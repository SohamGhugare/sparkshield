import React, { useState } from 'react';
import { useIntents, Intent } from './IntentProvider';

interface IntentDetailsProps {
  intent: Intent;
  onClose?: () => void;
}

const IntentDetails: React.FC<IntentDetailsProps> = ({ intent, onClose }) => {
  const { resolveIntent } = useIntents();
  const [loading, setLoading] = useState(false);
  const [resolution, setResolution] = useState({
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

  const renderParameterValue = (value: any) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    return String(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Intent Details</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">ID</p>
          <p className="font-medium">{intent.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Type</p>
          <p className="font-medium capitalize">{intent.type}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Source Chain</p>
          <p className="font-medium capitalize">{intent.sourceChain}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Target Chain</p>
          <p className="font-medium capitalize">{intent.targetChain}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className={`font-medium capitalize ${
            intent.status === 'resolved' ? 'text-green-600' : 
            intent.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {intent.status}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Created At</p>
          <p className="font-medium">{formatDate(intent.createdAt)}</p>
        </div>
        {intent.solver && (
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Solver</p>
            <p className="font-medium">{intent.solver}</p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Parameters</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {Object.entries(intent.parameters).map(([key, value]) => (
            <div key={key} className="mb-2">
              <p className="text-sm text-gray-500 capitalize">{key}</p>
              <div className="font-medium">{renderParameterValue(value)}</div>
            </div>
          ))}
        </div>
      </div>

      {intent.status === 'pending' && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Resolve Intent</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              className="w-full p-2 border rounded"
              value={resolution.status}
              onChange={(e) => setResolution(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea 
              className="w-full p-2 border rounded" 
              rows={2}
              value={resolution.reason}
              onChange={(e) => setResolution(prev => ({ ...prev, reason: e.target.value }))}
            />
          </div>
          
          {resolution.status === 'approved' && intent.type === 'claim' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Payout Amount</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded"
                value={resolution.payout}
                onChange={(e) => setResolution(prev => ({ ...prev, payout: parseFloat(e.target.value) }))}
              />
            </div>
          )}
          
          <button 
            onClick={handleResolve}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Processing...' : 'Resolve Intent'}
          </button>
        </div>
      )}
    </div>
  );
};

export default IntentDetails; 