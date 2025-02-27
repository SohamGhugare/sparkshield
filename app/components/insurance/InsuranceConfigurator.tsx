'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type { InsurancePolicy } from '../../types/insurance';
import { SuccessDialog } from '../ui/SuccessDialog';

interface InsuranceConfiguratorProps {
  selectedPolicy: InsurancePolicy | null;
  onPurchase: (amount: number, duration: number) => void;
}

export function InsuranceConfigurator({ selectedPolicy, onPurchase }: InsuranceConfiguratorProps) {
  const [amount, setAmount] = useState<string>('');
  const [duration, setDuration] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!selectedPolicy) return null;
  
  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !duration) return;
    
    setIsSubmitting(true);
    try {
      onPurchase(parseFloat(amount), duration);
      setShowSuccess(true);
      setAmount('');
      setDuration(30);
    } finally {
      setIsSubmitting(false);
    }
  };

  const premium = parseFloat(amount || '0') * (selectedPolicy.premiumRate / 100) * (duration / 365);

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Configure Coverage</h3>
        
        <form onSubmit={handlePurchase} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Coverage Amount (BTC)
              </label>
              <input
                id="amount"
                type="number"
                min={selectedPolicy.minAmount}
                max={selectedPolicy.maxAmount}
                step="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bitcoin/20 focus:border-bitcoin text-gray-900 bg-white"
                placeholder="Enter amount..."
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                Min: {selectedPolicy.minAmount} BTC | Max: {selectedPolicy.maxAmount} BTC
              </p>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Coverage Duration (Days)
              </label>
              <input
                id="duration"
                type="number"
                min={30}
                max={365}
                step={30}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bitcoin/20 focus:border-bitcoin text-gray-900 bg-white"
                placeholder="Enter duration..."
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                Min: 30 days | Max: 365 days
              </p>
            </div>
          </div>

          <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-bitcoin flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Premium Estimate</h4>
                <p className="text-sm text-gray-600 mt-1.5">
                  {premium.toFixed(8)} BTC ({selectedPolicy.premiumRate}% annual rate)
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-4 bg-gradient-to-r from-bitcoin to-bitcoin-hover text-white rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] font-bold text-lg shadow-md hover:shadow-lg
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Processing...' : 'Purchase Coverage'}
          </button>
        </form>
      </div>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Coverage Purchased!"
        message={`Successfully purchased ${amount} BTC coverage for ${duration} days in ${selectedPolicy.name}`}
      />
    </>
  );
} 