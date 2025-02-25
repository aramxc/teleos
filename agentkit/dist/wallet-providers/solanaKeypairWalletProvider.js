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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _SolanaKeypairWalletProvider_keypair, _SolanaKeypairWalletProvider_connection, _SolanaKeypairWalletProvider_genesisHash;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaKeypairWalletProvider = void 0;
const svmWalletProvider_1 = require("./svmWalletProvider");
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const svm_1 = require("../network/svm");
/**
 * SolanaKeypairWalletProvider is a wallet provider that uses a local Solana keypair.
 *
 * @augments SvmWalletProvider
 */
class SolanaKeypairWalletProvider extends svmWalletProvider_1.SvmWalletProvider {
    /**
     * Creates a new SolanaKeypairWalletProvider
     *
     * @param args - Configuration arguments
     * @param args.keypair - Either a Uint8Array or a base58 encoded string representing a 32-byte secret key
     * @param args.rpcUrl - URL of the Solana RPC endpoint
     * @param args.genesisHash - The genesis hash of the network
     */
    constructor({ keypair, rpcUrl, genesisHash, }) {
        super();
        _SolanaKeypairWalletProvider_keypair.set(this, void 0);
        _SolanaKeypairWalletProvider_connection.set(this, void 0);
        _SolanaKeypairWalletProvider_genesisHash.set(this, void 0);
        __classPrivateFieldSet(this, _SolanaKeypairWalletProvider_keypair, typeof keypair === "string"
            ? web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(keypair))
            : web3_js_1.Keypair.fromSecretKey(keypair), "f");
        __classPrivateFieldSet(this, _SolanaKeypairWalletProvider_connection, new web3_js_1.Connection(rpcUrl), "f");
        if (genesisHash in svm_1.SOLANA_NETWORKS) {
            __classPrivateFieldSet(this, _SolanaKeypairWalletProvider_genesisHash, genesisHash, "f");
        }
        else {
            throw new Error(`Unknown network with genesis hash: ${genesisHash}`);
        }
    }
    /**
     * Get the default RPC URL for a Solana cluster
     *
     * @param cluster - The cluster to get the RPC URL for
     * @returns The RPC URL for the cluster
     */
    static urlForCluster(cluster) {
        if (cluster in svm_1.SOLANA_NETWORKS) {
            switch (cluster) {
                case svm_1.SOLANA_MAINNET_GENESIS_BLOCK_HASH:
                    return (0, web3_js_1.clusterApiUrl)("mainnet-beta");
                case svm_1.SOLANA_TESTNET_GENESIS_BLOCK_HASH:
                    return (0, web3_js_1.clusterApiUrl)("testnet");
                case svm_1.SOLANA_DEVNET_GENESIS_BLOCK_HASH:
                    return (0, web3_js_1.clusterApiUrl)("devnet");
                default:
                    throw new Error(`Unknown cluster: ${cluster}`);
            }
        }
        else {
            throw new Error(`Unknown cluster: ${cluster}`);
        }
    }
    /**
     * Create a new SolanaKeypairWalletProvider from an SVM networkId and a keypair
     *
     * @param networkId - The SVM networkId
     * @param keypair - Either a Uint8Array or a base58 encoded string representing a 32-byte secret key
     * @returns The new SolanaKeypairWalletProvider
     */
    static async fromNetwork(networkId, keypair) {
        let genesisHash;
        switch (networkId) {
            case svm_1.SOLANA_MAINNET_NETWORK_ID:
                genesisHash = svm_1.SOLANA_MAINNET_GENESIS_BLOCK_HASH;
                break;
            case svm_1.SOLANA_DEVNET_NETWORK_ID:
                genesisHash = svm_1.SOLANA_DEVNET_GENESIS_BLOCK_HASH;
                break;
            case svm_1.SOLANA_TESTNET_NETWORK_ID:
                genesisHash = svm_1.SOLANA_TESTNET_GENESIS_BLOCK_HASH;
                break;
            default:
                throw new Error(`${networkId} is not a valid SVM networkId`);
        }
        const rpcUrl = this.urlForCluster(genesisHash);
        return await this.fromRpcUrl(rpcUrl, keypair);
    }
    /**
     * Create a new SolanaKeypairWalletProvider from an RPC URL and a keypair
     *
     * @param rpcUrl - The URL of the Solana RPC endpoint
     * @param keypair - Either a Uint8Array or a base58 encoded string representing a 32-byte secret key
     * @returns The new SolanaKeypairWalletProvider
     */
    static async fromRpcUrl(rpcUrl, keypair) {
        const connection = new web3_js_1.Connection(rpcUrl);
        return await this.fromConnection(connection, keypair);
    }
    /**
     * Create a new SolanaKeypairWalletProvider from a Connection and a keypair
     *
     * @param connection - The Connection to use
     * @param keypair - Either a Uint8Array or a base58 encoded string representing a 32-byte secret key
     * @returns The new SolanaKeypairWalletProvider
     */
    static async fromConnection(connection, keypair) {
        const genesisHash = await connection.getGenesisHash();
        return new SolanaKeypairWalletProvider({
            keypair,
            rpcUrl: connection.rpcEndpoint,
            genesisHash: genesisHash,
        });
    }
    /**
     * Get the connection instance
     *
     * @returns The Solana connection instance
     */
    getConnection() {
        return __classPrivateFieldGet(this, _SolanaKeypairWalletProvider_connection, "f");
    }
    /**
     * Get the public key of the wallet
     *
     * @returns The wallet's public key
     */
    getPublicKey() {
        return __classPrivateFieldGet(this, _SolanaKeypairWalletProvider_keypair, "f").publicKey;
    }
    /**
     * Get the address of the wallet
     *
     * @returns The base58 encoded address of the wallet
     */
    getAddress() {
        return __classPrivateFieldGet(this, _SolanaKeypairWalletProvider_keypair, "f").publicKey.toBase58();
    }
    /**
     * Get the network
     *
     * @returns The network
     */
    getNetwork() {
        return svm_1.SOLANA_NETWORKS[__classPrivateFieldGet(this, _SolanaKeypairWalletProvider_genesisHash, "f")];
    }
    /**
     * Sign a transaction
     *
     * @param transaction - The transaction to sign
     * @returns The signed transaction
     */
    async signTransaction(transaction) {
        transaction.sign([__classPrivateFieldGet(this, _SolanaKeypairWalletProvider_keypair, "f")]);
        return transaction;
    }
    /**
     * Send a transaction
     *
     * @param transaction - The transaction to send
     * @returns The signature
     */
    async sendTransaction(transaction) {
        const signature = await __classPrivateFieldGet(this, _SolanaKeypairWalletProvider_connection, "f").sendTransaction(transaction);
        await this.waitForSignatureResult(signature);
        return signature;
    }
    /**
     * Sign and send a transaction
     *
     * @param transaction - The transaction to sign and send
     * @returns The signature
     */
    async signAndSendTransaction(transaction) {
        const signedTransaction = await this.signTransaction(transaction);
        return this.sendTransaction(signedTransaction);
    }
    /**
     * Get the status of a transaction
     *
     * @param signature - The signature
     * @param options - The options for the status
     * @returns The status
     */
    async getSignatureStatus(signature, options) {
        return __classPrivateFieldGet(this, _SolanaKeypairWalletProvider_connection, "f").getSignatureStatus(signature, options);
    }
    /**
     * Wait for signature receipt
     *
     * @param signature - The signature
     * @returns The confirmation response
     */
    async waitForSignatureResult(signature) {
        const { blockhash, lastValidBlockHeight } = await __classPrivateFieldGet(this, _SolanaKeypairWalletProvider_connection, "f").getLatestBlockhash();
        return __classPrivateFieldGet(this, _SolanaKeypairWalletProvider_connection, "f").confirmTransaction({
            signature: signature,
            lastValidBlockHeight,
            blockhash,
        });
    }
    /**
     * Get the name of the wallet provider
     *
     * @returns The name of the wallet provider
     */
    getName() {
        return "solana_keypair_wallet_provider";
    }
    /**
     * Get the balance of the wallet
     *
     * @returns The balance of the wallet
     */
    getBalance() {
        return __classPrivateFieldGet(this, _SolanaKeypairWalletProvider_connection, "f").getBalance(__classPrivateFieldGet(this, _SolanaKeypairWalletProvider_keypair, "f").publicKey).then(balance => BigInt(balance));
    }
    /**
     * Transfer SOL from the wallet to another address
     *
     * @param to - The base58 encoded address to transfer the SOL to
     * @param value - The amount of SOL to transfer (as a decimal string, e.g. "0.0001")
     * @returns The signature
     */
    async nativeTransfer(to, value) {
        const initialBalance = await this.getBalance();
        const solAmount = parseFloat(value);
        const lamports = BigInt(Math.floor(solAmount * web3_js_1.LAMPORTS_PER_SOL));
        // Check if we have enough balance (including estimated fees)
        if (initialBalance < lamports + BigInt(5000)) {
            throw new Error(`Insufficient balance. Have ${Number(initialBalance) / web3_js_1.LAMPORTS_PER_SOL} SOL, need ${solAmount + 0.000005} SOL (including fees)`);
        }
        const toPubkey = new web3_js_1.PublicKey(to);
        const instructions = [
            web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: 10000,
            }),
            web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
                units: 2000,
            }),
            web3_js_1.SystemProgram.transfer({
                fromPubkey: __classPrivateFieldGet(this, _SolanaKeypairWalletProvider_keypair, "f").publicKey,
                toPubkey: toPubkey,
                lamports: lamports,
            }),
        ];
        const tx = new web3_js_1.VersionedTransaction(web3_js_1.MessageV0.compile({
            payerKey: __classPrivateFieldGet(this, _SolanaKeypairWalletProvider_keypair, "f").publicKey,
            instructions: instructions,
            recentBlockhash: (await __classPrivateFieldGet(this, _SolanaKeypairWalletProvider_connection, "f").getLatestBlockhash()).blockhash,
        }));
        tx.sign([__classPrivateFieldGet(this, _SolanaKeypairWalletProvider_keypair, "f")]);
        const signature = await __classPrivateFieldGet(this, _SolanaKeypairWalletProvider_connection, "f").sendTransaction(tx);
        await this.waitForSignatureResult(signature);
        return signature;
    }
    /**
     * Request SOL tokens from the Solana faucet. This method only works on devnet and testnet networks.
     *
     * @param lamports - The amount of lamports (1 SOL = 1,000,000,000 lamports) to request from the faucet
     * @returns A Promise that resolves to the signature of the airdrop
     */
    async requestAirdrop(lamports) {
        return await __classPrivateFieldGet(this, _SolanaKeypairWalletProvider_connection, "f").requestAirdrop(__classPrivateFieldGet(this, _SolanaKeypairWalletProvider_keypair, "f").publicKey, lamports);
    }
}
exports.SolanaKeypairWalletProvider = SolanaKeypairWalletProvider;
_SolanaKeypairWalletProvider_keypair = new WeakMap(), _SolanaKeypairWalletProvider_connection = new WeakMap(), _SolanaKeypairWalletProvider_genesisHash = new WeakMap();
