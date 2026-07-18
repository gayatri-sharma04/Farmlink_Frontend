import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyProducts, getFarmerOrders } from '../services/farmerService';
import { formatDateInUserTimezone } from '../utils/dateFormatter';

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      setLoading(true);
      setError('');
      
      try {
        const [productsData, ordersData] = await Promise.all([
          getMyProducts(token),
          getFarmerOrders(token)
        ]);
        
        // Filter products to show only this farmer's products
        const myProducts = Array.isArray(productsData) 
          ? productsData.filter(p => p.farmer_id === user.id)
          : [];
        
        setProducts(myProducts);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Calculate stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalSales = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, order) => sum + parseFloat(order.total_price), 0);

  // Recent orders (last 5)
  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-green-600 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.full_name || 'Farmer'}!
          </h1>
          <p className="text-gray-600">Manage your products and track orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">{pendingOrders}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sales</p>
                <p className="text-3xl font-bold text-green-600">{formatPrice(totalSales)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/add-product')}
              className="flex items-center justify-center bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </button>
            <button
              onClick={() => navigate('/farmer-products')}
              className="flex items-center justify-center bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              My Products
            </button>
            <button
              onClick={() => navigate('/farmer-orders')}
              className="flex items-center justify-center bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View Orders
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No orders yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-900">#{order.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDateInUserTimezone(order.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatPrice(order.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
