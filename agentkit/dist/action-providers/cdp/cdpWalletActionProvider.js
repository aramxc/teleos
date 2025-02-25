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
exports.cdpWalletActionProvider = exports.CdpWalletActionProvider = void 0;
const coinbase_sdk_1 = require("@coinbase/coinbase-sdk");
const zod_1 = require("zod");
const actionDecorator_1 = require("../actionDecorator");
const actionProvider_1 = require("../actionProvider");
const wallet_providers_1 = require("../../wallet-providers");
const constants_1 = require("./constants");
const schemas_1 = require("./schemas");
/**
 * CdpWalletActionProvider is an action provider for Cdp.
 *
 * This provider is used for any action that requires a CDP Wallet.
 */
class CdpWalletActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructor for the CdpWalletActionProvider class.
     *
     * @param config - The configuration options for the CdpWalletActionProvider.
     */
    constructor(config = {}) {
        super("cdp_wallet", []);
        /**
         * Checks if the Cdp action provider supports the given network.
         *
         * @param network - The network to check.
         * @returns True if the Cdp action provider supports the network, false otherwise.
         */
        this.supportsNetwork = (network) => network.protocolFamily === "evm";
        if (config.apiKeyName && config.apiKeyPrivateKey) {
            coinbase_sdk_1.Coinbase.configure({
                apiKeyName: config.apiKeyName,
                privateKey: config.apiKeyPrivateKey?.replace(/\\n/g, "\n"),
            });
        }
        else {
            coinbase_sdk_1.Coinbase.configureFromJson();
        }
    }
    /**
     * Deploys a contract.
     *
     * @param walletProvider - The wallet provider to deploy the contract from
     * @param args - The input arguments for the action
     * @returns A message containing the deployed contract address and details
     */
    async deployContract(walletProvider, args) {
        try {
            const solidityVersion = constants_1.SolidityVersions[args.solidityVersion];
            const contract = await walletProvider.deployContract({
                solidityVersion: solidityVersion,
                solidityInputJson: args.solidityInputJson,
                contractName: args.contractName,
                constructorArgs: args.constructorArgs ?? {},
            });
            const result = await contract.wait();
            return `Deployed contract ${args.contractName} at address ${result.getContractAddress()}. Transaction link: ${result
                .getTransaction()
                .getTransactionLink()}`;
        }
        catch (error) {
            return `Error deploying contract: ${error}`;
        }
    }
    /**
     * Deploys an NFT (ERC-721) token collection onchain from the wallet.
     *
     * @param walletProvider - The wallet provider to deploy the NFT from.
     * @param args - The input arguments for the action.
     * @returns A message containing the NFT token deployment details.
     */
    async deployNFT(walletProvider, args) {
        try {
            const nftContract = await walletProvider.deployNFT({
                name: args.name,
                symbol: args.symbol,
                baseURI: args.baseURI,
            });
            const result = await nftContract.wait();
            const transaction = result.getTransaction();
            const networkId = walletProvider.getNetwork().networkId;
            const contractAddress = result.getContractAddress();
            return [
                `Deployed NFT Collection ${args.name}:`,
                `- to address ${contractAddress}`,
                `- on network ${networkId}.`,
                `Transaction hash: ${transaction.getTransactionHash()}`,
                `Transaction link: ${transaction.getTransactionLink()}`,
            ].join("\n");
        }
        catch (error) {
            return `Error deploying NFT: ${error}`;
        }
    }
    /**
     * Deploys a token.
     *
     * @param walletProvider - The wallet provider to deploy the token.
     * @param args - The arguments for the token deployment.
     * @returns The deployed token.
     */
    async deployToken(walletProvider, args) {
        try {
            const tokenContract = await walletProvider.deployToken({
                name: args.name,
                symbol: args.symbol,
                totalSupply: args.totalSupply,
            });
            const result = await tokenContract.wait();
            return `Deployed ERC20 token contract ${args.name} (${args.symbol}) with total supply of ${args.totalSupply} tokens at address ${result.getContractAddress()}. Transaction link: ${result
                .getTransaction()
                .getTransactionLink()}`;
        }
        catch (error) {
            return `Error deploying token: ${error}`;
        }
    }
    /**
     * Trades a specified amount of a from asset to a to asset for the wallet.
     *
     * @param walletProvider - The wallet provider to trade the asset from.
     * @param args - The input arguments for the action.
     * @returns A message containing the trade details.
     */
    async trade(walletProvider, args) {
        try {
            const tradeResult = await walletProvider.createTrade({
                amount: args.amount,
                fromAssetId: args.fromAssetId,
                toAssetId: args.toAssetId,
            });
            const result = await tradeResult.wait();
            return `Traded ${args.amount} of ${args.fromAssetId} for ${result.getToAmount()} of ${args.toAssetId}.\nTransaction hash for the trade: ${result
                .getTransaction()
                .getTransactionHash()}\nTransaction link for the trade: ${result
                .getTransaction()
                .getTransactionLink()}`;
        }
        catch (error) {
            return `Error trading assets: ${error}`;
        }
    }
}
exports.CdpWalletActionProvider = CdpWalletActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "deploy_contract",
        description: `
Deploys smart contract with required args: solidity version (string), solidity input json (string), contract name (string), and optional constructor args (Dict[str, Any])

Input json structure:
{"language":"Solidity","settings":{"remappings":[],"outputSelection":{"*":{"*":["abi","evm.bytecode"]}}},"sources":{}}

You must set the outputSelection to {"*":{"*":["abi","evm.bytecode"]}} in the settings. The solidity version must be >= 0.8.0 and <= 0.8.28.

Sources should contain one or more contracts with the following structure:
{"contract_name.sol":{"content":"contract code"}}

The contract code should be escaped. Contracts cannot import from external contracts but can import from one another.

Constructor args are required if the contract has a constructor. They are a key-value
map where the key is the arg name and the value is the arg value. Encode uint/int/bytes/string/address values as strings, boolean values as true/false. For arrays/tuples, encode based on contained type.`,
        schema: schemas_1.DeployContractSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.CdpWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], CdpWalletActionProvider.prototype, "deployContract", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "deploy_nft",
        description: `This tool will deploy an NFT (ERC-721) contract onchain from the wallet. 
  It takes the name of the NFT collection, the symbol of the NFT collection, and the base URI for the token metadata as inputs.`,
        schema: schemas_1.DeployNftSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.CdpWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], CdpWalletActionProvider.prototype, "deployNFT", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "deploy_token",
        description: `This tool will deploy an ERC20 token smart contract. It takes the token name, symbol, and total supply as input. 
The token will be deployed using the wallet's default address as the owner and initial token holder.`,
        schema: schemas_1.DeployTokenSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.CdpWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], CdpWalletActionProvider.prototype, "deployToken", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "trade",
        description: `This tool will trade a specified amount of a 'from asset' to a 'to asset' for the wallet.
It takes the following inputs:
- The amount of the 'from asset' to trade
- The from asset ID to trade 
- The asset ID to receive from the trade

Important notes:
- Trades are only supported on mainnet networks (ie, 'base-mainnet', 'base', 'ethereum-mainnet', 'ethereum', etc.)
- Never allow trades on any non-mainnet network (ie, 'base-sepolia', 'ethereum-sepolia', etc.)
- When selling a native asset (e.g. 'eth' on base-mainnet), ensure there is sufficient balance to pay for the trade AND the gas cost of this trade`,
        schema: schemas_1.TradeSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.CdpWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], CdpWalletActionProvider.prototype, "trade", null);
const cdpWalletActionProvider = (config = {}) => new CdpWalletActionProvider(config);
exports.cdpWalletActionProvider = cdpWalletActionProvider;
