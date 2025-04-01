import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Upload, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Proposal {
  _id: string;
  name: string;
  date: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted';
  totalAmount: number;
  clientName: string;
}

export function SmartProposalPage() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await axios.get('http://139.59.76.86:5000/api/proposals');
      setProposals(response.data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (id: string) => {
    try {
      const response = await axios.get(`http://139.59.76.86:5000/api/proposals/${id}/pdf`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `proposal-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const getStatusColor = (status: Proposal['status']) => {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="p-3 bg-amber-50 rounded-full mr-4">
            <FileSpreadsheet className="h-6 w-6 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-amber-500">Smart Proposal</h1>
        </div>
        <button 
          onClick={() => navigate('/smart-proposal/create')}
          className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          Create New Proposal
        </button>
      </div>

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
              {proposals.map((proposal) => (
                <tr key={proposal._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{proposal.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{proposal.clientName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(proposal.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      RM {proposal.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => handleDownloadPDF(proposal._id)}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <Trash2 className="h-5 w-5" />
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