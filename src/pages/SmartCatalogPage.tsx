import React, { useState, useEffect } from 'react';
import { Eye, Heart, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
}

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
  category: string;
}

export function SmartCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);

  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [ selectedSubcategory]);

  const fetchData = async () => {
    try {
      const [productsRes,  subcategoriesRes] = await Promise.all([
        axios.get('http://143.198.212.38:5000/api/admin/products', {
          params: {
            category: 'smart-catalog',
            subcategory: selectedSubcategory || undefined
          }
         
        }),
        axios.get('http://143.198.212.38:5000/api/admin/subcategories')
      ]);

      setProducts(productsRes.data);
      setSubcategories(subcategoriesRes.data);
    } catch (error) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="p-3 bg-amber-50 rounded-full mr-4">
              <Package className="h-6 w-6 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-amber-500">Smart Catalog</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Categories</option>
                {subcategories
                  .map((subcategory) => (
                    <option key={subcategory._id} value={subcategory.name}>
                      {subcategory.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="aspect-square relative">
                <img
                  src={product.images[0] || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Link
                    to={`/smart-catalog/${product._id}`}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-5 w-5 text-gray-600" />
                  </Link>
                 
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-amber-500 font-semibold">
                    RM {product.price?.toFixed(2)}
                  </span>
                  
                </div>
                {/* <Link
                  to={`/smart-catalog/${product._id}`}
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}