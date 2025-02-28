import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { ethers } from 'ethers';

let coinbaseWallet: ReturnType<typeof createCoinbaseWalletSDK> | undefined;
let coinbaseProvider: ethers.BrowserProvider | undefined;

if (typeof window !== 'undefined') {
    coinbaseWallet = createCoinbaseWalletSDK({
        appName: "Teleos",
        appChainIds: [84532, 1337], // Base Sepolia and localhost
        appLogoUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bS0yIDE1LTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz48L3N2Zz4=",
        preference: {
            options: "smartWalletOnly",
        },
    });

    // Create the provider instance
    coinbaseProvider = new ethers.BrowserProvider(coinbaseWallet.getProvider());
}

export { coinbaseWallet, coinbaseProvider };




// const address = coinbaseProvider.request({ method: 'eth_requestAccounts' });
