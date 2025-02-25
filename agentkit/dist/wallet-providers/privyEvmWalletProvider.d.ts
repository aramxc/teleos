import { ViemWalletProvider } from "./viemWalletProvider";
import { PrivyWalletConfig, PrivyWalletExport } from "./privyShared";
/**
 * Configuration options for the Privy wallet provider.
 *
 * @interface
 */
export interface PrivyEvmWalletConfig extends PrivyWalletConfig {
    /** Optional chain ID to connect to */
    chainId?: string;
}
/**
 * A wallet provider that uses Privy's server wallet API.
 * This provider extends the ViemWalletProvider to provide Privy-specific wallet functionality
 * while maintaining compatibility with the base wallet provider interface.
 */
export declare class PrivyEvmWalletProvider extends ViemWalletProvider {
    #private;
    /**
     * Private constructor to enforce use of factory method.
     *
     * @param walletClient - The Viem wallet client instance
     * @param config - The configuration options for the Privy wallet
     */
    private constructor();
    /**
     * Creates and configures a new PrivyWalletProvider instance.
     *
     * @param config - The configuration options for the Privy wallet
     * @returns A configured PrivyWalletProvider instance
     *
     * @example
     * ```typescript
     * const provider = await PrivyWalletProvider.configureWithWallet({
     *   appId: "your-app-id",
     *   appSecret: "your-app-secret",
     *   walletId: "wallet-id",
     *   chainId: "84532"
     * });
     * ```
     */
    static configureWithWallet(config: PrivyEvmWalletConfig): Promise<PrivyEvmWalletProvider>;
    /**
     * Gets the name of the wallet provider.
     *
     * @returns The string identifier for this wallet provider
     */
    getName(): string;
    /**
     * Exports the wallet data.
     *
     * @returns The wallet data
     */
    exportWallet(): PrivyWalletExport;
}
