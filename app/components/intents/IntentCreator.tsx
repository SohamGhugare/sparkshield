import React, { useState } from 'react';
import { useIntents, IntentParameters } from './IntentProvider';
import Link from 'next/link';

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
    parameters: {} as IntentParameters
  });

  // Different parameter fields based on intent type
  const getParameterFields = () => {
    switch (type) {
      case 'coverage':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">Coverage Amount (BTC)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800" 
                onChange={(e) => updateParameter('coverageAmount', parseFloat(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">Duration (days)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800" 
                onChange={(e) => updateParameter('duration', parseInt(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">Premium (BTC)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800" 
                onChange={(e) => updateParameter('premium', parseFloat(e.target.value))}
              />
            </div>
          </>
        );
      
      case 'claim':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">Policy ID</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800" 
                onChange={(e) => updateParameter('policyId', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">Claim Amount (BTC)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800" 
                onChange={(e) => updateParameter('amount', parseFloat(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">Evidence</label>
              <textarea 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800" 
                rows={4}
                onChange={(e) => updateParameter('evidence', e.target.value)}
                placeholder="Provide details about your claim..."
              />
            </div>
          </>
        );
      
      case 'staking':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">Staking Amount (BTC)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800" 
                onChange={(e) => updateParameter('amount', parseFloat(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">Lock Period (days)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800" 
                onChange={(e) => updateParameter('lockPeriod', parseInt(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">Pool ID</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800" 
                onChange={(e) => updateParameter('poolId', e.target.value)}
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  const updateParameter = (key: string, value: string | number) => {
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
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Create {type.charAt(0).toUpperCase() + type.slice(1)} Intent</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-800 mb-1">Source Chain</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            value={formData.sourceChain}
            onChange={(e) => setFormData(prev => ({ ...prev, sourceChain: e.target.value }))}
          >
            <option value="near">NEAR</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-800 mb-1">Target Chain</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            value={formData.targetChain}
            onChange={(e) => setFormData(prev => ({ ...prev, targetChain: e.target.value }))}
          >
            <option value="bitcoin">Bitcoin</option>
            <option value="near">NEAR</option>
            <option value="ethereum">Ethereum</option>
          </select>
        </div>
        
        {getParameterFields()}
        
        {formData.targetChain !== 'BTC' && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-700 mb-2">
                  Don&apos;t have enough BTC? Use our Runes DEX to swap your tokens.
                </p>
                <Link 
                  href="/runes-dex" 
                  className="text-sm bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 inline-flex items-center"
                >
                  Swap Tokens
                  <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Intent'}
        </button>
      </form>
    </div>
  );
};

export default IntentCreator; 