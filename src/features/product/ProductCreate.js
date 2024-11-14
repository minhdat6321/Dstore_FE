import React, { useCallback, useState } from "react";
import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FSelect, FTextField, FUploadImage, FRadioGroup, FormProvider } from "../../components/form";
import { fData } from "../../utils/numberFormat";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../product/productSlice";

const UpdateProductSchema = yup.object().shape({
  product_name: yup.string().required("Name is required"),
  product_type: yup.string().required("Type is required"),
  product_price: yup
    .number()
    .typeError("Price must be a number")
    .integer("Price must be an integer") // Ensures price is an integer
    .required("Price is required"),
  product_quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .integer("Quantity must be an integer") // Ensures quantity is an integer
    .required("Quantity is required"),
});

function ProductCreate() {
  const { user } = useAuth();
  const { isLoading } = useSelector((state) => state.product);
  const [selectedCategory, setSelectedCategory] = useState(""); // Start with an empty string

  const defaultValues = {
    product_name: "",
    product_thumb: "",
    product_description: "",
    product_price: 0,
    product_type: "", // Ensure this starts blank
    product_quantity: 0,
    product_attributes: {},
    product_variations: [],
    isDraft: false,
    isPublished: true,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateProductSchema),
    defaultValues,
  });

  const { setValue, reset, handleSubmit, formState: { isSubmitting } } = methods;
  const dispatch = useDispatch();

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
    // console.log("data submitted: ", data);
    dispatch(createProduct({ ...data })).then(() => {
      reset(); // Reset the form after submission
      setSelectedCategory(""); // Reset the selected category to blank
      setValue("product_type", ""); // Reset product_type to blank as well
    });
  };

  const handleCategoryChange = (event) => {
    const selected = event.target.value;
    setSelectedCategory(selected);
    setValue("product_type", selected); // Update the category in form state
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
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
              <FSelect name="product_type" label="Category" value={selectedCategory} onChange={handleCategoryChange}>
                <option value=""></option> {/* Default blank option */}
                {[
                  { code: "Phone", label: "Phone" },
                  { code: "Watch", label: "Watch" },
                  { code: "Tablet", label: "Tablet" },
                  { code: "Accessory", label: "Accessory" },
                ].map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </FSelect>

              {/* Fields common to all categories */}
              <FTextField name="product_name" label="Product Name" />
              <FTextField name="product_price" label="Product Price" />
              <FTextField name="product_description" label="Product Description" />
              <FTextField name="product_quantity" label="Product Quantity" />

              {/* Conditionally render fields based on selected category */}
              {selectedCategory === "Phone" && (
                <>
                  <FTextField name="product_attributes.phone_brand" label="Phone Brand" />
                  <FTextField name="product_attributes.storage_capacity" label="Storage Capacity" />
                  <FTextField name="product_attributes.color" label="Color" />
                  <FTextField name="product_attributes.screen_size" label="Screen Size" />
                  <FTextField name="product_attributes.battery_capacity" label="Battery Capacity" />
                </>
              )}
              {selectedCategory === "Watch" && (
                <>
                  <FTextField name="product_attributes.watch_brand" label="Watch Brand" />
                  <FTextField name="product_attributes.color" label="Watch Color" />
                  <FTextField name="product_attributes.band_material" label="Material" />
                  <FRadioGroup name="product_attributes.watch_type" options={[true, false]} getOptionLabel={["Water Resistant", "Not Water Resistant"]} />
                </>
              )}
              {selectedCategory === "Tablet" && (
                <>
                  <FTextField name="product_attributes.tablet_brand" label="Tablet Brand" />
                  <FTextField name="product_attributes.color" label="Color" />
                  <FTextField name="product_attributes.screen_size" label="Screen Size" />
                  <FTextField name="product_attributes.operating_system" label="Operating System" />
                  <FTextField name="product_attributes.storage_capacity" label="Storage Capacity" />
                  <FTextField name="product_attributes.battery_capacity" label="Battery Capacity" />
                </>
              )}
              {selectedCategory === "Accessory" && (
                <>
                  <FTextField name="product_attributes.accessory_type" label="Accessory Type" />
                  <FTextField name="product_attributes.brand" label="Brand" />
                  <FTextField name="product_attributes.color" label="Color" />
                  <FTextField name="product_attributes.material" label="Material" />
                </>
              )}

              {/* Other Fields */}
              <FRadioGroup name="isPublished" options={[true, false]} getOptionLabel={["Published", "Not Published"]} />
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

export default ProductCreate;
