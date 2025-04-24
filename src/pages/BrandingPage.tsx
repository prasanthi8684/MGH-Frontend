import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/ui/Toast';
import { UploadButton } from '../components/ui/UploadButton';
import axios from 'axios';

export function BrandingPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [colors, setColors] = useState({
    primaryColor: '#FF0000',
    secondaryColor: '#000000'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.branding) {
      setLogo(user.branding.logo || null);
      setColors({
        primaryColor: user.branding.primaryColor,
        secondaryColor: user.branding.secondaryColor
      });
    }
  }, [user]);

  const handleLogoUpload = async (image: string) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      const response = await fetch(image);
      const blob = await response.blob();
      formData.append('logo', blob);
      formData.append('primaryColor', colors.primaryColor);
      formData.append('secondaryColor', colors.secondaryColor);

      const result = await axios.put('http://139.59.76.86:5000/api/users/branding', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setLogo(result.data.logo);
      setMessage({
        text: 'Branding updated successfully',
        type: 'success'
      });
    } catch (error) {
      setMessage({
        text: 'Failed to update branding',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setColors(prev => ({ ...prev, [name]: value }));
  };

  const handleColorSave = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.put('http://139.59.76.86:5000/api/users/branding', colors, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMessage({
        text: 'Brand colors updated successfully',
        type: 'success'
      });
    } catch (error) {
      setMessage({
        text: 'Failed to update brand colors',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
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
                <UploadButton
                  onUpload={handleLogoUpload}
                  aspectRatio={2}
                  maxSize={{ width: 800, height: 400 }}
                />
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
                  name="primaryColor"
                  value={colors.primaryColor}
                  onChange={handleColorChange}
                  className="h-10 w-20"
                />
                <input
                  type="text"
                  value={colors.primaryColor}
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
                  name="secondaryColor"
                  value={colors.secondaryColor}
                  onChange={handleColorChange}
                  className="h-10 w-20"
                />
                <input
                  type="text"
                  value={colors.secondaryColor}
                  onChange={handleColorChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
            </div>

            <button
              onClick={handleColorSave}
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Colors'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}