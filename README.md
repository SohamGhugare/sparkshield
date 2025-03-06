# SparkShield: Bitcoin-Native Parametric Insurance Protocol

SparkShield is a decentralized insurance protocol built on the Spark Network, a Bitcoin Layer 2 solution, with NEAR Intents integration. It enables instant, low-fee parametric insurance products while maintaining self-custody principles and leveraging cross-chain capabilities.

## Technical Architecture

### Core Components

1. **Spark Network Integration**
   - Built directly on Spark's Layer 2 network
   - Leverages Spark's instant finality and near-zero fees
   - Uses native Bitcoin for settlements and staking
   - Maintains self-custody through Spark's security model

2. **NEAR Intents Integration**
   - Cross-chain asset management and settlement
   - AI-powered intent resolution for insurance claims
   - Unified liquidity across multiple chains
   - Secure handling of diverse asset types

3. **Smart Claim System**
   - Automated claims verification
   - Instant payouts
   - Pool management and staking
   - Intent-based claim resolution

4. **Wallet Integration**
   - Self-custodial Spark wallet integration
   - Multi-wallet support including NEAR wallet
   - Persistent wallet sessions
   - Secure key management

### Code Structure

```
project/
├── app/
│   ├── components/
│   │   ├── insurance/        # Insurance buyer components
│   │   ├── capital/          # Capital provider components
│   │   ├── intents/          # NEAR Intents components
│   │   └── WalletContext.tsx # Wallet management
│   ├── insurance-buyer/      # Insurance buyer pages
│   ├── capital-provider/     # Capital provider pages
│   ├── intents/              # NEAR Intents integration
│   └── wallets/              # Wallet management pages
```

### Key Features

1. **Insurance Products**
   ```typescript
   interface InsuranceProduct {
     id: string;
     name: string;
     coverageAmount: number;
     premium: number;
     duration: number;
     triggers: TriggerCondition[];
     intentEnabled: boolean;    // NEAR Intents support flag
   }
   ```

2. **Staking Pools**
   ```typescript
   interface StakingPool {
     id: string;
     totalStaked: number;
     apy: number;
     lockupPeriod: number;
     utilizationRate: number;
     crossChainEnabled: boolean; // Cross-chain staking via NEAR Intents
   }
   ```

3. **NEAR Intents Integration**
   ```typescript
   interface InsuranceIntent {
     id: string;
     type: 'coverage' | 'claim' | 'staking';
     parameters: Record<string, any>;
     sourceChain: string;
     targetChain: string;
     status: 'pending' | 'resolved' | 'failed';
     solver?: string;
   }
   ```

### Technical Implementation

1. **Wallet Management**
   ```typescript
   interface WalletContextType {
     isConnected: boolean;
     selectedWallet: {
       id: string;
       pubkey: string;
       balance: bigint;
       chain: 'bitcoin' | 'near' | 'ethereum';
     } | null;
     connect: () => void;
     disconnect: () => void;
     selectWallet: (walletId: string) => Promise<void>;
   }
   ```

   **Spark Wallet Integration**
   ```typescript
   // Initialize a Spark wallet
   const sparkWallet = await SparkWallet.init({
     network: process.env.SPARK_NETWORK,
     mnemonic: storedMnemonic
   });

   // Get wallet balance
   const balance = await sparkWallet.getBalance();
   
   // Send payment
   const paymentResult = await sparkWallet.sendPayment({
     destination: recipientPubkey,
     amount: amountInSats,
     memo: "Insurance premium payment"
   });

   // Listen for incoming payments
   sparkWallet.on('payment', async (payment) => {
     if (payment.type === 'claim_payout') {
       await processPayout(payment);
     }
   });
   ```

2. **NEAR Intents Implementation**
   ```typescript
   // Create an insurance intent
   const createInsuranceIntent = async (params) => {
     const intent = await nearIntents.create({
       type: 'insurance_coverage',
       parameters: {
         coverageAmount: params.amount,
         duration: params.duration,
         premium: params.premium,
         triggers: params.triggers
       },
       sourceChain: 'near',
       targetChain: 'bitcoin'
     });
     
     return intent;
   };
   
   // Resolve an insurance claim intent
   const resolveClaimIntent = async (claimIntent) => {
     // AI-powered claim verification
     const verificationResult = await aiVerifier.verify(claimIntent.evidence);
     
     if (verificationResult.valid) {
       return nearIntents.resolve(claimIntent.id, {
         status: 'approved',
         payout: claimIntent.parameters.coverageAmount
       });
     }
     
     return nearIntents.resolve(claimIntent.id, {
       status: 'rejected',
       reason: verificationResult.reason
     });
   };
   ```

3. **Insurance Claims**
   ```typescript
   interface Claim {
     id: string;
     policyId: string;
     amount: number;
     evidence: string;
     status: 'pending' | 'approved' | 'rejected';
     timestamp: number;
     intentId?: string; // Reference to NEAR Intent if processed via intents
   }
   ```

### NEAR Intents Integration Benefits

SparkShield leverages NEAR Intents to provide several key advantages:

1. **Cross-Chain Capabilities**
   - Seamless asset transfers between Bitcoin, NEAR, and other chains
   - Unified liquidity across multiple blockchains
   - Single interface for multi-chain insurance products

2. **AI-Powered Claim Resolution**
   - Intelligent claim verification using AI agents
   - Automated intent resolution for faster payouts
   - Enhanced fraud detection through AI analysis

3. **Enhanced User Experience**
   - Cross-chain settlement in seconds regardless of native asset chain
   - Simplified user flows through intent-based interactions
   - Reduced complexity for end users

4. **Expanded Market Access**
   - Combined liquidity from DEXs across chains and CEXs
   - Access to broader capital pools for insurance backing
   - Increased participation from diverse ecosystems

### Spark Network Integration

SparkShield leverages several key features of the Spark Network:

1. **Transaction Processing**
   - Instant finality for quick policy activation
   - Near-zero fees for cost-effective operations
   - Native Bitcoin integration

2. **Security Model**
   - Bitcoin-level security inheritance
   - Self-custodial design
   - Trustless operation

### Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```env
   SPARK_NETWORK=testnet
   NEAR_NETWORK=testnet
   NEAR_INTENTS_API_KEY=your_api_key
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

### Testing

Run the test suite:
```bash
npm test 
npm run build
npm run deploy
```

## Future Developments

1. **Advanced NEAR Intents Integration**
   - Intent-based insurance marketplaces
   - AI agent networks for risk assessment
   - Cross-chain insurance pools with dynamic pricing

2. **Additional Insurance Products**
   - Multi-signature policies
   - Cross-chain coverage
   - Custom trigger conditions

3. **Enhanced Staking Features**
   - Variable lock periods
   - Stake delegation
   - Automated rebalancing

4. **Protocol Improvements**
   - Governance implementation
   - DAO integration
   - Advanced risk modeling
