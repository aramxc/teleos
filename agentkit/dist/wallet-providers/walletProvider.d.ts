import { Network } from "../network";
/**
 * WalletProvider is the abstract base class for all wallet providers.
 *
 * @abstract
 */
export declare abstract class WalletProvider {
    /**
     * Initializes the wallet provider.
     */
    constructor();
    /**
     * Tracks the initialization of the wallet provider.
     */
    private trackInitialization;
    /**
     * Get the address of the wallet provider.
     *
     * @returns The address of the wallet provider.
     */
    abstract getAddress(): string;
    /**
     * Get the network of the wallet provider.
     *
     * @returns The network of the wallet provider.
     */
    abstract getNetwork(): Network;
    /**
     * Get the name of the wallet provider.
     *
     * @returns The name of the wallet provider.
     */
    abstract getName(): string;
    /**
     * Get the balance of the native asset of the network.
     *
     * @returns The balance of the native asset of the network.
     */
    abstract getBalance(): Promise<bigint>;
    /**
     * Transfer the native asset of the network.
     *
     * @param to - The destination address.
     * @param value - The amount to transfer in whole units (e.g. ETH)
     * @returns The transaction hash.
     */
    abstract nativeTransfer(to: string, value: string): Promise<string>;
}
