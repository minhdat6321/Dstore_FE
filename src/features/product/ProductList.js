import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";
import LoadingScreen from "../../components/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { fetchCart } from "../cart/cartSlice";
import useAuth from "../../hooks/useAuth";
import ProductCardForPublic from "./ProductCardForPublic";


function ProductList({ products }) {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch(); // Use dispatch from redux

  const { user } = useAuth();
  useEffect(() => {
    dispatch(fetchCart());

  }, [])

  // if (user !== null) {
  //   if (!cart || !cart._id) {
  //     return <LoadingScreen />; // Handle undefined `user.role`
  //   }
  // }

  return (

    <Grid container spacing={2} mt={1}>
      {products.map((product) => (
        <Grid key={product._id} item xs={6} md={4} lg={3}>
          {user === null || user.role === undefined ?
            <ProductCardForPublic product={product} />
            :
            <ProductCard product={product} cartId={cart._id} user={user} />

          }

        </Grid>
      ))}
    </Grid>
  );
}

export default ProductList;
