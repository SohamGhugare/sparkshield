"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { getOrInitCachedWallet, refreshWallet } from "@/app/walletCache";

export default function WalletSendSpark() {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [amount, setAmount] = useState("0");
  const [idKey, setIdKey] = useState("");
  const params = useParams();
  const walletId = params.walletId as string;
  const router = useRouter();

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
                <h1 className="text-2xl font-bold text-gray-900">Send via Spark</h1>
                <p className="text-gray-600">Send to another Spark wallet</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block font-medium text-gray-900">
                    Amount (exhk)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount in exhk"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-bitcoin outline-none transition-all disabled:opacity-50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading || syncing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-medium text-gray-900">
                    Recipient Spark Address
                  </label>
                  <textarea
                    placeholder="Enter recipient's Spark address"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-bitcoin outline-none transition-all h-32 font-mono disabled:opacity-50"
                    value={idKey}
                    onChange={(e) => setIdKey(e.target.value)}
                    disabled={loading || syncing}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  disabled={loading || syncing || !idKey || !amount}
                  onClick={() => {
                    setLoading(true);
                    getOrInitCachedWallet(walletId).then((cachedWallet) => {
                      cachedWallet.sparkWallet
                        .sendSparkTransfer({
                          amountSats: parseInt(amount),
                          receiverSparkAddress: idKey,
                        })
                        .then(() => {
                          setSyncing(true);
                          refreshWallet(walletId).then(() => {
                            router.push(`/wallets/${walletId}`);
                          });
                        });
                    });
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-bitcoin text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-bold disabled:opacity-50"
                >
                  {syncing ? "Syncing wallet..." :
                   loading ? "Sending..." :
                   "Send Payment"}
                </button>

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
    </div>
  );
}
