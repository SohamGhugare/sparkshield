import React, { useState } from 'react';
import { useIntents, Intent, IntentResolution } from './IntentProvider';

interface IntentDetailsProps {
  intent: Intent;
  onClose?: () => void;
}

const IntentDetails: React.FC<IntentDetailsProps> = ({ intent, onClose }) => {
  const { resolveIntent } = useIntents();
  const [loading, setLoading] = useState(false);
  const [resolution, setResolution] = useState<IntentResolution>({
    status: 'approved',
    reason: '',
    payout: 0
  });

  const handleResolve = async () => {
    setLoading(true);
    try {
      await resolveIntent(intent.id, resolution);
    } catch (error) {
      console.error('Failed to resolve intent:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderParameterValue = (value: string | number | boolean | undefined) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto font-mono border border-gray-200">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    return String(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
        <h2 className="text-xl font-semibold text-gray-800">Intent Details</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">ID</p>
          <p className="font-medium text-gray-800 font-mono">{intent.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Type</p>
          <p className="font-medium text-gray-800 capitalize">{intent.type}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Source Chain</p>
          <p className="font-medium text-gray-800 capitalize">{intent.sourceChain}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Target Chain</p>
          <p className="font-medium text-gray-800 capitalize">{intent.targetChain}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className={`font-medium capitalize ${
            intent.status === 'resolved' ? 'text-green-600' : 
            intent.status === 'failed' ? 'text-red-600' : 
            'text-yellow-600'
          }`}>{intent.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Created</p>
          <p className="font-medium text-gray-800">{formatDate(intent.createdAt)}</p>
        </div>
        {intent.solver && (
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Solver</p>
            <p className="font-medium text-gray-800 font-mono">{intent.solver}</p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-800">Parameters</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          {Object.entries(intent.parameters).length > 0 ? (
            Object.entries(intent.parameters).map(([key, value]) => (
              <div key={key} className="mb-3 last:mb-0">
                <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <div className="font-medium text-gray-800">{renderParameterValue(value)}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No parameters provided</p>
          )}
        </div>
      </div>

      {intent.status === 'pending' && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Resolve Intent</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={resolution.status}
              onChange={(e) => setResolution(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              rows={2}
              value={resolution.reason}
              onChange={(e) => setResolution(prev => ({ ...prev, reason: e.target.value }))}
              placeholder={resolution.status === 'approved' ? 'Reason for approval' : 'Reason for rejection'}
            />
          </div>
          
          {resolution.status === 'approved' && intent.type === 'claim' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payout Amount (BTC)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={resolution.payout}
                onChange={(e) => setResolution(prev => ({ ...prev, payout: parseFloat(e.target.value) }))}
              />
            </div>
          )}
          
          <button 
            onClick={handleResolve}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400"
          >
            {loading ? 'Processing...' : 'Resolve Intent'}
          </button>
        </div>
      )}
    </div>
  );
};

export default IntentDetails; 