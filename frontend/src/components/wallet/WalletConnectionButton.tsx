'use client';

import { useWallet } from "@/contexts/WalletContext";
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function WalletConnect() {
  const { 
    connectWallet, 
    disconnectWallet, 
    isConnecting, 
    isConnected,
    address 
  } = useWallet();
  
  const shortenAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  return (
    <button
      onClick={isConnected ? disconnectWallet : connectWallet}
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
      ) : isConnected ? (
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