import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { cloudinaryUpload } from "../../utils/cloudinary";
import { fetchCart } from "../cart/cartSlice";

const initialState = {
  isLoading: false,
  error: null,
  products: [],
  count: 0,
  totalPages: 0,
  productById: null,

};

const slice = createSlice({
  name: "product",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createProductSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },
    addingProductIntoCartSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },
    updatingProductInCartSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.products = action.payload.products; // Set the products from API response
      state.count = action.payload.count;
      state.totalPages = action.payload.totalPages;
    },

    getProductByIdSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.productById = action.payload; // Set the products from API response
    },
    updateProductByIdSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },
  },
});

export default slice.reducer;

// Create Product (ADMIN)
export const createProduct = ({
  product_name,
  product_thumb,
  product_description,
  product_price,
  product_type,
  product_quantity,
  product_attributes,
  product_variations,
  isDraft,
  isPublished, }) => async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // Upload image to cloudinary
      const imageUrl = await cloudinaryUpload(product_thumb);

      // Construct payload based on product type
      const payload = {
        product_name,
        product_thumb: imageUrl,
        product_description,
        product_price,
        product_type,
        product_quantity,
        product_variations,
        isDraft,
        isPublished,
      };

      // Add product attributes based on category
      if (product_type === "Phone") {
        payload.product_attributes = {
          phone_brand: product_attributes.phone_brand,
          storage_capacity: product_attributes.storage_capacity,
          color: product_attributes.color,
          screen_size: product_attributes.screen_size,
          battery_capacity: product_attributes.battery_capacity,
        };
      } else if (product_type === "Watch") {
        payload.product_attributes = {
          watch_brand: product_attributes.watch_brand,
          color: product_attributes.color,
          band_material: product_attributes.band_material,
          watch_type: product_attributes.watch_type,
        };
      } else if (product_type === "Tablet") {
        payload.product_attributes = {
          tablet_brand: product_attributes.tablet_brand,
          color: product_attributes.color,
          screen_size: product_attributes.screen_size,
          operating_system: product_attributes.operating_system,
          storage_capacity: product_attributes.storage_capacity,
          battery_capacity: product_attributes.battery_capacity,
        };
      } else if (product_type === "Accessory") {
        payload.product_attributes = {
          accessory_type: product_attributes.accessory_type,
          brand: product_attributes.brand,
          color: product_attributes.color,
          material: product_attributes.material,
        };
      }

      const response = await apiService.post("/products", payload);
      dispatch(slice.actions.createProductSuccess(response.data));
      toast.success("Create Product successfully");
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

// Action to add product to the cart 
export const addingProductIntoCart = ({ productId, quantity = 1 }) => async (dispatch) => {
  try {
    // Create request payload in the specified format
    const requestData = {
      product: {
        productId,
        quantity,
      },
    };

    // Make the API request
    const response = await apiService.post(`/cart`, requestData);

    // Dispatch success action
    dispatch(slice.actions.addingProductIntoCartSuccess(response.data));
    dispatch(fetchCart());
    // Show success message
    toast.success(response.data.message || "Product added to cart successfully!");

  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

// Fetch Products based on filters
export const getProducts = ({ keySearch, page = 1, limit = 5, sort, category = "All", priceRange, isPublished = true }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    let res;
    const params = { page, limit, isPublished };  // Add isPublished to params

    if (keySearch) {
      params.keySearch = keySearch;
      if (priceRange) params.priceRange = priceRange;
      if (category) params.category = category;
      if (sort) params.sort = sort;  // Add sort to params for search
      res = await apiService.get("/products/search", { params });
    } else {
      params.category = category !== "All" ? category : "";
      if (sort) params.sort = sort === "newest" ? "ctime" : sort; // Add sort for the list products
      if (priceRange) params.priceRange = priceRange;

      res = await apiService.get("/products", { params });
    }

    dispatch(slice.actions.getProductsSuccess(res.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

// Get Product by Id
export const getProductById = ({ productIdParam }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    // console.log("productIdParam , check coi get dung khong :", productIdParam)
    // Make the API request
    const response = await apiService.get(`/products/${productIdParam}`);

    // Dispatch success action
    dispatch(slice.actions.getProductByIdSuccess(response.data.data));
    // Show success message
    toast.success(response.data.message || "Getting info Product successfully!");
    return response.data.data
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};


// Update the info Product
export const updateProductById = ({ productId, updateData }) => async (dispatch) => {
  try {
    // Create request payload in the specified format
    // const requestData = {
    //   product: {
    //     productId,
    //     quantity,
    //   },
    // };
    // console.log("productId , check coi patch dung khong :", productId)
    // Make the API request
    const response = await apiService.patch(`/products/${productId}`, updateData);

    // Dispatch success action
    dispatch(slice.actions.updateProductByIdSuccess(response.data));
    // Show success message
    toast.success(response.data.message || "Updating Product successfully!");

  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};