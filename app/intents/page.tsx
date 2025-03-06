'use client';

import React, { useState } from 'react';
import { IntentProvider, Intent } from '../components/intents/IntentProvider';
import IntentCreator from '../components/intents/IntentCreator';
import IntentList from '../components/intents/IntentList';
import IntentDetails from '../components/intents/IntentDetails';
import Link from 'next/link';

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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">NEAR Intents Dashboard</h1>
            <p className="text-gray-600">Manage cross-chain insurance intents and claims with AI-powered resolution</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex border-b border-gray-200">
                {(['all', 'pending', 'resolved', 'failed'] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`py-3 px-4 text-center font-medium ${
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
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleCreateIntent('coverage')}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Coverage Intent
              </button>
              <button 
                onClick={() => handleCreateIntent('claim')}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Claim Intent
              </button>
              <button 
                onClick={() => handleCreateIntent('staking')}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Staking Intent
              </button>
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
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600 mb-2">Select an intent to view details</p>
                  <p className="text-sm text-gray-500">Or create a new intent using the buttons above</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Create {intentType.charAt(0).toUpperCase() + intentType.slice(1)} Intent</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
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