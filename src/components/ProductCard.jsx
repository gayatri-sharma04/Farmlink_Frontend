import React, { useState } from 'react';
import { addToCart } from '../services/productService';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, farmerName }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageError, setImageError] = useState(false);
  
  const { token } = useAuth();

  // Category badge colors
  const categoryColors = {
    vegetables: 'bg-green-100 text-green-800',
    fruits: 'bg-yellow-100 text-yellow-800',
    grains: 'bg-amber-100 text-amber-800',
    dairy: 'bg-blue-100 text-blue-800',
    other: 'bg-gray-100 text-gray-800',
  };

  const getCategoryColor = (category) => {
    return categoryColors[category] || categoryColors.other;
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 20) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      setError('Please login to add items to cart');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await addToCart(product.id, quantity, product.price, token);
      setSuccess('Added to cart!');
      setQuantity(1);
      
      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      const errorMessage = err.detail || err.message || 'Failed to add to cart';
      setError(errorMessage);
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const truncateDescription = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatPrice = (price) => {
    return `Rs. ${parseFloat(price).toFixed(2)}`;
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 10) return `Only ${quantity} left`;
    return 'In Stock';
  };

  const getStockColor = (quantity) => {
    if (quantity === 0) return 'text-red-600';
    if (quantity < 10) return 'text-orange-600';
    return 'text-green-600';
  };

  const placeholderImage = 'https://via.placeholder.com/400x225?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-video bg-gray-100">
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <img
            src={placeholderImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(product.category)}`}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
        </div>

        {/* Availability Badge */}
        {!product.is_available && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>

        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</span>
        </div>

        {/* Stock Status */}
        <div className="mb-3">
          <span className={`text-sm font-medium ${getStockColor(product.quantity)}`}>
            {getStockStatus(product.quantity)}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          {truncateDescription(product.description)}
        </p>

        {/* Farmer Info */}
        <div className="mb-4">
          <span className="text-xs text-gray-500">
            Sold by {farmerName || 'Local Farm'}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || loading || !product.is_available}
              className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition-colors"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              disabled={loading || !product.is_available}
              className="w-16 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 20 || loading || !product.is_available}
              className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-3 bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={loading || !product.is_available || product.quantity === 0}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding...
            </>
          ) : !product.is_available || product.quantity === 0 ? (
            'Out of Stock'
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
