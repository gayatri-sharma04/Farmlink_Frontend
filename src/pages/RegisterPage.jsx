import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import farmerIcon from '../assets/farmer.png';
import userIcon from '../assets/user.png';
import backgroundImage from '../assets/background image.png';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    address: '',
    role: 'consumer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const quotes = [
    "Join our community of farmers and consumers.",
    "Start selling your fresh produce directly to customers.",
    "Get fresh, organic products from local farmers.",
    "Build a sustainable food ecosystem together.",
    "Fair trade, fresh food, happy community.",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (!formData.full_name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    
    if (!formData.role) {
      setError('Please select a role');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await register(
      formData.email,
      formData.password,
      formData.full_name,
      formData.phone,
      formData.address,
      formData.role
    );
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8" style={{ backgroundImage: `url('${backgroundImage}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="w-full max-w-md">
        {/* QUOTE SECTION */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl font-bold text-green-600 mb-2">
            FarmLink
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Farmer to Consumer Marketplace
          </p>
          <p className="text-gray-700 text-sm italic px-4 py-4 bg-green-100 rounded-lg border-l-4 border-green-600">
            "{randomQuote}"
          </p>
        </div>

        {/* REGISTER FORM */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Create Account
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Join our community today
          </p>
{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    {typeof error === 'string' 
      ? error 
      : error?.response?.data?.detail || error?.message || 'Registration failed'}
  </div>
)}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ROLE SELECTION - CARD BASED - MOVED TO TOP */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I want to *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'consumer' })}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                    formData.role === 'consumer'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:border-green-300'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <img src={userIcon} alt="Consumer" className="w-12 h-12 object-contain" />
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">Consumer</div>
                  <div className="text-xs text-gray-600">Buy Products</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'farmer' })}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                    formData.role === 'farmer'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:border-green-300'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <img src={farmerIcon} alt="Farmer" className="w-12 h-12 object-contain" />
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">Farmer</div>
                  <div className="text-xs text-gray-600">Sell Products</div>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Create a password (min 8 characters)"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Enter your address"
              />
            </div>
            {/* REGISTER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* LOGIN LINK */}
          <button
            onClick={() => navigate('/login')}
            className="w-full border-2 border-green-600 text-green-600 font-bold py-3 rounded-lg hover:bg-green-50 transition-colors"
          >
            Sign In
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-600 text-xs mt-6">
          © 2026 FarmLink. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
