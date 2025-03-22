import React, { useState } from 'react';
import { Package, Upload, Eye } from 'lucide-react';
import { Link } from "react-router-dom";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  color: string;
}

export function SmartCatalogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const products: Product[] = [
    {
      id: '1',
      title: 'Notebook giftset',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=500',
      color: 'Darkblue'
    },
    {
      id: '2',
      title: 'Notebook giftset',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1589203832113-de9d1e945f13?auto=format&fit=crop&q=80&w=500',
      color: 'Red'
    },
    {
      id: '3',
      title: 'Notebook giftset',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=500',
      color: 'Grey'
    },
    {
      id: '4',
      title: 'Notebook giftset',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=500',
      color: 'Brown'
    },
    // Add more products for pagination...
    {
      id: '5',
      title: 'Notebook giftset',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=500',
      color: 'Navy'
    },
    {
      id: '6',
      title: 'Notebook giftset',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1589203832113-de9d1e945f13?auto=format&fit=crop&q=80&w=500',
      color: 'Maroon'
    },
    {
      id: '7',
      title: 'Notebook giftset',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=500',
      color: 'Silver'
    },
    {
      id: '8',
      title: 'Notebook giftset',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=500',
      color: 'Tan'
    },
    {
      id: '9',
      title: 'Notebook giftset',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=500',
      color: 'Black'
    },
    {
      id: '10',
      title: 'Notebook giftset',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1589203832113-de9d1e945f13?auto=format&fit=crop&q=80&w=500',
      color: 'White'
    }
  ];

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="text-2xl font-bold text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Catalog</h1>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
            <Upload className="h-4 w-4 mr-2" />
            UPLOAD LOGO
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {currentProducts.map((product) => (
            <div key={product.id} className="bg-white-800 rounded-lg overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={product.image}
                  alt={`${product.title} - ${product.color}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">
                  {product.title} - {product.color}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-red-600">
                    MYR {product.price.toFixed(2)}
                  </span>
                  <button className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
                    <Eye className="h-4 w-4 mr-2" />
                    <Link to={`/smart-catalog/${product.id}`}>View</Link>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === number
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}