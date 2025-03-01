'use client';

import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { coinbaseProvider } from '@/lib/coinbaseWallet';

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  useEffect(() => {
    // Check if already connected
    coinbaseProvider?.send('eth_accounts', [])
      .then((accounts: string[]) => {
        if (accounts[0]) {
          setAddress(accounts[0]);
        }
      })
      .catch(console.error);
  }, []);

  const connectWallet = async () => {
    if (!coinbaseProvider) return;
    setIsConnecting(true);
    try {
      const accounts = await coinbaseProvider.send('eth_requestAccounts', []);
      if (accounts[0]) {
        setAddress(accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    setAddress(null);
  };
  
  const shortenAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  
  return (
    <button
      onClick={address ? disconnectWallet : connectWallet}
      disabled={isConnecting}
      className="
        group h-9
        px-4 py-1.5
        text-sm font-medium
        bg-gradient-to-r from-theme-button-primary/10 to-theme-button-hover/10
        text-theme-text-primary/90
        border border-theme-border-secondary
        rounded-full
        hover:border-theme-border-primary
        hover:text-theme-text-primary
        hover:from-theme-button-primary/20 hover:to-theme-button-hover/20
        transition-all duration-200
        hover:scale-[1.02]
        disabled:opacity-50
        disabled:cursor-not-allowed
        backdrop-blur-sm
        relative
      "
    >
      {isConnecting ? (
        "Connecting..."
      ) : address ? (
        <span className="flex items-center gap-2 relative pr-4">
          <FiberManualRecordIcon 
            className="text-green-400" 
            sx={{ fontSize: 8 }} 
          />
          <span className="relative">
            <span className="group-hover:opacity-0 transition-opacity duration-200">
              {shortenAddress(address)}
            </span>
            <span className="absolute left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Disconnect?
            </span>
          </span>
          <CloseIcon 
            className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
            sx={{ fontSize: 16 }}
          />
        </span>
      ) : (
        "Connect"
      )}
    </button>
  );
}