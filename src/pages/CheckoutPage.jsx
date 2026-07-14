import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCart, clearCart } from '../services/productService';
import { placeOrder } from '../services/orderService';

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
      
      setLoading(true);
      setError('');
      
      try {
        const data = await getCart(token);
        setCart(data);
        
        // Pre-fill delivery address from user profile if available
        if (user?.address) {
          setDeliveryAddress(user.address);
        }
      } catch (err) {
        const errorMessage = err.detail || err.message || 'Failed to fetch cart';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, user]);

  const validateForm = () => {
    if (!deliveryAddress.trim()) {
      setValidationError('Delivery address is required');
      return false;
    }
    
    if (deliveryAddress.trim().length < 10) {
      setValidationError('Delivery address must be at least 10 characters');
      return false;
    }
    
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      setError('Your cart is empty. Add items before checkout.');
      return;
    }

    setPlacingOrder(true);
    setError('');
    setValidationError('');

    const orderData = {
      items: cart.items,
      total_price: cart.total_price,
      delivery_address: deliveryAddress.trim(),
      notes: notes.trim() || undefined,
    };

    try {
      await placeOrder(orderData, token);
      
      // Clear cart after successful order
      try {
        await clearCart(token);
      } catch (clearErr) {
        console.error('Failed to clear cart:', clearErr);
        // Don't block the flow if cart clear fails
      }
      
      setSuccess(true);
      
      // Navigate to orders page after 2 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      const errorMessage = err.detail || err.message || 'Failed to place order';
      setError(errorMessage);
    } finally {
      setPlacingOrder(false);
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
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Review your order and provide delivery information</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success ? (
          // Success State
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              className="h-16 w-16 text-green-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600">Redirecting to your orders...</p>
          </div>
        ) : (
          <>
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
                <p className="text-gray-500 mb-6">Add items to your cart before checkout</p>
                <button
                  onClick={() => navigate('/products')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              // Checkout Form
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Summary Section */}
                <div className="lg:order-2">
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                    
                    {/* Cart Items */}
                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                      {cart.items.map((item) => (
                        <div key={item.product_id} className="flex justify-between items-start border-b border-gray-100 pb-3">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Product #{item.product_id.slice(0, 8)}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                          </div>
                          <p className="font-semibold text-gray-900">{formatPrice(calculateSubtotal(item))}</p>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>{formatPrice(calculateTotal())}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Tax</span>
                        <span>Rs. 0.00</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-green-600 pt-2 border-t">
                        <span>Total</span>
                        <span>{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Form Section */}
                <div className="lg:order-1">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Delivery Information</h3>
                    
                    {validationError && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {validationError}
                      </div>
                    )}

                    <div className="space-y-6">
                      {/* Delivery Address */}
                      <div>
                        <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Address *
                        </label>
                        <textarea
                          id="deliveryAddress"
                          value={deliveryAddress}
                          onChange={(e) => {
                            setDeliveryAddress(e.target.value);
                            setValidationError('');
                          }}
                          rows={4}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none ${
                            validationError && !deliveryAddress.trim() ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter complete delivery address (street, city, postal code)"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
                      </div>

                      {/* Special Instructions */}
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                          Special Instructions (Optional)
                        </label>
                        <textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                          placeholder="Any special instructions or notes for delivery?"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 space-y-3">
                      <button
                        type="button"
                        onClick={() => navigate('/cart')}
                        className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Back to Cart
                      </button>
                      
                      <button
                        type="submit"
                        disabled={placingOrder}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {placingOrder ? (
                          <>
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Placing Order...
                          </>
                        ) : (
                          'Place Order'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;