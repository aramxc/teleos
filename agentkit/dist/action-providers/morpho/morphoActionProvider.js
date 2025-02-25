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
exports.morphoActionProvider = exports.MorphoActionProvider = exports.SUPPORTED_NETWORKS = void 0;
const zod_1 = require("zod");
const decimal_js_1 = require("decimal.js");
const viem_1 = require("viem");
const actionProvider_1 = require("../actionProvider");
const wallet_providers_1 = require("../../wallet-providers");
const actionDecorator_1 = require("../actionDecorator");
const utils_1 = require("../../utils");
const constants_1 = require("./constants");
const schemas_1 = require("./schemas");
exports.SUPPORTED_NETWORKS = ["base-mainnet", "base-sepolia"];
/**
 * MorphoActionProvider is an action provider for Morpho Vault interactions.
 */
class MorphoActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructor for the MorphoActionProvider class.
     */
    constructor() {
        super("morpho", []);
        /**
         * Checks if the Morpho action provider supports the given network.
         *
         * @param network - The network to check.
         * @returns True if the Morpho action provider supports the network, false otherwise.
         */
        this.supportsNetwork = (network) => network.protocolFamily === "evm" && exports.SUPPORTED_NETWORKS.includes(network.networkId);
    }
    /**
     * Deposits assets into a Morpho Vault
     *
     * @param wallet - The wallet instance to execute the transaction
     * @param args - The input arguments for the action
     * @returns A success message with transaction details or an error message
     */
    async deposit(wallet, args) {
        const assets = new decimal_js_1.Decimal(args.assets);
        if (assets.comparedTo(new decimal_js_1.Decimal(0.0)) != 1) {
            return "Error: Assets amount must be greater than 0";
        }
        try {
            const atomicAssets = (0, viem_1.parseEther)(args.assets);
            const approvalResult = await (0, utils_1.approve)(wallet, args.tokenAddress, args.vaultAddress, atomicAssets);
            if (approvalResult.startsWith("Error")) {
                return `Error approving Morpho Vault as spender: ${approvalResult}`;
            }
            const data = (0, viem_1.encodeFunctionData)({
                abi: constants_1.METAMORPHO_ABI,
                functionName: "deposit",
                args: [atomicAssets, args.receiver],
            });
            const txHash = await wallet.sendTransaction({
                to: args.vaultAddress,
                data,
            });
            const receipt = await wallet.waitForTransactionReceipt(txHash);
            return `Deposited ${args.assets} to Morpho Vault ${args.vaultAddress} with transaction hash: ${txHash}\nTransaction receipt: ${JSON.stringify(receipt)}`;
        }
        catch (error) {
            return `Error depositing to Morpho Vault: ${error}`;
        }
    }
    /**
     * Withdraws assets from a Morpho Vault
     *
     * @param wallet - The wallet instance to execute the transaction
     * @param args - The input arguments for the action
     * @returns A success message with transaction details or an error message
     */
    async withdraw(wallet, args) {
        if (BigInt(args.assets) <= 0) {
            return "Error: Assets amount must be greater than 0";
        }
        try {
            const data = (0, viem_1.encodeFunctionData)({
                abi: constants_1.METAMORPHO_ABI,
                functionName: "withdraw",
                args: [BigInt(args.assets), args.receiver, args.receiver],
            });
            const txHash = await wallet.sendTransaction({
                to: args.vaultAddress,
                data,
            });
            const receipt = await wallet.waitForTransactionReceipt(txHash);
            return `Withdrawn ${args.assets} from Morpho Vault ${args.vaultAddress} with transaction hash: ${txHash}\nTransaction receipt: ${JSON.stringify(receipt)}`;
        }
        catch (error) {
            return `Error withdrawing from Morpho Vault: ${error}`;
        }
    }
}
exports.MorphoActionProvider = MorphoActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "deposit",
        description: `
This tool allows depositing assets into a Morpho Vault. 

It takes:
- vaultAddress: The address of the Morpho Vault to deposit to
- assets: The amount of assets to deposit in whole units
  Examples for WETH:
  - 1 WETH
  - 0.1 WETH
  - 0.01 WETH
- receiver: The address to receive the shares
- tokenAddress: The address of the token to approve

Important notes:
- Make sure to use the exact amount provided. Do not convert units for assets for this action.
- Please use a token address (example 0x4200000000000000000000000000000000000006) for the tokenAddress field.
`,
        schema: schemas_1.DepositSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], MorphoActionProvider.prototype, "deposit", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "withdraw",
        description: `
This tool allows withdrawing assets from a Morpho Vault. It takes:

- vaultAddress: The address of the Morpho Vault to withdraw from
- assets: The amount of assets to withdraw in atomic units (wei)
- receiver: The address to receive the shares
`,
        schema: schemas_1.WithdrawSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], MorphoActionProvider.prototype, "withdraw", null);
const morphoActionProvider = () => new MorphoActionProvider();
exports.morphoActionProvider = morphoActionProvider;
