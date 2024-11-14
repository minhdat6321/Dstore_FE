import * as React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Public/HomePage";
import AdminDiscountsPage from "../pages/Admin/AdminDiscountsPage";
import AdminProductsPage from "../pages/Admin/AdminProductsPage";
import AdminInventoryPage from "../pages/Admin/AdminInventoryPage";
import LoginPage from "../pages/Public/LoginPage";
import RegisterPage from "../pages/Public/RegisterPage";
import NotFoundPage from "../pages/Public/NotFoundPage";
import DetailPage from "../pages/Public/DetailPage";
import ProfilePage from "../pages/User/ProfilePage";
import CartPage from "../pages/User/CartPage";
import CheckoutPage from "../pages/User/CheckoutPage";
import BlankLayout from "../layouts/BlankLayout";
import AdminHomePage from "../pages/Admin/AdminHomePage";
import AdminMainLayout from "../layouts/AdminMainLayout";
import AuthRequire from "./AuthRequire";
import AdminRequire from "./AdminRequire";
import SuccessTransaction from "../pages/Public/SuccessTransaction";
import HistoryOrdersPage from "../pages/User/HistoryOrdersPage";
import ProductUpdate from "../features/product/ProductUpdate";


function Router() {
  return (
    <Routes>
      {/* Public routes for viewing and searching products */}
      <Route element={<MainLayout />}>
        {/* Home and Product Routes (No Auth Required) */}
        <Route index element={<HomePage />} />
        <Route path="product/:id" element={<DetailPage />} />
      </Route>

      {/* authenticated users */}

      <Route path="/user" element={<AuthRequire> <MainLayout /> </AuthRequire>}>
        {/* <Route path="/user" element={<MainLayout />}> */}

        {/* User Profile */}
        <Route path="profile" element={<ProfilePage />} />

        {/* Cart and Checkout */}
        <Route path="cart" element={<CartPage />} />
        <Route path="history" element={<HistoryOrdersPage />} />
        <Route path="checkout" element={<CheckoutPage />} />

      </Route>

      {/* ONLY Admin Chua check role admin*/}
      <Route path="/admin" element={<AdminRequire> <AdminMainLayout /></AdminRequire>} >
        {/* Admin routes for managing discounts and products */}
        <Route index element={<AdminHomePage />} />

        <Route path="discounts" element={<AdminDiscountsPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        {/* <Route path="products/update/:productId" element={<AdminProductsPage />} /> */}
        <Route path="products/update/:productId" element={<AdminProductsPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
      </Route>


      <Route element={<BlankLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/success" element={<SuccessTransaction />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Router;