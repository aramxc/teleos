"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivyWalletProvider = void 0;
const privyEvmWalletProvider_1 = require("./privyEvmWalletProvider");
const privySvmWalletProvider_1 = require("./privySvmWalletProvider");
/**
 * Factory class for creating chain-specific Privy wallet providers
 */
class PrivyWalletProvider {
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
    static async configureWithWallet(config) {
        if (config.chainType === "solana") {
            return (await privySvmWalletProvider_1.PrivySvmWalletProvider.configureWithWallet(config));
        }
        return (await privyEvmWalletProvider_1.PrivyEvmWalletProvider.configureWithWallet(config));
    }
}
exports.PrivyWalletProvider = PrivyWalletProvider;
