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
exports.wethActionProvider = exports.WethActionProvider = void 0;
const zod_1 = require("zod");
const actionProvider_1 = require("../actionProvider");
const actionDecorator_1 = require("../actionDecorator");
const schemas_1 = require("./schemas");
const constants_1 = require("./constants");
const viem_1 = require("viem");
const wallet_providers_1 = require("../../wallet-providers");
/**
 * WethActionProvider is an action provider for WETH.
 */
class WethActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructor for the WethActionProvider.
     */
    constructor() {
        super("weth", []);
        /**
         * Checks if the Weth action provider supports the given network.
         *
         * @param network - The network to check.
         * @returns True if the Weth action provider supports the network, false otherwise.
         */
        this.supportsNetwork = (network) => network.networkId === "base-mainnet" || network.networkId === "base-sepolia";
    }
    /**
     * Wraps ETH to WETH.
     *
     * @param walletProvider - The wallet provider to use for the action.
     * @param args - The input arguments for the action.
     * @returns A message containing the transaction hash.
     */
    async wrapEth(walletProvider, args) {
        try {
            const hash = await walletProvider.sendTransaction({
                to: constants_1.WETH_ADDRESS,
                data: (0, viem_1.encodeFunctionData)({
                    abi: constants_1.WETH_ABI,
                    functionName: "deposit",
                }),
                value: BigInt(args.amountToWrap),
            });
            await walletProvider.waitForTransactionReceipt(hash);
            return `Wrapped ETH with transaction hash: ${hash}`;
        }
        catch (error) {
            return `Error wrapping ETH: ${error}`;
        }
    }
}
exports.WethActionProvider = WethActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "wrap_eth",
        description: `
    This tool can only be used to wrap ETH to WETH.
Do not use this tool for any other purpose, or trading other assets.

Inputs:
- Amount of ETH to wrap.

Important notes:
- The amount is a string and cannot have any decimal points, since the unit of measurement is wei.
- Make sure to use the exact amount provided, and if there's any doubt, check by getting more information before continuing with the action.
- 1 wei = 0.000000000000000001 WETH
- Minimum purchase amount is 100000000000000 wei (0.0000001 WETH)
- Only supported on the following networks:
  - Base Sepolia (ie, 'base-sepolia')
  - Base Mainnet (ie, 'base', 'base-mainnet')
`,
        schema: schemas_1.WrapEthSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], WethActionProvider.prototype, "wrapEth", null);
const wethActionProvider = () => new WethActionProvider();
exports.wethActionProvider = wethActionProvider;
