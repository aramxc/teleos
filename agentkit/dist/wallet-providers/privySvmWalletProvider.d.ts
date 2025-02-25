import { SvmWalletProvider } from "./svmWalletProvider";
import { RpcResponseAndContext, SignatureStatus, VersionedTransaction, Connection, PublicKey, SignatureResult } from "@solana/web3.js";
import { Network } from "../network/types";
import { PrivyWalletConfig, PrivyWalletExport } from "./privyShared";
/**
 * Configuration options for the Privy Svm wallet provider.
 */
export interface PrivySvmWalletConfig extends PrivyWalletConfig {
    /** The network ID to use for the wallet */
    networkId?: string;
    /** The connection to use for the wallet */
    connection?: Connection;
}
/**
 * A wallet provider that uses Privy's server wallet API.
 * This provider extends the SvmWalletProvider to provide Privy-specific wallet functionality
 * while maintaining compatibility with the base wallet provider interface.
 */
export declare class PrivySvmWalletProvider extends SvmWalletProvider {
    #private;
    /**
     * Private constructor to enforce use of factory method.
     *
     * @param config - The configuration options for the Privy wallet
     */
    private constructor();
    /**
     * Creates and configures a new PrivySolanaWalletProvider instance.
     *
     * @param config - The configuration options for the Privy wallet
     * @returns A configured PrivySolanaWalletProvider instance
     *
     * @example
     * ```typescript
     * const provider = await PrivySolanaWalletProvider.configureWithWallet({
     *   appId: "your-app-id",
     *   appSecret: "your-app-secret",
     *   walletId: "wallet-id",
     * });
     * ```
     */
    static configureWithWallet<T extends PrivySvmWalletProvider>(config: PrivySvmWalletConfig): Promise<T>;
    /**
     * Sign a transaction.
     *
     * @param transaction - The transaction to sign.
     * @returns The signed transaction.
     */
    signTransaction(transaction: VersionedTransaction): Promise<VersionedTransaction>;
    /**
     * Sign and send a transaction.
     *
     * @param transaction - The transaction to send.
     * @returns The transaction hash.
     */
    signAndSendTransaction(transaction: VersionedTransaction): Promise<string>;
    /**
     * Send a transaction.
     *
     * @param _ - The transaction to send.
     * @returns The transaction hash.
     */
    sendTransaction(_: VersionedTransaction): Promise<string>;
    /**
     * Exports the wallet data.
     *
     * @returns The wallet data
     */
    exportWallet(): PrivyWalletExport;
    /**
     * Gets the name of the wallet provider.
     *
     * @returns The string identifier for this wallet provider
     */
    getName(): string;
    /**
     * Get the address of the wallet.
     *
     * @returns The address of the wallet.
     */
    getAddress(): string;
    /**
     * Get the network of the wallet.
     *
     * @returns The network of the wallet.
     */
    getNetwork(): Network;
    /**
     * Get the balance of the wallet.
     *
     * @returns The balance of the wallet.
     */
    getBalance(): Promise<bigint>;
    /**
     * Transfer a native token.
     *
     * @param _ - The address to transfer the token to.
     * @param arg2 - The value to transfer.
     * @returns The transaction hash.
     */
    nativeTransfer(_: string, arg2: string): Promise<string>;
    /**
     * Get the status of a transaction.
     *
     * @param signature - The transaction signature.
     * @returns The transaction status.
     */
    getSignatureStatus(signature: string): Promise<RpcResponseAndContext<SignatureStatus | null>>;
    /**
     * Wait for a signature result.
     *
     * @param signature - The signature to wait for.
     * @returns The signature result.
     */
    waitForSignatureResult(signature: string): Promise<RpcResponseAndContext<SignatureResult>>;
    /**
     * Get the connection.
     *
     * @returns The connection.
     */
    getConnection(): Connection;
    /**
     * Get the public key.
     *
     * @returns The public key.
     */
    getPublicKey(): PublicKey;
}
