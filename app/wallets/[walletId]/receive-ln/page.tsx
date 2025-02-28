"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FaBolt, FaCopy, FaCheckCircle } from "react-icons/fa";
import { getOrInitCachedWallet } from "@/app/walletCache";

export default function WalletReceiveLn() {
  const [invoice, setInvoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("0");
  const [memo, setMemo] = useState("");
  const params = useParams();
  const walletId = params.walletId as string;

  const CopyIcon = copied ? FaCheckCircle : FaCopy;

  if (invoice === null) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <FaBolt className="h-6 w-6 text-bitcoin" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Receive via Lightning</h1>
                  <p className="text-gray-600">Generate a Lightning Network invoice</p>
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
                      disabled={loading}
                      placeholder="Enter amount in exhk"
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-bitcoin outline-none transition-all disabled:opacity-50"
                      value={amount || ""}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-medium text-gray-900">
                      Memo (optional)
                    </label>
                    <textarea
                      placeholder="Add a description"
                      disabled={loading}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-bitcoin outline-none transition-all disabled:opacity-50"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    disabled={loading}
                    onClick={() => {
                      if (loading) return;
                      setLoading(true);
                      getOrInitCachedWallet(walletId).then((cachedWallet) => {
                        cachedWallet.sparkWallet
                          .createLightningInvoice({
                            amountSats: parseInt(amount),
                            memo,
                          })
                          .then(setInvoice);
                      });
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-bitcoin text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-bold disabled:opacity-50"
                  >
                    {loading ? "Creating invoice..." : "Create invoice"}
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-50 rounded-lg">
                <FaBolt className="h-6 w-6 text-bitcoin" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lightning Invoice</h1>
                <p className="text-gray-600">Share this invoice with the sender</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Invoice</p>
                <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-xl">
                  <p className="font-mono text-sm text-gray-600 break-all">
                    {invoice}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(invoice).then(() => {
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
