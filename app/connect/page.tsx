'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../components/WalletContext';

export default function ConnectWallet() {
  const router = useRouter();
  const { isConnected, connect } = useWallet();

  useEffect(() => {
    if (isConnected) {
      router.back();
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Connect Wallet</h2>
        <p className="text-gray-600 mb-8">
          Connect your wallet to access SparkShield&apos;s insurance features.
        </p>
        <button
          onClick={connect}
          className="bg-orange-50 text-bitcoin hover:bg-orange-100 px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 text-lg w-full"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
} 