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
exports.splActionProvider = exports.SplActionProvider = void 0;
const actionProvider_1 = require("../actionProvider");
const svmWalletProvider_1 = require("../../wallet-providers/svmWalletProvider");
const zod_1 = require("zod");
const actionDecorator_1 = require("../actionDecorator");
const schemas_1 = require("./schemas");
const web3_js_1 = require("@solana/web3.js");
/**
 * SplActionProvider serves as a provider for SPL token actions.
 * It provides SPL token transfer functionality.
 */
class SplActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Creates a new SplActionProvider instance.
     */
    constructor() {
        super("spl", []);
    }
    /**
     * Get the balance of SPL tokens for an address.
     *
     * @param walletProvider - The wallet provider to use
     * @param args - Parameters including mint address and optional target address
     * @returns A message indicating the token balance
     */
    async getBalance(walletProvider, args) {
        try {
            if (!args.address) {
                args.address = walletProvider.getAddress();
            }
            const connection = walletProvider.getConnection();
            const mintPubkey = new web3_js_1.PublicKey(args.mintAddress);
            const ownerPubkey = new web3_js_1.PublicKey(args.address);
            const { getMint, getAssociatedTokenAddress, getAccount, TokenAccountNotFoundError } = await import("@solana/spl-token");
            let mintInfo;
            try {
                mintInfo = await getMint(connection, mintPubkey);
            }
            catch (error) {
                return `Failed to fetch mint info for mint address ${args.mintAddress}. Error: ${error}`;
            }
            try {
                const ata = await getAssociatedTokenAddress(mintPubkey, ownerPubkey);
                const account = await getAccount(connection, ata);
                const balance = Number(account.amount) / Math.pow(10, mintInfo.decimals);
                return `Balance for ${args.address} is ${balance} tokens`;
            }
            catch (error) {
                if (error instanceof TokenAccountNotFoundError) {
                    return `Balance for ${args.address} is 0 tokens`;
                }
                throw error;
            }
        }
        catch (error) {
            return `Error getting SPL token balance: ${error}`;
        }
    }
    /**
     * Transfer SPL tokens to another address.
     *
     * @param walletProvider - The wallet provider to use for the transfer
     * @param args - Transfer parameters including recipient address, mint address, and amount
     * @returns A message indicating success or failure with transaction details
     */
    async transfer(walletProvider, args) {
        try {
            const connection = walletProvider.getConnection();
            const fromPubkey = walletProvider.getPublicKey();
            const toPubkey = new web3_js_1.PublicKey(args.recipient);
            const mintPubkey = new web3_js_1.PublicKey(args.mintAddress);
            const { getMint, getAssociatedTokenAddress, getAccount, createAssociatedTokenAccountInstruction, createTransferCheckedInstruction, } = await import("@solana/spl-token");
            let mintInfo;
            try {
                mintInfo = await getMint(connection, mintPubkey);
            }
            catch (error) {
                return `Failed to fetch mint info for mint address ${args.mintAddress}. Error: ${error}`;
            }
            const adjustedAmount = args.amount * Math.pow(10, mintInfo.decimals);
            const sourceAta = await getAssociatedTokenAddress(mintPubkey, fromPubkey);
            const destinationAta = await getAssociatedTokenAddress(mintPubkey, toPubkey);
            const instructions = [];
            const sourceAccount = await getAccount(connection, sourceAta);
            if (sourceAccount.amount < BigInt(adjustedAmount)) {
                throw new Error(`Insufficient token balance. Have ${sourceAccount.amount}, need ${adjustedAmount}`);
            }
            try {
                await getAccount(connection, destinationAta);
            }
            catch {
                instructions.push(createAssociatedTokenAccountInstruction(fromPubkey, destinationAta, toPubkey, mintPubkey));
            }
            instructions.push(createTransferCheckedInstruction(sourceAta, mintPubkey, destinationAta, fromPubkey, adjustedAmount, mintInfo.decimals));
            const tx = new web3_js_1.VersionedTransaction(web3_js_1.MessageV0.compile({
                payerKey: fromPubkey,
                instructions: instructions,
                recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
            }));
            const signature = await walletProvider.signAndSendTransaction(tx);
            await walletProvider.waitForSignatureResult(signature);
            return [
                `Successfully transferred ${args.amount} tokens to ${args.recipient}`,
                `Token mint: ${args.mintAddress}`,
                `Signature: ${signature}`,
            ].join("\n");
        }
        catch (error) {
            return `Error transferring SPL tokens: ${error}`;
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
        return network.protocolFamily === "svm";
    }
}
exports.SplActionProvider = SplActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "get_balance",
        description: `
    This tool will get the balance of SPL tokens for an address.
    - Mint address must be a valid SPL token mint
    - If no address is provided, uses the connected wallet's address
    - Returns the token balance in token units (not raw)
    `,
        schema: schemas_1.GetBalanceSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [svmWalletProvider_1.SvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], SplActionProvider.prototype, "getBalance", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "transfer",
        description: `
    This tool will transfer SPL tokens to another address.
    - Amount should be specified in token units (not raw)
    - Recipient must be a valid Solana address
    - Mint address must be a valid SPL token mint
    - Ensures sufficient token balance before transfer
    - Returns transaction details
    `,
        schema: schemas_1.TransferTokenSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [svmWalletProvider_1.SvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], SplActionProvider.prototype, "transfer", null);
/**
 * Factory function to create a new SplActionProvider instance.
 *
 * @returns A new SplActionProvider instance
 */
const splActionProvider = () => new SplActionProvider();
exports.splActionProvider = splActionProvider;
