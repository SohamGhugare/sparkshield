'use client';

import { useEffect, useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { getAllStoredWallets } from '@/app/storage';
import { getOrInitCachedWallet } from '@/app/walletCache';
import Loader from './loader';

type Props = {
  onClose: () => void;
  onSelect: (walletId: string) => void;
};

type WalletInfo = {
  id: string;
  pubkey: string;
  balance: bigint;
};

export function WalletSelectModal({ onClose, onSelect }: Props) {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWallets = async () => {
      const storedWallets = getAllStoredWallets();
      const walletsInfo = await Promise.all(
        storedWallets.map(async (wallet) => {
          const cached = await getOrInitCachedWallet(wallet.id);
          const pubkey = await cached.sparkWallet.getSparkAddress();
          return {
            id: wallet.id,
            pubkey,
            balance: cached.balance,
          };
        })
      );
      setWallets(walletsInfo);
      setLoading(false);
    };

    loadWallets();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Wallet</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No wallets found</p>
            <button
              onClick={() => window.location.href = '/wallets/new'}
              className="bg-bitcoin text-white py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors font-bold"
            >
              Create Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => onSelect(wallet.id)}
                className="flex items-center justify-between w-full bg-orange-50 text-bitcoin p-4 rounded-xl hover:bg-orange-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <FaWallet className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Wallet {wallet.id.slice(0, 8)}...</p>
                    <p className="text-sm text-gray-600">{wallet.balance.toString()} exhk</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full border border-gray-200 text-gray-600 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-bold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 