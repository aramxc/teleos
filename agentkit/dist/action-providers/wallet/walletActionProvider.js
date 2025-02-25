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
exports.walletActionProvider = exports.WalletActionProvider = void 0;
const zod_1 = require("zod");
const actionDecorator_1 = require("../actionDecorator");
const actionProvider_1 = require("../actionProvider");
const wallet_providers_1 = require("../../wallet-providers");
const schemas_1 = require("./schemas");
const PROTOCOL_FAMILY_TO_TERMINOLOGY = {
    evm: { unit: "WEI", displayUnit: "ETH", type: "Transaction hash", verb: "transaction" },
    svm: { unit: "LAMPORTS", displayUnit: "SOL", type: "Signature", verb: "transfer" },
};
const DEFAULT_TERMINOLOGY = { unit: "", displayUnit: "", type: "Hash", verb: "transfer" };
/**
 * WalletActionProvider provides actions for getting basic wallet information.
 */
class WalletActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructor for the WalletActionProvider.
     */
    constructor() {
        super("wallet", []);
        /**
         * Checks if the wallet action provider supports the given network.
         * Since wallet actions are network-agnostic, this always returns true.
         *
         * @param _ - The network to check.
         * @returns True, as wallet actions are supported on all networks.
         */
        this.supportsNetwork = (_) => true;
    }
    /**
     * Gets the details of the connected wallet including address, network, and balance.
     *
     * @param walletProvider - The wallet provider to get the details from.
     * @param _ - Empty args object (not used).
     * @returns A formatted string containing the wallet details.
     */
    async getWalletDetails(walletProvider, _) {
        try {
            const address = walletProvider.getAddress();
            const network = walletProvider.getNetwork();
            const balance = await walletProvider.getBalance();
            const name = walletProvider.getName();
            const terminology = PROTOCOL_FAMILY_TO_TERMINOLOGY[network.protocolFamily] || DEFAULT_TERMINOLOGY;
            return [
                "Wallet Details:",
                `- Provider: ${name}`,
                `- Address: ${address}`,
                "- Network:",
                `  * Protocol Family: ${network.protocolFamily}`,
                `  * Network ID: ${network.networkId || "N/A"}`,
                `  * Chain ID: ${network.chainId || "N/A"}`,
                `- Native Balance: ${balance.toString()} ${terminology.unit}`,
            ].join("\n");
        }
        catch (error) {
            return `Error getting wallet details: ${error}`;
        }
    }
    /**
     * Transfers a specified amount of native currency to a destination onchain.
     *
     * @param walletProvider - The wallet provider to transfer from.
     * @param args - The input arguments for the action.
     * @returns A message containing the transfer details.
     */
    async nativeTransfer(walletProvider, args) {
        try {
            const { protocolFamily } = walletProvider.getNetwork();
            const terminology = PROTOCOL_FAMILY_TO_TERMINOLOGY[protocolFamily] || DEFAULT_TERMINOLOGY;
            if (protocolFamily === "evm" && !args.to.startsWith("0x")) {
                args.to = `0x${args.to}`;
            }
            const result = await walletProvider.nativeTransfer(args.to, args.value);
            return [
                `Transferred ${args.value} ${terminology.displayUnit} to ${args.to}`,
                `${terminology.type}: ${result}`,
            ].join("\n");
        }
        catch (error) {
            const { protocolFamily } = walletProvider.getNetwork();
            const terminology = PROTOCOL_FAMILY_TO_TERMINOLOGY[protocolFamily] || DEFAULT_TERMINOLOGY;
            return `Error during ${terminology.verb}: ${error}`;
        }
    }
}
exports.WalletActionProvider = WalletActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "get_wallet_details",
        description: `
    This tool will return the details of the connected wallet including:
    - Wallet address
    - Network information (protocol family, network ID, chain ID)
    - Native token balance (ETH for EVM networks, SOL for Solana networks)
    - Wallet provider name
    `,
        schema: schemas_1.GetWalletDetailsSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.WalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], WalletActionProvider.prototype, "getWalletDetails", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "native_transfer",
        description: `
This tool will transfer native tokens from the wallet to another onchain address.

It takes the following inputs:
- amount: The amount to transfer in whole units (e.g. 1 ETH, 0.1 SOL)
- destination: The address to receive the funds

Important notes:
- Ensure sufficient balance of the input asset before transferring
- Ensure there is sufficient native token balance for gas fees
`,
        schema: schemas_1.NativeTransferSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.WalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], WalletActionProvider.prototype, "nativeTransfer", null);
/**
 * Factory function to create a new WalletActionProvider instance.
 *
 * @returns A new WalletActionProvider instance.
 */
const walletActionProvider = () => new WalletActionProvider();
exports.walletActionProvider = walletActionProvider;
