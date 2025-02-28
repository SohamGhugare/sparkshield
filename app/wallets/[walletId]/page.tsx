"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaArrowDown,
  FaArrowUp,
  FaCopy,
  FaCheckCircle,
  FaEye,
  FaSync,
  FaWallet,
  FaBitcoin,
} from "react-icons/fa";
import Loader from "@/app/components/loader";
import { getOrInitCachedWallet, refreshWallet } from "@/app/walletCache";

type Wallet = {
  balance: bigint;
  pubkey: string;
  mnemonic: string;
};

export default function Wallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [pubkeyCopied, setPubkeyCopied] = useState(false);
  const [mnemonicCopied, setMnemonicCopied] = useState(false);
  const [revealMnemonic, setRevealMnemonic] = useState(false);
  const params = useParams();
  const walletId = params.walletId as string;

  useEffect(() => {
    if (!walletId) return;
    getOrInitCachedWallet(walletId).then((cachedWallet) => {
      cachedWallet.sparkWallet.getSparkAddress().then((pubkey) => {
        setWallet({
          balance: cachedWallet.balance,
          mnemonic: cachedWallet.mnemonic,
          pubkey,
        });
      });
    });
  }, [walletId]);

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const PubkeyCopyIcon = pubkeyCopied ? FaCheckCircle : FaCopy;
  const MnemonicCopyIcon = mnemonicCopied ? FaCheckCircle : FaCopy;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-orange-50 rounded-lg">
                <FaWallet className="h-6 w-6 text-bitcoin" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Wallet Details</h1>
                <p className="text-gray-600">Manage your wallet and transactions</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Balance Card */}
              <div className="bg-orange-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <FaBitcoin className="h-5 w-5 text-bitcoin" />
                  <p className="text-gray-600 font-medium">Balance</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {wallet.balance.toString()} exhk
                </p>
              </div>

              {/* Pubkey Section */}
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Public Key</p>
                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl">
                  <p className="font-mono text-sm text-gray-600 break-all">
                    {wallet.pubkey}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(wallet.pubkey).then(() => {
                        setPubkeyCopied(true);
                        setTimeout(() => setPubkeyCopied(false), 1000);
                      });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <PubkeyCopyIcon className={`h-4 w-4 ${pubkeyCopied ? 'text-green-500' : 'text-gray-400'}`} />
                  </button>
                </div>
              </div>

              {/* Mnemonic Section */}
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Recovery Phrase</p>
                <div className="p-4 bg-gray-50 rounded-xl">
                  {revealMnemonic ? (
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm text-gray-600 break-all">{wallet.mnemonic}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(wallet.mnemonic).then(() => {
                            setMnemonicCopied(true);
                            setTimeout(() => setMnemonicCopied(false), 1000);
                          });
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MnemonicCopyIcon className={`h-4 w-4 ${mnemonicCopied ? 'text-green-500' : 'text-gray-400'}`} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRevealMnemonic(true)}
                      className="flex items-center gap-2 text-bitcoin hover:text-orange-600 transition-colors"
                    >
                      <FaEye className="h-4 w-4" />
                      <span>Reveal Recovery Phrase</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => window.location.href = `/wallets/${walletId}/send`}
                  className="flex items-center justify-center gap-2 bg-bitcoin text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-bold"
                >
                  <FaArrowUp /> Send
                </button>
                <button
                  onClick={() => window.location.href = `/wallets/${walletId}/receive`}
                  className="flex items-center justify-center gap-2 bg-orange-50 text-bitcoin py-3 px-4 rounded-xl hover:bg-orange-100 transition-colors font-bold"
                >
                  <FaArrowDown /> Receive
                </button>
              </div>

              {/* Sync Button */}
              <button
                disabled={syncing}
                onClick={() => {
                  setSyncing(true);
                  refreshWallet(walletId).then((cachedWallet) => {
                    cachedWallet.sparkWallet.getSparkAddress().then((pubkey) => {
                      setWallet({
                        balance: cachedWallet.balance,
                        mnemonic: cachedWallet.mnemonic,
                        pubkey,
                      });
                      setSyncing(false);
                    });
                  });
                }}
                className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-bold disabled:opacity-50"
              >
                {syncing ? (
                  <Loader className="h-4 w-4" />
                ) : (
                  <FaSync className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                )}
                {syncing ? 'Syncing...' : 'Sync Wallet'}
              </button>

              {/* Back Button */}
              <button
                onClick={() => window.location.href = '/wallets'}
                className="flex items-center justify-center gap-2 w-full text-gray-600 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-bold"
              >
                Back to Wallets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
