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
exports.basenameActionProvider = exports.BasenameActionProvider = void 0;
const viem_1 = require("viem");
const zod_1 = require("zod");
const actionProvider_1 = require("../actionProvider");
const actionDecorator_1 = require("../actionDecorator");
const constants_1 = require("./constants");
const schemas_1 = require("./schemas");
const wallet_providers_1 = require("../../wallet-providers");
/**
 * Action provider for registering Basenames.
 */
class BasenameActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructs a new BasenameActionProvider.
     */
    constructor() {
        super("basename", []);
        /**
         * Checks if the Basename action provider supports the given network.
         *
         * @param network - The network to check.
         * @returns True if the Basename action provider supports the network, false otherwise.
         */
        this.supportsNetwork = (network) => network.networkId === "base-mainnet" || network.networkId === "base-sepolia";
    }
    /**
     * Registers a Basename.
     *
     * @param wallet - The wallet to use for the registration.
     * @param args - The arguments for the registration.
     * @returns A string indicating the success or failure of the registration.
     */
    async register(wallet, args) {
        const address = wallet.getAddress();
        const isMainnet = wallet.getNetwork().networkId === "base-mainnet";
        const suffix = isMainnet ? ".base.eth" : ".basetest.eth";
        if (!args.basename.endsWith(suffix)) {
            args.basename += suffix;
        }
        const l2ResolverAddress = isMainnet ? constants_1.L2_RESOLVER_ADDRESS_MAINNET : constants_1.L2_RESOLVER_ADDRESS_TESTNET;
        const addressData = (0, viem_1.encodeFunctionData)({
            abi: constants_1.L2_RESOLVER_ABI,
            functionName: "setAddr",
            args: [(0, viem_1.namehash)(args.basename), address],
        });
        const nameData = (0, viem_1.encodeFunctionData)({
            abi: constants_1.L2_RESOLVER_ABI,
            functionName: "setName",
            args: [(0, viem_1.namehash)(args.basename), args.basename],
        });
        try {
            const contractAddress = isMainnet
                ? constants_1.BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_MAINNET
                : constants_1.BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_TESTNET;
            const hash = await wallet.sendTransaction({
                to: contractAddress,
                data: (0, viem_1.encodeFunctionData)({
                    abi: constants_1.REGISTRAR_ABI,
                    functionName: "register",
                    args: [
                        {
                            name: args.basename.replace(suffix, ""),
                            owner: address,
                            duration: constants_1.REGISTRATION_DURATION,
                            resolver: l2ResolverAddress,
                            data: [addressData, nameData],
                            reverseRecord: true,
                        },
                    ],
                }),
                value: (0, viem_1.parseEther)(args.amount),
            });
            await wallet.waitForTransactionReceipt(hash);
            return `Successfully registered basename ${args.basename} for address ${address}`;
        }
        catch (error) {
            return `Error registering basename: Error: ${error}`;
        }
    }
}
exports.BasenameActionProvider = BasenameActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "register_basename",
        description: `
This tool will register a Basename for the agent. The agent should have a wallet associated to register a Basename.
When your network ID is 'base-mainnet' (also sometimes known simply as 'base'), the name must end with .base.eth, and when your network ID is 'base-sepolia', it must ends with .basetest.eth.
Do not suggest any alternatives and never try to register a Basename with another postfix. The prefix of the name must be unique so if the registration of the
Basename fails, you should prompt to try again with a more unique name.
`,
        schema: schemas_1.RegisterBasenameSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], BasenameActionProvider.prototype, "register", null);
const basenameActionProvider = () => new BasenameActionProvider();
exports.basenameActionProvider = basenameActionProvider;
