import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { getCart, removeFromCart, updateCartItem, clearCart } from '../services/productService';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItems, setUpdatingItems] = useState({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await getCart(token);
      setCart(data);
    } catch (err) {
      const errorMessage = err.detail || err.message || 'Failed to fetch cart';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 20) return;
    
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    setError('');
    
    try {
      await updateCartItem(productId, newQuantity, token);
      await fetchCart();
    } catch (err) {
      const errorMessage = err.detail || err.message || 'Failed to update quantity';
      setError(errorMessage);
      setTimeout(() => setError(''), 3000);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveItem = async (productId) => {
    setShowRemoveConfirm(null);
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    setError('');
    
    try {
      await removeFromCart(productId, token);
      await fetchCart();
    } catch (err) {
      const errorMessage = err.detail || err.message || 'Failed to remove item';
      setError(errorMessage);
      setTimeout(() => setError(''), 3000);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleClearCart = async () => {
    setShowClearConfirm(false);
    setLoading(true);
    setError('');
    
    try {
      await clearCart(token);
      await fetchCart();
    } catch (err) {
      const errorMessage = err.detail || err.message || 'Failed to clear cart';
      setError(errorMessage);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `Rs. ${parseFloat(price).toFixed(2)}`;
  };

  const calculateSubtotal = (item) => {
    return item.quantity * item.price;
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + calculateSubtotal(item), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-green-600 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0FFF0' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <Logo size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
              <p className="text-gray-600">Review your items before checkout</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!cart || !cart.items || cart.items.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add some products to get started</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          // Cart Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Subtotal</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cart.items.map((item, index) => (
                        <tr key={item.product_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">Product #{item.product_id.slice(0, 8)}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{formatPrice(item.price)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updatingItems[item.product_id]}
                                className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition-colors"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                                disabled={item.quantity >= 20 || updatingItems[item.product_id]}
                                className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(calculateSubtotal(item))}</td>
                          <td className="px-6 py-4">
                            {showRemoveConfirm === item.product_id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleRemoveItem(item.product_id)}
                                  className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setShowRemoveConfirm(null)}
                                  className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowRemoveConfirm(item.product_id)}
                                disabled={updatingItems[item.product_id]}
                                className="text-red-600 hover:text-red-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4 p-4">
                  {cart.items.map((item) => (
                    <div key={item.product_id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">Product #{item.product_id.slice(0, 8)}</h4>
                          <p className="text-gray-600">{formatPrice(item.price)}</p>
                        </div>
                        <p className="font-bold text-lg text-green-600">{formatPrice(calculateSubtotal(item))}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItems[item.product_id]}
                            className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                            disabled={item.quantity >= 20 || updatingItems[item.product_id]}
                            className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        
                        {showRemoveConfirm === item.product_id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleRemoveItem(item.product_id)}
                              className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setShowRemoveConfirm(null)}
                              className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowRemoveConfirm(item.product_id)}
                            disabled={updatingItems[item.product_id]}
                            className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span>Rs. 0.00</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold text-green-600">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full bg-red-100 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                  >
                    Clear Cart
                  </button>
                  
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clear Cart Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Cart</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to remove all items from your cart?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearCart}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
