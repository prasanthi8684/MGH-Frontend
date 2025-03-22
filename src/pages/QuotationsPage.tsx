import React from 'react';
import { ClipboardList } from 'lucide-react';

export function QuotationsPage() {
  return (
    <div>
      <div className="flex items-center mb-8">
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full mr-4">
          <ClipboardList className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quotations</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300">
          Manage and track all your quotation requests here.
        </p>
      </div>
    </div>
  );
}