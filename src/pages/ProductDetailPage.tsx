import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, FileText, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { Toast } from '../components/ui/Toast';

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

interface QuotationFormData {
  name: string;
  clientName: string;
  clientEmail: string;
  products: {
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    images: string[];
  }[];
}

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [quotationForm, setQuotationForm] = useState<QuotationFormData>({
    name: '',
    clientName: '',
    clientEmail: '',
    products: []
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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
    if (product && value >= 1 && value <= product.quantity) {
      setQuantity(value);
    }
  };

  const handleQuantityIncrement = () => {
    if (product && quantity < product.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuotationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      const totalPrice = quantity * product.price;
      const quotationData = {
        ...quotationForm,
        products: [{
          name: product.name,
          description: product.description,
          quantity,
          unitPrice: product.price,
          totalPrice,
          images: product.images
        }],
        totalAmount: totalPrice,
        status: 'draft'
      };

      await axios.post('http://localhost:5000/api/quotations', quotationData);
      
      setMessage({
        text: 'Quotation created successfully',
        type: 'success'
      });
      
      setIsQuotationModalOpen(false);
      navigate('/quotations');
    } catch (error) {
      setMessage({
        text: 'Failed to create quotation',
        type: 'error'
      });
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
      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

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
                  onClick={handleQuantityDecrement}
                  className="p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border-x border-gray-300 dark:border-gray-600 bg-transparent py-2"
                  min="1"
                  max={product.quantity}
                />
                <button
                  onClick={handleQuantityIncrement}
                  className="p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
                  disabled={quantity >= product.quantity}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {product.quantity} available
              </span>
            </div>
          </div>

          <div className="space-y-4">
         
            <button
              onClick={() => setIsQuotationModalOpen(true)}
              className="w-full py-3 px-4 border border-amber-500 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <FileText className="h-5 w-5 mr-2" />
              Request Quote
            </button>
          </div>
        </div>
      </div>

      {/* Quotation Modal */}
      {isQuotationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Request Quotation
            </h2>

            <form onSubmit={handleQuotationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quotation Name
                </label>
                <input
                  type="text"
                  value={quotationForm.name}
                  onChange={(e) => setQuotationForm({ ...quotationForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={quotationForm.clientName}
                  onChange={(e) => setQuotationForm({ ...quotationForm, clientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={quotationForm.clientEmail}
                  onChange={(e) => setQuotationForm({ ...quotationForm, clientEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  required
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Unit Price:</span>
                  <span>RM {product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 dark:text-white mt-2">
                  <span>Total:</span>
                  <span>RM {(quantity * product.price).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsQuotationModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}