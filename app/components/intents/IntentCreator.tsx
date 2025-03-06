import React, { useState } from 'react';
import { useIntents } from './IntentProvider';

interface IntentCreatorProps {
  type: 'coverage' | 'claim' | 'staking';
  onSuccess?: (intentId: string) => void;
  onError?: (error: Error) => void;
}

const IntentCreator: React.FC<IntentCreatorProps> = ({ 
  type, 
  onSuccess, 
  onError 
}) => {
  const { createIntent } = useIntents();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sourceChain: 'near',
    targetChain: 'bitcoin',
    parameters: {}
  });

  // Different parameter fields based on intent type
  const getParameterFields = () => {
    switch (type) {
      case 'coverage':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Coverage Amount</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded" 
                onChange={(e) => updateParameter('coverageAmount', parseFloat(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Duration (days)</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded" 
                onChange={(e) => updateParameter('duration', parseInt(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Premium</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded" 
                onChange={(e) => updateParameter('premium', parseFloat(e.target.value))}
              />
            </div>
          </>
        );
      
      case 'claim':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Policy ID</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                onChange={(e) => updateParameter('policyId', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Claim Amount</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded" 
                onChange={(e) => updateParameter('amount', parseFloat(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Evidence</label>
              <textarea 
                className="w-full p-2 border rounded" 
                rows={4}
                onChange={(e) => updateParameter('evidence', e.target.value)}
              />
            </div>
          </>
        );
      
      case 'staking':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Staking Amount</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded" 
                onChange={(e) => updateParameter('amount', parseFloat(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Lock Period (days)</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded" 
                onChange={(e) => updateParameter('lockPeriod', parseInt(e.target.value))}
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  const updateParameter = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const intent = await createIntent({
        type,
        parameters: formData.parameters,
        sourceChain: formData.sourceChain,
        targetChain: formData.targetChain
      });
      
      if (onSuccess) {
        onSuccess(intent.id);
      }
    } catch (error) {
      console.error('Failed to create intent:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create {type.charAt(0).toUpperCase() + type.slice(1)} Intent</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Source Chain</label>
          <select 
            className="w-full p-2 border rounded"
            value={formData.sourceChain}
            onChange={(e) => setFormData(prev => ({ ...prev, sourceChain: e.target.value }))}
          >
            <option value="near">NEAR</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Target Chain</label>
          <select 
            className="w-full p-2 border rounded"
            value={formData.targetChain}
            onChange={(e) => setFormData(prev => ({ ...prev, targetChain: e.target.value }))}
          >
            <option value="bitcoin">Bitcoin</option>
            <option value="near">NEAR</option>
            <option value="ethereum">Ethereum</option>
          </select>
        </div>
        
        {getParameterFields()}
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Intent'}
        </button>
      </form>
    </div>
  );
};

export default IntentCreator; 