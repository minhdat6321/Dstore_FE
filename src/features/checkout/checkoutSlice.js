import { createSlice } from "@reduxjs/toolkit"
import apiService from "../../app/apiService"
import { toast } from "react-toastify";
import { PAYPAL_CLIENT_ID } from "../../app/config";
import { deleteProductFromCart } from "../cart/cartSlice";


const initialState = {
  isLoading: false,
  error: null,
  productsCheckout: null,
  checkoutSummary: null,
  paypalOrderID: null,
  initialOptions: {
    "client-id": PAYPAL_CLIENT_ID,
    "enable-funding": "venmo",
    "disable-funding": "",
    "buyer-country": "US",
    currency: "USD",
    "data-page-type": "product-details",
    components: "buttons",
    "data-sdk-integration-source": "developer-studio",
  }
}

const slice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    checkoutCartSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.productsCheckout = action.payload
      state.checkoutSummary = action.payload.checkout_order
    },
    checkoutSingleProductSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.productsCheckout = action.payload
      state.checkoutSummary = action.payload.checkout_order
    },

    createPaypalOrderSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.paypalOrderID = action.payload.id;
    },

  },
})

export default slice.reducer


export const checkoutCart = (cartId, selectedProductIds) => async (dispatch) => {
  try {
    dispatch(slice.actions.startLoading());
    console.log("selectedProductIds: ", selectedProductIds);

    // Map each item in selectedProductIds to match the format needed for checkout
    const order_ids = selectedProductIds.map((item) => ({
      item_products: [{ productId: item.productId._id, quantity: item.quantity }],
    }));

    const response = await apiService.post(`/checkout`, {
      order_ids,
      cartId,
    });

    dispatch(slice.actions.checkoutCartSuccess(response.data.data));
    return (response.data.data)
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error("Checkout failed");
    throw error; // Re-throw error to handle it in CartPage
  }
};



export const checkoutSingleProduct = (cartId, order_id) => async (dispatch) => {
  try {
    dispatch(slice.actions.startLoading());

    const response = await apiService.post(`/checkout`, {
      order_ids: [order_id],
      cartId,
    });

    dispatch(slice.actions.checkoutSingleProductSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    throw error; // Handle in component if needed
  }
};


export const createPaypalOrder = (totalCheckout) => async (dispatch) => {
  try {
    dispatch(slice.actions.startLoading());

    // Assuming backend returns an order ID in response.data.data.orderID
    const response = await apiService.post(`/checkout/orders`, { totalCheckout });
    const orderID = response.data.data.id;

    if (!orderID) throw new Error("Order ID is missing in the response");

    dispatch(slice.actions.createPaypalOrderSuccess(response.data.data));
    console.log("create Paypal order - orderID: ", orderID)
    return orderID; // Ensure orderID is returned here

  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error("PayPal order creation failed");
    throw error;
  }
};
// Capture PayPal order using the orderID after approval

// export const capturePaypalOrder = (orderID) => async (dispatch) => {
export const capturePaypalOrder = (orderID, order_checkout, order_products) => async (dispatch) => {
  try {
    dispatch(slice.actions.startLoading());

    // Capture the PayPal order
    const response = await apiService.post(`/checkout/orders/${orderID}/capture`);
    const orderData = response.data.data;

    // Structure the order data in a unified format for backend
    const orderPayload = {
      id: orderData.id,
      payment_source: {
        paypal: {
          email_address: orderData.payer.email_address,
          account_id: orderData.payer.payer_id,
        },
      },
      purchase_units: [
        {
          payments: {
            captures: [
              {
                id: orderData.purchase_units[0].payments.captures[0].id,
                amount: {
                  currency_code: orderData.purchase_units[0].payments.captures[0].amount.currency_code,
                  value: orderData.purchase_units[0].payments.captures[0].amount.value,
                },
              },
            ],
          },
          shipping: {
            name: {
              full_name: orderData.purchase_units[0].shipping.name.full_name,
            },
            address: {
              address_line_1: orderData.purchase_units[0].shipping.address.address_line_1,
              admin_area_2: orderData.purchase_units[0].shipping.address.admin_area_2,
              admin_area_1: orderData.purchase_units[0].shipping.address.admin_area_1,
              postal_code: orderData.purchase_units[0].shipping.address.postal_code,
              country_code: orderData.purchase_units[0].shipping.address.country_code,
            },
          },
        },
      ],
      order_checkout,
      order_products,
    };

    // Dispatch successful PayPal order capture
    dispatch(slice.actions.createPaypalOrderSuccess(orderData));

    // Create a new order in the backend with the structured payload
    await apiService.post(`/orders/create/${orderID}`, orderPayload);


    // Update stock in the Product model before deleting products from the cart
    const stockUpdatePromises = order_products.flatMap(order =>
      order.item_products.map(async (item) => {
        const newStock = item.stock - item.quantity; // Calculate new stock
        await apiService.patch(`/products/update/stock/${item.productId}`, { product_quantity: newStock });
      })
    );

    await Promise.all(stockUpdatePromises);


    // Delete each product from cart after successful order creation
    const deletePromises = order_products.flatMap(order =>
      order.item_products.map(async (item) => {
        console.log("Deleting product with ID:", item.productId); // Log for debugging
        return dispatch(deleteProductFromCart(item.productId));
      })
    );

    await Promise.all(deletePromises);

    return orderData;
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error("PayPal order capture failed");
    throw error;
  }
};

