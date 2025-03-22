import React from 'react';
import { HelpCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            MH GLOBALSdn Bhd 2024
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <HelpCircle className="h-5 w-5 mr-1" />
              Account Manager Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}