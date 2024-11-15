import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";


let initialState = {
  isLoading: false,
  error: null,
  cart: null,
}

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createNewCartSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.cart = action.payload;
    },
    fetchCartSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.cart = action.payload;
    },
    updateCartProductQuantitySuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.cart = action.payload;
    },

    deleteProductFromCartSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const productId = action.payload.productId;
      if (state.cart) {
        state.cart.cart_products = state.cart.cart_products.filter(
          (product) => product.productId._id !== productId
        );
      }
    },


  },
})

export default slice.reducer

export const createNewCart = (user) => async (dispatch) => {
  try {
    // Make the API request
    const body = {
      userId: user._id
    }
    const response = await apiService.post(`/cart/create`, body);

    // Dispatch success action
    dispatch(slice.actions.createNewCartSuccess(response.data.data));
    console.log("create new cart: ", response.data.data);

  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};

export const fetchCart = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    // Make the API request
    const response = await apiService.get(`/cart`);

    // Dispatch success action
    dispatch(slice.actions.fetchCartSuccess(response.data.data));
    console.log("response data data get cart: ", response.data.data);



  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};

export const updateCartProductQuantity = ({ productId, quantity, oldQuantity }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    // Create request payload in the specified format
    const requestData = {
      productId,
      quantity,
      old_quantity: oldQuantity
    };

    // Make the API request
    const response = await apiService.patch(`/cart/update`, requestData);

    // Dispatch success action
    dispatch(slice.actions.updateCartProductQuantitySuccess(response.data.data));
    // console.log("data after updating: ", response.data.data)
    dispatch(fetchCart());
    // Show success message
    toast.success(response.data.message || "Adjust Quantity in cart successfully!");

  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const deleteProductFromCart = (productId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    // Create request payload in the specified format
    const requestData = { productId };

    // Make the DELETE request with productId in the request body
    const response = await apiService.delete(`/cart`, { data: requestData });

    // Dispatch success action with productId for reducer logic
    dispatch(slice.actions.deleteProductFromCartSuccess({ productId }));
    dispatch(fetchCart());
    // Show success message
    toast.success(response.data.message || "Deleted product from cart successfully!");
  } catch (error) {
    // Handle and display error
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message || "Failed to delete product from cart.");
  }
};

