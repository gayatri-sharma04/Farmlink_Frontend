import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Get all products
export const getProducts = async (skip = 0, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: { skip, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single product
export const getProduct = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add item to cart
export const addToCart = async (productId, quantity, price, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/cart/items`,
      {
        product_id: productId,
        quantity,
        price
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get cart
export const getCart = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Remove from cart
export const removeFromCart = async (productId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/cart/items/${productId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update cart item quantity
export const updateCartItem = async (productId, quantity, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/cart/items/${productId}`,
      { quantity },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Clear cart
export const clearCart = async (token) => {
  try {
    const response = await axios.delete(`${API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};