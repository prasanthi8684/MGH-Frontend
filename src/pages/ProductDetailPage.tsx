import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, FileText, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import axios from 'axios';
import { Toast } from '../components/ui/Toast';
import { useCart } from '../context/CartContext';

interface PriceTier {
  minQuantity: number;
  maxQuantity: number;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  priceTiers: PriceTier[];
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
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0);
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
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProduct(response.data);
      if (response.data.images.length > 0) {
        setSelectedImage(response.data.images[0]);
      }
      setCurrentPrice(response.data.basePrice);
    } catch (error) {
      setError('Error fetching product details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Memoize the price update function
  const updatePrice = useCallback(async () => {
    if (!product || !id) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/admin/products/${id}/price?quantity=${quantity}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCurrentPrice(response.data.price);
    } catch (error) {
      console.error('Error fetching price:', error);
      // Fallback to client-side calculation
      const price = getPriceForQuantity(quantity);
      setCurrentPrice(price);
    }
  }, [product, id, quantity]);

  useEffect(() => {
    if (product) {
      updatePrice();
    }
  }, [updatePrice, product]);

  const getPriceForQuantity = (qty: number): number => {
    if (!product) return 0;
    
    const sortedTiers = [...(product.priceTiers || [])].sort((a, b) => a.minQuantity - b.minQuantity);
    
    for (const tier of sortedTiers) {
      if (qty >= tier.minQuantity && qty <= tier.maxQuantity) {
        return tier.price;
      }
    }
    
    return product.basePrice;
  };

  const handleQuantityChange = useCallback((value: number) => {
    if (product && value >= 1 && value <= product.quantity) {
      setQuantity(value);
    }
  }, [product]);

  const handleQuantityIncrement = useCallback(() => {
    if (product && quantity < product.quantity) {
      setQuantity(prev => prev + 1);
    }
  }, [product, quantity]);

  const handleQuantityDecrement = useCallback(() => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  }, [quantity]);

  // Prevent double API calls with proper state management
  const handleAddToCart = useCallback(async () => {
    if (!product || addingToCart) return; // Prevent multiple calls

    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity, currentPrice);
      setAddedToCart(true);
      setMessage({
        text: 'Product added to cart successfully!',
        type: 'success'
      });
      
      // Reset the added state after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.error || 'Failed to add product to cart',
        type: 'error'
      });
    } finally {
      setAddingToCart(false);
    }
  }, [product, addingToCart, addToCart, quantity, currentPrice]);

  const handleQuotationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      const totalPrice = quantity * currentPrice;
      const quotationData = {
        ...quotationForm,
        products: [{
          name: product.name,
          description: product.description,
          quantity,
          unitPrice: currentPrice,
          totalPrice,
          images: product.images
        }],
        totalAmount: totalPrice,
        status: 'current'
      };

      await axios.post('http://localhost:5000/api/quotations', quotationData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
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

  const renderPriceTiers = () => {
    if (!product?.priceTiers || product.priceTiers.length === 0) {
      return null;
    }

    return (
      <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
        <h2 className="text-lg font-semibold mb-4">Quantity-Based Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {product.priceTiers.map((tier, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border ${
                quantity >= tier.minQuantity && quantity <= tier.maxQuantity
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {tier.minQuantity}-{tier.maxQuantity} units
                </span>
                <span className="text-lg font-bold text-red-600">
                  RM {tier.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Check if product is already in cart
  const isInCart = cart?.items.some(item => item.productId === product?._id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
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
          className="flex items-center text-gray-500 hover:text-red-500"
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
                    selectedImage === image ? 'ring-2 ring-red-500' : ''
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
              <div>
                <span className="text-2xl font-bold text-red-500">
                  RM {currentPrice?.toFixed(2)}
                </span>
                {currentPrice !== product.basePrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    RM {product.basePrice?.toFixed(2)}
                  </span>
                )}
                <div className="text-sm text-gray-500 mt-1">
                  Price for {quantity} unit{quantity > 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Heart className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Share2 className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <div 
              className="text-gray-600 dark:text-gray-300 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          {renderPriceTiers()}

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
            <div className="mt-2 text-sm text-gray-600">
              Total: RM {(quantity * currentPrice).toFixed(2)}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.quantity === 0 || addedToCart}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : isInCart
                  ? 'bg-gray-500 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addingToCart ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Adding to Cart...
                </>
              ) : addedToCart ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Added to Cart!
                </>
              ) : isInCart ? (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Already in Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={() => setIsQuotationModalOpen(true)}
              className="w-full py-3 px-4 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors flex items-center justify-center"
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
                  <span>RM {currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 dark:text-white mt-2">
                  <span>Total:</span>
                  <span>RM {(quantity * currentPrice).toFixed(2)}</span>
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
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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