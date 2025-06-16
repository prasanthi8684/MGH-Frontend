import React from 'react';
import { Minus, Plus, X, DollarSign, ShoppingCart } from 'lucide-react';
import { SelectedProduct } from '../../types/product';

interface SelectedProductsListProps {
  selectedProducts: SelectedProduct[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onCustomPriceChange: (productId: string, customPrice: number) => void;
  onRemove: (productId: string) => void;
  totalAmount: number;
}

export const SelectedProductsList = ({
  selectedProducts,
  onQuantityChange,
  onCustomPriceChange,
  onRemove,
  totalAmount
}: SelectedProductsListProps) => {
  if (selectedProducts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No products selected
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Select products from the catalog to add them to your proposal
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Selected Products ({selectedProducts.length})
        </h3>
      </div>
      
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {selectedProducts.map(product => (
          <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
                    {product.name}
                  </h4>
                  <button
                    onClick={() => onRemove(product.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="mt-2 space-y-2">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Qty:</span>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                      <button
                        onClick={() => onQuantityChange(product.id, product.quantity - 1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => onQuantityChange(product.id, product.quantity + 1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Price Controls */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Price:</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={product.customPrice || product.price}
                        onChange={(e) => onCustomPriceChange(product.id, parseFloat(e.target.value) || 0)}
                        className="w-16 px-1 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  {/* Subtotal */}
                  <div className="flex justify-between items-center pt-1 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${((product.customPrice || product.price) * product.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Total Amount:
          </span>
          <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};