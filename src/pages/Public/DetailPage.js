import { Button, TextField } from "@mui/material"; // Import TextField
import { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Container,
  Typography,
  Box,
  Stack,
  Rating,
  Divider,
  Breadcrumbs,
  Link,
  Alert
} from "@mui/material";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { fCurrency } from "../../utils/numberFormat";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import apiService from "../../app/apiService";
import LoadingScreen from "../../components/LoadingScreen";
import { useDispatch, useSelector } from "react-redux"; // Import dispatch
import { addingProductIntoCart } from "../../features/product/productSlice"; // Import the action
import useAuth from "../../hooks/useAuth";
import QuantityInput from "../../components/QuantityInput";
import { checkoutSingleProduct } from "../../features/checkout/checkoutSlice";

function DetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1); // New state for quantity
  const params = useParams();
  const dispatch = useDispatch(); // Use dispatch from redux
  const navigate = useNavigate();
  const { cart, isLoading } = useSelector((state) => state.cart);

  const { user } = useAuth();

  useEffect(() => {
    if (params.id) {
      const getProduct = async () => {
        setLoading(true);
        try {
          const res = await apiService.get(`/products/${params.id}`);
          setProduct(res.data.data);
          setError("");
        } catch (error) {
          console.log(error);
          setError(error.message);
        }
        setLoading(false);
      };
      getProduct();
    }
  }, [params]);

  // Handle case when user role is not defined
  if (!user || !user.role) {
    return <LoadingScreen />;
  }

  // Function for single product checkout
  const handleBuyNow = async () => {
    try {
      const productId = product._id;
      const order_id = {
        item_products: [{ productId, quantity }],
      };

      const result = await dispatch(checkoutSingleProduct(cart._id, order_id));

      // Navigate to checkout page for a single product
      navigate("/user/checkout", { state: { order: result } });
    } catch (error) {
      console.error("Buy Now checkout failed:", error);
    }
  };

  // Function to handle "Add to Cart" action
  const handleAddToCart = (product) => {
    const productId = product._id;
    dispatch(addingProductIntoCart({ productId, quantity }));
    setQuantity(1); // Reset the quantity to 1 after submitting
  };

  // Handle change in quantity input
  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && value > 0) {
      setQuantity(Number(value));
    }
  };

  return (
    <Container sx={{ my: 3 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
        <Link underline="hover" color="inherit" component={RouterLink} to="/">
          Home Page
        </Link>
        <Typography color="text.primary">{product?.product_name}</Typography>
      </Breadcrumbs>
      <Box sx={{ position: "relative", height: 1 }}>
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            {error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <>
                {product && (
                  <Card>
                    <Grid container>
                      <Grid item xs={12} md={6}>
                        <Box p={2}>
                          <Box
                            sx={{
                              borderRadius: 2,
                              overflow: "hidden",
                              display: "flex",
                            }}
                          >
                            <Box
                              component="img"
                              sx={{
                                width: 1,
                                height: 1,
                              }}
                              src={product.product_thumb}
                              alt="product"
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h5" paragraph>
                          {product.product_name}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 2 }}
                        >
                          <Rating
                            value={product.product_ratingsAverage}
                            precision={0.1}
                            readOnly
                          />
                        </Stack>
                        <Typography variant="h4" sx={{ mb: 3 }}>
                          <Box
                            component="span"
                            sx={{
                              color: "text.disabled",
                              textDecoration: "line-through",
                            }}
                          >
                            {product.priceSale && fCurrency(product.priceSale)}
                          </Box>
                          &nbsp;{fCurrency(product.product_price)}
                        </Typography>

                        <Divider sx={{ borderStyle: "dashed" }} />

                        <Box sx={{ mb: 3 }}>
                          <ReactMarkdown
                            rehypePlugins={[rehypeRaw]}
                            children={product.product_description}
                          />
                          <Typography>Stock: {product.product_quantity}</Typography>
                        </Box>

                        {/* Display "Out of Stock" alert if quantity is 0 */}
                        {product.product_quantity === 0 && (
                          <Alert severity="error" sx={{ mb: 2 }}>
                            Out of Stock
                          </Alert>
                        )}

                        {/* Responsive buttons and quantity input */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          <Stack spacing={2}>

                            <QuantityInput
                              value={quantity}
                              onChange={handleQuantityChange}
                              min={1}
                              max={product.product_quantity}
                              availableQuantity={product.product_quantity}
                            />

                            {user.role === "Admin" ? (
                              <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={2}>
                                <Button
                                  variant="contained"
                                  size="large"
                                  color="primary"
                                  onClick={() => navigate(`/admin/products/update/${product._id}`)}
                                  sx={{
                                    fontSize: { xs: "0.8rem", md: "1rem" },
                                    padding: { xs: "8px 16px", md: "12px 24px" },
                                  }}
                                >
                                  Update
                                </Button>
                              </Stack>
                            ) : (
                              <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={2}>
                                <Button
                                  variant="contained"
                                  size="large"
                                  sx={{
                                    fontSize: { xs: "0.8rem", md: "1rem" },
                                    padding: { xs: "8px 16px", md: "12px 24px" },
                                  }}
                                  onClick={() => handleAddToCart(product)}
                                  disabled={product.product_quantity === 0} // Disable if out of stock
                                >
                                  Add to Cart
                                </Button>

                                <Button
                                  variant="contained"
                                  color="success"
                                  size="large"
                                  sx={{
                                    fontSize: { xs: "0.8rem", md: "1rem" },
                                    padding: { xs: "8px 16px", md: "12px 24px" },
                                  }}
                                  onClick={() => handleBuyNow()}
                                  disabled={product.product_quantity === 0} // Disable if out of stock
                                >
                                  Buy Now
                                </Button>
                              </Stack>
                            )}
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                )}
                {!product && (
                  <Typography variant="h6">404 Product not found</Typography>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default DetailPage;
