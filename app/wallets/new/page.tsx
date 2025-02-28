"use client";

import { useEffect, useState } from "react";
import { generateMnemonic } from "bip39";
import { useRouter } from "next/navigation";
import { FaWallet, FaArrowRight } from "react-icons/fa";
import { addStoredWallet } from "@/app/storage";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function prettyIndex(index: number) {
  switch (index) {
    case 1: return "1st";
    case 2: return "2nd";
    case 3: return "3rd";
    default: return `${index}th`;
  }
}

export default function NewWallet() {
  const [mnemonic, setMnemonic] = useState("");
  const [copyText, setCopyText] = useState("Copy to clipboard");
  const [step, setStep] = useState(0);
  const router = useRouter();

  const [index1, setIndex1] = useState(0);
  const [word1, setWord1] = useState("");
  const [index2, setIndex2] = useState(0);
  const [word2, setWord2] = useState("");

  useEffect(() => {
    setMnemonic(generateMnemonic());
    const i1 = getRandomInt(1, 12);
    setIndex1(i1);
    let index2Candidate = getRandomInt(1, 12);
    while (index2Candidate === i1) {
      index2Candidate = getRandomInt(1, 12);
    }
    setIndex2(index2Candidate);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-50 rounded-lg">
                <FaWallet className="h-6 w-6 text-bitcoin" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Wallet</h1>
                <p className="text-gray-600">Set up your SparkShield wallet</p>
              </div>
            </div>

            <div className="space-y-6">
              {step === -1 ? (
                <div className="text-center space-y-4">
                  <p className="text-red-500">
                    Incorrect word entered. For security reasons, we&apos;ll generate a new mnemonic phrase.
                  </p>
                  <button
                    onClick={() => location.reload()}
                    className="flex items-center justify-center gap-2 w-full bg-bitcoin text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-bold"
                  >
                    Start Over
                  </button>
                </div>
              ) : step === 0 ? (
                <>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg text-bitcoin">
                      <p className="font-medium">Important Security Notice</p>
                      <p className="text-sm text-gray-600">
                        Don&apos;t forget to save your recovery phrase!
                      </p>
                    </div>
                    
                    <textarea
                      value={mnemonic}
                      className="font-mono p-4 border border-gray-200 rounded-xl w-full h-32 text-gray-900 bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(mnemonic).then(() => {
                          setCopyText("Copied!");
                          setTimeout(() => setCopyText("Copy to clipboard"), 2000);
                        });
                      }}
                      className="flex items-center justify-center gap-2 w-full bg-orange-50 text-bitcoin py-3 px-4 rounded-xl hover:bg-orange-100 transition-colors font-bold"
                    >
                      {copyText}
                    </button>
                    
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center justify-center gap-2 w-full bg-bitcoin text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-bold"
                    >
                      Continue <FaArrowRight />
                    </button>
                  </div>
                </>
              ) : step === 1 || step === 2 ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Please verify your recovery phrase by entering the {step === 1 ? prettyIndex(index1) : prettyIndex(index2)} word:
                  </p>
                  
                  <input
                    type="text"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-bitcoin outline-none transition-all"
                    value={step === 1 ? word1 : word2}
                    onChange={(e) => step === 1 ? setWord1(e.target.value) : setWord2(e.target.value)}
                    placeholder={`Enter the ${step === 1 ? prettyIndex(index1) : prettyIndex(index2)} word`}
                  />
                  
                  <button
                    onClick={() => {
                      if (step === 1) {
                        if (mnemonic.split(" ")[index1 - 1] === word1) {
                          setStep(2);
                        } else {
                          setStep(-1);
                        }
                      } else {
                        if (mnemonic.split(" ")[index2 - 1] === word2) {
                          addStoredWallet(mnemonic);
                          router.push("/wallets");
                        } else {
                          setStep(-1);
                        }
                      }
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-bitcoin text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-bold"
                  >
                    {step === 1 ? "Next" : "Create Wallet"}
                  </button>
                </div>
              ) : null}

              <button
                onClick={() => router.push("/wallets")}
                className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-bold"
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
