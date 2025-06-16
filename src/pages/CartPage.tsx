import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Loader2, FileText, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Toast } from '../components/ui/Toast';
import axios from 'axios';

interface ProposalFormData {
  name: string;
  clientName: string;
  clientEmail: string;
}

export function CartPage() {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, clearCart, loading } = useCart();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalForm, setProposalForm] = useState<ProposalFormData>({
    name: '',
    clientName: '',
    clientEmail: ''
  });
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  const handleQuantityChange = async (itemId: string, newQuantity: number, unitPrice: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItems(prev => new Set(prev).add(itemId));
      await updateCartItem(itemId, newQuantity, unitPrice);
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.error || 'Failed to update quantity',
        type: 'error'
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      setMessage({
        text: 'Item removed from cart',
        type: 'success'
      });
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.error || 'Failed to remove item',
        type: 'error'
      });
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;

    try {
      await clearCart();
      setMessage({
        text: 'Cart cleared successfully',
        type: 'success'
      });
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.error || 'Failed to clear cart',
        type: 'error'
      });
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;

    try {
      setIsSubmittingProposal(true);
      
      // Convert cart items to proposal products
      const products = cart.items.map(item => ({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        images: item.images
      }));

      const proposalData = {
        ...proposalForm,
        products,
        totalAmount: cart.totalAmount,
        status: 'draft'
      };

      const response = await axios.post(
        'http://localhost:5000/api/quotations',
        proposalData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data) {
        setMessage({
          text: 'Proposal created successfully from cart items',
          type: 'success'
        });
        
        setIsProposalModalOpen(false);
        setProposalForm({ name: '', clientName: '', clientEmail: '' });
        
        // Optionally clear cart after creating proposal
        if (window.confirm('Proposal created! Would you like to clear your cart?')) {
          await clearCart();
        }
        
        // Navigate to proposals page
        setTimeout(() => {
          navigate('/smart-proposal');
        }, 1500);
      }
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.error || 'Failed to create proposal',
        type: 'error'
      });
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  if (loading && !cart) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

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
              <ShoppingCart className="h-6 w-6 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
          </div>
        </div>
        
        {cart && cart.items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear Cart
          </button>
        )}
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Add some products to get started
          </p>
          <Link
            to="/smart-catalog"
            className="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.images[0] || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{item.category}</span>
                      {item.subcategory && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{item.subcategory}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1, item.unitPrice)}
                      disabled={item.quantity <= 1 || updatingItems.has(item._id)}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    
                    <span className="w-12 text-center font-medium">
                      {updatingItems.has(item._id) ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      ) : (
                        item.quantity
                      )}
                    </span>
                    
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1, item.unitPrice)}
                      disabled={updatingItems.has(item._id)}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Price and Remove */}
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      RM {item.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      RM {item.unitPrice.toFixed(2)} each
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Items ({cart.totalItems})</span>
                  <span>RM {cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>RM {cart.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => setIsProposalModalOpen(true)}
                  className="w-full py-3 px-4 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Create Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Creation Modal */}
      {isProposalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create Proposal from Cart
              </h2>
              <button
                onClick={() => setIsProposalModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Proposal Name
                </label>
                <input
                  type="text"
                  value={proposalForm.name}
                  onChange={(e) => setProposalForm({ ...proposalForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter proposal name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={proposalForm.clientName}
                  onChange={(e) => setProposalForm({ ...proposalForm, clientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter client name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  value={proposalForm.clientEmail}
                  onChange={(e) => setProposalForm({ ...proposalForm, clientEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter client email"
                  required
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Total Items:</span>
                  <span>{cart?.totalItems || 0}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                  <span>Total Amount:</span>
                  <span>RM {cart?.totalAmount.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProposalModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProposal}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmittingProposal ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Create Proposal
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}