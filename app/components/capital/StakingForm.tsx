'use client';

import { useState } from 'react';
import { AlertCircle, History } from 'lucide-react';
import type { InsurancePool } from '../../types/capital';
import { SuccessDialog } from '../ui/SuccessDialog';
import { MyStakingsModal } from './MyStakingsModal';

interface StakingFormProps {
  pool: InsurancePool;
}

export function StakingForm({ pool }: StakingFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [duration, setDuration] = useState<number>(pool.lockupPeriod);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showStakings, setShowStakings] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Staking:', { amount, duration, poolId: pool.id });
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
      setAmount('');
      setDuration(pool.lockupPeriod);
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedReturns = parseFloat(amount || '0') * (pool.currentAPY / 100) * (duration / 365);

  return (
    <>
      <div className="bg-white rounded-xl p-8 shadow-sm h-full border-2 border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Stake in Pool</h3>
          <button
            type="button"
            onClick={() => setShowStakings(true)}
            className="flex items-center gap-2 px-4 py-2 text-bitcoin hover:bg-orange-50 rounded-lg transition-colors"
          >
            <History className="h-4 w-4" />
            <span className="font-medium">My Stakings</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Stake Amount (BTC)
              </label>
              <input
                id="amount"
                type="number"
                min={pool.minStake}
                max={pool.maxStake}
                step="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bitcoin/20 focus:border-bitcoin text-gray-900 bg-white shadow-sm"
                placeholder="Enter amount..."
                required
              />
              <p className="text-sm text-gray-500 mt-2 ml-1">
                Min: {pool.minStake} BTC | Max: {pool.maxStake} BTC
              </p>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Lock Duration (Days)
              </label>
              <input
                id="duration"
                type="number"
                min={pool.lockupPeriod}
                step={15}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bitcoin/20 focus:border-bitcoin text-gray-900 bg-white shadow-sm"
                placeholder="Enter duration..."
                required
              />
              <p className="text-sm text-gray-500 mt-2 ml-1">
                Minimum lock period: {pool.lockupPeriod} days
              </p>
            </div>
          </div>

          {/* Estimated Returns */}
          <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-bitcoin flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Estimated Returns</h4>
                <p className="text-sm text-gray-600 mt-1.5">
                  {estimatedReturns.toFixed(8)} BTC ({pool.currentAPY}% APY)
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
            {isSubmitting ? 'Staking...' : 'Stake Now'}
          </button>
        </form>
      </div>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Staking Successful!"
        message={`Successfully staked ${amount} BTC for ${duration} days in ${pool.name}`}
      />

      <MyStakingsModal 
        isOpen={showStakings}
        onClose={() => setShowStakings(false)}
      />
    </>
  );
} 