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
var _PrivySvmWalletProvider_walletId, _PrivySvmWalletProvider_address, _PrivySvmWalletProvider_authorizationPrivateKey, _PrivySvmWalletProvider_privyClient, _PrivySvmWalletProvider_connection, _PrivySvmWalletProvider_genesisHash;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivySvmWalletProvider = void 0;
const svmWalletProvider_1 = require("./svmWalletProvider");
const web3_js_1 = require("@solana/web3.js");
const svm_1 = require("../network/svm");
const privyShared_1 = require("./privyShared");
/**
 * A wallet provider that uses Privy's server wallet API.
 * This provider extends the SvmWalletProvider to provide Privy-specific wallet functionality
 * while maintaining compatibility with the base wallet provider interface.
 */
class PrivySvmWalletProvider extends svmWalletProvider_1.SvmWalletProvider {
    /**
     * Private constructor to enforce use of factory method.
     *
     * @param config - The configuration options for the Privy wallet
     */
    constructor(config) {
        super();
        _PrivySvmWalletProvider_walletId.set(this, void 0);
        _PrivySvmWalletProvider_address.set(this, void 0);
        _PrivySvmWalletProvider_authorizationPrivateKey.set(this, void 0);
        _PrivySvmWalletProvider_privyClient.set(this, void 0);
        _PrivySvmWalletProvider_connection.set(this, void 0);
        _PrivySvmWalletProvider_genesisHash.set(this, void 0);
        __classPrivateFieldSet(this, _PrivySvmWalletProvider_walletId, config.walletId, "f");
        __classPrivateFieldSet(this, _PrivySvmWalletProvider_address, config.address, "f");
        __classPrivateFieldSet(this, _PrivySvmWalletProvider_authorizationPrivateKey, config.authorizationPrivateKey, "f");
        __classPrivateFieldSet(this, _PrivySvmWalletProvider_privyClient, config.privyClient, "f");
        __classPrivateFieldSet(this, _PrivySvmWalletProvider_connection, config.connection, "f");
        __classPrivateFieldSet(this, _PrivySvmWalletProvider_genesisHash, config.genesisHash, "f");
    }
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
    static async configureWithWallet(config) {
        const { wallet, privy } = await (0, privyShared_1.createPrivyWallet)(config);
        const connection = config.connection ??
            new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)(svm_1.SOLANA_CLUSTER_ID_BY_NETWORK_ID[config.networkId ?? ""]));
        return new PrivySvmWalletProvider({
            ...config,
            walletId: wallet.id,
            address: wallet.address,
            privyClient: privy,
            connection,
            genesisHash: await connection.getGenesisHash(),
        });
    }
    /**
     * Sign a transaction.
     *
     * @param transaction - The transaction to sign.
     * @returns The signed transaction.
     */
    async signTransaction(transaction) {
        const { signedTransaction } = await __classPrivateFieldGet(this, _PrivySvmWalletProvider_privyClient, "f").walletApi.solana.signTransaction({
            walletId: __classPrivateFieldGet(this, _PrivySvmWalletProvider_walletId, "f"),
            transaction,
        });
        return signedTransaction;
    }
    /**
     * Sign and send a transaction.
     *
     * @param transaction - The transaction to send.
     * @returns The transaction hash.
     */
    async signAndSendTransaction(transaction) {
        try {
            const { hash } = await __classPrivateFieldGet(this, _PrivySvmWalletProvider_privyClient, "f").walletApi.solana.signAndSendTransaction({
                walletId: __classPrivateFieldGet(this, _PrivySvmWalletProvider_walletId, "f"),
                caip2: `solana:${__classPrivateFieldGet(this, _PrivySvmWalletProvider_genesisHash, "f").substring(0, 32)}`,
                transaction,
            });
            return hash;
        }
        catch (error) {
            console.error("Failed to send transaction", error);
            throw new Error("Failed to send transaction");
        }
    }
    /**
     * Send a transaction.
     *
     * @param _ - The transaction to send.
     * @returns The transaction hash.
     */
    async sendTransaction(_) {
        throw new Error("Method not implemented.");
    }
    /**
     * Exports the wallet data.
     *
     * @returns The wallet data
     */
    exportWallet() {
        return {
            walletId: __classPrivateFieldGet(this, _PrivySvmWalletProvider_walletId, "f"),
            authorizationPrivateKey: __classPrivateFieldGet(this, _PrivySvmWalletProvider_authorizationPrivateKey, "f"),
            chainId: this.getNetwork().chainId,
            networkId: this.getNetwork().networkId,
        };
    }
    /**
     * Gets the name of the wallet provider.
     *
     * @returns The string identifier for this wallet provider
     */
    getName() {
        return "privy_svm_wallet_provider";
    }
    /**
     * Get the address of the wallet.
     *
     * @returns The address of the wallet.
     */
    getAddress() {
        return __classPrivateFieldGet(this, _PrivySvmWalletProvider_address, "f");
    }
    /**
     * Get the network of the wallet.
     *
     * @returns The network of the wallet.
     */
    getNetwork() {
        return svm_1.SOLANA_NETWORKS[__classPrivateFieldGet(this, _PrivySvmWalletProvider_genesisHash, "f")];
    }
    /**
     * Get the balance of the wallet.
     *
     * @returns The balance of the wallet.
     */
    async getBalance() {
        const balance = await __classPrivateFieldGet(this, _PrivySvmWalletProvider_connection, "f").getBalance(new web3_js_1.PublicKey(__classPrivateFieldGet(this, _PrivySvmWalletProvider_address, "f")));
        return BigInt(balance);
    }
    /**
     * Transfer a native token.
     *
     * @param _ - The address to transfer the token to.
     * @param arg2 - The value to transfer.
     * @returns The transaction hash.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async nativeTransfer(_, arg2) {
        throw new Error("Method not implemented.");
    }
    /**
     * Get the status of a transaction.
     *
     * @param signature - The transaction signature.
     * @returns The transaction status.
     */
    async getSignatureStatus(signature) {
        return __classPrivateFieldGet(this, _PrivySvmWalletProvider_connection, "f").getSignatureStatus(signature);
    }
    /**
     * Wait for a signature result.
     *
     * @param signature - The signature to wait for.
     * @returns The signature result.
     */
    waitForSignatureResult(signature) {
        return __classPrivateFieldGet(this, _PrivySvmWalletProvider_connection, "f").confirmTransaction({
            signature,
            ...svm_1.SOLANA_NETWORKS[__classPrivateFieldGet(this, _PrivySvmWalletProvider_genesisHash, "f")],
        });
    }
    /**
     * Get the connection.
     *
     * @returns The connection.
     */
    getConnection() {
        return __classPrivateFieldGet(this, _PrivySvmWalletProvider_connection, "f");
    }
    /**
     * Get the public key.
     *
     * @returns The public key.
     */
    getPublicKey() {
        return new web3_js_1.PublicKey(__classPrivateFieldGet(this, _PrivySvmWalletProvider_address, "f"));
    }
}
exports.PrivySvmWalletProvider = PrivySvmWalletProvider;
_PrivySvmWalletProvider_walletId = new WeakMap(), _PrivySvmWalletProvider_address = new WeakMap(), _PrivySvmWalletProvider_authorizationPrivateKey = new WeakMap(), _PrivySvmWalletProvider_privyClient = new WeakMap(), _PrivySvmWalletProvider_connection = new WeakMap(), _PrivySvmWalletProvider_genesisHash = new WeakMap();
