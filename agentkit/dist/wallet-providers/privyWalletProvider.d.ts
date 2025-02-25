import { PrivyEvmWalletProvider, PrivyEvmWalletConfig } from "./privyEvmWalletProvider";
import { PrivySvmWalletProvider, PrivySvmWalletConfig } from "./privySvmWalletProvider";
export type PrivyWalletConfig = PrivyEvmWalletConfig | PrivySvmWalletConfig;
/**
 * Factory class for creating chain-specific Privy wallet providers
 */
export declare class PrivyWalletProvider {
    /**
     * Creates and configures a new wallet provider instance based on the chain type.
     *
     * @param config - The configuration options for the Privy wallet
     * @returns A configured WalletProvider instance for the specified chain
     *
     * @example
     * ```typescript
     * // For EVM (default)
     * const evmWallet = await PrivyWalletProvider.configureWithWallet({
     *   appId: "your-app-id",
     *   appSecret: "your-app-secret"
     * });
     *
     * // For Solana
     * const solanaWallet = await PrivyWalletProvider.configureWithWallet({
     *   appId: "your-app-id",
     *   appSecret: "your-app-secret",
     *   chainType: "solana"
     * });
     * ```
     */
    static configureWithWallet<T extends PrivyWalletConfig>(config: T & {
        chainType?: "ethereum" | "solana";
    }): Promise<T extends {
        chainType: "solana";
    } ? PrivySvmWalletProvider : PrivyEvmWalletProvider>;
}
