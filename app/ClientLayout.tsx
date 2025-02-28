'use client';

import { Navbar } from './components/Navbar';
import { WalletProvider } from './components/WalletContext';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    
      <WalletProvider>
        <Navbar />
        {children}
      </WalletProvider>
  );
} 