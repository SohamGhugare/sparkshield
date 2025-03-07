import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useIntents } from '../intents/IntentProvider';

// Define types for Runes DEX
export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  logoUrl: string;
  address?: string; // Optional for native tokens
}

export interface SwapQuote {
  inputToken: TokenInfo;
  outputToken: TokenInfo;
  inputAmount: number;
  outputAmount: number;
  exchangeRate: number;
  fee: number;
  slippage: number;
  route: string[];
  expiresAt: number;
  intentId?: string; // Store the associated intent ID
}

export interface SwapResult {
  success: boolean;
  txHash?: string;
  inputAmount: number;
  outputAmount: number;
  timestamp: number;
  intentId?: string;
}

interface RunesDexContextType {
  supportedTokens: TokenInfo[];
  getQuote: (inputToken: string, outputToken: string, amount: number) => Promise<SwapQuote>;
  executeSwap: (quote: SwapQuote) => Promise<SwapResult>;
  swapHistory: SwapResult[];
  loading: boolean;
}

// Create context with default values
const RunesDexContext = createContext<RunesDexContextType>({
  supportedTokens: [],
  getQuote: async () => ({
    inputToken: { symbol: '', name: '', decimals: 0, logoUrl: '' },
    outputToken: { symbol: '', name: '', decimals: 0, logoUrl: '' },
    inputAmount: 0,
    outputAmount: 0,
    exchangeRate: 0,
    fee: 0,
    slippage: 0.5,
    route: [],
    expiresAt: 0
  }),
  executeSwap: async () => ({
    success: false,
    inputAmount: 0,
    outputAmount: 0,
    timestamp: 0
  }),
  swapHistory: [],
  loading: false
});

// Mock tokens
const mockTokens: TokenInfo[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    decimals: 8,
    logoUrl: '/images/tokens/btc.png'
  },
  {
    symbol: 'RUNE',
    name: 'Rune',
    decimals: 8,
    logoUrl: '/images/tokens/rune.png'
  },
  {
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    decimals: 24,
    logoUrl: '/images/tokens/near.png',
    address: 'near.near'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoUrl: '/images/tokens/eth.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoUrl: '/images/tokens/usdc.png'
  }
];

// Mock exchange rates (relative to BTC)
const mockExchangeRates: Record<string, number> = {
  BTC: 1,
  RUNE: 0.00005,
  NEAR: 0.000025,
  ETH: 0.05,
  USDC: 0.000025
};

interface RunesDexProviderProps {
  children: ReactNode;
}

