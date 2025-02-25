"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jupiterActionProvider = exports.JupiterActionProvider = void 0;
const actionProvider_1 = require("../actionProvider");
const svmWalletProvider_1 = require("../../wallet-providers/svmWalletProvider");
const zod_1 = require("zod");
const actionDecorator_1 = require("../actionDecorator");
const schemas_1 = require("./schemas");
const web3_js_1 = require("@solana/web3.js");
const api_1 = require("@jup-ag/api");
/**
 * JupiterActionProvider handles token swaps using Jupiter's API.
 */
class JupiterActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Initializes Jupiter API client.
     */
    constructor() {
        super("jupiter", []);
    }
    /**
     * Swaps tokens using Jupiter's API.
     *
     * @param walletProvider - The wallet provider to use for the swap
     * @param args - Swap parameters including input token, output token, and amount
     * @returns A message indicating success or failure with transaction details
     */
    async swap(walletProvider, args) {
        try {
            const jupiterApi = (0, api_1.createJupiterApiClient)();
            const userPublicKey = walletProvider.getPublicKey();
            const inputMint = new web3_js_1.PublicKey(args.inputMint);
            const outputMint = new web3_js_1.PublicKey(args.outputMint);
            const { getMint } = await import("@solana/spl-token");
            let mintInfo;
            try {
                mintInfo = await getMint(walletProvider.getConnection(), inputMint);
            }
            catch (error) {
                return `Failed to fetch mint info for mint address ${args.inputMint}. Error: ${error}`;
            }
            const amount = args.amount * 10 ** mintInfo.decimals;
            const quoteResponse = await jupiterApi.quoteGet({
                inputMint: inputMint.toBase58(),
                outputMint: outputMint.toBase58(),
                amount: amount,
                slippageBps: args.slippageBps || 50, // 0.5% default slippage
            });
            if (!quoteResponse) {
                throw new Error("Failed to get a swap quote.");
            }
            const swapRequest = {
                userPublicKey: userPublicKey.toBase58(),
                wrapAndUnwrapSol: true,
                useSharedAccounts: true, // Optimize for low transaction costs
                quoteResponse,
            };
            const swapResponse = await jupiterApi.swapPost({ swapRequest });
            if (!swapResponse || !swapResponse.swapTransaction) {
                throw new Error("Failed to generate swap transaction.");
            }
            const transactionBuffer = Buffer.from(swapResponse.swapTransaction, "base64");
            const tx = web3_js_1.VersionedTransaction.deserialize(transactionBuffer);
            const signature = await walletProvider.signAndSendTransaction(tx);
            await walletProvider.waitForSignatureResult(signature);
            return `Successfully swapped ${args.amount} tokens! Signature: ${signature}`;
        }
        catch (error) {
            return `Error swapping tokens: ${error}`;
        }
    }
    /**
     * Checks if the action provider supports the given network.
     * Only supports Solana networks.
     *
     * @param network - The network to check support for
     * @returns True if the network is a Solana network
     */
    supportsNetwork(network) {
        return network.protocolFamily == "svm" && network.networkId === "solana-mainnet";
    }
}
exports.JupiterActionProvider = JupiterActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "swap",
        description: `
    Swaps tokens using Jupiter's DEX aggregator.
    - Input and output tokens must be valid SPL token mints.
    - Ensures sufficient balance before executing swap.
    - If says "SOL" as the input or output, use the mint address So11111111111111111111111111111111111111112
    NOTE: Only available on Solana mainnet.
    `,
        schema: schemas_1.SwapTokenSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [svmWalletProvider_1.SvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], JupiterActionProvider.prototype, "swap", null);
/**
 * Factory function to create a new JupiterActionProvider instance.
 *
 * @returns A new JupiterActionProvider instance
 */
const jupiterActionProvider = () => new JupiterActionProvider();
exports.jupiterActionProvider = jupiterActionProvider;
