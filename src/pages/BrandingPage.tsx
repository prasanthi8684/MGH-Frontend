import React, { useState } from 'react';
import { Palette, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/ui/Toast';
import { UploadButton } from '../components/ui/UploadButton';

export function BrandingPage() {
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [colors, setColors] = useState({
    primary: '#FF0000',
    secondary: '#000000'
  });

  const handleLogoUpload = async (image: string) => {
    try {
      // Handle logo upload to server
      setLogo(image);
      setMessage({
        text: 'Logo uploaded successfully',
        type: 'success'
      });
    } catch (error) {
      setMessage({
        text: 'Failed to upload logo',
        type: 'error'
      });
    }
  };

  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setColors(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full mr-4">
          <Palette className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Branding</h1>
      </div>

      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Company Logo
          </h2>
          
          <div className="space-y-4">
            {logo ? (
              <div className="relative">
                <img
                  src={logo}
                  alt="Company Logo"
                  className="max-w-full h-auto rounded-lg"
                />
                <button
                  onClick={() => setLogo(null)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  <Upload className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <UploadButton
                onUpload={handleLogoUpload}
                aspectRatio={2}
                maxSize={{ width: 800, height: 400 }}
              />
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Recommended size: 800x400px. PNG or JPG format.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Brand Colors
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Primary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  name="primary"
                  value={colors.primary}
                  onChange={handleColorChange}
                  className="h-10 w-20"
                />
                <input
                  type="text"
                  value={colors.primary}
                  onChange={handleColorChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Secondary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  name="secondary"
                  value={colors.secondary}
                  onChange={handleColorChange}
                  className="h-10 w-20"
                />
                <input
                  type="text"
                  value={colors.secondary}
                  onChange={handleColorChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}