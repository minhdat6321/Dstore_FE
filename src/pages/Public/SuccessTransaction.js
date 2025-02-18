
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Typography, Container } from "@mui/material";

function SuccessTransaction() {
  return (
    <Container sx={{ display: "flex", height: "100%", alignItems: "center" }}>
      <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
        <Typography variant="h4" paragraph>
          Transaction Successful!
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: "1rem" }}>
          Thank you for your purchase! Your transaction has been completed successfully.
        </Typography>
        <Button to="/" variant="contained" component={RouterLink}>
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
}

export default SuccessTransaction;
