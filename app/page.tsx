'use client';

import { FeatureCard } from './components/FeatureCard';
import { UserTypeCard } from './components/UserTypeCard';
import Link from 'next/link';

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
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-700">
              <span>Powered by</span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="text-orange-600 inline-block hover:scale-105 transition-transform bg-orange-50 px-4 py-2 rounded-lg shadow-sm">
                  Spark
                </span>
                <span className="text-gray-700">&</span>
                <span className="text-purple-600 inline-block hover:scale-105 transition-transform bg-purple-50 px-4 py-2 rounded-lg shadow-sm">
                  Runes DEX
                </span>
              </div>
            </div>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            SparkShield is a Bitcoin-native parametric insurance protocol built directly on Spark. It leverages Spark&apos;s instant transaction capabilities and low fees to provide innovative insurance solutions for Bitcoin holders and businesses while maintaining self-custody principles.
          </p>
          <p className="text-lg md:text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
            With Runes DEX integration powered by NEAR Intents, SparkShield enables seamless token swaps, cross-chain insurance products, and unified liquidity across multiple blockchains.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/intents" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md">
              Explore NEAR Intents Dashboard
            </Link>
            <Link href="/runes-dex" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md">
              Try Runes DEX
            </Link>
          </div>
        </div>

        {/* User Type Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
          <UserTypeCard
            title="Insurance Buyer"
            description="Protect your assets with customizable coverage options and instant quotes. Cross-chain coverage powered by NEAR Intents."
            buttonText="Get Coverage"
            redirectPath="/insurance-buyer"
          />
          <UserTypeCard
            title="Capital Provider"
            description="Earn yields by providing liquidity to insurance pools with flexible staking options. Access unified liquidity across multiple chains."
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
            description="Ultra-efficient Bitcoin Layer 2 enabling instant, near-zero fee transactions"
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
          <FeatureCard
            title="Cross-Chain Coverage"
            description="Seamlessly protect assets across Bitcoin, NEAR, and other blockchains with unified policies"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" d="M8 12h8M12 16V8M3 12h2M19 12h2"/>
                <circle cx="12" cy="12" r="9" strokeWidth="2"/>
              </svg>
            }
          />
          <FeatureCard
            title="AI-Powered Claims"
            description="Intelligent claim verification and automated payouts using NEAR Intents and AI agents"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" d="M12 8v4l3 3M12 2a10 10 0 100 20 10 10 0 000-20z"/>
                <path strokeWidth="2" d="M17 17l3 3M21 12h-2M12 21v-2M3 12h2M12 3v2"/>
              </svg>
            }
          />
          <FeatureCard
            title="Unified Liquidity"
            description="Access combined liquidity pools across multiple chains for better capital efficiency"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364"/>
              </svg>
            }
          />
        </div>
        
        {/* Runes DEX Integration Highlight Section */}
        <div className="mt-24 bg-gradient-to-br from-purple-50 to-blue-100 rounded-xl p-8 shadow-md border border-purple-200">
          <h2 className="text-3xl font-bold text-center mb-8 text-purple-800">Runes DEX Integration with NEAR Intents</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-purple-700">Seamless Token Swaps</h3>
              <p className="text-gray-700">
                Runes DEX enables automatic token conversion when you don&apos;t have the exact token needed for insurance operations,
                with optimal routing and fair rates powered by NEAR Intents.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-purple-700">Cross-Chain Capabilities</h3>
              <p className="text-gray-700">
                Swap tokens seamlessly between Bitcoin, NEAR, and other chains with atomic settlement,
                providing a unified interface for multi-chain insurance products.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-purple-700">Enhanced User Experience</h3>
              <p className="text-gray-700">
                Enjoy cross-chain settlement in seconds regardless of native asset chain, with simplified 
                user flows through intent-based interactions and reduced complexity.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-purple-700">Expanded Market Access</h3>
              <p className="text-gray-700">
                Access combined liquidity from DEXs across chains and CEXs, with broader capital pools 
                for insurance backing and increased participation from diverse ecosystems.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/runes-dex" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md">
              Try Runes DEX Now
            </Link>
          </div>
        </div>

       
      </div>
    </div>
  );
}
