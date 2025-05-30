import React, { useState, useEffect } from 'react';
import { ClipboardList, Eye, Trash2, Download, Edit2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toast } from '../components/ui/Toast';

interface Quotation {
  _id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted';
  products: {
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    image: string;
  }[];
  totalAmount: number;
  createdAt: string;
}

export function QuotationsPage() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get('http://143.198.212.38:5000/api/quotations', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setQuotations(response.data);
    } catch (error) {
      setMessage({
        text: 'Failed to fetch quotations',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this quotation?')) return;

    try {
      setDeletingId(id);
      await axios.delete(`http://143.198.212.38:5000/api/quotations/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage({
        text: 'Quotation deleted successfully',
        type: 'success'
      });
      setQuotations(prev => prev.filter(q => q._id !== id));
    } catch (error) {
      setMessage({
        text: 'Failed to delete quotation',
        type: 'error'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      setDownloadingId(id);
      const response = await axios.get(`http://143.198.212.38:5000/api/quotations/${id}/pdf`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quotation-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMessage({
        text: 'Failed to download quotation',
        type: 'error'
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/quotations/edit/${id}`);
  };

  const getStatusColor = (status: Quotation['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-600';
      case 'sent':
        return 'bg-blue-100 text-blue-600';
      case 'viewed':
        return 'bg-yellow-100 text-yellow-600';
      case 'accepted':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full mr-4">
          <ClipboardList className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quotations</h1>
      </div>

      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Client</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {quotations.map((quotation) => (
                <tr key={quotation._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{quotation.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <div>{quotation.clientName}</div>
                      <div className="text-xs">{quotation.clientEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(quotation.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                      {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      RM {quotation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-3">
                      {/* <button 
                        onClick={() => handleEdit(quotation._id)}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button> */}
                      <button 
                        onClick={() => handleDownload(quotation._id)}
                        disabled={downloadingId === quotation._id}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50"
                        title="Download PDF"
                      >
                        {downloadingId === quotation._id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Download className="h-5 w-5" />
                        )}
                      </button>
                      <button 
                        onClick={() => handleDelete(quotation._id)}
                        disabled={deletingId === quotation._id}
                        className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === quotation._id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}