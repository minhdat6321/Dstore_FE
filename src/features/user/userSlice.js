import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
  isLoading: false,
  error: null,
  updatedProfile: null,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateUserProfileSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const updatedUser = action.payload;
      state.updatedProfile = updatedUser;
    },
  },
});

export default slice.reducer;

export const updateUserProfile = ({
  userId,
  firstName,
  lastName,
  email,
  phone,
  avatarUrl,
  city,
  country,
  state,
  zipCode,
  address,
}) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const data = {
      firstName,
      lastName,
      email,
      phone,
      city,
      country,
      state,
      zipCode,
      address,
    };
    if (avatarUrl instanceof File) {
      const imageUrl = await cloudinaryUpload(avatarUrl);
      data.avatarUrl = imageUrl;
    }
    const response = await apiService.put(`/users/${userId}`, data);
    dispatch(slice.actions.updateUserProfileSuccess(response.data));
    toast.success("Profile updated successfully");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error("Failed to update profile: " + error.message);
  }
};
