import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Logo from "../components/Logo";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import CartIcon from "../components/CartIcon";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../features/cart/cartSlice";
import { Stack } from "@mui/material";

function MainHeader() {


  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  React.useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  let cartCount = useSelector((state) => state.cart.cart?.cart_count_product || 0);



  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      handleMenuClose();
      await logout(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error(error);
    }
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box sx={{ my: 1.5, px: 2.5 }}>
        <Typography variant="subtitle2" noWrap>
          {user?.firstName}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          {user?.email}
        </Typography>
      </Box>

      <Divider sx={{ borderStyle: "dashed" }} />

      <MenuItem
        onClick={handleMenuClose}
        to="/user/profile"
        component={RouterLink}
        sx={{ mx: 1 }}
      >
        My Profile
      </MenuItem>

      <MenuItem
        onClick={handleMenuClose}
        to="/user/cart"
        component={RouterLink}
        sx={{ mx: 1 }}
      >
        Cart
      </MenuItem>

      <MenuItem
        onClick={handleMenuClose}
        to="/user/history"
        component={RouterLink}
        sx={{ mx: 1 }}
      >
        History
      </MenuItem>

      <Divider sx={{ borderStyle: "dashed" }} />

      <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ mb: 3 }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <Logo />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Dstore
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Conditional rendering based on user's authentication state */}
          {user ? (
            <Box>
              <Stack direction="row" spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ height: "100%" }}>
                <CartIcon cartCount={cartCount} />
                <Avatar
                  onClick={handleProfileMenuOpen}
                  src={user?.avatarUrl}
                  alt={user?.firstName || "User Avatar"}
                  sx={{ width: 32, height: 32 }}
                />
              </Stack>
            </Box>
          ) : (
            <Box>
              {/* Login Button */}
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ ml: 2 }}
              >
                Login
              </Button>

              {/* Sign Up Button */}
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{ ml: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}

export default MainHeader;
