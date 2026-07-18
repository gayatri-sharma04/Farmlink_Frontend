import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import FarmerProtectedRoute from './components/FarmerProtectedRoute';
import DefaultRedirect from './components/DefaultRedirect';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerProducts from './pages/FarmerProducts';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import FarmerOrders from './pages/FarmerOrders';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          {/* Farmer Routes */}
          <Route
            path="/dashboard"
            element={
              <FarmerProtectedRoute>
                <FarmerDashboard />
              </FarmerProtectedRoute>
            }
          />
          <Route
            path="/farmer-products"
            element={
              <FarmerProtectedRoute>
                <FarmerProducts />
              </FarmerProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <FarmerProtectedRoute>
                <AddProduct />
              </FarmerProtectedRoute>
            }
          />
          <Route
            path="/edit-product/:productId"
            element={
              <FarmerProtectedRoute>
                <EditProduct />
              </FarmerProtectedRoute>
            }
          />
          <Route
            path="/farmer-orders"
            element={
              <FarmerProtectedRoute>
                <FarmerOrders />
              </FarmerProtectedRoute>
            }
          />

          {/* Default Route - Role-based redirect */}
          <Route path="/" element={<DefaultRedirect />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
