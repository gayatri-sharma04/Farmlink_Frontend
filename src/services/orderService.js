import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Place new order
export const placeOrder = async (orderData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/orders`,
      orderData,
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

// Get all user orders
export const getUserOrders = async (token, skip = 0, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/orders`,
      {
        params: { skip, limit },
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

// Get single order
export const getOrder = async (orderId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/orders/${orderId}`,
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

// Update order status
export const updateOrderStatus = async (orderId, status, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/orders/${orderId}`,
      { status },
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