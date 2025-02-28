'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/app/components/WalletContext';
import { Marketplace } from '@/app/components/Marketplace';
import Loader from '@/app/components/loader';

export default function InsuranceBuyer() {
  const { isConnected, loading } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isConnected) {
      router.push('/');
    }
  }, [isConnected, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isConnected) {
    return null;
  }

  return <Marketplace />;
} 