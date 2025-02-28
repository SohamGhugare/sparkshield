'use client';

import { FeatureCard } from './components/FeatureCard';
import { UserTypeCard } from './components/UserTypeCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="flex flex-col gap-6 mb-10">
            <span className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight">
              Decentralized Insurance
            </span>
            <div className="flex items-center justify-center gap-4 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-700">
              Powered by{" "}
              <span className="text-bitcoin inline-block hover:scale-105 transition-transform bg-orange-50 px-4 py-2 rounded-lg">
                Spark
              </span>
            </div>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
            SparkShield is a Bitcoin-native parametric insurance protocol built directly on Spark. It leverages Spark&apos;s instant transaction capabilities and low fees to provide innovative insurance solutions for Bitcoin holders and businesses while maintaining self-custody principles.
          </p>
        </div>

        {/* User Type Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
          <UserTypeCard
            title="Insurance Buyer"
            description="Protect your assets with customizable coverage options and instant quotes."
            buttonText="Get Coverage"
            redirectPath="/insurance-buyer"
          />
          <UserTypeCard
            title="Capital Provider"
            description="Earn yields by providing liquidity to insurance pools with flexible staking options."
            buttonText="Provide Capital"
            redirectPath="/capital-provider"
          />
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Capital Providers"
            description="Provide liquidity in BTC or stablecoins to earn yields on insurance premiums"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect width="18" height="20" x="3" y="2" rx="2" strokeWidth="2"/>
                <path strokeWidth="2" d="M12 11V14M8 11V14M16 11V14"/>
              </svg>
            }
          />
          <FeatureCard
            title="Spark Network"
            description="Ultra-efficient Bitcoint Layer 2 enabling instant, near-zero fee transactions"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" d="M4 20L8 16L12 20L20 12M20 12V16M20 12H16"/>
              </svg>
            }
          />
          <FeatureCard
            title="Insurance Buyers"
            description="Purchase parametric coverage with instant activation and automatic payouts"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" d="M4 6h16M4 10h16M4 14h8"/>
                <path strokeWidth="2" d="M14 18l3-3 3 3m-3-3v8"/>
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}
