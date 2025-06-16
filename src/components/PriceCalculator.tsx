import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import axios from 'axios';

interface PriceRange {
  minQuantity: number;
  maxQuantity: number;
  price: number;
}

interface PriceCalculatorProps {
  productId: string;
  basePrice: number;
  priceRanges: PriceRange[];
  onPriceChange?: (price: number, quantity: number) => void;
}

export function PriceCalculator({ productId, basePrice, priceRanges, onPriceChange }: PriceCalculatorProps) {
  const [quantity, setQuantity] = useState(1);
  const [calculatedPrice, setCalculatedPrice] = useState(basePrice);
  const [loading, setLoading] = useState(false);

  const calculatePrice = (qty: number) => {
    if (!priceRanges || priceRanges.length === 0) {
      return basePrice;
    }

    const sortedRanges = [...priceRanges].sort((a, b) => a.minQuantity - b.minQuantity);
    
    for (const range of sortedRanges) {
      if (qty >= range.minQuantity && qty <= range.maxQuantity) {
        return range.price;
      }
    }
    
    return basePrice;
  };

  useEffect(() => {
    const price = calculatePrice(quantity);
    setCalculatedPrice(price);
    onPriceChange?.(price, quantity);
  }, [quantity, priceRanges, basePrice]);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setQuantity(newQuantity);
    
    // Optionally fetch price from server for verification
    if (productId) {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/${productId}/price`, {
          params: { quantity: newQuantity },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCalculatedPrice(response.data.price);
        onPriceChange?.(response.data.price, newQuantity);
      } catch (error) {
        console.error('Error fetching price:', error);
        // Fallback to local calculation
        const price = calculatePrice(newQuantity);
        setCalculatedPrice(price);
        onPriceChange?.(price, newQuantity);
      } finally {
        setLoading(false);
      }
    }
  };

  const getApplicableRange = () => {
    if (!priceRanges || priceRanges.length === 0) return null;
    
    const sortedRanges = [...priceRanges].sort((a, b) => a.minQuantity - b.minQuantity);
    
    for (const range of sortedRanges) {
      if (quantity >= range.minQuantity && quantity <= range.maxQuantity) {
        return range;
      }
    }
    
    return null;
  };

  const applicableRange = getApplicableRange();

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Calculator className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Price Calculator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Unit Price:</span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {loading ? 'Calculating...' : `RM ${calculatedPrice.toFixed(2)}`}
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Price:</span>
            <span className="text-xl font-bold text-blue-600">
              {loading ? 'Calculating...' : `RM ${(calculatedPrice * quantity).toFixed(2)}`}
            </span>
          </div>

          {applicableRange && (
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
              <span className="text-blue-700 dark:text-blue-300">
                Applied range: {applicableRange.minQuantity}-{applicableRange.maxQuantity} units
              </span>
            </div>
          )}
        </div>

        {priceRanges && priceRanges.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pricing Tiers:
            </h4>
            <div className="space-y-1">
              {[...priceRanges]
                .sort((a, b) => a.minQuantity - b.minQuantity)
                .map((range, index) => (
                  <div
                    key={index}
                    className={`text-xs p-2 rounded ${
                      applicableRange === range
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {range.minQuantity}-{range.maxQuantity} units: RM {range.price.toFixed(2)} each
                  </div>
                ))}
              <div className="text-xs p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                Base price: RM {basePrice.toFixed(2)} each
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}