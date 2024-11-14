import { Link as RouterLink } from "react-router-dom";
import { Box } from "@mui/material";
import logoImg from "../logo.png";
import useAuth from "../hooks/useAuth"; // Import your auth hook to get the user's role

function Logo({ disabledLink = false, sx }) {
  const { user } = useAuth(); // Get the current user's data from the auth context

  const logo = (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <img src={logoImg} alt="logo" width="100%" />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  // Check if the user is an admin and set the link to '/admin', otherwise link to '/'
  const logoLink = user?.role === "Admin" ? "/admin" : "/";

  return <RouterLink to={logoLink}>{logo}</RouterLink>;
}

export default Logo;
