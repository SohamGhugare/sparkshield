"use client";

import { useParams } from "next/navigation";
import { FaBitcoin, FaBolt, FaStar, FaArrowRight } from "react-icons/fa";

export default function WalletReceive() {
  const params = useParams();
  const walletId = params.walletId as string;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Receive Funds</h1>
            <p className="text-gray-600 mb-8">Choose how you want to receive funds</p>

            <div className="space-y-3">
              <button
                onClick={() => window.location.href = `/wallets/${walletId}/deposit-btc`}
                className="flex items-center justify-between w-full bg-orange-50 text-bitcoin p-4 rounded-xl hover:bg-orange-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <FaBitcoin className="h-6 w-6 text-bitcoin" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Deposit from Bitcoin</p>
                    <p className="text-sm text-gray-600">Receive BTC from a Bitcoin address</p>
                  </div>
                </div>
                <FaArrowRight className="h-4 w-4 text-gray-400 group-hover:text-bitcoin transition-colors" />
              </button>

              <button
                onClick={() => window.location.href = `/wallets/${walletId}/receive-ln`}
                className="flex items-center justify-between w-full bg-orange-50 text-bitcoin p-4 rounded-xl hover:bg-orange-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <FaBolt className="h-6 w-6 text-bitcoin" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Receive on Lightning</p>
                    <p className="text-sm text-gray-600">Generate Lightning Network invoice</p>
                  </div>
                </div>
                <FaArrowRight className="h-4 w-4 text-gray-400 group-hover:text-bitcoin transition-colors" />
              </button>

              <button
                onClick={() => window.location.href = `/wallets/${walletId}/receive-spark`}
                className="flex items-center justify-between w-full bg-orange-50 text-bitcoin p-4 rounded-xl hover:bg-orange-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <FaStar className="h-6 w-6 text-bitcoin" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Receive on Spark</p>
                    <p className="text-sm text-gray-600">Receive from another Spark wallet</p>
                  </div>
                </div>
                <FaArrowRight className="h-4 w-4 text-gray-400 group-hover:text-bitcoin transition-colors" />
              </button>

              <button
                onClick={() => window.location.href = `/wallets/${walletId}`}
                className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-bold mt-6"
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
