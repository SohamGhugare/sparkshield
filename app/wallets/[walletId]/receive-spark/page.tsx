"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaStar, FaCopy, FaCheckCircle } from "react-icons/fa";
import Loader from "@/app/components/loader";
import { getOrInitCachedWallet } from "@/app/walletCache";

export default function WalletReceiveSpark() {
  const [pubkey, setPubkey] = useState<string | null>();
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const walletId = params.walletId as string;

  useEffect(() => {
    if (!walletId) return;
    getOrInitCachedWallet(walletId).then((cachedWallet) => {
      cachedWallet.sparkWallet.getSparkAddress().then(setPubkey);
    });
  }, [walletId]);

  if (!pubkey) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const CopyIcon = copied ? FaCheckCircle : FaCopy;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-50 rounded-lg">
                <FaStar className="h-6 w-6 text-bitcoin" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Receive via Spark</h1>
                <p className="text-gray-600">Share your Spark address</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Your Spark Address</p>
                <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-xl">
                  <p className="font-mono text-sm text-gray-600 break-all">
                    {pubkey}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pubkey).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    <CopyIcon className={`h-4 w-4 ${copied ? 'text-green-500' : 'text-gray-400'}`} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => window.location.href = `/wallets/${walletId}`}
                className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-bold"
              >
                Back to Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
