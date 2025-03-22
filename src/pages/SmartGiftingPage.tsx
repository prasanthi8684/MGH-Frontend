import React, { useState } from 'react';
import { Gift, Sparkles, AlertTriangle } from 'lucide-react';
import { UploadButton } from '../components/ui/UploadButton';

interface GiftOption {
  id: string;
  title: string;
  price: number;
  image: string;
  items: string[];
}

export function SmartGiftingPage() {
  const [budget, setBudget] = useState<string>('130');
  const [quantity, setQuantity] = useState<string>('75');
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);

  const giftOptions: GiftOption[] = [
    {
      id: '1',
      title: 'Glass Cup Gift Set',
      price: 19.00,
      image: 'https://images.unsplash.com/photo-1577937927133-66ef87ce9e02?auto=format&fit=crop&q=80&w=400',
      items: [
        'Paper Bag with Window + Gift Tag And Ribbon',
        'Glass cup with straw and brown PU leatherette sleeve and Logo'
      ]
    },
    {
      id: '2',
      title: 'Mailer Gift Box Set C',
      price: 33.20,
      image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400',
      items: [
        'Mailer Gift Box + Gift Tag2',
        'Eco notebook with Paper Pen3',
        'Stainless Steel Mug4',
        'Mini Cadbury 3 pcs'
      ]
    },
    {
      id: '3',
      title: 'Lunch Box Gift Set',
      price: 61.00,
      image: 'https://images.unsplash.com/photo-1621844061203-3f31a2a7d6ad?auto=format&fit=crop&q=80&w=400',
      items: [
        'LED Display Vacuum Thermal Flask - Sky Blue2',
        'Home Expert Multicolor 3 Tier 304 Stainless Steel Lunch Box3',
        'Paper Bag with Window for Doorgift 4',
        'Greeting Card'
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setShowResults(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleLogoUpload = (croppedImage: string) => {
    setLogo(croppedImage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Gifting</h1>
        <UploadButton 
  onUpload={(croppedImage) => handleLogoUpload(croppedImage)}
  aspectRatio={2}
  maxSize={{ width: 800, height: 400 }}
/>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - AI Curator */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-semibold text-amber-400">AI Gift Curator</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get the perfect gift curation out of thousands of options in seconds
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Budget
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    defaultValue="giftset"
                  >
                    <option value="giftset">Giftset</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="suggest gift ideas for my company annual dinner .."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors"
                  >
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  est curation time ~16sec
                </p>
              </div>
            </form>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
            <p className="text-amber-600 dark:text-amber-400 text-sm">
              Note: our smart gifting product is under active development. Both response time and quality of curation are being enhanced actively.
            </p>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-amber-400 mb-4">
              Curated Gift Result
            </h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
              </div>
            ) : showResults ? (
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Select your preferred gifting options below:
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Or you can try different options by re-generating or ask the model for a new suggestion
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {giftOptions.map(option => (
                    <div key={option.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <img
                        src={option.image}
                        alt={option.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {option.title}
                      </h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 mb-4 list-disc pl-4">
                        {option.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-semibold">
                          MYR {option.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button className="w-full py-2 px-4 bg-amber-400 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors">
                    Instant Quotation
                  </button>
                  <button className="w-full py-2 px-4 border border-amber-400 text-amber-400 hover:bg-amber-50 rounded-lg font-medium transition-colors">
                    Re-generate
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <Gift className="h-12 w-12 mb-4 opacity-50" />
                <p>Your curated gift options appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}