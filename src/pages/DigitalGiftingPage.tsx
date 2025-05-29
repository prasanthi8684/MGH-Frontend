import React, { useState, useEffect } from 'react';
import { QrCode, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
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

interface SubCategory {
  _id: string;
  name: string;
  category: string;
}

export function DigitalGiftingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const productsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, [selectedSubcategory]);

  const fetchData = async () => {
    try {
      const [productsRes, subcategoriesRes] = await Promise.all([
        axios.get('http://143.198.212.38:5000/api/admin/products', {
          params: {
            category: 'digital-gifting',
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

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
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
              <QrCode className="h-6 w-6 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-amber-500">Digital Gifts</h1>
          </div>
        </div>

        {/* Subcategory Filter */}
        {subcategories.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
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
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Gift Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {currentProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3]">
                <img
                  src={product.images[0] || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                 <div className="absolute top-4 right-4 flex gap-2">
                                  <Link
                                    to={`/digital-gifting/${product._id}`}
                                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                                  >
                                    <Eye className="h-5 w-5 text-gray-600" />
                                  </Link>
                                 
                                </div>
             
             
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {product.name}
                </h3>
                {/* <Link
                  to={`/digital-gifting/${product._id}`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link> */}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === number
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}