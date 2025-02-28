'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllStoredWallets } from '@/app/storage';
import { getOrInitCachedWallet } from '@/app/walletCache';

interface WalletContextType {
  isConnected: boolean;
  selectedWallet: {
    id: string;
    pubkey: string;
    balance: bigint;
  } | null;
  connect: () => void;
  disconnect: () => void;
  selectWallet: (walletId: string) => Promise<void>;
  loading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletContextType['selectedWallet']>(null);
  const [loading, setLoading] = useState(true);

  // Load selected wallet from localStorage on mount
  useEffect(() => {
    const loadSavedWallet = async () => {
      const savedWalletId = localStorage.getItem('selectedWalletId');
      if (savedWalletId) {
        await selectWallet(savedWalletId);
      }
      setLoading(false);
    };
    loadSavedWallet();
  }, []); // Empty dependency array since this should only run once

  const selectWallet = async (walletId: string) => {
    const wallet = await getOrInitCachedWallet(walletId);
    const pubkey = await wallet.sparkWallet.getSparkAddress();
    setSelectedWallet({
      id: walletId,
      pubkey,
      balance: wallet.balance
    });
    setIsConnected(true);
    localStorage.setItem('selectedWalletId', walletId);
  };

  const connect = async () => {
    const wallets = getAllStoredWallets();
    if (wallets.length === 0) {
      window.location.href = '/wallets/new';
      return;
    }
    
    if (wallets.length > 1) {
      window.location.href = '/wallets';
      return;
    }

    await selectWallet(wallets[0].id);
  };

  const disconnect = () => {
    setSelectedWallet(null);
    setIsConnected(false);
    localStorage.removeItem('selectedWalletId');
  };

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      selectedWallet, 
      connect, 
      disconnect, 
      selectWallet,
      loading 
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 