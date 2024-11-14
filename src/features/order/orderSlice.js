import { createSlice } from "@reduxjs/toolkit"
import apiService from "../../app/apiService"
import { toast } from "react-toastify";


const initialState = {
  isLoading: false,
  error: null,
  orders: [],
}

const slice = createSlice({
  name: "order",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getCompletedOrdersSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.orders = action.payload;
    },
  },
})


export const getCompletedOrders = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    // Make the API request
    const response = await apiService.get("/orders/completed");

    // Dispatch success action
    dispatch(slice.actions.getCompletedOrdersSuccess(response.data.data));
    // console.log("response data data history order: ", response.data.data);

  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};
export default slice.reducer