import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Minus, X, Save, Send, ImageIcon, Loader2, Search, Check, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { Toast } from '../components/ui/Toast';
import { useCart } from '../context/CartContext';

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

interface ProposalProduct {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  images: string[];
}

interface FormData {
  name: string;
  clientName: string;
  clientEmail: string;
  products: ProposalProduct[];
}

export function CreateProposalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    clientName: '',
    clientEmail: '',
    products: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Product selection modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Check if coming from cart
  const fromCart = location.state?.fromCart;

  useEffect(() => {
    // If coming from cart, populate with cart items
    if (fromCart && cart && cart.items.length > 0) {
      const cartProducts = cart.items.map(item => ({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        images: item.images
      }));
      
      setFormData(prev => ({
        ...prev,
        products: cartProducts
      }));
    }
  }, [fromCart, cart]);

  useEffect(() => {
    if (isProductModalOpen) {
      fetchProducts();
    }
  }, [isProductModalOpen]);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === '') {
      setFilteredProducts(availableProducts);
    } else {
      const filtered = availableProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, availableProducts]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await axios.get('http://localhost:5000/api/admin/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAvailableProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      setMessage({
        text: 'Failed to fetch products',
        type: 'error'
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const addSelectedProducts = () => {
    const productsToAdd = availableProducts
      .filter(product => selectedProducts.has(product._id))
      .map(product => ({
        name: product.name,
        description: product.description,
        quantity: 1,
        unitPrice: product.price,
        totalPrice: product.price,
        images: product.images
      }));

    setFormData(prev => ({
      ...prev,
      products: [...prev.products, ...productsToAdd]
    }));

    setSelectedProducts(new Set());
    setIsProductModalOpen(false);
    setSearchQuery('');
  };

  const addEmptyProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, {
        name: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        images: []
      }]
    }));
  };

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const updateProduct = (index: number, field: keyof ProposalProduct, value: any) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
        totalPrice: field === 'quantity' || field === 'unitPrice'
          ? Number(value) * (field === 'quantity' ? updatedProducts[index].unitPrice : updatedProducts[index].quantity)
          : updatedProducts[index].totalPrice
      };
      return { ...prev, products: updatedProducts };
    });
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = true) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (formData.products.length === 0) {
      setMessage({
        text: 'Please add at least one product to the proposal',
        type: 'error'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const totalAmount = formData.products.reduce((sum, product) => sum + product?.totalPrice, 0);
      
      const response = await axios.post(
        'http://localhost:5000/api/proposals',
        {
          ...formData,
          status: isDraft ? 'draft' : 'sent',
          totalAmount
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data) {
        setMessage({
          text: isDraft ? 'Proposal saved as draft' : 'Proposal sent successfully',
          type: 'success'
        });

        // If proposal was created from cart, optionally clear cart
        if (fromCart && cart && cart.items.length > 0) {
          if (window.confirm('Proposal created! Would you like to clear your cart?')) {
            await clearCart();
          }
        }

        setTimeout(() => {
          navigate('/smart-proposal');
        }, 1500);
      }
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.error || 'Error creating proposal',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {fromCart ? 'Create Proposal from Cart' : 'Create New Proposal'}
        </h1>
        {fromCart && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <ShoppingCart className="h-4 w-4 mr-1" />
            {cart?.totalItems || 0} items from cart
          </div>
        )}
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Proposal Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client Email
              </label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Products</h2>
            {!fromCart && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Select Products
                </button>
                <button
                  type="button"
                  onClick={addEmptyProduct}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Product
                </button>
              </div>
            )}
          </div>

          {formData.products.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {fromCart 
                ? 'No items in cart to create proposal from.'
                : 'No products added yet. Use the buttons above to add products.'
              }
            </div>
          ) : (
            <div className="space-y-4">
              {formData.products.map((product, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={product.description}
                        onChange={(e) => updateProduct(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => updateProduct(index, 'quantity', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Unit Price (RM)
                      </label>
                      <input
                        type="number"
                        value={product.unitPrice}
                        onChange={(e) => updateProduct(index, 'unitPrice', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Product Images */}
                  {product.images.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Images
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.images.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`Product ${index + 1} - Image ${imgIndex + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Remove
                    </button>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total:</span>
                      <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                        RM {product.totalPrice?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total Amount */}
        {formData.products.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</h3>
              <span className="text-2xl font-bold text-red-600">
                RM {formData.products.reduce((sum, product) => sum + product.totalPrice, 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-red-500 text-sm font-medium rounded-md text-red-500 bg-white hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </>
            )}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Proposal
              </>
            )}
          </button>
        </div>
      </form>

      {/* Product Selection Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Select Products
                </h2>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loadingProducts ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No products found
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedProducts.has(product._id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => toggleProductSelection(product._id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                          {product.name}
                        </h3>
                        {selectedProducts.has(product._id) && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                      )}
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-blue-600">
                          RM {product.price?.toFixed(2)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedProducts.size} product(s) selected
                </span>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addSelectedProducts}
                    disabled={selectedProducts.size === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Selected Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}