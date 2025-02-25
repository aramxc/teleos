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
exports.cdpApiActionProvider = exports.CdpApiActionProvider = void 0;
const package_json_1 = require("../../../package.json");
const coinbase_sdk_1 = require("@coinbase/coinbase-sdk");
const zod_1 = require("zod");
const actionDecorator_1 = require("../actionDecorator");
const actionProvider_1 = require("../actionProvider");
const wallet_providers_1 = require("../../wallet-providers");
const schemas_1 = require("./schemas");
/**
 * CdpApiActionProvider is an action provider for CDP API.
 *
 * This provider is used for any action that uses the CDP API, but does not require a CDP Wallet.
 */
class CdpApiActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructor for the CdpApiActionProvider class.
     *
     * @param config - The configuration options for the CdpApiActionProvider.
     */
    constructor(config = {}) {
        super("cdp_api", []);
        /**
         * Checks if the Cdp action provider supports the given network.
         *
         * NOTE: Network scoping is done at the action implementation level
         *
         * @param _ - The network to check.
         * @returns True if the Cdp action provider supports the network, false otherwise.
         */
        this.supportsNetwork = (_) => true;
        if (config.apiKeyName && config.apiKeyPrivateKey) {
            coinbase_sdk_1.Coinbase.configure({
                apiKeyName: config.apiKeyName,
                privateKey: config.apiKeyPrivateKey?.replace(/\\n/g, "\n"),
                source: "agentkit",
                sourceVersion: package_json_1.version,
            });
        }
        else {
            coinbase_sdk_1.Coinbase.configureFromJson();
        }
    }
    /**
     * Check the reputation of an address.
     *
     * @param args - The input arguments for the action
     * @returns A string containing reputation data or error message
     */
    async addressReputation(args) {
        if (args.network.includes("solana")) {
            return "Address reputation is only supported on Ethereum networks.";
        }
        try {
            const address = new coinbase_sdk_1.ExternalAddress(args.network, args.address);
            const reputation = await address.reputation();
            return reputation.toString();
        }
        catch (error) {
            return `Error checking address reputation: ${error}`;
        }
    }
    /**
     * Requests test tokens from the faucet for the default address in the wallet.
     *
     * @param walletProvider - The wallet provider to request funds from.
     * @param args - The input arguments for the action.
     * @returns A confirmation message with transaction details.
     */
    async faucet(walletProvider, args) {
        const network = walletProvider.getNetwork();
        if (network.networkId !== "base-sepolia" && network.networkId !== "solana-devnet") {
            return `Faucet is only allowed on 'base-sepolia' or 'solana-devnet'.`;
        }
        try {
            const address = new coinbase_sdk_1.ExternalAddress(walletProvider.getNetwork().networkId, walletProvider.getAddress());
            const faucetTx = await address.faucet(args.assetId || undefined);
            const result = await faucetTx.wait({ timeoutSeconds: 60 });
            return `Received ${args.assetId || "ETH"} from the faucet. Transaction: ${result.getTransactionLink()}`;
        }
        catch (error) {
            return `Error requesting faucet funds: ${error}`;
        }
    }
}
exports.CdpApiActionProvider = CdpApiActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "address_reputation",
        description: `
This tool checks the reputation of an address on a given network. It takes:

- network: The network to check the address on (e.g. "base-mainnet")
- address: The Ethereum address to check
`,
        schema: schemas_1.AddressReputationSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", Promise)
], CdpApiActionProvider.prototype, "addressReputation", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "request_faucet_funds",
        description: `This tool will request test tokens from the faucet for the default address in the wallet. It takes the wallet and asset ID as input.
Faucet is only allowed on 'base-sepolia' or 'solana-devnet'.
If fauceting on 'base-sepolia', user can only provide asset ID 'eth' or 'usdc', if no asset ID is provided, the faucet will default to 'eth'.
If fauceting on 'solana-devnet', user can only provide asset ID 'sol', if no asset ID is provided, the faucet will default to 'sol'.
You are not allowed to faucet with any other network or asset ID. If you are on another network, suggest that the user sends you some ETH
from another wallet and provide the user with your wallet details.`,
        schema: schemas_1.RequestFaucetFundsSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.WalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], CdpApiActionProvider.prototype, "faucet", null);
const cdpApiActionProvider = (config = {}) => new CdpApiActionProvider(config);
exports.cdpApiActionProvider = cdpApiActionProvider;
