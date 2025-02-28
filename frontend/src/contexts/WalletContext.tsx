'use client';

import { createContext, useContext, useState } from 'react';
import { coinbaseProvider } from '@/lib/coinbaseWallet';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  ensName: string | null;
}

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isConnecting: boolean;
  error: Error | null;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  chainId: null,
  ensName: null,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  isConnecting: false,
  error: null,
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    ensName: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (!coinbaseProvider) {
        throw new Error('Coinbase Wallet provider not initialized');
      }

      const accounts = await coinbaseProvider.send('eth_requestAccounts', []) as string[];
      
      if (accounts[0]) {
        const chainId = await coinbaseProvider.send('eth_chainId', []) as string;

        setState({
          address: accounts[0],
          isConnected: true,
          chainId: parseInt(chainId, 16),
          ensName: null,
        });
      }
    } catch (err) {
      console.error('Failed to connect Coinbase wallet:', err);
      setError(err instanceof Error ? err : new Error('Failed to connect wallet'));
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    setState({
      address: null,
      isConnected: false,
      chainId: null,
      ensName: null,
    });
  };

  const value = {
    ...state,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}