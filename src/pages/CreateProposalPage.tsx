import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, X, Save, Send, ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Toast } from '../components/ui/Toast';

interface Product {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

interface FormData {
  name: string;
  clientName: string;
  clientEmail: string;
  products: Product[];
}

export function CreateProposalPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    clientName: '',
    clientEmail: '',
    products: [{
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      image: ''
    }]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [uploadingImage, setUploadingImage] = useState<{ [key: number]: boolean }>({});

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, {
        name: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        image: ''
      }]
    }));
  };

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const updateProduct = (index: number, field: keyof Product, value: any) => {
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

  const handleImageUpload = async (index: number, file: File) => {
    try {
      setUploadingImage(prev => ({ ...prev, [index]: true }));

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          text: 'Image size must be less than 5MB',
          type: 'error'
        });
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('image', file);

      const response = await axios.post(
        'http://139.59.76.86:5000/api/upload',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.imageUrl) {
        updateProduct(index, 'image', response.data.imageUrl);
      }
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.error || 'Error uploading image',
        type: 'error'
      });
    } finally {
      setUploadingImage(prev => ({ ...prev, [index]: false }));
    }
  };

  const removeImage = (index: number) => {
    updateProduct(index, 'image', '');
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = true) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const totalAmount = formData.products.reduce((sum, product) => sum + product.totalPrice, 0);
      
      const response = await axios.post(
        'http://139.59.76.86:5000/api/proposals',
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

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Create New Proposal</h1>

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
            <button
              type="button"
              onClick={addProduct}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>

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

                {/* Image Upload Section */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Image
                  </label>
                  <div className="flex items-center space-x-4">
                    {product.image ? (
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={`Product ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer relative">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => e.target.files && handleImageUpload(index, e.target.files[0])}
                          disabled={uploadingImage[index]}
                        />
                        {uploadingImage[index] ? (
                          <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
                        ) : (
                          <>
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                            <span className="mt-2 text-xs text-gray-500">Add Image</span>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                </div>

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
                      RM {product.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
    </div>
  );
}