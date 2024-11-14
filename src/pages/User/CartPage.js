// src/pages/CartPage.js
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, IconButton, Button, Checkbox, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteProductFromCart, fetchCart, updateCartProductQuantity } from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { checkoutCart } from "../../features/checkout/checkoutSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, isLoading, error } = useSelector((state) => state.cart);
  const [selectedProductIds, setSelectedProductIds] = useState([]); // Update this state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);



  const handleCheckoutClick = async () => {
    console.log("Starting checkout process...");
    try {
      // Await the dispatch and unwrap the result
      const result = await dispatch(checkoutCart(cart._id, selectedProductIds));

      // Navigate to the checkout page after the dispatch has completed
      navigate("/user/checkout");
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };


  const handleQuantityChange = (productId, quantity, oldQuantity) => {
    if (quantity === 0) {
      setProductToDelete(productId);
      setDeleteDialogOpen(true);
    } else {
      dispatch(updateCartProductQuantity({ productId, quantity, oldQuantity }));
    }
  };

  const handleDeleteConfirmed = () => {
    dispatch(deleteProductFromCart(productToDelete));
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleSelectProduct = (product) => {
    setSelectedProductIds((prevSelected) => {
      const exists = prevSelected.find(item => item.productId._id === product.productId._id);
      if (exists) {
        return prevSelected.filter(item => item.productId._id !== product.productId._id);
      } else {
        return [...prevSelected, { productId: product.productId, quantity: product.quantity }];
      }
    });
  };

  const handleDeleteSelected = async () => {
    await Promise.all(
      selectedProductIds.map(({ productId }) => dispatch(deleteProductFromCart(productId._id)))
    );
    setSelectedProductIds([]);
    dispatch(fetchCart());
  };


  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box>
      <h1>Cart Page</h1>
      {cart && cart.cart_products.length > 0 ? (
        <Grid container spacing={2}>
          {cart.cart_products.map((product) => (
            <Grid item xs={12} key={product.productId._id}>
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ borderBottom: "1px solid #ccc", pb: 2, pt: 2 }}>
                <Checkbox
                  checked={selectedProductIds.some(item => item.productId._id === product.productId._id)}
                  onChange={() => handleSelectProduct(product)}
                />
                <Box display="flex" alignItems="center">
                  <img
                    src={product.productId.product_thumb}
                    alt={product.productId.product_name}
                    style={{ width: "80px", height: "80px", marginRight: "16px" }}
                  />
                  <Box>
                    <Typography variant="h6">{product.productId.product_name}</Typography>
                    <Typography variant="body2">{product.productId.product_description}</Typography>
                    <Typography variant="body1">${product.productId.product_price}</Typography>
                  </Box>
                </Box>
                <TextField
                  id="outlined-number"
                  label="Number"
                  type="number"
                  value={product.quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value, 10);
                    if (newQuantity >= 0) {
                      handleQuantityChange(product.productId._id, newQuantity, product.quantity);
                    } else {
                      handleQuantityChange(product.productId._id, 0, product.quantity);
                    }
                  }}
                  inputProps={{ min: 0 }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{ width: "80px" }}
                />
                <IconButton onClick={() => handleQuantityChange(product.productId._id, 0, product.quantity)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}

          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            m={4}
            sx={{
              gap: 2, // Adds spacing between the buttons
            }}
          >            <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={selectedProductIds.length === 0}
            onClick={handleCheckoutClick}
          >
              Buy
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={selectedProductIds.length === 0}
              onClick={handleDeleteSelected}
              size="large"
            >
              Delete Selected
            </Button>
          </Box>

          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to remove this product from your cart?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color="primary">No</Button>
              <Button onClick={handleDeleteConfirmed} color="secondary">Yes</Button>
            </DialogActions>
          </Dialog>
        </Grid>
      ) : (
        <Typography>No items in cart</Typography>
      )}
    </Box>
  );
};

export default CartPage;
