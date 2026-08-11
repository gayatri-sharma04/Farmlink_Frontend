import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import backgroundImage from '../assets/background image.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url('${backgroundImage}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'scroll' }}>
      <div className="w-full max-w-[500px] mx-auto">
        
        {/* LOGIN FORM */}
        <div className="bg-white/98 backdrop-blur-sm rounded-3xl shadow-2xl p-9 border border-gray-100">
          <h2 className="text-2xl font-bold mb-2 ml-4" style={{ color: '#14532d' }}>
            {t('login.title')}
          </h2>
          <p className="text-gray-600 text-sm mb-8">
            {t('login.subtitle')}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL FIELD */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={handleInputChange(setEmail)}
                placeholder="you@example.com"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                required
              />
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('login.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={handleInputChange(setPassword)}
                placeholder="••••••••"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                required
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl text-base"
            >
              {loading ? t('login.signingIn') : t('login.signIn')}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">{t('login.noAccount')}</span>
            </div>
          </div>

          {/* REGISTER LINK */}
          <button
            onClick={() => navigate('/register')}
            className="w-full border-2 border-green-600 text-green-600 font-bold py-4 rounded-xl hover:bg-green-50 transition-colors text-base"
          >
            {t('login.createAccount')}
          </button>
        </div>

        {/* FOOTER */}
        {/* <p className="text-center text-blue-600 text-xs mt-6">
          © 2026 FarmLink. All rights reserved.
        </p> */}
      </div>
    </div>
  );
};

export default LoginPage;


