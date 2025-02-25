"use strict";
// TODO: Improve type safety
/* eslint-disable @typescript-eslint/no-explicit-any */
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
var _ViemWalletProvider_walletClient, _ViemWalletProvider_publicClient, _ViemWalletProvider_gasLimitMultiplier, _ViemWalletProvider_feePerGasMultiplier;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViemWalletProvider = void 0;
const viem_1 = require("viem");
const evmWalletProvider_1 = require("./evmWalletProvider");
const network_1 = require("../network/network");
const utils_1 = require("../utils");
/**
 * A wallet provider that uses the Viem library.
 */
class ViemWalletProvider extends evmWalletProvider_1.EvmWalletProvider {
    /**
     * Constructs a new ViemWalletProvider.
     *
     * @param walletClient - The wallet client.
     * @param gasConfig - Configuration for gas multipliers.
     */
    constructor(walletClient, gasConfig) {
        super();
        _ViemWalletProvider_walletClient.set(this, void 0);
        _ViemWalletProvider_publicClient.set(this, void 0);
        _ViemWalletProvider_gasLimitMultiplier.set(this, void 0);
        _ViemWalletProvider_feePerGasMultiplier.set(this, void 0);
        __classPrivateFieldSet(this, _ViemWalletProvider_walletClient, walletClient, "f");
        __classPrivateFieldSet(this, _ViemWalletProvider_publicClient, (0, viem_1.createPublicClient)({
            chain: walletClient.chain,
            transport: (0, viem_1.http)(),
        }), "f");
        __classPrivateFieldSet(this, _ViemWalletProvider_gasLimitMultiplier, Math.max(gasConfig?.gasLimitMultiplier ?? 1.2, 1), "f");
        __classPrivateFieldSet(this, _ViemWalletProvider_feePerGasMultiplier, Math.max(gasConfig?.feePerGasMultiplier ?? 1, 1), "f");
    }
    /**
     * Signs a message.
     *
     * @param message - The message to sign.
     * @returns The signed message.
     */
    async signMessage(message) {
        const account = __classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").account;
        if (!account) {
            throw new Error("Account not found");
        }
        return __classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").signMessage({ account, message });
    }
    /**
     * Signs a typed data object.
     *
     * @param typedData - The typed data object to sign.
     * @returns The signed typed data object.
     */
    async signTypedData(typedData) {
        return __classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").signTypedData({
            account: __classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").account,
            domain: typedData.domain,
            types: typedData.types,
            primaryType: typedData.primaryType,
            message: typedData.message,
        });
    }
    /**
     * Signs a transaction.
     *
     * @param transaction - The transaction to sign.
     * @returns The signed transaction.
     */
    async signTransaction(transaction) {
        const txParams = {
            account: __classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").account,
            to: transaction.to,
            value: transaction.value,
            data: transaction.data,
            chain: __classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").chain,
        };
        return __classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").signTransaction(txParams);
    }
    /**
     * Sends a transaction.
     *
     * @param transaction - The transaction to send.
     * @returns The hash of the transaction.
     */
    async sendTransaction(transaction) {
        const account = __classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").account;
        if (!account) {
            throw new Error("Account not found");
        }
        const chain = __classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").chain;
        if (!chain) {
            throw new Error("Chain not found");
        }
        const feeData = await __classPrivateFieldGet(this, _ViemWalletProvider_publicClient, "f").estimateFeesPerGas();
        const maxFeePerGas = (0, utils_1.applyGasMultiplier)(feeData.maxFeePerGas, __classPrivateFieldGet(this, _ViemWalletProvider_feePerGasMultiplier, "f"));
        const maxPriorityFeePerGas = (0, utils_1.applyGasMultiplier)(feeData.maxPriorityFeePerGas, __classPrivateFieldGet(this, _ViemWalletProvider_feePerGasMultiplier, "f"));
        const gasLimit = await __classPrivateFieldGet(this, _ViemWalletProvider_publicClient, "f").estimateGas({
            account,
            to: transaction.to,
            value: transaction.value,
            data: transaction.data,
        });
        const gas = BigInt(Math.round(Number(gasLimit) * __classPrivateFieldGet(this, _ViemWalletProvider_gasLimitMultiplier, "f")));
        const txParams = {
            account: account,
            chain: chain,
            data: transaction.data,
            to: transaction.to,
            value: transaction.value,
            gas,
            maxFeePerGas,
            maxPriorityFeePerGas,
        };
        return __classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").sendTransaction(txParams);
    }
    /**
     * Gets the address of the wallet.
     *
     * @returns The address of the wallet.
     */
    getAddress() {
        return __classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").account?.address ?? "";
    }
    /**
     * Gets the network of the wallet.
     *
     * @returns The network of the wallet.
     */
    getNetwork() {
        return {
            protocolFamily: "evm",
            chainId: String(__classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").chain.id),
            networkId: network_1.CHAIN_ID_TO_NETWORK_ID[__classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").chain.id],
        };
    }
    /**
     * Gets the name of the wallet provider.
     *
     * @returns The name of the wallet provider.
     */
    getName() {
        return "viem_wallet_provider";
    }
    /**
     * Gets the balance of the wallet.
     *
     * @returns The balance of the wallet.
     */
    async getBalance() {
        const account = __classPrivateFieldGet(this, _ViemWalletProvider_walletClient, "f").account;
        if (!account) {
            throw new Error("Account not found");
        }
        return __classPrivateFieldGet(this, _ViemWalletProvider_publicClient, "f").getBalance({ address: account.address });
    }
    /**
     * Waits for a transaction receipt.
     *
     * @param txHash - The hash of the transaction to wait for.
     * @returns The transaction receipt.
     */
    async waitForTransactionReceipt(txHash) {
        return await __classPrivateFieldGet(this, _ViemWalletProvider_publicClient, "f").waitForTransactionReceipt({ hash: txHash });
    }
    /**
     * Reads a contract.
     *
     * @param params - The parameters to read the contract.
     * @returns The response from the contract.
     */
    async readContract(params) {
        return __classPrivateFieldGet(this, _ViemWalletProvider_publicClient, "f").readContract(params);
    }
    /**
     * Transfer the native asset of the network.
     *
     * @param to - The destination address.
     * @param value - The amount to transfer in whole units (e.g. ETH)
     * @returns The transaction hash.
     */
    async nativeTransfer(to, value) {
        const atomicAmount = (0, viem_1.parseEther)(value);
        const tx = await this.sendTransaction({
            to: to,
            value: atomicAmount,
        });
        const receipt = await this.waitForTransactionReceipt(tx);
        if (!receipt) {
            throw new Error("Transaction failed");
        }
        return receipt.transactionHash;
    }
}
exports.ViemWalletProvider = ViemWalletProvider;
_ViemWalletProvider_walletClient = new WeakMap(), _ViemWalletProvider_publicClient = new WeakMap(), _ViemWalletProvider_gasLimitMultiplier = new WeakMap(), _ViemWalletProvider_feePerGasMultiplier = new WeakMap();
