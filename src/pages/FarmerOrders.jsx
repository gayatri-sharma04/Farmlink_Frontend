import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFarmerOrders, updateOrderStatus, getMyProducts } from '../services/farmerService';
import { formatDateInUserTimezone } from '../utils/dateFormatter';

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token || !user) return;
      
      setLoading(true);
      setError('');
      
      try {
        // Get farmer's products to get their product IDs
        const myProducts = await getMyProducts(token, user.id);
        
        // Convert product IDs to strings for consistent comparison
        const myProductIds = new Set(myProducts.map(p => String(p.id)));
        
        // Get all orders (backend filters for farmers)
        const data = await getFarmerOrders(token);
        
        // Filter orders AND filter items within each order
        const filteredOrders = (Array.isArray(data) ? data : [])
          .filter(order => {
            if (!order.items || !Array.isArray(order.items)) return false;
            // Include order if it has at least one of farmer's products
            return order.items.some(item => 
              myProductIds.has(String(item.product_id))
            );
          })
          .map(order => {
            // Filter items within the order to show only farmer's products
            const farmerItems = order.items.filter(item => 
              myProductIds.has(String(item.product_id))
            );
            
            // Recalculate total for farmer's items only
            const farmerTotal = farmerItems.reduce((total, item) => 
              total + (item.quantity * item.price), 0
            );
            
            return {
              ...order,
              items: farmerItems,
              total_price: farmerTotal
            };
          });
        
        setOrders(filteredOrders);
      } catch (err) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, user]);

  const formatPrice = (price) => {
    return `Rs. ${parseFloat(price).toFixed(2)}`;
  };

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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setStatusUpdate(order.status);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !statusUpdate) return;

    try {
      await updateOrderStatus(selectedOrder.id, { status: statusUpdate }, token);
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: statusUpdate } : o));
      setSelectedOrder(null);
      setSuccessMessage('Order status updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0FFF0' }}>
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
    <div className="min-h-screen" style={{ backgroundColor: '#F0FFF0' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">View and manage orders for your products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {!orders || orders.length === 0 ? (
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
            <p className="text-gray-500">Orders will appear here when customers purchase your products</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-900">#{order.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDateInUserTimezone(order.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatPrice(order.total_price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
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
                      <p className="text-sm text-gray-600">{formatDateInUserTimezone(order.created_at)}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items?.length || 0} items
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
                  onClick={() => setSelectedOrder(null)}
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
                  <p className="font-medium text-gray-900">{formatDateInUserTimezone(selectedOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Your Total</p>
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
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Product Name</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Product ID</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Quantity</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Price</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">
                              {item.product_name || 'Unknown Product'}
                            </td>
                            <td className="px-4 py-2 text-sm font-mono text-gray-600">#{item.product_id.slice(0, 8)}</td>
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

              {/* Update Status */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Update Status</h4>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;
