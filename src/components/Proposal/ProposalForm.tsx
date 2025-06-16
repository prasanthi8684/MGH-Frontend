import React, { useState } from 'react';
import { X, Calendar, User, Mail, FileText } from 'lucide-react';
import { SelectedProduct, Proposal } from '../../types/product';

interface ProposalFormProps {
  selectedProducts: SelectedProduct[];
  totalAmount: number;
  onSubmit: (proposal: Omit<Proposal, 'id' | 'products' | 'totalAmount' | 'createdAt'>) => void;
  onClose: () => void;
}

export const ProposalForm = ({ selectedProducts, totalAmount, onSubmit, onClose }: ProposalFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    validUntil: '',
    status: 'draft' as const
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Proposal title is required';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Client email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address';
    }

    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required';
    } else {
      const selectedDate = new Date(formData.validUntil);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.validUntil = 'Valid until date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Set default valid until date (30 days from now)
  React.useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    setFormData(prev => ({
      ...prev,
      validUntil: defaultDate.toISOString().split('T')[0]
    }));
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create Proposal
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Proposal Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Proposal Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter proposal title"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 dark:bg-gray-700 dark:text-white ${
                errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Enter client name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 dark:bg-gray-700 dark:text-white ${
                  errors.clientName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.clientName && <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Client Email
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                placeholder="Enter client email"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 dark:bg-gray-700 dark:text-white ${
                  errors.clientEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.clientEmail && <p className="mt-1 text-sm text-red-600">{errors.clientEmail}</p>}
            </div>
          </div>

          {/* Valid Until Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Valid Until
            </label>
            <input
              type="date"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 dark:bg-gray-700 dark:text-white ${
                errors.validUntil ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.validUntil && <p className="mt-1 text-sm text-red-600">{errors.validUntil}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="draft">Draft</option>
              <option value="sent">Send to Client</option>
            </select>
          </div>

          {/* Products Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
              Products Summary ({selectedProducts.length} items)
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {selectedProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {product.name} × {product.quantity}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${((product.customPrice || product.price) * product.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 mt-3 pt-3 flex justify-between items-center">
              <span className="font-semibold text-gray-900 dark:text-white">Total Amount:</span>
              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium transition-colors"
            >
              Create Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};