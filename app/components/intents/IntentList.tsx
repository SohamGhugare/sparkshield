import React from 'react';
import { useIntents, Intent } from './IntentProvider';

interface IntentListProps {
  filter?: 'all' | 'pending' | 'resolved' | 'failed';
  onSelectIntent?: (intent: Intent) => void;
}

const IntentList: React.FC<IntentListProps> = ({ 
  filter = 'all',
  onSelectIntent 
}) => {
  const { intents, loading } = useIntents();
  
  const filteredIntents = filter === 'all' 
    ? intents 
    : intents.filter(intent => intent.status === filter);
  
  if (loading) {
    return <div className="p-6 text-center text-gray-600 bg-white rounded-lg shadow-md">Loading intents...</div>;
  }
  
  if (filteredIntents.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-md">
        <p className="text-gray-600 mb-4">No intents found.</p>
        <p className="text-sm text-gray-500">Create a new intent to get started.</p>
      </div>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const getIntentTypeIcon = (type: string) => {
    switch (type) {
      case 'coverage':
        return '🛡️';
      case 'claim':
        return '📝';
      case 'staking':
        return '💰';
      default:
        return '📋';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          {filter.charAt(0).toUpperCase() + filter.slice(1)} Intents
        </h2>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {filteredIntents.map(intent => (
          <li 
            key={intent.id} 
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onSelectIntent && onSelectIntent(intent)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getIntentTypeIcon(intent.type)}</span>
                <div>
                  <p className="font-medium text-gray-800">{intent.type.charAt(0).toUpperCase() + intent.type.slice(1)} Intent</p>
                  <p className="text-sm text-gray-500">
                    {intent.sourceChain.charAt(0).toUpperCase() + intent.sourceChain.slice(1)} → 
                    {intent.targetChain.charAt(0).toUpperCase() + intent.targetChain.slice(1)}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(intent.status)}`}>
                  {intent.status.charAt(0).toUpperCase() + intent.status.slice(1)}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {formatDate(intent.createdAt)}
                </span>
              </div>
            </div>
            
            <div className="mt-2 text-sm text-gray-600">
              <p>ID: <span className="font-mono">{intent.id.substring(0, 8)}...</span></p>
              {intent.solver && <p>Solver: <span className="font-mono">{intent.solver}</span></p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IntentList; 