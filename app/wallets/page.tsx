"use client";

import { useEffect, useState } from "react";
import { FaArrowRight, FaWallet, FaPlus, FaKey, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  clearStoredWallets,
  getAllStoredWallets,
  type StoredWallet,
} from "@/app/storage";
import Loader from "@/app/components/loader";
import { getOrInitCachedWallet } from "../walletCache";

type Wallet = {
  id: string;
  balance: bigint;
  pubkey: string;
};

type BoxProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

function Box(props: BoxProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={props.onClick}
        className="flex items-center justify-between bg-white rounded-xl p-6 hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-orange-200"
      >
        {props.children}
      </div>
    </div>
  );
}

function WalletItem({ storedWallet }: { storedWallet: StoredWallet }) {
  const [wallet, setWallet] = useState<Wallet | null>();
  const { id, mnemonic } = storedWallet;
  const router = useRouter();

  useEffect(() => {
    getOrInitCachedWallet(id).then((cachedWallet) => {
      cachedWallet.sparkWallet.getSparkAddress().then((pubkey) => {
        setWallet({ balance: cachedWallet.balance, id, pubkey });
      });
    });
  }, [id, mnemonic, setWallet]);

  if (!wallet) {
    return (
      <Box>
        <div className="flex justify-center w-full py-4">
          <Loader />
        </div>
      </Box>
    );
  }

  return (
    <Box onClick={() => router.push(`/wallets/${wallet.id}`)}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-orange-50 rounded-lg">
          <FaWallet className="h-6 w-6 text-bitcoin" />
        </div>
        <div>
          <p className="text-gray-900 font-medium">{wallet.pubkey.substring(0, 20)}...</p>
          <p className="text-gray-600">{String(wallet.balance)} exhk</p>
        </div>
      </div>
      <FaArrowRight className="text-gray-400 hover:text-bitcoin transition-colors" />
    </Box>
  );
}

export default function Wallets() {
  const [wallets, setWallets] = useState<Array<StoredWallet>>([]);

  useEffect(() => {
    setWallets(getAllStoredWallets());
  }, [setWallets]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wallets</h1>
          <p className="text-gray-600 mb-8">Manage your SparkShield wallets and assets</p>

          <div className="space-y-4 mb-8">
            {wallets.map((wallet) => (
              <WalletItem key={wallet.id} storedWallet={wallet} />
            ))}
            {wallets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No wallets found. Create or recover a wallet to get started.
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/wallets/new'}
              className="flex items-center justify-center gap-2 w-full bg-bitcoin text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-bold"
            >
              <FaPlus /> Create a wallet
            </button>
            
            <button
              onClick={() => window.location.href = '/wallets/recover'}
              className="flex items-center justify-center gap-2 w-full bg-orange-50 text-bitcoin py-3 px-4 rounded-xl hover:bg-orange-100 transition-colors font-bold"
            >
              <FaKey /> Recover a wallet
            </button>

            {wallets.length > 0 && (
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Are you sure you want to clear all the wallets? " +
                      "You can recover them using the mnemonics you saved during the creation process."
                    )
                  ) {
                    clearStoredWallets();
                    location.reload();
                  }
                }}
                className="flex items-center justify-center gap-2 w-full border border-red-200 text-red-500 py-3 px-4 rounded-xl hover:bg-red-50 transition-colors font-bold"
              >
                <FaTrash /> Clear all wallets
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
