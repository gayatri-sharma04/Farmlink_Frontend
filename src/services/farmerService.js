import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Get all products (filtered to farmer's products)
export const getMyProducts = async (token, farmerId) => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Filter products to return only this farmer's products
    const allProducts = response.data;
    if (farmerId) {
      return allProducts.filter(p => p.farmer_id === farmerId);
    }
    return allProducts;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch products';
    throw new Error(errorMessage);
  }
};

// Get single product by ID
export const getProductById = async (productId, token) => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch product';
    throw new Error(errorMessage);
  }
};

// Add new product
export const addProduct = async (productData, token) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to add product';
    throw new Error(errorMessage);
  }
};

// Update existing product
export const updateProduct = async (productId, productData, token) => {
  try {
    const response = await axios.put(`${API_URL}/products/${productId}`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to update product';
    throw new Error(errorMessage);
  }
};

// Delete product
export const deleteProduct = async (productId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to delete product';
    throw new Error(errorMessage);
  }
};

// Get all orders (for farmer)
export const getFarmerOrders = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch orders';
    throw new Error(errorMessage);
  }
};

// Update order status
export const updateOrderStatus = async (orderId, statusData, token) => {
  try {
    const response = await axios.put(`${API_URL}/orders/${orderId}`, statusData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to update order status';
    throw new Error(errorMessage);
  }
};
