import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import backgroundImage from '../assets/background image.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const quotes = [
    "Connecting farmers with consumers, one harvest at a time.",
    "Fair prices for farmers, fresh produce for consumers.",
    "Direct from farm to your table - no middlemen.",
    "Supporting local farmers, building a stronger community.",
    "Real farmers, real prices, real value.",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      // Role-based redirect
      const userRole = result.data.user?.role;
      if (userRole === 'farmer') {
        navigate('/dashboard');
      } else {
        navigate('/products');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url('${backgroundImage}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
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

        {/* LOGIN FORM */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL FIELD */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleInputChange(setEmail)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={handleInputChange(setPassword)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to FarmLink?</span>
            </div>
          </div>

          {/* REGISTER LINK */}
          <button
            onClick={() => navigate('/register')}
            className="w-full border-2 border-green-600 text-green-600 font-bold py-3 rounded-lg hover:bg-green-50 transition-colors"
          >
            Create an Account
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

export default LoginPage;
