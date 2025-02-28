"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaBitcoin, FaCopy, FaCheckCircle } from "react-icons/fa";
import Loader from "@/app/components/loader";
import { getOrInitCachedWallet } from "@/app/walletCache";

export default function WalletDepositBtc() {
  const [address, setAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyAddressText, setCopyAddressText] = useState("Copy address");
  const params = useParams();
  const walletId = params.walletId as string;

  useEffect(() => {
    if (!walletId) return;
    getOrInitCachedWallet(walletId).then((cachedWallet) => {
      cachedWallet.sparkWallet.getDepositAddress().then(setAddress);
    });
  }, [walletId]);

  if (!address) {
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
                <FaBitcoin className="h-6 w-6 text-bitcoin" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Deposit Bitcoin</h1>
                <p className="text-gray-600">Send BTC to this address</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-orange-50 p-4 rounded-lg text-bitcoin">
                <p className="text-sm">
                  Your balance will increase once the deposit is confirmed on the Bitcoin network.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-gray-900">Bitcoin Address</p>
                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl">
                  <p className="font-mono text-sm text-gray-600 break-all">
                    {address}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(address).then(() => {
                        setCopied(true);
                        setCopyAddressText("Copied!");
                        setTimeout(() => {
                          setCopied(false);
                          setCopyAddressText("Copy address");
                          console.log(copyAddressText);
                        }, 2000);
                      });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
