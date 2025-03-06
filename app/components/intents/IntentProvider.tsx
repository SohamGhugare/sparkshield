import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our intent system
export interface IntentParameters {
  coverageAmount?: number;
  duration?: number;
  premium?: number;
  policyId?: string;
  amount?: number;
  evidence?: string;
  lockPeriod?: number;
  poolId?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface Intent {
  id: string;
  type: 'coverage' | 'claim' | 'staking';
  parameters: IntentParameters;
  sourceChain: string;
  targetChain: string;
  status: 'pending' | 'resolved' | 'failed';
  solver?: string;
  createdAt: number;
}

export interface IntentResolution {
  status: string;
  reason: string;
  payout?: number;
  [key: string]: string | number | boolean | undefined;
}

interface IntentContextType {
  intents: Intent[];
  createIntent: (intentData: Omit<Intent, 'id' | 'status' | 'createdAt'>) => Promise<Intent>;
  resolveIntent: (intentId: string, resolution: IntentResolution) => Promise<boolean>;
  getIntentById: (intentId: string) => Intent | undefined;
  pendingIntents: Intent[];
  loading: boolean;
}

// Create context with default values
const IntentContext = createContext<IntentContextType>({
  intents: [],
  createIntent: async () => ({ 
    id: '', 
    type: 'coverage', 
    parameters: {}, 
    sourceChain: '', 
    targetChain: '', 
    status: 'pending', 
    createdAt: Date.now() 
  }),
  resolveIntent: async () => false,
  getIntentById: () => undefined,
  pendingIntents: [],
  loading: false,
});

// Mock NEAR Intents API for now
const mockNearIntentsApi = {
  create: async (intentData: Omit<Intent, 'id' | 'status' | 'createdAt'>): Promise<Intent> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: `intent_${Date.now()}`,
      ...intentData,
      status: 'pending',
      createdAt: Date.now(),
    };
  },
  
  resolve: async (intentId: string, resolution: IntentResolution): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // We're not using the parameters in this mock implementation,
    // but we're keeping them to match a real API signature
    console.log(`Resolving intent ${intentId} with resolution:`, resolution);
    
    return true;
  },
  
  getIntents: async (): Promise<Intent[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [];
  }
};

interface IntentProviderProps {
  children: ReactNode;
}

export const IntentProvider: React.FC<IntentProviderProps> = ({ children }) => {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load intents on component mount
    const loadIntents = async () => {
      try {
        setLoading(true);
        const loadedIntents = await mockNearIntentsApi.getIntents();
        setIntents(loadedIntents);
      } catch (error) {
        console.error('Failed to load intents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIntents();
  }, []);

  const createIntent = async (intentData: Omit<Intent, 'id' | 'status' | 'createdAt'>): Promise<Intent> => {
    try {
      const newIntent = await mockNearIntentsApi.create(intentData);
      setIntents(prev => [...prev, newIntent]);
      return newIntent;
    } catch (error) {
      console.error('Failed to create intent:', error);
      throw error;
    }
  };

  const resolveIntent = async (intentId: string, resolution: IntentResolution): Promise<boolean> => {
    try {
      const success = await mockNearIntentsApi.resolve(intentId, resolution);
      
      if (success) {
        setIntents(prev => 
          prev.map(intent => 
            intent.id === intentId 
              ? { 
                  ...intent, 
                  status: 'resolved' as const,
                  reason: resolution.reason,
                  payout: resolution.payout
                } 
              : intent
          )
        );
      }
      
      return success;
    } catch (error) {
      console.error('Failed to resolve intent:', error);
      
      // Update the intent status to failed
      setIntents(prev => 
        prev.map(intent => 
          intent.id === intentId 
            ? { ...intent, status: 'failed' } 
            : intent
        )
      );
      
      return false;
    }
  };

  const getIntentById = (intentId: string): Intent | undefined => {
    return intents.find(intent => intent.id === intentId);
  };

  const pendingIntents = intents.filter(intent => intent.status === 'pending');

  return (
    <IntentContext.Provider 
      value={{ 
        intents, 
        createIntent, 
        resolveIntent, 
        getIntentById, 
        pendingIntents,
        loading
      }}
    >
      {children}
    </IntentContext.Provider>
  );
};

// Custom hook to use the intent context
export const useIntents = () => useContext(IntentContext); 