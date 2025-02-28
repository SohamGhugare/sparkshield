"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaBolt } from "react-icons/fa";
import { getOrInitCachedWallet, refreshWallet } from "@/app/walletCache";
import bolt11 from "bolt11";

enum Status {
  None,
  Paying,
  Syncing,
}

export default function WalletSendLn() {
  const [invoice, setInvoice] = useState("");
  const [status, setStatus] = useState<Status>(Status.None);
  const [step, setStep] = useState(0);
  const params = useParams();
  const walletId = params.walletId as string;
  const router = useRouter();

  let decoded;
  let memo;
  try {
    decoded = bolt11.decode(invoice);
    memo = decoded.tags.find((t) => t.tagName === "description")?.data as string;
  } catch {}

  if (step === 0) {
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
                  <h1 className="text-2xl font-bold text-gray-900">Send via Lightning</h1>
                  <p className="text-gray-600">Pay a Lightning Network invoice</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-medium text-gray-900">
                    Lightning Invoice
                  </label>
                  <textarea
                    placeholder="Enter Lightning invoice"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-bitcoin outline-none transition-all h-32 font-mono"
                    value={invoice}
                    onChange={(e) => setInvoice(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setStep(1)}
                    disabled={!decoded}
                    className="flex items-center justify-center gap-2 w-full bg-bitcoin text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-bold disabled:opacity-50"
                  >
                    Next
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
                <h1 className="text-2xl font-bold text-gray-900">Confirm Payment</h1>
                <p className="text-gray-600">Review payment details</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">Amount</p>
                  <p className="text-gray-600">{decoded?.satoshis} sats</p>
                </div>

                {memo && (
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">Description</p>
                    <p className="text-gray-600">{memo}</p>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="font-medium text-gray-900">Expires</p>
                  <p className="text-gray-600">{decoded?.timeExpireDateString}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  disabled={status !== Status.None}
                  onClick={() => {
                    setStatus(Status.Paying);
                    getOrInitCachedWallet(walletId).then((cachedWallet) => {
                      cachedWallet.sparkWallet
                        .payLightningInvoice({ invoice })
                        .then(() => {
                          setStatus(Status.Syncing);
                          refreshWallet(walletId).then(() => {
                            router.push(`/wallets/${walletId}`);
                          });
                        });
                    });
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-bitcoin text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-bold disabled:opacity-50"
                >
                  {status === Status.Paying ? "Paying..." :
                   status === Status.Syncing ? "Syncing wallet..." :
                   "Confirm Payment"}
                </button>

                <button
                  onClick={() => setStep(0)}
                  className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-bold"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
