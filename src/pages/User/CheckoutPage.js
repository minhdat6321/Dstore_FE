import React from 'react';
import { Container, Paper, Typography, Grid, Divider, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import PaypalCheckout from '../../features/checkout/PaypalCheckout';

const CheckoutPage = () => {
  const productsCheckout = useSelector((state) => state.checkout.productsCheckout);
  const { order_ids_new, checkout_order } = productsCheckout;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Checkout
      </Typography>

      {/* Order Items Section */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Order Items
        </Typography>

        {order_ids_new.map((order, index) => (
          <Box key={index} sx={{ py: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order #{index + 1}
            </Typography>

            {order.item_products.map((item, itemIndex) => (
              <Grid container spacing={2} key={itemIndex} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <Typography>Product ID: {item.productId}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography>Product Name: {item.name}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography>Quantity: {item.quantity}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography>Price: ${item.price.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            ))}

            <Box sx={{ pt: 2 }}>
              <Typography variant="body1">
                Price (Raw): ${order.priceRaw.toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Price After Discounts: ${order.priceApplyDiscount.toFixed(2)}
              </Typography>
            </Box>

            {order.discounts.length > 0 && (
              <Box sx={{ pt: 1 }}>
                <Typography variant="body2" color="secondary">
                  Discounts Applied:
                </Typography>
                {order.discounts.map((discount, discountIndex) => (
                  <Typography key={discountIndex} variant="body2">
                    Discount Code: {discount.codeId}
                  </Typography>
                ))}
              </Box>
            )}

            <Divider sx={{ my: 2 }} />
          </Box>
        ))}
      </Paper>

      {/* Checkout Summary Section */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Checkout Summary
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">Total Price (Before Discounts):</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">${checkout_order.totalPrice.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Shipping Fee:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">${checkout_order.feeShip.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Total Discounts:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">-${checkout_order.totalDiscount.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Total Checkout Amount:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">${checkout_order.totalCheckout.toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* PayPal Payment Section */}
      <PaypalCheckout />
    </Container>
  );
};

export default CheckoutPage;
