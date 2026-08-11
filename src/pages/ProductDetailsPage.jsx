import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Plus, Minus, Trash2, Edit2 } from 'lucide-react';
import { getProduct } from '../services/productService';
import { addToCart } from '../services/productService';
import { getProductReviews, createReview, updateReview, deleteReview } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, token, isConsumer, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);

  // Review form state
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(productId);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await getProductReviews(productId);
        setReviews(data || []);
      } catch (err) {
        setReviewsError(err.message || 'Failed to load reviews');
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (product.quantity <= 0) {
      alert('This product is out of stock');
      return;
    }

    if (quantity > product.quantity) {
      alert(`Only ${product.quantity} available`);
      return;
    }

    setAdding(true);
    try {
      await addToCart(product.id, quantity, product.price, token);
      alert('Added to cart!');
      setQuantity(1);
    } catch (err) {
      alert(err.detail || err.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !isConsumer) {
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      if (editingReview) {
        await updateReview(editingReview.id, reviewForm, token);
        setReviews(reviews.map(r => r.id === editingReview.id ? { ...r, ...reviewForm } : r));
        setEditingReview(null);
      } else {
        const newReview = await createReview(productId, reviewForm, token);
        setReviews([...reviews, newReview]);
      }
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      alert(err.detail || err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({ rating: review.rating, comment: review.comment });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview(reviewId, token);
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      alert(err.detail || err.message || 'Failed to delete review');
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setReviewForm({ rating: 5, comment: '' });
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/products')}
          className="text-green-600 hover:text-green-700 mb-6 inline-block"
        >
          ← Back to Products
        </button>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image_url || 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(product.name)}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(product.name);
                }}
              />
              {product.quantity <= 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <span className="text-white text-2xl font-bold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>

              <div className="mb-4">
                <span className="text-3xl font-bold text-green-600">
                  Rs. {parseFloat(product.price).toFixed(2)}
                </span>
                <span className="text-gray-500 ml-2">per {product.unit || 'kg'}</span>
              </div>

              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.quantity > 10 ? 'bg-green-100 text-green-700' :
                  product.quantity > 0 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {product.quantity > 10 ? 'In Stock' :
                   product.quantity > 0 ? `${product.quantity} left` :
                   'Out of Stock'}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-600">
                  <span className="font-semibold">Category:</span> {product.category}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Sold by:</span> {product.farmer_name || 'Local Farm'}
                </p>
              </div>

              {/* Quantity Selector */}
              {product.quantity > 0 && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
                      min="1"
                      max={product.quantity}
                      className="w-20 text-center border border-gray-300 rounded-lg py-2"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      disabled={quantity >= product.quantity}
                      className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={adding || product.quantity <= 0}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {adding ? 'Adding...' : product.quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

          {/* Rating Summary */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b">
            <div className="text-4xl font-bold text-gray-900">{calculateAverageRating()}</div>
            <div className="flex">
              {renderStars(Math.round(calculateAverageRating()))}
            </div>
            <div className="text-gray-600">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Review Form */}
          {isAuthenticated && isConsumer && (
            <div className="mb-8 pb-8 border-b">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingReview ? 'Edit Your Review' : 'Write a Review'}
              </h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
                  </button>
                  {editingReview && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="text-gray-600">Loading reviews...</div>
          ) : reviewsError ? (
            <div className="text-red-600">{reviewsError}</div>
          ) : reviews.length === 0 ? (
            <div className="text-gray-600">No reviews yet. Be the first to review!</div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-gray-600 text-sm">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900">{review.consumer_name || 'Anonymous'}</p>
                    </div>
                    {isAuthenticated && review.consumer_id === user.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
