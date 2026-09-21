import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail';
import Bespoke from '../pages/Bespoke';
import Checkout from '../pages/Checkout';
import OrderSuccess from '../pages/OrderSuccess';
import TrackOrder from '../pages/TrackOrder';
import Wishlist from '../pages/Wishlist';
import About from '../pages/About';
import Policies from '../pages/Policies';

// Account module
import Login from '../pages/Account/Login';
import AccountLayout from '../pages/Account/AccountLayout';
import AccountOverview from '../pages/Account/AccountOverview';
import AccountOrders from '../pages/Account/AccountOrders';
import AccountBespoke from '../pages/Account/AccountBespoke';
import AccountAddresses from '../pages/Account/AccountAddresses';
import AccountSettings from '../pages/Account/AccountSettings';

// Admin module
import AdminRoute from '../components/common/AdminRoute';
import AdminLayout from '../pages/Admin/AdminLayout';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminProducts from '../pages/Admin/AdminProducts';
import AdminProductEdit from '../pages/Admin/AdminProductEdit';
import AdminOrders from '../pages/Admin/AdminOrders';
import AdminMto from '../pages/Admin/AdminMto';
import AdminBespoke from '../pages/Admin/AdminBespoke';
import AdminCoupons from '../pages/Admin/AdminCoupons';
import AdminCategories from '../pages/Admin/AdminCategories';
import AdminSettings from '../pages/Admin/AdminSettings';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminNewsletter from '../pages/Admin/AdminNewsletter';
import AdminLogin from '../pages/Admin/AdminLogin';

// Common guards
import ProtectedRoute from '../components/common/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:handle" element={<ProductDetail />} />
      <Route path="/bespoke" element={<Bespoke />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success/:ref" element={<OrderSuccess />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/track-order" element={<TrackOrder />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/about" element={<About />} />
      <Route path="/policies" element={<Policies />} />

      {/* Auth & Patron Account Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AccountOverview />} />
        <Route path="overview" element={<AccountOverview />} />
        <Route path="orders" element={<AccountOrders />} />
        <Route path="bespoke" element={<AccountBespoke />} />
        <Route path="addresses" element={<AccountAddresses />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="settings" element={<AccountSettings />} />
      </Route>

      {/* Super Admin & Staff Portal Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductEdit />} />
        <Route path="products/:id" element={<AdminProductEdit />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="mto" element={<AdminMto />} />
        <Route path="bespoke" element={<AdminBespoke />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="newsletter" element={<AdminNewsletter />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
