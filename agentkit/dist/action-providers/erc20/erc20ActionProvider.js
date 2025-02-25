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
exports.erc20ActionProvider = exports.ERC20ActionProvider = void 0;
const zod_1 = require("zod");
const actionProvider_1 = require("../actionProvider");
const actionDecorator_1 = require("../actionDecorator");
const schemas_1 = require("./schemas");
const constants_1 = require("./constants");
const viem_1 = require("viem");
const wallet_providers_1 = require("../../wallet-providers");
/**
 * ERC20ActionProvider is an action provider for ERC20 tokens.
 */
class ERC20ActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructor for the ERC20ActionProvider.
     */
    constructor() {
        super("erc20", []);
        /**
         * Checks if the ERC20 action provider supports the given network.
         *
         * @param network - The network to check.
         * @returns True if the ERC20 action provider supports the network, false otherwise.
         */
        this.supportsNetwork = (network) => network.protocolFamily === "evm";
    }
    /**
     * Gets the balance of an ERC20 token.
     *
     * @param walletProvider - The wallet provider to get the balance from.
     * @param args - The input arguments for the action.
     * @returns A message containing the balance.
     */
    async getBalance(walletProvider, args) {
        try {
            const balance = await walletProvider.readContract({
                address: args.contractAddress,
                abi: constants_1.abi,
                functionName: "balanceOf",
                args: [walletProvider.getAddress()],
            });
            return `Balance of ${args.contractAddress} is ${balance}`;
        }
        catch (error) {
            return `Error getting balance: ${error}`;
        }
    }
    /**
     * Transfers a specified amount of an ERC20 token to a destination onchain.
     *
     * @param walletProvider - The wallet provider to transfer the asset from.
     * @param args - The input arguments for the action.
     * @returns A message containing the transfer details.
     */
    async transfer(walletProvider, args) {
        try {
            const hash = await walletProvider.sendTransaction({
                to: args.contractAddress,
                data: (0, viem_1.encodeFunctionData)({
                    abi: constants_1.abi,
                    functionName: "transfer",
                    args: [args.destination, BigInt(args.amount)],
                }),
            });
            await walletProvider.waitForTransactionReceipt(hash);
            return `Transferred ${args.amount} of ${args.contractAddress} to ${args.destination}.\nTransaction hash for the transfer: ${hash}`;
        }
        catch (error) {
            return `Error transferring the asset: ${error}`;
        }
    }
}
exports.ERC20ActionProvider = ERC20ActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "get_balance",
        description: `
    This tool will get the balance of an ERC20 asset in the wallet. It takes the contract address as input.
    `,
        schema: schemas_1.GetBalanceSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], ERC20ActionProvider.prototype, "getBalance", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "transfer",
        description: `
    This tool will transfer an ERC20 token from the wallet to another onchain address.

It takes the following inputs:
- amount: The amount to transfer
- contractAddress: The contract address of the token to transfer
- destination: Where to send the funds (can be an onchain address, ENS 'example.eth', or Basename 'example.base.eth')

Important notes:
- Ensure sufficient balance of the input asset before transferring
- When sending native assets (e.g. 'eth' on base-mainnet), ensure there is sufficient balance for the transfer itself AND the gas cost of this transfer
    `,
        schema: schemas_1.TransferSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], ERC20ActionProvider.prototype, "transfer", null);
const erc20ActionProvider = () => new ERC20ActionProvider();
exports.erc20ActionProvider = erc20ActionProvider;
