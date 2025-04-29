import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, AlertTriangle, Eye, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Toast } from '../components/ui/Toast';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
}

interface AIRecommendation {
  suggestions: {
    categories: string[];
    keywords: string[];
    minPrice: number;
    maxPrice: number;
  };
  products: Product[];
}

export function SmartGiftingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [budget, setBudget] = useState<string>('130');
  const [quantity, setQuantity] = useState<string>('75');
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowResults(false);
    
    try {
      const response = await axios.get('http://139.59.76.86:5000/api/smart-gifting/recommendations', {
        params: {
          prompt,
          budget,
          quantity
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data: AIRecommendation = response.data;
      setProducts(data.products);
      setShowResults(true);

      if (data.products.length === 0) {
        setMessage({
          text: 'No matching products found. Try adjusting your criteria.',
          type: 'error'
        });
      }
    } catch (error) {
      setMessage({
        text: 'Error getting recommendations. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Gifting</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - AI Curator */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-semibold text-amber-400">AI Gift Curator</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get the perfect gift curation out of thousands of options in seconds
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Budget (RM)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    defaultValue="giftset"
                  >
                    <option value="giftset">Giftset</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your gift requirements (e.g., corporate gifts for annual dinner, eco-friendly promotional items...)"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={3}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 bottom-2 p-2 bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >

                  <MagnifyingGlassIcon className="h-6 w-6 text-white" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  est curation time ~16sec
                </p>
              </div>
            </form>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
            <p className="text-amber-600 dark:text-amber-400 text-sm">
              Note: our smart gifting product is under active development. Both response time and quality of curation are being enhanced actively.
            </p>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-amber-400 mb-4">
              Curated Gift Results
            </h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
              </div>
            ) : showResults ? (
              products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map(product => (
                    <div key={product._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-semibold">
                          RM {product.price.toFixed(2)}
                        </span>
                        <Link
                          to={`/smart-gifting/${product._id}`}
                          className="flex items-center text-sm text-amber-500 hover:text-amber-600"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <Gift className="h-12 w-12 mb-4 opacity-50" />
                  <p>No matching products found</p>
                  <p className="text-sm mt-2">Try adjusting your search criteria</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <Gift className="h-12 w-12 mb-4 opacity-50" />
                <p>Your curated gift options will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}