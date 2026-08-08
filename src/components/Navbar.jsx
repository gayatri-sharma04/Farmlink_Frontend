import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingBag, ShoppingCart, Package, Home, PlusCircle, ChevronDown } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setLanguageDropdownOpen(false);
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
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-all font-semibold hover:shadow-md"
                >
                  {t('nav.login')}
                </button>

                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold hover:shadow-md"
                >
                  {t('nav.signup')}
                </button>
              </>
            )}

            {/* LANGUAGE SELECTOR DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all border border-gray-300 font-semibold text-gray-700"
              >
                <span className="text-lg">
                  {language === 'en' ? '🇬🇧' : '🇳🇵'}
                </span>
                <span className="text-sm">
                  {language === 'en' ? 'English' : 'नेपाली'}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* DROPDOWN MENU */}
              {languageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-50">

                  {/* ENGLISH OPTION */}
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-green-50 transition-colors border-b border-gray-200 ${
                      language === 'en' ? 'bg-green-100 border-l-4 border-green-600' : ''
                    }`}
                  >
                    <span className="text-2xl">🇬🇧</span>
                    <div>
                      <div className="font-semibold text-gray-900">English</div>
                      <div className="text-xs text-gray-600">English Language</div>
                    </div>
                    {language === 'en' && (
                      <span className="ml-auto text-green-600 font-bold">✓</span>
                    )}
                  </button>

                  {/* NEPALI OPTION */}
                  <button
                    onClick={() => handleLanguageChange('np')}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-green-50 transition-colors ${
                      language === 'np' ? 'bg-green-100 border-l-4 border-green-600' : ''
                    }`}
                  >
                    <span className="text-2xl">🇳🇵</span>
                    <div>
                      <div className="font-semibold text-gray-900">नेपाली</div>
                      <div className="text-xs text-gray-600">Nepali Language</div>
                    </div>
                    {language === 'np' && (
                      <span className="ml-auto text-green-600 font-bold">✓</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
