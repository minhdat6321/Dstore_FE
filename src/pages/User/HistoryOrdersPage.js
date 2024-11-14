import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { getCompletedOrders } from "../../features/order/orderSlice";

const HistoryOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getCompletedOrders());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Order History
      </Typography>
      {orders.length === 0 ? (
        <Typography>No completed orders found.</Typography>
      ) : (
        <List>
          {orders.map((order) => (
            <Card key={order._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Order ID: {order._id}</Typography>

                {/* Order Total */}
                <Typography variant="subtitle1">
                  Total Amount: ${order.order_checkout.totalPrice} {/* Assuming the price is in cents */}
                </Typography>

                {/* Order Date */}
                <Typography variant="subtitle2">
                  Order Date: {new Date(order.createdAt).toLocaleDateString()}
                </Typography>

                {/* Order Status */}
                <Typography variant="body2" color="text.secondary">
                  Status: {order.order_status}
                </Typography>

                {/* Shipping Information */}
                <Box mt={2}>
                  <Typography variant="body1" color="text.primary">
                    Shipping Address:
                  </Typography>
                  <Typography variant="body2">{order.order_shipping.fullName}</Typography>
                  <Typography variant="body2">
                    {order.order_shipping.addressLine1}, {order.order_shipping.city}, {order.order_shipping.state}{" "}
                    {order.order_shipping.postalCode}, {order.order_shipping.country}
                  </Typography>
                </Box>

                {/* Payment Information */}
                <Box mt={2}>
                  <Typography variant="body1" color="text.primary">
                    Payment Status: {order.order_payment.status}
                  </Typography>
                  <Typography variant="body2">
                    Payment ID: {order.order_payment.paypalCaptureId}
                  </Typography>
                </Box>

                {/* Ordered Products */}
                <List sx={{ mt: 2 }}>
                  {order.order_products.map((item) => (
                    <ListItem key={item._id}>
                      <ListItemAvatar>
                        <Avatar src={item.thumb} alt={item.name} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${item.name} (x${item.quantity})`}
                        secondary={`Price: $${(item.price).toFixed(2)}`} // Assuming price is in cents
                      />
                      <ListItemText
                        primary={`Total Price: $${((item.price) * item.quantity).toFixed(2)}`} // Assuming price is in cents
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Container>
  );
};

export default HistoryOrdersPage;
