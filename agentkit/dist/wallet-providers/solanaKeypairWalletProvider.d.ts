import { SvmWalletProvider } from "./svmWalletProvider";
import { Network } from "../network";
import { Connection, PublicKey, VersionedTransaction, RpcResponseAndContext, SignatureResult, SignatureStatus, SignatureStatusConfig } from "@solana/web3.js";
import { SOLANA_CLUSTER, SOLANA_NETWORK_ID } from "../network/svm";
/**
 * SolanaKeypairWalletProvider is a wallet provider that uses a local Solana keypair.
 *
 * @augments SvmWalletProvider
 */
export declare class SolanaKeypairWalletProvider extends SvmWalletProvider {
    #private;
    /**
     * Creates a new SolanaKeypairWalletProvider
     *
     * @param args - Configuration arguments
     * @param args.keypair - Either a Uint8Array or a base58 encoded string representing a 32-byte secret key
     * @param args.rpcUrl - URL of the Solana RPC endpoint
     * @param args.genesisHash - The genesis hash of the network
     */
    constructor({ keypair, rpcUrl, genesisHash, }: {
        keypair: Uint8Array | string;
        rpcUrl: string;
        genesisHash: string;
    });
    /**
     * Get the default RPC URL for a Solana cluster
     *
     * @param cluster - The cluster to get the RPC URL for
     * @returns The RPC URL for the cluster
     */
    static urlForCluster(cluster: SOLANA_CLUSTER): string;
    /**
     * Create a new SolanaKeypairWalletProvider from an SVM networkId and a keypair
     *
     * @param networkId - The SVM networkId
     * @param keypair - Either a Uint8Array or a base58 encoded string representing a 32-byte secret key
     * @returns The new SolanaKeypairWalletProvider
     */
    static fromNetwork<T extends SolanaKeypairWalletProvider>(networkId: SOLANA_NETWORK_ID, keypair: Uint8Array | string): Promise<T>;
    /**
     * Create a new SolanaKeypairWalletProvider from an RPC URL and a keypair
     *
     * @param rpcUrl - The URL of the Solana RPC endpoint
     * @param keypair - Either a Uint8Array or a base58 encoded string representing a 32-byte secret key
     * @returns The new SolanaKeypairWalletProvider
     */
    static fromRpcUrl<T extends SolanaKeypairWalletProvider>(rpcUrl: string, keypair: Uint8Array | string): Promise<T>;
    /**
     * Create a new SolanaKeypairWalletProvider from a Connection and a keypair
     *
     * @param connection - The Connection to use
     * @param keypair - Either a Uint8Array or a base58 encoded string representing a 32-byte secret key
     * @returns The new SolanaKeypairWalletProvider
     */
    static fromConnection<T extends SolanaKeypairWalletProvider>(connection: Connection, keypair: Uint8Array | string): Promise<T>;
    /**
     * Get the connection instance
     *
     * @returns The Solana connection instance
     */
    getConnection(): Connection;
    /**
     * Get the public key of the wallet
     *
     * @returns The wallet's public key
     */
    getPublicKey(): PublicKey;
    /**
     * Get the address of the wallet
     *
     * @returns The base58 encoded address of the wallet
     */
    getAddress(): string;
    /**
     * Get the network
     *
     * @returns The network
     */
    getNetwork(): Network;
    /**
     * Sign a transaction
     *
     * @param transaction - The transaction to sign
     * @returns The signed transaction
     */
    signTransaction(transaction: VersionedTransaction): Promise<VersionedTransaction>;
    /**
     * Send a transaction
     *
     * @param transaction - The transaction to send
     * @returns The signature
     */
    sendTransaction(transaction: VersionedTransaction): Promise<string>;
    /**
     * Sign and send a transaction
     *
     * @param transaction - The transaction to sign and send
     * @returns The signature
     */
    signAndSendTransaction(transaction: VersionedTransaction): Promise<string>;
    /**
     * Get the status of a transaction
     *
     * @param signature - The signature
     * @param options - The options for the status
     * @returns The status
     */
    getSignatureStatus(signature: string, options?: SignatureStatusConfig): Promise<RpcResponseAndContext<SignatureStatus | null>>;
    /**
     * Wait for signature receipt
     *
     * @param signature - The signature
     * @returns The confirmation response
     */
    waitForSignatureResult(signature: string): Promise<RpcResponseAndContext<SignatureResult>>;
    /**
     * Get the name of the wallet provider
     *
     * @returns The name of the wallet provider
     */
    getName(): string;
    /**
     * Get the balance of the wallet
     *
     * @returns The balance of the wallet
     */
    getBalance(): Promise<bigint>;
    /**
     * Transfer SOL from the wallet to another address
     *
     * @param to - The base58 encoded address to transfer the SOL to
     * @param value - The amount of SOL to transfer (as a decimal string, e.g. "0.0001")
     * @returns The signature
     */
    nativeTransfer(to: string, value: string): Promise<string>;
    /**
     * Request SOL tokens from the Solana faucet. This method only works on devnet and testnet networks.
     *
     * @param lamports - The amount of lamports (1 SOL = 1,000,000,000 lamports) to request from the faucet
     * @returns A Promise that resolves to the signature of the airdrop
     */
    requestAirdrop(lamports: number): Promise<string>;
}
