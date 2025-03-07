import React, { useState, useEffect } from 'react';
import { useRunesDex, SwapQuote, TokenInfo } from './RunesDexProvider';

interface TokenSwapProps {
  onSwapComplete?: (success: boolean) => void;
}

const TokenSwap: React.FC<TokenSwapProps> = ({ onSwapComplete }) => {
  const { supportedTokens, getQuote, executeSwap } = useRunesDex();
  
  const [inputToken, setInputToken] = useState<string>('BTC');
  const [outputToken, setOutputToken] = useState<string>('RUNE');
  const [inputAmount, setInputAmount] = useState<string>('0.01');
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [swapStatus, setSwapStatus] = useState<'idle' | 'quoting' | 'quoted' | 'swapping' | 'success' | 'failed'>('idle');

  // Get a fresh quote when inputs change
  useEffect(() => {
    // Only fetch if we have valid input
    if (!inputToken || !outputToken || !inputAmount || parseFloat(inputAmount) <= 0) {
      setQuote(null);
      return;
    }
    
    // Don't fetch a new quote if we're already in the process of swapping
    if (swapStatus === 'swapping') {
      return;
    }
    
    // Set a minimum amount threshold to avoid micro-quotes
    if (parseFloat(inputAmount) < 0.0001) {
      return;
    }
    
    // Create a reference to the current request to avoid race conditions
    const currentRequest = {
      inputToken,
      outputToken,
      amount: parseFloat(inputAmount)
    };
    
    const fetchQuote = async () => {
      setSwapStatus('quoting');
      setError(null);
      
      try {
        const newQuote = await getQuote(currentRequest.inputToken, currentRequest.outputToken, currentRequest.amount);
        
        // Only update if this is still the current request
        if (
          inputToken === currentRequest.inputToken && 
          outputToken === currentRequest.outputToken && 
          parseFloat(inputAmount) === currentRequest.amount
        ) {
          setQuote(newQuote);
          setSwapStatus('quoted');
        }
      } catch (err) {
        console.error('Failed to get quote:', err);
        setError(err instanceof Error ? err.message : 'Failed to get quote');
        setSwapStatus('idle');
      }
    };
    
    // Use a more aggressive debounce for better performance
    const handler = setTimeout(fetchQuote, 800);
    return () => clearTimeout(handler);
  }, [inputToken, outputToken, inputAmount, getQuote, swapStatus]);
  
  // Handle token swap
  const handleSwap = async () => {
    if (!quote) return;
    
    setSwapStatus('swapping');
    setError(null);
    
    try {
      const result = await executeSwap(quote);
      
      if (result.success) {
        setSwapStatus('success');
        if (onSwapComplete) onSwapComplete(true);
      } else {
        setSwapStatus('failed');
        setError('Swap failed. Please try again.');
        if (onSwapComplete) onSwapComplete(false);
      }
      
      // Reset after a few seconds
      setTimeout(() => {
        if (swapStatus === 'success') {
          setInputAmount('');
          setQuote(null);
        }
        setSwapStatus('idle');
      }, 3000);
      
    } catch (err) {
      console.error('Swap execution error:', err);
      setError(err instanceof Error ? err.message : 'Swap failed');
      setSwapStatus('failed');
      if (onSwapComplete) onSwapComplete(false);
    }
  };
  
  // Swap input and output tokens
  const handleSwitchTokens = () => {
    setInputToken(outputToken);
    setOutputToken(inputToken);
  };
  
  // Format number with specified decimals
  const formatNumber = (num: number, decimals: number = 8) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals
    });
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getTokenInfo = (symbol: string): TokenInfo | undefined => {
    return supportedTokens.find(t => t.symbol === symbol);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Swap Tokens</h2>
      
      {/* Input token */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-800 mb-1">From</label>
        <div className="flex items-center gap-2">
          <select
            className="w-1/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            disabled={swapStatus === 'swapping'}
          >
            {supportedTokens.map(token => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="w-2/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.001"
            disabled={swapStatus === 'swapping'}
          />
        </div>
      </div>
      
      {/* Switch button */}
      <div className="flex justify-center my-2">
        <button
          type="button"
          onClick={handleSwitchTokens}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          disabled={swapStatus === 'swapping'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Output token */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-800 mb-1">To</label>
        <div className="flex items-center gap-2">
          <select
            className="w-1/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            value={outputToken}
            onChange={(e) => setOutputToken(e.target.value)}
            disabled={swapStatus === 'swapping'}
          >
            {supportedTokens.map(token => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
          <div className="w-2/3 p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800">
            {quote ? formatNumber(quote.outputAmount) : '0.00'}
          </div>
        </div>
      </div>
      
      {/* Quote details */}
      {quote && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Exchange Rate:</span>
            <span className="text-gray-800 font-medium">
              1 {inputToken} = {formatNumber(quote.exchangeRate)} {outputToken}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Fee:</span>
            <span className="text-gray-800 font-medium">
              {formatNumber(quote.fee, 8)} {inputToken}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Slippage Tolerance:</span>
            <span className="text-gray-800 font-medium">{quote.slippage}%</span>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
          {error}
        </div>
      )}
      
      {/* Swap button */}
      <button
        type="button"
        onClick={handleSwap}
        disabled={!quote || swapStatus === 'swapping' || swapStatus === 'quoting'}
        className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
          !quote || swapStatus === 'swapping' || swapStatus === 'quoting'
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : swapStatus === 'success'
            ? 'bg-green-600 text-white hover:bg-green-700'
            : swapStatus === 'failed'
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {swapStatus === 'swapping' ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Swap
          </span>
        ) : swapStatus === 'quoting' ? (
          'Getting Quote...'
        ) : swapStatus === 'success' ? (
          'Swap Successful!'
        ) : swapStatus === 'failed' ? (
          'Swap Failed'
        ) : (
          `Swap ${inputAmount} ${inputToken} for ${quote ? formatNumber(quote.outputAmount) : '0.00'} ${outputToken}`
        )}
      </button>
    </div>
  );
};

export default TokenSwap; 