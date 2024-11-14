import React, { useCallback, useEffect } from "react";
import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, FTextField, FUploadAvatar } from "../../components/form";
import { fData } from "../../utils/numberFormat";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../features/user/userSlice";
import { toast } from "react-toastify"; // For toast notifications

const UpdateUserSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

function ProfilePage() {
  const { user } = useAuth();
  const isLoading = useSelector((state) => state.user.isLoading);

  const defaultValues = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatarUrl: user?.avatarUrl || "",
    coverUrl: user?.coverUrl || "",
    city: user?.city || "",
    country: user?.country || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
    address: user?.address || "",
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const { setValue, handleSubmit, formState: { isSubmitting } } = methods;
  const dispatch = useDispatch();

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue("avatarUrl", Object.assign(file, { preview: URL.createObjectURL(file) }));
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      await dispatch(updateUserProfile({ userId: user._id, ...data }));
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
            <FUploadAvatar
              name="avatarUrl"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{ mt: 2, mx: "auto", display: "block", textAlign: "center", color: "text.secondary" }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box sx={{
              display: "grid",
              rowGap: 3,
              columnGap: 2,
              gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" },
            }}>
              <FTextField name="firstName" label="First Name" />
              <FTextField name="lastName" label="Last Name" />
              <FTextField name="email" label="Email" disabled />
              <FTextField name="phone" label="Phone" />
              <FTextField name="address" label="Address" />
              <FTextField name="city" label="City" />
              <FTextField name="state" label="State" />
              <FTextField name="zipCode" label="Zip Code" />
              <FTextField name="country" label="Country" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ProfilePage;
