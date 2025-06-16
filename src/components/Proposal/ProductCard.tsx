import React from 'react';
import { Plus, Check, Package } from 'lucide-react';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  isSelected: boolean;
  selectedQuantity: number;
}

export const ProductCard = ({ product, onSelect, isSelected, selectedQuantity }: ProductCardProps) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-all duration-200 ${
      isSelected ? 'border-yellow-400 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
    }`}>
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 rounded-full p-1">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
            {product.name}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            {product.sku}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        
        <button
          onClick={() => onSelect(product)}
          disabled={!product.inStock}
          className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
            product.inStock
              ? isSelected
                ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {product.inStock ? (
            <>
              {isSelected ? (
                <>
                  <Check className="h-4 w-4" />
                  Added ({selectedQuantity})
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add to Proposal
                </>
              )}
            </>
          ) : (
            <>
              <Package className="h-4 w-4" />
              Out of Stock
            </>
          )}
        </button>
      </div>
    </div>
  );
};