export const RunesDexProvider: React.FC<RunesDexProviderProps> = ({ children }) => {
  const { createIntent, resolveIntent, intents } = useIntents();
  const [swapHistory, setSwapHistory] = useState<SwapResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Quote cache to reduce redundant API calls
  const [quoteCache, setQuoteCache] = useState<Record<string, {quote: SwapQuote, timestamp: number}>>({});

  // Load swap history from intents
  useEffect(() => {
    // Find all swap intents and convert them to swap history
    const swapIntents = intents.filter(intent => intent.type === 'swap');
    
    const swapResults: SwapResult[] = swapIntents.map(intent => ({
      success: intent.status === 'resolved',
      txHash: `tx_${intent.id.substring(0, 8)}`,
      inputAmount: intent.parameters.inputAmount as number || 0,
      outputAmount: intent.parameters.outputAmount as number || 0,
      timestamp: intent.createdAt,
      intentId: intent.id
    }));
    
    setSwapHistory(swapResults);
  }, [intents]);

  // Get a quote for swapping tokens
  const getQuote = async (inputToken: string, outputToken: string, amount: number): Promise<SwapQuote> => {
    setLoading(true);
    
    try {
      // Create a cache key
      const cacheKey = `${inputToken}-${outputToken}-${amount.toFixed(8)}`;
      
      // Check if we have a recent cached quote (less than 10 seconds old)
      const cachedQuote = quoteCache[cacheKey];
      if (cachedQuote && Date.now() - cachedQuote.timestamp < 10000) {
        return cachedQuote.quote;
      }
      
      // Create a quote intent to simulate getting a quote from the network
      const quoteIntent = await createIntent({
        type: 'quote',
        sourceChain: getChainForToken(inputToken),
        targetChain: getChainForToken(outputToken),
        parameters: {
          inputToken,
          outputToken,
          amount
        }
      });
      
      const input = mockTokens.find(t => t.symbol === inputToken);
      const output = mockTokens.find(t => t.symbol === outputToken);
      
      if (!input || !output) {
        throw new Error('Token not supported');
      }
      
      // Calculate exchange rate and output amount
      const inputRate = mockExchangeRates[inputToken];
      const outputRate = mockExchangeRates[outputToken];
      const exchangeRate = inputRate / outputRate;
      
      // Apply a random fee between 0.1% and 0.5%
      const fee = amount * (0.1 + Math.random() * 0.4) / 100;
      const outputAmount = (amount - fee) * exchangeRate;
      
      const quote = {
        inputToken: input,
        outputToken: output,
        inputAmount: amount,
        outputAmount,
        exchangeRate,
        fee,
        slippage: 0.5, // Default slippage tolerance
        route: [inputToken, outputToken], // Direct route
        expiresAt: Date.now() + 60000, // Quote expires in 1 minute
        intentId: quoteIntent.id // Store the intent ID for reference
      };
      
      // Cache the quote
      setQuoteCache(prev => ({
        ...prev,
        [cacheKey]: {
          quote,
          timestamp: Date.now()
        }
      }));
      
      // Resolve the quote intent
      await resolveIntent(quoteIntent.id, {
        status: 'approved',
        reason: 'Quote generated successfully',
        outputAmount
      });
      
      return quote;
    } finally {
      setLoading(false);
    }
  };
  
  // Execute a token swap
  const executeSwap = async (quote: SwapQuote): Promise<SwapResult> => {
    setLoading(true);
    
    try {
      // Check if quote is expired
      if (Date.now() > quote.expiresAt) {
        throw new Error('Quote expired');
      }
      
      // Create a swap intent using NEAR Intents
      const swapIntent = await createIntent({
        type: 'swap',
        sourceChain: getChainForToken(quote.inputToken.symbol),
        targetChain: getChainForToken(quote.outputToken.symbol),
        parameters: {
          inputToken: quote.inputToken.symbol,
          outputToken: quote.outputToken.symbol,
          inputAmount: quote.inputAmount,
          outputAmount: quote.outputAmount,
          slippage: quote.slippage,
          quoteId: quote.intentId
        }
      });
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Apply slippage (randomly get a slightly better or worse rate)
      const slippageAdjustment = 1 + (Math.random() * quote.slippage * 2 - quote.slippage) / 100;
      const finalOutputAmount = quote.outputAmount * slippageAdjustment;
      
      // Resolve the swap intent
      await resolveIntent(swapIntent.id, {
        status: 'approved',
        reason: 'Swap executed successfully',
        outputAmount: finalOutputAmount
      });
      
      // Create swap result
      const result: SwapResult = {
        success: true,
        txHash: `tx_${swapIntent.id.substring(0, 8)}`,
        inputAmount: quote.inputAmount,
        outputAmount: finalOutputAmount,
        timestamp: Date.now(),
        intentId: swapIntent.id
      };
      
      return result;
    } catch (error) {
      console.error('Swap failed:', error);
      
      return {
        success: false,
        inputAmount: quote.inputAmount,
        outputAmount: 0,
        timestamp: Date.now()
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to determine chain for a token
  const getChainForToken = (tokenSymbol: string): string => {
    switch (tokenSymbol) {
      case 'BTC':
        return 'bitcoin';
      case 'NEAR':
        return 'near';
      case 'ETH':
        return 'ethereum';
      default:
        return 'near'; // Default to NEAR for other tokens
    }
  };

  return (
    <RunesDexContext.Provider
      value={{
        supportedTokens: mockTokens,
        getQuote,
        executeSwap,
        swapHistory,
        loading
      }}
    >
      {children}
    </RunesDexContext.Provider>
  );
};

// Custom hook to use the Runes DEX context
export const useRunesDex = () => useContext(RunesDexContext); 