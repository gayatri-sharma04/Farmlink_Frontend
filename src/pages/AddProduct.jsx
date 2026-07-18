import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addProduct } from '../services/farmerService';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: 'vegetables',
    image_url: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim() || formData.name.length < 3) {
      setError('Product name must be at least 3 characters');
      return false;
    }
    if (!formData.description.trim() || formData.description.length < 10) {
      setError('Description must be at least 10 characters');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      setError('Quantity must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        image_url: formData.image_url || null,
      };

      await addProduct(productData, token);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/farmer-products');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/farmer-products');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <svg className="h-16 w-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Added Successfully!</h2>
          <p className="text-gray-600">Redirecting to your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-gray-600">Fill in the details to add a new product</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Fresh Tomatoes"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Minimum 3 characters</p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Minimum 10 characters</p>
            </div>

            {/* Price and Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (Rs.) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="50"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="100"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/product-image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Enter a URL for your product image</p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
