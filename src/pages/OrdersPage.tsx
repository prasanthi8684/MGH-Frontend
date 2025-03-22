import React from 'react';
import { FileText } from 'lucide-react';

export function OrdersPage() {
  return (
    <div>
      <div className="flex items-center mb-8">
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full mr-4">
          <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300">
          View and manage all your orders in one place.
        </p>
      </div>
    </div>
  );
}