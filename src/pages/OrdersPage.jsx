import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';
import { formatDateInUserTimezone } from '../utils/dateFormatter';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      
      setLoading(true);
      setError('');
      
      try {
        const data = await getUserOrders(token);
        console.log('Orders data from backend:', data);
        // Sort by newest first (reverse chronological)
        const sortedOrders = Array.isArray(data) ? data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        ) : [];
        setOrders(sortedOrders);
      } catch (err) {
        const errorMessage = err.detail || err.message || 'Failed to fetch orders';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return formatDateInUserTimezone(dateString);
  };

  const formatPrice = (price) => {
    return `Rs. ${parseFloat(price).toFixed(2)}`;
  };

  const getItemCount = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.length;
  };

  const handleViewDetails = (order) => {
    console.log('Selected order details:', order);
    setSelectedOrder(order);
  };

  const closeDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-green-600 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View your order history and track deliveries</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!orders || orders.length === 0 ? (
          // Empty State
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          // Orders List
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order, index) => (
                    <tr key={order.id} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-900">#{order.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(order.total_price)}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {getItemCount(order.items)} {getItemCount(order.items) === 1 ? 'item' : 'items'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-mono text-sm text-gray-900">#{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        {getItemCount(order.items)} {getItemCount(order.items) === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <p className="font-bold text-lg text-green-600">{formatPrice(order.total_price)}</p>
                  </div>
                  
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="w-full bg-green-50 text-green-600 py-2 rounded-lg font-semibold hover:bg-green-100 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Order Details</h3>
                  <p className="text-sm text-gray-600">Order #{selectedOrder.id.slice(0, 8)}</p>
                </div>
                <button
                  onClick={closeDetails}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                <span className={`px-4 py-2 text-sm font-semibold rounded-full uppercase ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-bold text-lg text-green-600">{formatPrice(selectedOrder.total_price)}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                {!selectedOrder.items || selectedOrder.items.length === 0 ? (
                  <p className="text-gray-500 bg-gray-50 p-3 rounded-lg">No items in this order</p>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Product ID</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Quantity</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Price</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm font-mono text-gray-900">#{item.product_id.slice(0, 8)}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{formatPrice(item.price)}</td>
                            <td className="px-4 py-2 text-sm font-semibold text-gray-900">{formatPrice(item.quantity * item.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Delivery Address */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {selectedOrder.delivery_address ? selectedOrder.delivery_address : 'No address provided'}
                </p>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Special Instructions</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={closeDetails}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;