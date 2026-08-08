import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ShoppingCart, Package, Home, PlusCircle } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b-2 border-green-100 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO SECTION */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <Logo size="md" />
            <div>
              <h1 className="text-2xl font-bold text-green-600">FarmLink</h1>
              <p className="text-xs text-gray-600">Farm to Consumer</p>
            </div>
          </div>

          {/* NAVIGATION - DESKTOP */}
          {user && user.role === 'consumer' && (
            <div className="hidden md:flex items-center gap-3">
              {/* PRODUCTS NAV ITEM */}
              <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors border border-gray-200 hover:border-green-300"
              >
                <ShoppingBag size={18} className="text-green-600" />
                <span className="text-gray-700 font-semibold">Products</span>
              </button>

              {/* CART NAV ITEM */}
              <button
                onClick={() => navigate('/cart')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors border border-gray-200 hover:border-green-300"
              >
                <ShoppingCart size={18} className="text-green-600" />
                <span className="text-gray-700 font-semibold">Cart</span>
              </button>

              {/* ORDERS NAV ITEM */}
              <button
                onClick={() => navigate('/orders')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors border border-gray-200 hover:border-green-300"
              >
                <Package size={18} className="text-green-600" />
                <span className="text-gray-700 font-semibold">Orders</span>
              </button>
            </div>
          )}

          {user && user.role === 'farmer' && (
            <div className="hidden md:flex items-center gap-3">
              {/* DASHBOARD NAV ITEM */}
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors border border-gray-200 hover:border-green-300"
              >
                <Home size={18} className="text-green-600" />
                <span className="text-gray-700 font-semibold">Dashboard</span>
              </button>

              {/* MY PRODUCTS NAV ITEM */}
              <button
                onClick={() => navigate('/farmer-products')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors border border-gray-200 hover:border-green-300"
              >
                <ShoppingBag size={18} className="text-green-600" />
                <span className="text-gray-700 font-semibold">My Products</span>
              </button>

              {/* ADD PRODUCT NAV ITEM */}
              <button
                onClick={() => navigate('/add-product')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors border border-gray-200 hover:border-green-300"
              >
                <PlusCircle size={18} className="text-green-600" />
                <span className="text-gray-700 font-semibold">Add Product</span>
              </button>

              {/* MY ORDERS NAV ITEM */}
              <button
                onClick={() => navigate('/farmer-orders')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors border border-gray-200 hover:border-green-300"
              >
                <Package size={18} className="text-green-600" />
                <span className="text-gray-700 font-semibold">Orders</span>
              </button>
            </div>
          )}

          {/* USER SECTION */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-gray-900 font-semibold text-sm">
                    {user.full_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role === 'farmer' ? '👨‍🌾 Farmer' : '👤 Consumer'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
