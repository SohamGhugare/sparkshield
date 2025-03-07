'use client';

import React from 'react';
import Link from 'next/link';
import { IntentProvider } from '../components/intents/IntentProvider';
import { RunesDexProvider } from '../components/runes/RunesDexProvider';
import TokenSwap from '../components/runes/TokenSwap';
import SwapHistory from '../components/runes/SwapHistory';

const RunesDexPage = () => {
  return (
    <IntentProvider>
      <RunesDexProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Runes DEX</h1>
              <p className="text-gray-600 mb-2">Swap tokens seamlessly for your insurance operations</p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Powered by NEAR Intents</span> - All swaps are executed as cross-chain intents for optimal routing and settlement
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <TokenSwap />
                
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Why Use Runes DEX?</h2>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Automatic token conversion for insurance operations</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Real-time quotes with optimal routing via NEAR Intents</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Slippage protection ensures fair rates</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Cross-chain settlement powered by NEAR Intents</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <SwapHistory />
                
                <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-md border border-blue-200">
                  <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">How It Works with NEAR Intents</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">1. Intent Creation</h3>
                      </div>
                      <p className="text-gray-700">
                        Your swap request is converted into a NEAR Intent, which describes what you want to achieve without specifying how.
                      </p>
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">2. Solver Network</h3>
                      </div>
                      <p className="text-gray-700">
                        The NEAR Intents network finds the optimal path for your swap across multiple chains and liquidity sources.
                      </p>
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">3. Cross-Chain Execution</h3>
                      </div>
                      <p className="text-gray-700">
                        The swap is executed across chains with atomic settlement, ensuring your transaction is completed safely or reverted.
                      </p>
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">4. Intent Resolution</h3>
                      </div>
                      <p className="text-gray-700">
                        The intent is resolved with proof of execution, and your new tokens are delivered to your wallet across chains.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RunesDexProvider>
    </IntentProvider>
  );
};

export default RunesDexPage;
