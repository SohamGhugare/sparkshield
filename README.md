# SparkShield: Bitcoin-Native Parametric Insurance Protocol

SparkShield is a decentralized insurance protocol built on the Spark Network, a Bitcoin Layer 2 solution. It enables instant, low-fee parametric insurance products while maintaining self-custody principles.

## Technical Architecture

### Core Components

1. **Spark Network Integration**
   - Built directly on Spark's Layer 2 network
   - Leverages Spark's instant finality and near-zero fees
   - Uses native Bitcoin for settlements and staking
   - Maintains self-custody through Spark's security model

2. **Smart Claim System**
   - Automated claims verification
   - Instant payouts
   - Pool management and staking

3. **Wallet Integration**
   - Self-custodial Spark wallet integration
   - Multi-wallet support
   - Persistent wallet sessions
   - Secure key management

### Code Structure

```typescript
project/
├── app/
│   ├── components/
│   │   ├── insurance/        # Insurance buyer components
│   │   ├── capital/          # Capital provider components
│   │   └── WalletContext.tsx # Wallet management
│   ├── insurance-buyer/      # Insurance buyer pages
│   ├── capital-provider/     # Capital provider pages
│   └── wallets/             # Wallet management pages
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
     } | null;
     connect: () => void;
     disconnect: () => void;
     selectWallet: (walletId: string) => Promise<void>;
   }
   ```

2. **Insurance Claims**
   ```typescript
   interface Claim {
     id: string;
     policyId: string;
     amount: number;
     evidence: string;
     status: 'pending' | 'approved' | 'rejected';
     timestamp: number;
   }
   ```

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

1. **Additional Insurance Products**
   - Multi-signature policies
   - Cross-chain coverage
   - Custom trigger conditions

2. **Enhanced Staking Features**
   - Variable lock periods
   - Stake delegation
   - Automated rebalancing

3. **Protocol Improvements**
   - Governance implementation
   - DAO integration
   - Advanced risk modeling
