"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const solanaKeypairWalletProvider_1 = require("./solanaKeypairWalletProvider");
const svm_1 = require("../network/svm");
describe("Solana Keypair Wallet", () => {
    it("should initialize correctly via convenience getters", async () => {
        const keypair = web3_js_1.Keypair.generate();
        let wallet = await solanaKeypairWalletProvider_1.SolanaKeypairWalletProvider.fromRpcUrl((0, web3_js_1.clusterApiUrl)("devnet"), keypair.secretKey);
        expect(wallet.getNetwork()).toEqual(svm_1.SOLANA_NETWORKS[svm_1.SOLANA_DEVNET_GENESIS_BLOCK_HASH]);
        wallet = await solanaKeypairWalletProvider_1.SolanaKeypairWalletProvider.fromRpcUrl((0, web3_js_1.clusterApiUrl)("testnet"), keypair.secretKey);
        expect(wallet.getNetwork()).toEqual(svm_1.SOLANA_NETWORKS[svm_1.SOLANA_TESTNET_GENESIS_BLOCK_HASH]);
        wallet = await solanaKeypairWalletProvider_1.SolanaKeypairWalletProvider.fromRpcUrl((0, web3_js_1.clusterApiUrl)("mainnet-beta"), keypair.secretKey);
        expect(wallet.getNetwork()).toEqual(svm_1.SOLANA_NETWORKS[svm_1.SOLANA_MAINNET_GENESIS_BLOCK_HASH]);
        expect(wallet.getAddress()).toEqual(keypair.publicKey.toBase58());
    });
    it("should error when the network genesis hash is unknown", async () => {
        expect(() => new solanaKeypairWalletProvider_1.SolanaKeypairWalletProvider({
            keypair: web3_js_1.Keypair.generate().secretKey,
            rpcUrl: (0, web3_js_1.clusterApiUrl)("mainnet-beta"),
            genesisHash: "0x123",
        })).toThrowError("Unknown network with genesis hash");
    });
});
