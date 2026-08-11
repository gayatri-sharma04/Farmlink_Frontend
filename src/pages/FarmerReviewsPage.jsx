import React, { useState, useEffect } from 'react';
import { Star, Package } from 'lucide-react';
import { getFarmerReviews } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const FarmerReviewsPage = () => {
  const { t } = useLanguage();
  const { user, token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getFarmerReviews(user.id, token);
        setReviews(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user.id, token]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const groupReviewsByProduct = () => {
    const grouped = {};
    reviews.forEach(review => {
      if (!grouped[review.product_id]) {
        grouped[review.product_id] = {
          product_name: review.product_name,
          reviews: []
        };
      }
      grouped[review.product_id].reviews.push(review);
    });
    return grouped;
  };

  const groupedReviews = groupReviewsByProduct();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Reviews</h1>
        <p className="text-gray-600 mb-8">See what customers are saying about your products</p>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{reviews.length}</div>
              <div className="text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{calculateAverageRating()}</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{Object.keys(groupedReviews).length}</div>
              <div className="text-gray-600">Products Reviewed</div>
            </div>
          </div>
        </div>

        {/* Reviews by Product */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg">Loading reviews...</div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            {error}
          </div>
        ) : Object.keys(groupedReviews).length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600">Your products haven't received any reviews yet. Keep providing great products and service!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedReviews).map(([productId, productData]) => (
              <div key={productId} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  {productData.product_name}
                </h3>

                {/* Product Rating Summary */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                  <div className="text-2xl font-bold text-gray-900">
                    {(productData.reviews.reduce((acc, r) => acc + r.rating, 0) / productData.reviews.length).toFixed(1)}
                  </div>
                  <div className="flex">
                    {renderStars(Math.round(productData.reviews.reduce((acc, r) => acc + r.rating, 0) / productData.reviews.length))}
                  </div>
                  <div className="text-gray-600">
                    {productData.reviews.length} review{productData.reviews.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {productData.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-gray-600 text-sm">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">{review.consumer_name || 'Anonymous'}</p>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerReviewsPage;
