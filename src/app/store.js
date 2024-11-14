import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import cartReducer from "../features/cart/cartSlice";
import productReducer from "../features/product/productSlice";
import orderReducer from "../features/order/orderSlice";
import checkoutReducer from "../features/checkout/checkoutSlice";


const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  product: productReducer,
  order: orderReducer,
  checkout: checkoutReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;