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
exports.moonwellActionProvider = exports.MoonwellActionProvider = exports.SUPPORTED_NETWORKS = void 0;
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
 * MoonwellActionProvider is an action provider for Moonwell MToken interactions.
 */
class MoonwellActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructor for the MoonwellActionProvider class.
     */
    constructor() {
        super("moonwell", []);
        /**
         * Checks if the Moonwell action provider supports the given network.
         *
         * @param network - The network to check.
         * @returns True if the Moonwell action provider supports the network, false otherwise.
         */
        this.supportsNetwork = (network) => network.protocolFamily === "evm" && exports.SUPPORTED_NETWORKS.includes(network.networkId);
    }
    /**
     * Deposits assets into a Moonwell MToken
     *
     * @param wallet - The wallet instance to execute the transaction
     * @param args - The input arguments for the action
     * @returns A success message with transaction details or an error message
     */
    async mint(wallet, args) {
        const assets = new decimal_js_1.Decimal(args.assets);
        if (assets.comparedTo(new decimal_js_1.Decimal(0.0)) != 1) {
            return "Error: Assets amount must be greater than 0";
        }
        const network = wallet.getNetwork();
        const networkObject = network.networkId === "base-mainnet"
            ? constants_1.MOONWELL_BASE_ADDRESSES
            : constants_1.MOONWELL_BASE_SEPOLIA_ADDRESSES;
        if (!networkObject[args.mTokenAddress]) {
            return "Error: Invalid MToken address";
        }
        try {
            // Handle different token decimals
            let atomicAssets;
            const userAddress = wallet.getAddress();
            if (network.networkId === "base-mainnet" &&
                "MOONWELL_WETH" === networkObject[args.mTokenAddress]) {
                // For ETH minting, use parseEther (18 decimals)
                atomicAssets = (0, viem_1.parseEther)(args.assets);
            }
            else {
                // For other tokens, use the correct decimals
                const decimals = constants_1.TOKEN_DECIMALS[args.tokenAddress];
                if (!decimals) {
                    return `Error: Unsupported token address ${args.tokenAddress}. Please verify the token address is correct.`;
                }
                atomicAssets = (0, viem_1.parseUnits)(args.assets, decimals);
            }
            // Check if this is a WETH mint on mainnet
            if (network.networkId === "base-mainnet" &&
                "MOONWELL_WETH" === networkObject[args.mTokenAddress]) {
                // Use the router for ETH mints - no approval needed since we're sending native ETH
                const data = (0, viem_1.encodeFunctionData)({
                    abi: constants_1.ETH_ROUTER_ABI,
                    functionName: "mint",
                    args: [userAddress],
                });
                const txHash = await wallet.sendTransaction({
                    to: constants_1.WETH_ROUTER_ADDRESS,
                    data,
                    value: atomicAssets,
                });
                const receipt = await wallet.waitForTransactionReceipt(txHash);
                return `Deposited ${args.assets} ETH to Moonwell WETH via router with transaction hash: ${txHash}\nTransaction receipt: ${JSON.stringify(receipt, (_, value) => (typeof value === "bigint" ? value.toString() : value))}`;
            }
            else {
                // For all other tokens, we need approval first
                const approvalResult = await (0, utils_1.approve)(wallet, args.tokenAddress, args.mTokenAddress, atomicAssets);
                if (approvalResult.startsWith("Error")) {
                    return `Error approving Moonwell MToken as spender: ${approvalResult}`;
                }
                const data = (0, viem_1.encodeFunctionData)({
                    abi: constants_1.MTOKEN_ABI,
                    functionName: "mint",
                    args: [atomicAssets],
                });
                const txHash = await wallet.sendTransaction({
                    to: args.mTokenAddress,
                    data,
                    value: 0n,
                });
                const receipt = await wallet.waitForTransactionReceipt(txHash);
                if (!receipt) {
                    throw new Error("No receipt received for mint transaction");
                }
                if (receipt.status !== "success") {
                    throw new Error(`Mint transaction failed with status ${receipt.status}`);
                }
                return `Deposited ${args.assets} to Moonwell MToken ${args.mTokenAddress} with transaction hash: ${txHash}\nTransaction receipt: ${JSON.stringify(receipt, (_, value) => (typeof value === "bigint" ? value.toString() : value))}`;
            }
        }
        catch (error) {
            console.error("DEBUG - Mint error:", error);
            if (error instanceof Error) {
                return `Error minting Moonwell MToken: ${error.message}`;
            }
            return `Error minting Moonwell MToken: ${error}`;
        }
    }
    /**
     * Redeems assets from a Moonwell MToken
     *
     * @param wallet - The wallet instance to execute the transaction
     * @param args - The input arguments for the action
     * @returns A success message with transaction details or an error message
     */
    async redeem(wallet, args) {
        const assets = new decimal_js_1.Decimal(args.assets);
        if (assets.comparedTo(new decimal_js_1.Decimal(0.0)) != 1) {
            return "Error: Assets amount must be greater than 0";
        }
        const network = wallet.getNetwork();
        const networkObject = network.networkId === "base-mainnet"
            ? constants_1.MOONWELL_BASE_ADDRESSES
            : constants_1.MOONWELL_BASE_SEPOLIA_ADDRESSES;
        if (!networkObject[args.mTokenAddress]) {
            return "Error: Invalid MToken address";
        }
        try {
            // Handle different token decimals
            const decimals = constants_1.MTOKENS_UNDERLYING_DECIMALS[constants_1.MOONWELL_BASE_ADDRESSES[args.mTokenAddress]];
            if (!decimals) {
                return `Error: Unsupported token address ${args.mTokenAddress}. Please verify the token address is correct.`;
            }
            const atomicAssets = (0, viem_1.parseUnits)(args.assets, decimals);
            const data = (0, viem_1.encodeFunctionData)({
                abi: constants_1.MTOKEN_ABI,
                functionName: "redeemUnderlying",
                args: [atomicAssets],
            });
            const txHash = await wallet.sendTransaction({
                to: args.mTokenAddress,
                data,
                value: 0n,
            });
            const receipt = await wallet.waitForTransactionReceipt(txHash);
            if (!receipt) {
                throw new Error("No receipt received for redeem transaction");
            }
            if (receipt.status !== "success") {
                throw new Error(`Redeem transaction failed with status ${receipt.status}`);
            }
            return `Redeemed ${args.assets} from Moonwell MToken ${args.mTokenAddress} with transaction hash: ${txHash}\nTransaction receipt: ${JSON.stringify(receipt, (_, value) => (typeof value === "bigint" ? value.toString() : value))}`;
        }
        catch (error) {
            console.error("DEBUG - Redeem error:", error);
            if (error instanceof Error) {
                return `Error redeeming from Moonwell MToken: ${error.message}`;
            }
            return `Error redeeming from Moonwell MToken: ${error}`;
        }
    }
}
exports.MoonwellActionProvider = MoonwellActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "mint",
        description: `
This tool allows minting assets into a Moonwell MToken. 

It takes:
- mTokenAddress: The address of the Moonwell MToken to mint to
- assets: The amount of assets that will be approved to spend by the mToken in whole units
  Examples for WETH:
  - 1 WETH
  - 0.1 WETH
  - 0.01 WETH
  Examples for cbETH:
  - 1 cbETH
  - 0.1 cbETH
  - 0.01 cbETH
  Examples for USDC:
  - 1 USDC
  - 0.1 USDC
  - 0.01 USDC
- tokenAddress: The address of the token to approve

Important notes:
- Make sure to use the exact amount provided. Do not convert units for assets for this action.
- Please use a token address (example 0x4200000000000000000000000000000000000006) for the tokenAddress field.
- This tool handles token approval. If requested to mint on Moonwell, do not use any other actions to approve tokens.
`,
        schema: schemas_1.MintSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], MoonwellActionProvider.prototype, "mint", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "redeem",
        description: `
This tool allows redeeming assets from a Moonwell MToken. 

It takes:
- mTokenAddress: The address of the Moonwell MToken to redeem from
- assets: The amount of assets to redeem in whole units
  Examples for WETH:
  - 1 WETH
  - 0.1 WETH
  - 0.01 WETH
  Examples for cbETH:
  - 1 cbETH
  - 0.1 cbETH
  - 0.01 cbETH
  Examples for USDC:
  - 1 USDC
  - 0.1 USDC
  - 0.01 USDC

Important notes:
- Make sure to use the exact amount provided. Do not convert units for assets for this action.
- Please use a token address (example 0x4200000000000000000000000000000000000006) for the tokenAddress field.
`,
        schema: schemas_1.RedeemSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], MoonwellActionProvider.prototype, "redeem", null);
const moonwellActionProvider = () => new MoonwellActionProvider();
exports.moonwellActionProvider = moonwellActionProvider;
