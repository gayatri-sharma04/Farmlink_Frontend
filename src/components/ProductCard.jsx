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

  const getCategoryIcon = (category) => {
    const icons = {
      fruits: { emoji: '🍎', color: 'bg-red-100 text-red-700 border-red-300' },
      vegetables: { emoji: '🥬', color: 'bg-green-100 text-green-700 border-green-300' },
      grains: { emoji: '🌾', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      dairy: { emoji: '🥛', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    };
    return icons[category?.toLowerCase()] || icons.fruits;
  };

  const getStockStatus = (qty) => {
    if (qty <= 0) {
      return { 
        status: 'Out of Stock', 
        color: 'bg-red-100 text-red-700 border-red-300',
        icon: '✗'
      };
    } else if (qty <= 5) {
      return { 
        status: `Only ${qty} left!`, 
        color: 'bg-orange-100 text-orange-700 border-orange-300',
        icon: '⚠️'
      };
    } else if (qty <= 10) {
      return { 
        status: `${qty} in stock`, 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        icon: '⏱️'
      };
    } else {
      return { 
        status: '✓ In Stock', 
        color: 'bg-green-100 text-green-700 border-green-300',
        icon: '✓'
      };
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 20) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      setError('Please login first');
      return;
    }

    if (product.quantity <= 0) {
      setError('This product is out of stock');
      return;
    }

    if (quantity > product.quantity) {
      setError(`Only ${product.quantity} available`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await addToCart(product.id, quantity, product.price, token);
      setSuccess('Added to cart!');
      setQuantity(1);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.detail || err.message || 'Failed to add to cart');
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


  const catInfo = getCategoryIcon(product.category);
  const stockStatus = getStockStatus(product.quantity);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* IMAGE SECTION - LARGE AND PROMINENT */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        <img 
          src={product.image_url || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(product.name)}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(product.name);
          }}
        />
        
        {/* CATEGORY BADGE - LARGE AND PROMINENT */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`flex items-center gap-2 border-2 rounded-full px-4 py-2 shadow-lg font-bold capitalize ${catInfo.color}`}>
            <span className="text-xl">{catInfo.emoji}</span>
            {product.category}
          </div>
        </div>

        {/* STOCK STATUS - BOTTOM LEFT */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className={`border-2 rounded-full px-3 py-1 text-xs font-bold ${stockStatus.color}`}>
            {stockStatus.icon} {stockStatus.status}
          </div>
        </div>

        {/* URGENT WARNING FOR LOW STOCK */}
        {product.quantity <= 5 && product.quantity > 0 && (
          <div className="absolute top-20 left-0 right-0 bg-orange-500 text-white px-3 py-2 text-center text-xs font-bold animate-pulse">
            🔥 Hurry! Only {product.quantity} left!
          </div>
        )}

        {product.quantity === 0 && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded font-bold">
              Out of Stock
            </div>
          </div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-col flex-grow p-4">
        {/* PRODUCT NAME */}
        <h3 className="font-bold text-lg mb-1 line-clamp-2 text-gray-900">
          {product.name}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
          {truncateDescription(product.description)}
        </p>

        {/* FARMER NAME */}
        <p className="text-gray-500 text-xs mb-3 font-medium">
          Sold by <span className="text-gray-700 font-semibold">{farmerName || 'Local Farm'}</span>
        </p>

        {/* PRICE - PROMINENT */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-green-600 font-bold text-2xl">
            Rs. {parseFloat(product.price).toFixed(2)}
          </p>
        </div>

        {/* QUANTITY SELECTOR - DISABLED IF OUT OF STOCK */}
        {product.quantity > 0 && (
          <div className="mb-4">
            <label className="text-gray-700 font-semibold text-sm block mb-2">
              Quantity
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || loading || product.quantity === 0}
                className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors font-bold text-lg disabled:opacity-50"
              >
                −
              </button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => handleQuantityChange(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
                disabled={loading || product.quantity === 0}
                className="flex-1 text-center border-0 bg-transparent focus:outline-none font-semibold disabled:opacity-50"
                min="1"
                max={product.quantity}
              />
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.quantity || loading || product.quantity === 0}
                className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors font-bold text-lg disabled:opacity-50"
              >
                +
              </button>
            </div>
            {quantity > product.quantity && (
              <p className="text-red-600 text-xs mt-2">
                Only {product.quantity} available
              </p>
            )}
          </div>
        )}

        {/* ADD TO CART BUTTON */}
        <button 
          onClick={handleAddToCart}
          disabled={loading || !product.is_available || product.quantity === 0}
          className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
        >
          {loading ? 'Adding to Cart...' : !product.is_available || product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm text-center">
            ✓ Added to cart!
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm text-center">
            ✗ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
