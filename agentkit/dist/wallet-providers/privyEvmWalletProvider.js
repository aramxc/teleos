"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PrivyEvmWalletProvider_walletId, _PrivyEvmWalletProvider_authorizationPrivateKey;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivyEvmWalletProvider = void 0;
const server_auth_1 = require("@privy-io/server-auth");
const viem_1 = require("@privy-io/server-auth/viem");
const viemWalletProvider_1 = require("./viemWalletProvider");
const viem_2 = require("viem");
const network_1 = require("../network/network");
/**
 * A wallet provider that uses Privy's server wallet API.
 * This provider extends the ViemWalletProvider to provide Privy-specific wallet functionality
 * while maintaining compatibility with the base wallet provider interface.
 */
class PrivyEvmWalletProvider extends viemWalletProvider_1.ViemWalletProvider {
    /**
     * Private constructor to enforce use of factory method.
     *
     * @param walletClient - The Viem wallet client instance
     * @param config - The configuration options for the Privy wallet
     */
    constructor(walletClient, config) {
        super(walletClient);
        _PrivyEvmWalletProvider_walletId.set(this, void 0);
        _PrivyEvmWalletProvider_authorizationPrivateKey.set(this, void 0);
        __classPrivateFieldSet(this, _PrivyEvmWalletProvider_walletId, config.walletId, "f"); // Now guaranteed to exist
        __classPrivateFieldSet(this, _PrivyEvmWalletProvider_authorizationPrivateKey, config.authorizationPrivateKey, "f");
    }
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
    static async configureWithWallet(config) {
        const privy = new server_auth_1.PrivyClient(config.appId, config.appSecret, {
            walletApi: config.authorizationPrivateKey
                ? {
                    authorizationPrivateKey: config.authorizationPrivateKey,
                }
                : undefined,
        });
        let walletId;
        let address;
        if (!config.walletId) {
            if (config.authorizationPrivateKey && !config.authorizationKeyId) {
                throw new Error("authorizationKeyId is required when creating a new wallet with an authorization key, this can be found in your Privy Dashboard");
            }
            if (config.authorizationKeyId && !config.authorizationPrivateKey) {
                throw new Error("authorizationPrivateKey is required when creating a new wallet with an authorizationKeyId. " +
                    "If you don't have it, you can create a new one in your Privy Dashboard, or delete the authorization key.");
            }
            try {
                const wallet = await privy.walletApi.create({
                    chainType: "ethereum",
                    authorizationKeyIds: config.authorizationKeyId ? [config.authorizationKeyId] : undefined,
                });
                walletId = wallet.id;
                address = wallet.address;
            }
            catch (error) {
                console.error(error);
                if (error instanceof Error &&
                    error.message.includes("Missing `privy-authorization-signature` header")) {
                    // Providing a more informative error message, see context: https://github.com/coinbase/agentkit/pull/242#discussion_r1956428617
                    throw new Error("Privy error: you have an authorization key on your account which can create and modify wallets, please delete this key or pass it to the PrivyWalletProvider to create a new wallet");
                }
                throw new Error("Failed to create wallet");
            }
        }
        else {
            walletId = config.walletId;
            const wallet = await privy.walletApi.getWallet({ id: walletId });
            if (!wallet) {
                throw new Error(`Wallet with ID ${walletId} not found`);
            }
            address = wallet.address;
        }
        const account = await (0, viem_1.createViemAccount)({
            walletId,
            address,
            privy,
        });
        const chainId = config.chainId || "84532";
        const chain = (0, network_1.getChain)(chainId);
        if (!chain) {
            throw new Error(`Chain with ID ${chainId} not found`);
        }
        const walletClient = (0, viem_2.createWalletClient)({
            account,
            chain,
            transport: (0, viem_2.http)(),
        });
        return new PrivyEvmWalletProvider(walletClient, { ...config, walletId });
    }
    /**
     * Gets the name of the wallet provider.
     *
     * @returns The string identifier for this wallet provider
     */
    getName() {
        return "privy_evm_wallet_provider";
    }
    /**
     * Exports the wallet data.
     *
     * @returns The wallet data
     */
    exportWallet() {
        return {
            walletId: __classPrivateFieldGet(this, _PrivyEvmWalletProvider_walletId, "f"),
            authorizationPrivateKey: __classPrivateFieldGet(this, _PrivyEvmWalletProvider_authorizationPrivateKey, "f"),
            chainId: this.getNetwork().chainId,
            networkId: this.getNetwork().networkId,
        };
    }
}
exports.PrivyEvmWalletProvider = PrivyEvmWalletProvider;
_PrivyEvmWalletProvider_walletId = new WeakMap(), _PrivyEvmWalletProvider_authorizationPrivateKey = new WeakMap();
