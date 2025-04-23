import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Upload, X } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (croppedImage: any) => void;
  aspectRatio?: number;
  maxSize?: { width: number; height: number };
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  aspectRatio = 1,
  maxSize = { width: 800, height: 400 }
}: ImageUploadModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 0,
    y: 0,
    width: 100,
    height: 100
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width > maxSize.width || img.height > maxSize.height) {
            alert(`Image must be smaller than ${maxSize.width}×${maxSize.height}px`);
            return;
          }
          setSelectedImage(reader.result as string);
        };
        img.src = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = useCallback((image: HTMLImageElement, crop: PixelCrop) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL('image/png');
  }, []);

  const handleCropComplete = (crop: PixelCrop) => {
    setCompletedCrop(crop);
  };

  const handleUpload = () => {
    if (completedCrop && imageRef.current) {
      const croppedImage = getCroppedImg(imageRef.current, completedCrop);
      onUpload(croppedImage);
      onClose();
      setSelectedImage(null);
      setCrop({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Logo</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {!selectedImage ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                PNG only (MAX. {maxSize.width}×{maxSize.height}px)
              </p>
              <input
                type="file"
                accept="image/png"
                onChange={handleFileChange}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg cursor-pointer transition-colors"
              >
                Select File
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-[60vh] overflow-auto">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={aspectRatio}
              >
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Upload preview"
                  className="max-w-full"
                />
              </ReactCrop>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
              >
                Upload
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}