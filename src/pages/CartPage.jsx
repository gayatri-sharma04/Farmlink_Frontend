import React from 'react';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600">Cart functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;