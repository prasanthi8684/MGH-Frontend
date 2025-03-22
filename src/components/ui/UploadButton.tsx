import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { ImageUploadModal } from './ImageUploadModal';

interface UploadButtonProps {
  onUpload: (image: string) => void;
  aspectRatio?: number;
  maxSize?: { width: number; height: number };
}

export function UploadButton({ 
  onUpload, 
  aspectRatio,
  maxSize 
}: UploadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <Upload className="h-4 w-4 mr-2" />
        UPLOAD LOGO
      </button>

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={onUpload}
        aspectRatio={aspectRatio}
        maxSize={maxSize}
      />
    </>
  );
}