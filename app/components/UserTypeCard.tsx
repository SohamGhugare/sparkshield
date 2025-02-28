'use client';

import { useState } from 'react';
import { useWallet } from './WalletContext';
import { WalletSelectModal } from './WalletSelectModal';

type Props = {
  title: string;
  description: string;
  buttonText: string;
  redirectPath: string;
};

export function UserTypeCard({ title, description, buttonText, redirectPath }: Props) {
  const { isConnected, selectWallet } = useWallet();
  const [showWalletSelect, setShowWalletSelect] = useState(false);

  const handleClick = async () => {
    if (!isConnected) {
      setShowWalletSelect(true);
    } else {
      window.location.href = redirectPath;
    }
  };

  return (
    <>
      <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-orange-200 transition-colors">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-8">{description}</p>
        <button
          onClick={handleClick}
          className="w-full bg-bitcoin text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-bold"
        >
          {!isConnected ? "Choose Wallet" : buttonText}
        </button>
      </div>

      {showWalletSelect && (
        <WalletSelectModal 
          onClose={() => setShowWalletSelect(false)}
          onSelect={async (walletId) => {
            await selectWallet(walletId);
            setShowWalletSelect(false);
            window.location.href = redirectPath;
          }}
        />
      )}
    </>
  );
} 