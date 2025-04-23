import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Toast } from '../ui/Toast';

export function ForgotPassword() {
    const APIURL = 'http://139.59.76.86:5000';
  const [bussinessemail, setEmail] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const response = await fetch(`${APIURL}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bussinessemail }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to send reset email');
        }
        setMessage({
            text: 'Password reset instructions have been sent to your email.',
            type: 'success'
          });
          setEmail('');
      } catch (err) {
        setMessage({
            text: err instanceof Error ? err.message : 'Failed to send reset instructions.',
            type: 'error'
          });
        } finally {
          setIsSubmitting(false);
        }

    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}
      
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-6">MHG</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Reset your password
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="bussinessemail"
              name="bussinessemail"
              type="email"
              required
              value={bussinessemail}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
          </button>

          <Link
            to="/login"
            className="flex items-center justify-center text-sm text-red-600 hover:text-red-500 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
}