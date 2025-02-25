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
var _CdpWalletProvider_cdpWallet, _CdpWalletProvider_address, _CdpWalletProvider_network, _CdpWalletProvider_publicClient, _CdpWalletProvider_gasLimitMultiplier, _CdpWalletProvider_feePerGasMultiplier;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdpWalletProvider = void 0;
const package_json_1 = require("../../package.json");
const decimal_js_1 = require("decimal.js");
const viem_1 = require("viem");
const evmWalletProvider_1 = require("./evmWalletProvider");
const coinbase_sdk_1 = require("@coinbase/coinbase-sdk");
const network_1 = require("../network/network");
const utils_1 = require("../utils");
/**
 * A wallet provider that uses the Coinbase SDK.
 */
class CdpWalletProvider extends evmWalletProvider_1.EvmWalletProvider {
    /**
     * Constructs a new CdpWalletProvider.
     *
     * @param config - The configuration options for the CdpWalletProvider.
     */
    constructor(config) {
        super();
        _CdpWalletProvider_cdpWallet.set(this, void 0);
        _CdpWalletProvider_address.set(this, void 0);
        _CdpWalletProvider_network.set(this, void 0);
        _CdpWalletProvider_publicClient.set(this, void 0);
        _CdpWalletProvider_gasLimitMultiplier.set(this, void 0);
        _CdpWalletProvider_feePerGasMultiplier.set(this, void 0);
        __classPrivateFieldSet(this, _CdpWalletProvider_cdpWallet, config.wallet, "f");
        __classPrivateFieldSet(this, _CdpWalletProvider_address, config.address, "f");
        __classPrivateFieldSet(this, _CdpWalletProvider_network, config.network, "f");
        __classPrivateFieldSet(this, _CdpWalletProvider_publicClient, (0, viem_1.createPublicClient)({
            chain: network_1.NETWORK_ID_TO_VIEM_CHAIN[config.network.networkId],
            transport: (0, viem_1.http)(),
        }), "f");
        __classPrivateFieldSet(this, _CdpWalletProvider_gasLimitMultiplier, Math.max(config.gas?.gasLimitMultiplier ?? 1.2, 1), "f");
        __classPrivateFieldSet(this, _CdpWalletProvider_feePerGasMultiplier, Math.max(config.gas?.feePerGasMultiplier ?? 1, 1), "f");
    }
    /**
     * Configures a new CdpWalletProvider with a wallet.
     *
     * @param config - Optional configuration parameters
     * @returns A Promise that resolves to a new CdpWalletProvider instance
     * @throws Error if required environment variables are missing or wallet initialization fails
     */
    static async configureWithWallet(config = {}) {
        if (config.apiKeyName && config.apiKeyPrivateKey) {
            coinbase_sdk_1.Coinbase.configure({
                apiKeyName: config.apiKeyName,
                privateKey: config.apiKeyPrivateKey?.replace(/\\n/g, "\n"),
                source: "agentkit",
                sourceVersion: package_json_1.version,
            });
        }
        else {
            coinbase_sdk_1.Coinbase.configureFromJson();
        }
        let wallet;
        const mnemonicPhrase = config.mnemonicPhrase || process.env.MNEMONIC_PHRASE;
        const networkId = config.networkId || process.env.NETWORK_ID || coinbase_sdk_1.Coinbase.networks.BaseSepolia;
        try {
            if (config.wallet) {
                wallet = config.wallet;
            }
            else if (config.cdpWalletData) {
                const walletData = JSON.parse(config.cdpWalletData);
                wallet = await coinbase_sdk_1.Wallet.import(walletData);
            }
            else if (mnemonicPhrase) {
                wallet = await coinbase_sdk_1.Wallet.import({ mnemonicPhrase: mnemonicPhrase }, networkId);
            }
            else {
                wallet = await coinbase_sdk_1.Wallet.create({ networkId: networkId });
            }
        }
        catch (error) {
            throw new Error(`Failed to initialize wallet: ${error}`);
        }
        const address = (await wallet.getDefaultAddress())?.getId();
        const network = {
            protocolFamily: "evm",
            chainId: network_1.NETWORK_ID_TO_CHAIN_ID[networkId],
            networkId: networkId,
        };
        const cdpWalletProvider = new CdpWalletProvider({
            wallet,
            address,
            network,
            gas: config.gas,
        });
        return cdpWalletProvider;
    }
    /**
     * Signs a message.
     *
     * @param message - The message to sign.
     * @returns The signed message.
     */
    async signMessage(message) {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f")) {
            throw new Error("Wallet not initialized");
        }
        const messageHash = (0, coinbase_sdk_1.hashMessage)(message);
        const payload = await __classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f").createPayloadSignature(messageHash);
        if (payload.getStatus() === "pending" && payload?.wait) {
            await payload.wait(); // needed for Server-Signers
        }
        return payload.getSignature();
    }
    /**
     * Signs a typed data object.
     *
     * @param typedData - The typed data object to sign.
     * @returns The signed typed data object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signTypedData(typedData) {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f")) {
            throw new Error("Wallet not initialized");
        }
        const messageHash = (0, coinbase_sdk_1.hashTypedDataMessage)(typedData.domain, typedData.types, typedData.message);
        const payload = await __classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f").createPayloadSignature(messageHash);
        if (payload.getStatus() === "pending" && payload?.wait) {
            await payload.wait(); // needed for Server-Signers
        }
        return payload.getSignature();
    }
    /**
     * Signs a transaction.
     *
     * @param transaction - The transaction to sign.
     * @returns The signed transaction.
     */
    async signTransaction(transaction) {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f")) {
            throw new Error("Wallet not initialized");
        }
        const serializedTx = (0, viem_1.serializeTransaction)(transaction);
        const transactionHash = (0, viem_1.keccak256)(serializedTx);
        const payload = await __classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f").createPayloadSignature(transactionHash);
        if (payload.getStatus() === "pending" && payload?.wait) {
            await payload.wait(); // needed for Server-Signers
        }
        return payload.getSignature();
    }
    /**
     * Sends a transaction.
     *
     * @param transaction - The transaction to send.
     * @returns The hash of the transaction.
     */
    async sendTransaction(transaction) {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f")) {
            throw new Error("Wallet not initialized");
        }
        const preparedTransaction = await this.prepareTransaction(transaction.to, transaction.value, transaction.data);
        const signature = await this.signTransaction({
            ...preparedTransaction,
        });
        const signedPayload = await this.addSignatureAndSerialize(preparedTransaction, signature);
        const externalAddress = new coinbase_sdk_1.ExternalAddress(__classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f").getNetworkId(), __classPrivateFieldGet(this, _CdpWalletProvider_address, "f"));
        const tx = await externalAddress.broadcastExternalTransaction(signedPayload.slice(2));
        return tx.transactionHash;
    }
    /**
     * Prepares a transaction.
     *
     * @param to - The address to send the transaction to.
     * @param value - The value of the transaction.
     * @param data - The data of the transaction.
     * @returns The prepared transaction.
     */
    async prepareTransaction(to, value, data) {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f")) {
            throw new Error("Wallet not initialized");
        }
        const nonce = await __classPrivateFieldGet(this, _CdpWalletProvider_publicClient, "f").getTransactionCount({
            address: __classPrivateFieldGet(this, _CdpWalletProvider_address, "f"),
        });
        const feeData = await __classPrivateFieldGet(this, _CdpWalletProvider_publicClient, "f").estimateFeesPerGas();
        const maxFeePerGas = (0, utils_1.applyGasMultiplier)(feeData.maxFeePerGas, __classPrivateFieldGet(this, _CdpWalletProvider_feePerGasMultiplier, "f"));
        const maxPriorityFeePerGas = (0, utils_1.applyGasMultiplier)(feeData.maxPriorityFeePerGas, __classPrivateFieldGet(this, _CdpWalletProvider_feePerGasMultiplier, "f"));
        const gasLimit = await __classPrivateFieldGet(this, _CdpWalletProvider_publicClient, "f").estimateGas({
            account: __classPrivateFieldGet(this, _CdpWalletProvider_address, "f"),
            to,
            value,
            data,
        });
        const gas = BigInt(Math.round(Number(gasLimit) * __classPrivateFieldGet(this, _CdpWalletProvider_gasLimitMultiplier, "f")));
        const chainId = parseInt(__classPrivateFieldGet(this, _CdpWalletProvider_network, "f").chainId, 10);
        return {
            to,
            value,
            data,
            nonce,
            maxFeePerGas,
            maxPriorityFeePerGas,
            gas,
            chainId,
            type: "eip1559",
        };
    }
    /**
     * Adds signature to a transaction and serializes it for broadcast.
     *
     * @param transaction - The transaction to sign.
     * @param signature - The signature to add to the transaction.
     * @returns A serialized transaction.
     */
    async addSignatureAndSerialize(transaction, signature) {
        // Decode the signature into its components
        const r = `0x${signature.slice(2, 66)}`; // First 32 bytes
        const s = `0x${signature.slice(66, 130)}`; // Next 32 bytes
        const v = BigInt(parseInt(signature.slice(130, 132), 16)); // Last byte
        return (0, viem_1.serializeTransaction)(transaction, { r, s, v });
    }
    /**
     * Gets the address of the wallet.
     *
     * @returns The address of the wallet.
     */
    getAddress() {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_address, "f")) {
            throw new Error("Address not initialized");
        }
        return __classPrivateFieldGet(this, _CdpWalletProvider_address, "f");
    }
    /**
     * Gets the network of the wallet.
     *
     * @returns The network of the wallet.
     */
    getNetwork() {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_network, "f")) {
            throw new Error("Network not initialized");
        }
        return __classPrivateFieldGet(this, _CdpWalletProvider_network, "f");
    }
    /**
     * Gets the name of the wallet provider.
     *
     * @returns The name of the wallet provider.
     */
    getName() {
        return "cdp_wallet_provider";
    }
    /**
     * Gets the balance of the wallet.
     *
     * @returns The balance of the wallet in wei
     */
    async getBalance() {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f")) {
            throw new Error("Wallet not initialized");
        }
        const balance = await __classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f").getBalance("eth");
        return BigInt(balance.mul(10 ** 18).toString());
    }
    /**
     * Waits for a transaction receipt.
     *
     * @param txHash - The hash of the transaction to wait for.
     * @returns The transaction receipt.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async waitForTransactionReceipt(txHash) {
        return await __classPrivateFieldGet(this, _CdpWalletProvider_publicClient, "f").waitForTransactionReceipt({ hash: txHash });
    }
    /**
     * Reads a contract.
     *
     * @param params - The parameters to read the contract.
     * @returns The response from the contract.
     */
    async readContract(params) {
        return __classPrivateFieldGet(this, _CdpWalletProvider_publicClient, "f").readContract(params);
    }
    /**
     * Creates a trade.
     *
     * @param options - The options for the trade.
     * @returns The trade.
     */
    async createTrade(options) {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f")) {
            throw new Error("Wallet not initialized");
        }
        return __classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f").createTrade(options);
    }
    /**
     * Deploys a token.
     *
     * @param options - The options for the token deployment.
     * @returns The deployed token.
     */
    async deployToken(options) {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f")) {
            throw new Error("Wallet not initialized");
        }
        return __classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f").deployToken(options);
    }
    /**
     * Deploys a contract.
     *
     * @param options - The options for contract deployment
     * @param options.solidityVersion - The version of the Solidity compiler to use (e.g. "0.8.0+commit.c7dfd78e")
     * @param options.solidityInputJson - The JSON input for the Solidity compiler containing contract source and settings
     * @param options.contractName - The name of the contract to deploy
     * @param options.constructorArgs - Key-value map of constructor args
     *
     * @returns A Promise that resolves to the deployed contract instance
     * @throws Error if wallet is not initialized
     */
    async deployContract(options) {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f")) {
            throw new Error("Wallet not initialized");
        }
        return __classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f").deployContract(options);
    }
    /**
     * Deploys a new NFT (ERC-721) smart contract.
     *
     * @param options - Configuration options for the NFT contract deployment
     * @param options.name - The name of the collection
     * @param options.symbol - The token symbol for the collection
     * @param options.baseURI - The base URI for token metadata.
     *
     * @returns A Promise that resolves to the deployed SmartContract instance
     * @throws Error if the wallet is not properly initialized
     * @throws Error if the deployment fails for any reason (network issues, insufficient funds, etc.)
     */
    async deployNFT(options) {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f")) {
            throw new Error("Wallet not initialized");
        }
        return __classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f").deployNFT(options);
    }
    /**
     * Transfer the native asset of the network.
     *
     * @param to - The destination address.
     * @param value - The amount to transfer in Wei.
     * @returns The transaction hash.
     */
    async nativeTransfer(to, value) {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f")) {
            throw new Error("Wallet not initialized");
        }
        const transferResult = await __classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f").createTransfer({
            amount: new decimal_js_1.Decimal(value),
            assetId: coinbase_sdk_1.Coinbase.assets.Eth,
            destination: to,
            gasless: false,
        });
        const result = await transferResult.wait();
        if (!result.getTransactionHash()) {
            throw new Error("Transaction hash not found");
        }
        return result.getTransactionHash();
    }
    /**
     * Exports the wallet.
     *
     * @returns The wallet's data.
     */
    async exportWallet() {
        if (!__classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f")) {
            throw new Error("Wallet not initialized");
        }
        return __classPrivateFieldGet(this, _CdpWalletProvider_cdpWallet, "f").export();
    }
}
exports.CdpWalletProvider = CdpWalletProvider;
_CdpWalletProvider_cdpWallet = new WeakMap(), _CdpWalletProvider_address = new WeakMap(), _CdpWalletProvider_network = new WeakMap(), _CdpWalletProvider_publicClient = new WeakMap(), _CdpWalletProvider_gasLimitMultiplier = new WeakMap(), _CdpWalletProvider_feePerGasMultiplier = new WeakMap();
