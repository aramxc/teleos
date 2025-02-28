import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';

export const coinbaseWallet = createCoinbaseWalletSDK({
    appName: "Teleos",
    appChainIds: [84532], // base sepolia

    preference: {
        options: "smartWalletOnly",
    },
});




// Create the provider instance
export const coinbaseProvider = coinbaseWallet.getProvider();


// const address = coinbaseProvider.request({ method: 'eth_requestAccounts' });
