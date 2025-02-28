"use client";

import { useState } from "react";
import { validateMnemonic } from "bip39";
import { useRouter } from "next/navigation";
import { FaKey } from "react-icons/fa";
import { addStoredWallet } from "@/app/storage";

export default function RecoverWallet() {
  const [mnemonic, setMnemonic] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-50 rounded-lg">
                <FaKey className="h-6 w-6 text-bitcoin" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recover Wallet</h1>
                <p className="text-gray-600">Enter your mnemonic phrase to recover your wallet</p>
              </div>
            </div>

            <div className="space-y-4">
              <textarea
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                className="font-mono p-4 border border-gray-200 rounded-xl w-full h-32 text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-bitcoin outline-none transition-all"
                placeholder="Enter your 12-word recovery phrase..."
              />

              <div className="space-y-3 pt-4">
                <button
                  onClick={() => {
                    if (!validateMnemonic(mnemonic)) {
                      alert("Invalid mnemonic phrase.");
                      return;
                    }
                    addStoredWallet(mnemonic);
                    router.push("/wallets");
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-bitcoin text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-bold"
                >
                  Recover Wallet
                </button>
                
                <button
                  onClick={() => router.push("/wallets")}
                  className="flex items-center justify-center gap-2 w-full bg-orange-50 text-bitcoin py-3 px-4 rounded-xl hover:bg-orange-100 transition-colors font-bold"
                >
                  Back to Wallets
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
