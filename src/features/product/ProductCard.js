import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, Button, CardActionArea, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fCurrency } from "../../utils/numberFormat";
import useAuth from "../../hooks/useAuth";
import LoadingScreen from "../../components/LoadingScreen";
import { addingProductIntoCart } from "./productSlice";
import { useDispatch } from "react-redux";
import { checkoutSingleProduct } from "../checkout/checkoutSlice";

function ProductCard({ product, cartId, user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Use dispatch from redux


  // Function for single product checkout
  const handleBuyNow = async () => {
    try {
      const productId = product._id;
      const order_id = {
        item_products: [{ productId, quantity: 1 }],
      };

      const result = await dispatch(checkoutSingleProduct(cartId, order_id));

      // Navigate to checkout page for a single product
      navigate("/user/checkout", { state: { order: result } });
    } catch (error) {
      console.error("Buy Now checkout failed:", error);
    }
  };

  // Function to handle "Add to Cart" action
  const handleAddToCart = () => {
    const productId = product._id;
    dispatch(addingProductIntoCart({ productId }));
  };

  return (
    <Card onClick={() => navigate(`/product/${product._id}`)}
    >
      <div>
        <CardMedia
          component="img"
          height="200"
          image={product.product_thumb}
          alt="green iguana"
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
                {fCurrency(product.product_priceSale)}
              </Typography>
            )}
            <Typography variant="subtitle1">
              {fCurrency(product.product_price)}
            </Typography>
          </Stack>
          <Box
            sx={{
              display: "flex",              // Use flexbox
              justifyContent: "center",      // Center horizontally
              alignItems: "center",          // Align vertically
              gap: 2,                        // Add spacing between the buttons
              mt: 2,                         // Optional margin-top for spacing above the buttons
              flexWrap: "wrap",              // Wrap the buttons on smaller screens
            }}
          >
            {user.role === "Admin" ? (
              <>
                <Button
                  sx={{ fontSize: { xs: "0.6rem", md: "0.8rem" } }}
                  size="medium"
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click navigation
                    navigate(`/admin/products/update/${product._id}`);
                  }}                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  sx={{ fontSize: { xs: "0.6rem", md: "0.8rem" } }}
                  size="small"
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  disabled={product.product_quantity === 0} // Disable if out of stock
                >
                  Cart
                </Button>
                <Button
                  sx={{ fontSize: { xs: "0.6rem", md: "0.8rem" } }}
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow();
                  }}
                  disabled={product.product_quantity === 0} // Disable if out of stock
                >
                  Buy
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </div>
    </Card>
  );
}
export default ProductCard;
