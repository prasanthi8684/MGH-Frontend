import React, { useState, useEffect } from 'react';
import { ClipboardList, Eye, Trash2, Download, Edit2, Loader2, Check, X, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toast } from '../components/ui/Toast';

interface Quotation {
  _id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  status: 'current' | 'open' | 'accepted' | 'rejected';
  products: {
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    images: string[];
  }[];
  totalAmount: number;
  createdAt: string;
}

interface StatusCounts {
  current: number;
  open: number;
  accepted: number;
  rejected: number;
}

export function QuotationsPage() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [filteredQuotations, setFilteredQuotations] = useState<Quotation[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'open' | 'accepted' | 'rejected'>('current');
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    current: 0,
    open: 0,
    accepted: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchQuotations();
  }, []);

  useEffect(() => {
    // Filter quotations based on active tab
    const filtered = quotations.filter(q => q.status === activeTab);
    setFilteredQuotations(filtered);
  }, [quotations, activeTab]);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get('http://143.198.212.38:5000/api/quotations', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const quotationsData = response.data;
      setQuotations(quotationsData);
      
      // Calculate status counts
      const counts = quotationsData.reduce((acc: StatusCounts, quotation: Quotation) => {
        acc[quotation.status] = (acc[quotation.status] || 0) + 1;
        return acc;
      }, { current: 0, open: 0, accepted: 0, rejected: 0 });
      
      setStatusCounts(counts);
    } catch (error) {
      setMessage({
        text: 'Failed to fetch quotations',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'open' | 'accepted' | 'rejected') => {
    try {
      setUpdatingStatusId(id);
      await axios.put(
        `http://143.198.212.38:5000/api/quotations/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setMessage({
        text: `Quotation ${newStatus} successfully`,
        type: 'success'
      });
      
      fetchQuotations();
    } catch (error) {
      setMessage({
        text: `Failed to ${newStatus} quotation`,
        type: 'error'
      });
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleView = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setIsViewModalOpen(true);
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
      fetchQuotations();
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

  const getStatusColor = (status: Quotation['status']) => {
    switch (status) {
      case 'current':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'open':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-600 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: Quotation['status']) => {
    switch (status) {
      case 'current':
        return <ClipboardList className="h-8 w-8" />;
      case 'open':
        return <FileText className="h-8 w-8" />;
      case 'accepted':
        return <Check className="h-8 w-8" />;
      case 'rejected':
        return <X className="h-8 w-8" />;
      default:
        return <ClipboardList className="h-8 w-8" />;
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

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 ${getStatusColor('current')}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Quotations</p>
              <p className="text-3xl font-bold text-purple-600">{statusCounts.current}</p>
            </div>
            <div className="text-purple-600">
              {getStatusIcon('current')}
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 ${getStatusColor('open')}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Quotations</p>
              <p className="text-3xl font-bold text-blue-600">{statusCounts.open}</p>
            </div>
            <div className="text-blue-600">
              {getStatusIcon('open')}
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 ${getStatusColor('accepted')}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Accepted Quotations</p>
              <p className="text-3xl font-bold text-green-600">{statusCounts.accepted}</p>
            </div>
            <div className="text-green-600">
              {getStatusIcon('accepted')}
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 ${getStatusColor('rejected')}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected Quotations</p>
              <p className="text-3xl font-bold text-red-600">{statusCounts.rejected}</p>
            </div>
            <div className="text-red-600">
              {getStatusIcon('rejected')}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'current', label: 'Current' },
              { key: 'open', label: 'Open' },
              { key: 'accepted', label: 'Accepted' },
              { key: 'rejected', label: 'Rejected' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Quotations Table */}
        <div className="overflow-x-auto">
          {filteredQuotations.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No {activeTab} quotations found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredQuotations.map((quotation) => (
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
                      <div className="text-sm text-gray-900 dark:text-white">
                        RM {quotation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleView(quotation)}
                          className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        
                        {activeTab === 'current' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(quotation._id, 'accepted')}
                              disabled={updatingStatusId === quotation._id}
                              className="p-2 text-gray-400 hover:text-green-500 disabled:opacity-50"
                              title="Accept"
                            >
                              {updatingStatusId === quotation._id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <Check className="h-5 w-5" />
                              )}
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(quotation._id, 'rejected')}
                              disabled={updatingStatusId === quotation._id}
                              className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
                              title="Reject"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        
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
          )}
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Quotation Details
                </h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {selectedQuotation.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Client: {selectedQuotation.clientName}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Email: {selectedQuotation.clientEmail}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Date: {new Date(selectedQuotation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedQuotation.status)}`}>
                    {selectedQuotation.status.charAt(0).toUpperCase() + selectedQuotation.status.slice(1)}
                  </span>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    RM {selectedQuotation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Products</h4>
                <div className="space-y-4">
                  {selectedQuotation.products.map((product, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-white">{product.name}</h5>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{product.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Qty: {product.quantity}</span>
                            <span>Unit Price: RM {product.unitPrice.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            RM {product.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {product.images.length > 0 && (
                        <div className="flex space-x-2 mt-3">
                          {product.images.slice(0, 3).map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={image}
                              alt={`${product.name} ${imgIndex + 1}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedQuotation.status === 'current' && (
                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedQuotation._id, 'rejected');
                      setIsViewModalOpen(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedQuotation._id, 'accepted');
                      setIsViewModalOpen(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}