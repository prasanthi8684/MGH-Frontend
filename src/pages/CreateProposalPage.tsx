import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, X, Save, Send, ImageIcon } from 'lucide-react';
import axios from 'axios';

interface Product {
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
      images: []
    }]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addProduct = () => {
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

  const handleImageSelect = async (index: number, files: FileList) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post('http://139.59.76.86:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.imageUrls) {
        updateProduct(index, 'images', [
         // ...formData.products[index].images,
          ...response.data.imageUrls
        ]);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    }
  };

  const removeImage = (productIndex: number, imageIndex: number) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[productIndex].images = updatedProducts[productIndex].images.filter((_, i) => i !== imageIndex);
      return { ...prev, products: updatedProducts };
    });
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = true) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const totalAmount = formData.products.reduce((sum, product) => sum + product.totalPrice, 0);
      
      const response = await axios.post('http://139.59.76.86:5000/api/proposals', {
        ...formData,
        status: isDraft ? 'draft' : 'sent',
        totalAmount
      });
      
      if (response.data) {
        navigate('/smart-proposal');
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Error creating proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create New Proposal</h1>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Proposal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Client Name</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Client Email</label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Products</h2>
            <button
              type="button"
              onClick={addProduct}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>

          <div className="space-y-4">
            {formData.products.map((product, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => updateProduct(index, 'name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                      type="text"
                      value={product.description}
                      onChange={(e) => updateProduct(index, 'description', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => updateProduct(index, 'quantity', Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unit Price (MYR)</label>
                    <input
                      type="number"
                      value={product.unitPrice}
                      onChange={(e) => updateProduct(index, 'unitPrice', Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                  <div className="flex flex-wrap gap-4">
                    {product.images.map((image, imageIndex) => (
                      <div key={imageIndex} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1} preview ${imageIndex + 1}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, imageIndex)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={(e) => e.target.files && handleImageSelect(index, e.target.files)}
                      />
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <span className="mt-2 text-xs text-gray-500">Add Images</span>
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Remove
                  </button>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Total:</span>
                    <span className="ml-2 text-lg font-semibold">
                      MYR {product.totalPrice.toFixed(2)}
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
            className="inline-flex items-center px-4 py-2 border border-amber-500 text-sm font-medium rounded-md text-amber-500 bg-white hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Proposal
          </button>
        </div>
      </form>
    </div>
  );
}