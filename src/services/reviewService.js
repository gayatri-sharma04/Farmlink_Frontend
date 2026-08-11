import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Get all reviews for a product
export const getProductReviews = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}/reviews`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all reviews for a farmer (for farmer reviews page)
export const getFarmerReviews = async (farmerId, token) => {
  try {
    const response = await axios.get(`${API_URL}/farmers/${farmerId}/reviews`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new review
export const createReview = async (productId, reviewData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/products/${productId}/reviews`,
      reviewData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update an existing review
export const updateReview = async (reviewId, reviewData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/reviews/${reviewId}`,
      reviewData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a review
export const deleteReview = async (reviewId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
