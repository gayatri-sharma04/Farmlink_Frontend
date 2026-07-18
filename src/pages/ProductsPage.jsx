import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const { token } = useAuth();
  const limit = 20;

  const fetchProducts = async (initial = true) => {
    try {
      if (initial) {
        setLoading(true);
        setError('');
      } else {
        setLoadingMore(true);
      }

      const data = await getProducts(skip, limit);
      
      if (initial) {
        setProducts(data);
      } else {
        setProducts(prev => [...prev, ...data]);
      }

      // Check if there are more products to load
      setHasMore(data.length === limit);
    } catch (err) {
      const errorMessage = err.detail || err.message || 'Failed to fetch products';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(true);
  }, []);

  const handleLoadMore = () => {
    setSkip(prev => prev + limit);
    fetchProducts(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fresh Products</h1>
          <p className="text-gray-600">Browse our selection of fresh produce from local farmers</p>
          
          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name, category, or description..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-12 w-12 text-green-600 mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          // Error State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-4">
              {error}
            </div>
            <button
              onClick={() => fetchProducts(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          // No Products State
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? 'No products found' : 'No products available'}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Check back later for new products'}
            </p>
          </div>
        ) : (
          // Products Grid
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  farmerName={product.farmer_name || null}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && filteredProducts.length >= limit && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loadingMore ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'Load More Products'
                  )}
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="text-center mt-4 text-gray-600">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
