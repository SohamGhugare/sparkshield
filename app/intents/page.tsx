'use client';

import React, { useState } from 'react';
import { IntentProvider, Intent } from '../components/intents/IntentProvider';
import IntentCreator from '../components/intents/IntentCreator';
import IntentList from '../components/intents/IntentList';
import IntentDetails from '../components/intents/IntentDetails';

const IntentsPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'resolved' | 'failed'>('all');
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [intentType, setIntentType] = useState<'coverage' | 'claim' | 'staking'>('coverage');

  const handleSelectIntent = (intent: Intent) => {
    setSelectedIntent(intent);
  };

  const handleCloseDetails = () => {
    setSelectedIntent(null);
  };

  const handleCreateIntent = (type: 'coverage' | 'claim' | 'staking') => {
    setIntentType(type);
    setShowCreateModal(true);
  };

  const handleIntentCreated = (intentId: string) => {
    setShowCreateModal(false);
    // Could add a success notification here
  };

  return (
    <IntentProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">NEAR Intents Dashboard</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleCreateIntent('coverage')}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Create Coverage Intent
            </button>
            <button 
              onClick={() => handleCreateIntent('claim')}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Create Claim Intent
            </button>
            <button 
              onClick={() => handleCreateIntent('staking')}
              className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
            >
              Create Staking Intent
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex border-b">
            {(['all', 'pending', 'resolved', 'failed'] as const).map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === tab 
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <IntentList 
              filter={activeTab} 
              onSelectIntent={handleSelectIntent} 
            />
          </div>
          
          <div>
            {selectedIntent ? (
              <IntentDetails 
                intent={selectedIntent} 
                onClose={handleCloseDetails} 
              />
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-500">Select an intent to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Create {intentType.charAt(0).toUpperCase() + intentType.slice(1)} Intent</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <IntentCreator 
                type={intentType} 
                onSuccess={handleIntentCreated}
                onError={(error) => console.error(error)}
              />
            </div>
          </div>
        </div>
      )}
    </IntentProvider>
  );
};

export default IntentsPage; 