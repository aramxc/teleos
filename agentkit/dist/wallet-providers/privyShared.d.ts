import { PrivyClient, Wallet } from "@privy-io/server-auth";
/**
 * Configuration options for the Privy wallet provider.
 *
 * @interface
 */
export interface PrivyWalletConfig {
    /** The Privy application ID */
    appId: string;
    /** The Privy application secret */
    appSecret: string;
    /** The ID of the wallet to use, if not provided a new wallet will be created */
    walletId?: string;
    /** Optional authorization key for the wallet API */
    authorizationPrivateKey?: string;
    /** Optional authorization key ID for creating new wallets */
    authorizationKeyId?: string;
    /** The chain type to create the wallet on */
    chainType?: "ethereum" | "solana";
}
export type PrivyWalletExport = {
    walletId: string;
    authorizationPrivateKey: string | undefined;
    chainId: string | undefined;
    networkId: string | undefined;
};
type CreatePrivyWalletReturnType = {
    wallet: Wallet & {
        id: string;
    };
    privy: PrivyClient;
};
/**
 * Create a Privy wallet
 *
 * @param config - The configuration options for the Privy wallet
 * @returns The created Privy wallet
 */
export declare function createPrivyWallet(config: PrivyWalletConfig): Promise<CreatePrivyWalletReturnType>;
export {};
