'use client';

import { useConnectModal } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

export function useWalletConnect() {
  const { connect, isConnecting } = useConnectModal();

  const connectWallet = async () => {
    try {
      await connect({ client });
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  return {
    connectWallet,
    isConnecting,
    error: null // We can expand this later if needed
  };
}