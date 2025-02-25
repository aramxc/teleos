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
exports.wowActionProvider = exports.WowActionProvider = void 0;
const zod_1 = require("zod");
const actionProvider_1 = require("../actionProvider");
const wallet_providers_1 = require("../../wallet-providers");
const actionDecorator_1 = require("../actionDecorator");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const utils_2 = require("./uniswap/utils");
const viem_1 = require("viem");
const schemas_1 = require("./schemas");
/**
 * WowActionProvider is an action provider for Wow protocol interactions.
 */
class WowActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructor for the WowActionProvider class.
     */
    constructor() {
        super("wow", []);
        /**
         * Checks if the Wow action provider supports the given network.
         *
         * @param network - The network to check.
         * @returns True if the Wow action provider supports the network, false otherwise.
         */
        this.supportsNetwork = (network) => network.protocolFamily === "evm" && constants_1.SUPPORTED_NETWORKS.includes(network.networkId);
    }
    /**
     * Buys a Zora Wow ERC20 memecoin with ETH.
     *
     * @param walletProvider - The wallet to create the token from.
     * @param args - The input arguments for the action.
     * @returns A message containing the token purchase details.
     */
    async buyToken(walletProvider, args) {
        try {
            const tokenQuote = await (0, utils_1.getBuyQuote)(walletProvider, args.contractAddress, args.amountEthInWei);
            // Multiply by 99/100 and floor to get 99% of quote as minimum
            const minTokens = BigInt(Math.floor(Number(tokenQuote) * 99)) / BigInt(100);
            const hasGraduated = await (0, utils_2.getHasGraduated)(walletProvider, args.contractAddress);
            const data = (0, viem_1.encodeFunctionData)({
                abi: constants_1.WOW_ABI,
                functionName: "buy",
                args: [
                    walletProvider.getAddress(),
                    walletProvider.getAddress(),
                    "0x0000000000000000000000000000000000000000",
                    "",
                    hasGraduated ? 1n : 0n,
                    minTokens,
                    0n,
                ],
            });
            const txHash = await walletProvider.sendTransaction({
                to: args.contractAddress,
                data,
                value: BigInt(args.amountEthInWei),
            });
            await walletProvider.waitForTransactionReceipt(txHash);
            return `Purchased WoW ERC20 memecoin with transaction hash: ${txHash}`;
        }
        catch (error) {
            return `Error buying Zora Wow ERC20 memecoin: ${error}`;
        }
    }
    /**
     * Creates a Zora Wow ERC20 memecoin.
     *
     * @param wallet - The wallet to create the token from.
     * @param args - The input arguments for the action.
     * @returns A message containing the token creation details.
     */
    async createToken(wallet, args) {
        const factoryAddress = (0, constants_1.getFactoryAddress)(wallet.getNetwork().networkId);
        try {
            const data = (0, viem_1.encodeFunctionData)({
                abi: constants_1.WOW_FACTORY_ABI,
                functionName: "deploy",
                args: [
                    wallet.getAddress(),
                    "0x0000000000000000000000000000000000000000",
                    args.tokenUri || constants_1.GENERIC_TOKEN_METADATA_URI,
                    args.name,
                    args.symbol,
                ],
            });
            const txHash = await wallet.sendTransaction({
                to: factoryAddress,
                data,
            });
            await wallet.waitForTransactionReceipt(txHash);
            return `Created WoW ERC20 memecoin ${args.name} with symbol ${args.symbol} on network ${wallet.getNetwork().networkId}.\nTransaction hash: ${txHash}`;
        }
        catch (error) {
            return `Error creating Zora Wow ERC20 memecoin: ${error}`;
        }
    }
    /**
     * Sells WOW tokens for ETH.
     *
     * @param walletProvider - The wallet to sell the tokens from.
     * @param args - The input arguments for the action.
     * @returns A message confirming the sale with the transaction hash.
     */
    async sellToken(walletProvider, args) {
        try {
            const ethQuote = await (0, utils_1.getSellQuote)(walletProvider, args.contractAddress, args.amountTokensInWei);
            const hasGraduated = await (0, utils_2.getHasGraduated)(walletProvider, args.contractAddress);
            // Multiply by 98/100 and floor to get 98% of quote as minimum
            const minEth = BigInt(Math.floor(Number(ethQuote) * 98)) / BigInt(100);
            const data = (0, viem_1.encodeFunctionData)({
                abi: constants_1.WOW_ABI,
                functionName: "sell",
                args: [
                    BigInt(args.amountTokensInWei),
                    walletProvider.getAddress(),
                    "0x0000000000000000000000000000000000000000",
                    "",
                    hasGraduated ? 1n : 0n,
                    minEth,
                    0n,
                ],
            });
            const txHash = await walletProvider.sendTransaction({
                to: args.contractAddress,
                data,
            });
            await walletProvider.waitForTransactionReceipt(txHash);
            return `Sold WoW ERC20 memecoin with transaction hash: ${txHash}`;
        }
        catch (error) {
            return `Error selling Zora Wow ERC20 memecoin: ${error}`;
        }
    }
}
exports.WowActionProvider = WowActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "buy_token",
        description: `
This tool can only be used to buy a Zora Wow ERC20 memecoin (also can be referred to as a bonding curve token) with ETH.
Do not use this tool for any other purpose, or trading other assets.

Inputs:
- WOW token contract address
- Address to receive the tokens  
- Amount of ETH to spend (in wei)

Important notes:
- The amount is a string and cannot have any decimal points, since the unit of measurement is wei.
- Make sure to use the exact amount provided, and if there's any doubt, check by getting more information before continuing with the action. 
- 1 wei = 0.000000000000000001 ETH
- Minimum purchase amount is 100000000000000 wei (0.0000001 ETH)
- Only supported on the following networks:
  - Base Sepolia (ie, 'base-sepolia')
  - Base Mainnet (ie, 'base', 'base-mainnet')`,
        schema: schemas_1.WowBuyTokenInput,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], WowActionProvider.prototype, "buyToken", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "create_token",
        description: `
This tool can only be used to create a Zora Wow ERC20 memecoin (also can be referred to as a bonding curve token) using the WoW factory.
Do not use this tool for any other purpose, or for creating other types of tokens.

Inputs:
- Token name (e.g. WowCoin)
- Token symbol (e.g. WOW) 
- Token URI (optional) - Contains metadata about the token

Important notes:
- Uses a bonding curve - no upfront liquidity needed
- Only supported on the following networks:
  - Base Sepolia (ie, 'base-sepolia')
  - Base Mainnet (ie, 'base', 'base-mainnet')`,
        schema: schemas_1.WowCreateTokenInput,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], WowActionProvider.prototype, "createToken", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "sell_token",
        description: `
This tool can only be used to sell a Zora Wow ERC20 memecoin (also can be referred to as a bonding curve token) for ETH.
Do not use this tool for any other purpose, or trading other assets.

Inputs:
- WOW token contract address
- Amount of tokens to sell (in wei)

Important notes:
- The amount is a string and cannot have any decimal points, since the unit of measurement is wei.
- Make sure to use the exact amount provided, and if there's any doubt, check by getting more information before continuing with the action. 
- 1 wei = 0.000000000000000001 ETH
- Minimum purchase amount is 100000000000000 wei (0.0000001 ETH)
- Only supported on the following networks:
  - Base Sepolia (ie, 'base-sepolia')
  - Base Mainnet (ie, 'base', 'base-mainnet')`,
        schema: schemas_1.WowSellTokenInput,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], WowActionProvider.prototype, "sellToken", null);
const wowActionProvider = () => new WowActionProvider();
exports.wowActionProvider = wowActionProvider;
