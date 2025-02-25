'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useWalletConnect } from '@/hooks/wallets/useWalletConnect';
import { useWalletDisconnect } from '@/hooks/wallets/useWalletDisconnect';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';

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

  const { connectWallet, isConnecting, error } = useWalletConnect();
  const { disconnectWallet } = useWalletDisconnect();
  const account = useActiveAccount();
  const chain = useActiveWalletChain();

  useEffect(() => {
    if (account) {
      setState({
        address: account.address || null,
        isConnected: true,
        chainId: chain?.id || null,
        ensName: null,
      });
    } else {
      setState({
        address: null,
        isConnected: false,
        chainId: null,
        ensName: null,
      });
    }
  }, [account, chain]);

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