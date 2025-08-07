import React, { useState, useEffect } from 'react';
import { Heart, Eye, ShoppingCart, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Toast } from '../components/ui/Toast';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  priceTiers: {
    minQuantity: number;
    maxQuantity: number;
    price: number;
  }[];
  quantity: number;
  images: string[];
  category: string;
  subcategory: string;
}

export function FavoritesPage() {
  const { addToCart } = useCart();
  const { refreshFavoritesCount } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    fetchFavoriteProducts();
  }, []);

  const fetchFavoriteProducts = async () => {
    try {
      const response = await axios.get('http://143.198.212.38:5000/api/likes/user/liked-products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(response.data.products || []);
    } catch (error) {
      setMessage({
        text: 'Failed to fetch favorite products',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (productId: string) => {
    try {
      setRemovingId(productId);
      await axios.post(
        `http://143.198.212.38:5000/api/likes/products/${productId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Remove from local state
      setProducts(prev => prev.filter(product => product._id !== productId));
      
      // Update favorites count in header
      refreshFavoritesCount();
      
      setMessage({
        text: 'Removed from favorites',
        type: 'success'
      });
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.error || 'Failed to remove from favorites',
        type: 'error'
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      setAddingToCartId(product._id);
      await addToCart(product._id, 1, product.basePrice);
      setMessage({
        text: 'Added to cart successfully!',
        type: 'success'
      });
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.error || 'Failed to add to cart',
        type: 'error'
      });
    } finally {
      setAddingToCartId(null);
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-red-500 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Continue Shopping
          </Link>
          <div className="flex items-center">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full mr-4">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
          </div>
        </div>
        
        {products.length > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {products.length} favorite{products.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      {products.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No favorites yet
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start exploring products and add them to your favorites
          </p>
          <Link
            to="/smart-catalog"
            className="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} of {products.length} favorites
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="relative mb-4">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveFromFavorites(product._id)}
                    disabled={removingId === product._id}
                    className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title="Remove from favorites"
                  >
                    {removingId === product._id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    ) : (
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    )}
                  </button>
                </div>

                {/* Product Details */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-red-500">
                      RM {product.basePrice.toFixed(2)}
                    </span>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {product.quantity} in stock
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {product.category} • {product.subcategory}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Link
                      to={`/smart-catalog/${product._id}`}
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCartId === product._id || product.quantity === 0}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCartId === product._id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === number
                      ? 'bg-red-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}