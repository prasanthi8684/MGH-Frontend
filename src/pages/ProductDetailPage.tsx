import React, { useState } from 'react';
import { Heart, HelpCircle, ChevronLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface ProductVariant {
  color: string;
  price: number;
  image: string;
}

export function ProductDetailPage() {
  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState('Blue');
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const variants: ProductVariant[] = [
    {
      color: 'Blue',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
    },
    {
      color: 'Red',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
    },
    {
      color: 'Grey',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
    },
    {
      color: 'Black',
      price: 47.80,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const selectedVariant = variants.find(v => v.color === selectedColor) || variants[0];

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/smart-catalog" className="text-gray-500 hover:text-gray-700">Smart Catalog</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Product Details</span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={selectedVariant.image}
                  alt={`Notebook giftset - ${selectedColor}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Notebook giftset - {selectedColor}
                </h1>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Heart
                    className={`h-6 w-6 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      MYR {selectedVariant.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Color Variants */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Choose your colour
                    </label>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {variants.map((variant) => (
                      <button
                        key={variant.color}
                        onClick={() => setSelectedColor(variant.color)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                          selectedColor === variant.color
                            ? 'border-amber-500 text-amber-500 bg-amber-50'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {variant.color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity and Price */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity and Price
                  </label>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-x border-gray-300 py-2"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    MYR {(selectedVariant.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Description</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>1. PU Leather Notebook:
                    <ul className="ml-4 space-y-1">
                      <li>- A5 size</li>
                      <li>- 80g lined paper</li>
                      <li>- 100 sheets (200 pages)</li>
                    </ul>
                  </li>
                  <li>2. Stainless Steel Gel Pen
                    <ul className="ml-4">
                      <li>- 0.5mm black gel pen ink</li>
                    </ul>
                  </li>
                  <li>3. Gift Box</li>
                </ul>
              </div>

              {/* Special Notes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Special Notes
                  </label>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </div>
                <textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. use the Logo I provided on WhatsApp"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                />
              </div>

              {/* Add to Cart Button */}
              <button className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}