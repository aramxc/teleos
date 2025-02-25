'use client';

import { useDisconnect, useActiveWallet } from "thirdweb/react";

export function useWalletDisconnect() {
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  const handleDisconnect = async () => {
    if (wallet) {
      try {
        await disconnect(wallet);
      } catch (err) {
        console.error("Failed to disconnect wallet:", err);
      }
    }
  };

  return {
    disconnectWallet: handleDisconnect,
    isConnected: !!wallet
  };
}