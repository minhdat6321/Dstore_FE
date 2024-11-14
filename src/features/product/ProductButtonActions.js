// ProductButtonActions.js

import React from "react";
import { Box, Button, Stack, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fCurrency } from "../../utils/numberFormat";
import useAuth from "../../hooks/useAuth";
import LoadingScreen from "../../components/LoadingScreen";

function ProductButtonActions({ product }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle case when user role is not defined
  if (!user || !user.role) {
    return <LoadingScreen />;
  }

  // Function to handle "Add to Cart" action
  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    // Implement add-to-cart logic here
  };

  // Function to handle "Buy Now" action
  const handleBuyNow = (product) => {
    console.log("Buying now:", product);
    // Implement buy-now logic here
  };

  return (
    <Card
      sx={{ cursor: "pointer" }}
      onClick={() => navigate(`/product/${product._id}`)} // Navigate to product detail page on card click
    >
      <div>
        <CardMedia
          component="img"
          height="200"
          image={product.product_thumb}
          alt={product.product_name}
        />
        <CardContent>
          <Typography gutterBottom variant="body1" component="div" noWrap>
            {product.product_name}
          </Typography>
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            justifyContent="flex-end"
          >
            {product.priceSale && (
              <Typography
                component="span"
                sx={{ color: "text.disabled", textDecoration: "line-through" }}
              >
                {fCurrency(product.priceSale)}
              </Typography>
            )}
            <Typography variant="subtitle1">
              {fCurrency(product.product_price)}
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            {user.role === "Admin" ? (
              <Button
                variant="contained"
                size="medium"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click navigation
                  navigate(`/admin/products/update/${product._id}`);
                }}
                sx={{
                  fontSize: { xs: "0.6rem", md: "0.8rem" },
                }}
              >
                Update
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click navigation
                    handleAddToCart(product);
                  }}
                  disabled={product.product_quantity === 0} // Disable if out of stock
                  sx={{
                    fontSize: { xs: "0.6rem", md: "0.8rem" },
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click navigation
                    handleBuyNow(product);
                  }}
                  disabled={product.product_quantity === 0} // Disable if out of stock
                  sx={{
                    fontSize: { xs: "0.6rem", md: "0.8rem" },
                  }}
                >
                  Buy Now
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </div>
    </Card>
  );
}

export default ProductButtonActions;
