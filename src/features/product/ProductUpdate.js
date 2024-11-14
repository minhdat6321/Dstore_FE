import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FTextField, FUploadImage, FRadioGroup, FormProvider } from "../../components/form";
import { fData } from "../../utils/numberFormat";
import { useDispatch, useSelector } from "react-redux";
import { getProductById, updateProductById } from "../product/productSlice";
import { useParams } from "react-router-dom";

const UpdateProductSchema = yup.object().shape({
  product_name: yup.string().required("Name is required"),
  product_type: yup.string().required("Type is required"),
  product_price: yup
    .number()
    .typeError("Price must be a number")
    .integer("Price must be an integer")
    .required("Price is required"),
  product_quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .integer("Quantity must be an integer")
    .required("Quantity is required"),
});

function ProductUpdate() {
  const params = useParams();
  const dispatch = useDispatch();
  const productIdParam = params.productId || "";
  const { isLoading, productById } = useSelector((state) => state.product);

  const defaultValues = {
    product_id: productIdParam,
    product_name: productById?.product_name || "",
    product_thumb: productById?.product_thumb || "",
    product_description: productById?.product_description || "",
    product_price: productById?.product_price || 0,
    product_type: productById?.product_type || "",
    product_quantity: productById?.product_quantity || 0,
    product_attributes: productById?.product_attributes || {},
    product_variations: productById?.product_variations || [],
    is: false,
    isPublished: true,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateProductSchema),
    defaultValues,
  });

  const { setValue, reset, handleSubmit, watch, formState: { isSubmitting } } = methods;

  const selectedCategory = watch("product_type");

  useEffect(() => {
    if (productIdParam) {
      const fetchProduct = async () => {
        try {
          const response = await dispatch(getProductById({ productIdParam }));
          reset(response);
          setValue("product_type", response.product_type);
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };
      fetchProduct();
    }
  }, [productIdParam, dispatch, reset, setValue]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue("product_thumb", Object.assign(file, { preview: URL.createObjectURL(file) }));
      }
    },
    [setValue]
  );

  const onSubmit = (data) => {
    const { product_id: productId, ...updateData } = data;
    dispatch(updateProductById({ productId, updateData }));
  };

  const renderPhoneFields = () => (
    <>
      <FTextField name="product_attributes.phone_brand" label="Phone Brand" />
      <FTextField name="product_attributes.color" label="Color" />
      <FTextField name="product_attributes.screen_size" label="Screen Size" />
      <FTextField name="product_attributes.battery_capacity" label="Battery Capacity" />
    </>
  );

  const renderWatchFields = () => (
    <>
      <FTextField name="product_attributes.watch_brand" label="Watch Brand" />
      <FTextField name="product_attributes.color" label="Watch Color" />
      <FTextField name="product_attributes.band_material" label="Band Material" />
      <FRadioGroup name="product_attributes.watch_type" options={[true, false]} getOptionLabel={() => ["Water Resistant", "Not Water Resistant"]} />
    </>
  );

  const renderTabletFields = () => (
    <>
      <FTextField name="product_attributes.tablet_brand" label="Tablet Brand" />
      <FTextField name="product_attributes.color" label="Color" />
      <FTextField name="product_attributes.screen_size" label="Screen Size" />
      <FTextField name="product_attributes.operating_system" label="Operating System" />
      <FTextField name="product_attributes.storage_capacity" label="Storage Capacity" />
    </>
  );

  const renderAccessoryFields = () => (
    <>
      <FTextField name="product_attributes.accessory_type" label="Accessory Type" />
      <FTextField name="product_attributes.brand" label="Brand" />
      <FTextField name="product_attributes.color" label="Color" />
      <FTextField name="product_attributes.material" label="Material" />
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FTextField name="product_id" label="Product Id" disabled={!!productIdParam} />

          <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
            <FUploadImage
              name="product_thumb"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography variant="caption" sx={{ mt: 2, mx: "auto", display: "block", textAlign: "center", color: "text.secondary" }}>
                  Allowed *.jpeg, *.jpg, *.png, *.gif <br /> max size of {fData(3145728)}
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
              gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }
            }}>

              <FTextField name="product_type" label="Category" />
              <FTextField name="product_name" label="Product Name" />
              <FTextField name="product_price" label="Product Price" />
              <FTextField name="product_description" label="Product Description" />
              <FTextField name="product_quantity" label="Product Quantity" />

              {selectedCategory === "Phone" && renderPhoneFields()}
              {selectedCategory === "Watch" && renderWatchFields()}
              {selectedCategory === "Tablet" && renderTabletFields()}
              {selectedCategory === "Accessory" && renderAccessoryFields()}

              {/* Other Fields */}
              <FRadioGroup name="isPublished" options={[true, false]} getOptionLabel={["Published", "Not Published"]} />            </Box>

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

export default ProductUpdate;
