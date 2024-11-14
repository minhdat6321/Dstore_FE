import { createSlice } from "@reduxjs/toolkit"
import apiService from "../../app/apiService"


const initialState = {
  isLoading: false,
  error: null,
}

const slice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
})

export default slice.reducer