import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';

export const coinbaseSDK = createCoinbaseWalletSDK({
    appName: "Teleos",
    appLogoUrl: "https://teleos.xyz/logo.png", // Need to use a full URL, not a local path
    appChainIds: [8453], // Base mainnet
    preference: {
        options: "all", // Shows both Smart Wallet and mobile app options
        attribution: {
            auto: true, // Automatically generate attribution from app origin
        }
    },
});

// Create provider
export const coinbaseProvider = coinbaseSDK.getProvider();