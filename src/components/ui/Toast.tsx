import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20';
  const textColor = type === 'error' ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200';
  const borderColor = type === 'error' ? 'border-red-200 dark:border-red-800' : 'border-green-200 dark:border-green-800';

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg border ${bgColor} ${textColor} ${borderColor}`}>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 inline-flex items-center justify-center rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}