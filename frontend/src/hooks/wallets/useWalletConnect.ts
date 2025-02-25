'use client';

import { useConnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

export function useWalletConnect() {
  const { connect, isConnecting, error } = useConnect();

  const connectWallet = async () => {
    try {
      await connect(async () => {
        const metamask = createWallet("io.metamask");
        await metamask.connect({ client });
        return metamask;
      });
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  return {
    connectWallet,
    isConnecting,
    error
  };
}