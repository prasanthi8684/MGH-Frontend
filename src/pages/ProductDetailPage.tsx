import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Heart, Share2 } from 'lucide-react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  subcategory: string;
  images: string[];
}

export function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/products/${id}`);
      setProduct(response.data);
      if (response.data.images.length > 0) {
        setSelectedImage(response.data.images[0]);
      }
    } catch (error) {
      setError('Error fetching product details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && (!product?.quantity || value <= product.quantity)) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center mb-8">
        <Link
          to={`/${product.category.toLowerCase().replace(' ', '-')}`}
          className="flex items-center text-gray-500 hover:text-amber-500"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to {product.category}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square rounded-lg overflow-hidden ${
                    selectedImage === image ? 'ring-2 ring-amber-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-amber-500">
                RM {product.price.toFixed(2)}
              </span>

            </div>
          </div>

          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Quantity</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border-x border-gray-300 dark:border-gray-600 bg-transparent py-2"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {product.quantity} available
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors">
              Add to Cart
            </button>
            <button className="w-full py-3 px-4 border border-amber-500 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg font-medium transition-colors">
              Request Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}