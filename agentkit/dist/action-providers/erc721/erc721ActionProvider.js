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
exports.erc721ActionProvider = exports.Erc721ActionProvider = void 0;
const zod_1 = require("zod");
const actionProvider_1 = require("../actionProvider");
const wallet_providers_1 = require("../../wallet-providers");
const actionDecorator_1 = require("../actionDecorator");
const schemas_1 = require("./schemas");
const constants_1 = require("./constants");
const viem_1 = require("viem");
/**
 * Erc721ActionProvider is an action provider for Erc721 contract interactions.
 */
class Erc721ActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructor for the Erc721ActionProvider class.
     */
    constructor() {
        super("erc721", []);
        /**
         * Checks if the Erc721 action provider supports the given network.
         *
         * @param network - The network to check.
         * @returns True if the Erc721 action provider supports the network, false otherwise.
         */
        this.supportsNetwork = (network) => network.protocolFamily === "evm";
    }
    /**
     * Mints an NFT (ERC-721) to a specified destination address onchain.
     *
     * @param walletProvider - The wallet provider to mint the NFT from.
     * @param args - The input arguments for the action.
     * @returns A message containing the NFT mint details.
     */
    async mint(walletProvider, args) {
        try {
            const data = (0, viem_1.encodeFunctionData)({
                abi: constants_1.ERC721_ABI,
                functionName: "mint",
                args: [args.destination, 1n],
            });
            const hash = await walletProvider.sendTransaction({
                to: args.contractAddress,
                data,
            });
            await walletProvider.waitForTransactionReceipt(hash);
            return `Successfully minted NFT ${args.contractAddress} to ${args.destination}`;
        }
        catch (error) {
            return `Error minting NFT ${args.contractAddress} to ${args.destination}: ${error}`;
        }
    }
    /**
     * Transfers an NFT (ERC721 token) to a destination address.
     *
     * @param walletProvider - The wallet provider to transfer the NFT from.
     * @param args - The input arguments for the action.
     * @returns A message containing the transfer details.
     */
    async transfer(walletProvider, args) {
        try {
            const data = (0, viem_1.encodeFunctionData)({
                abi: constants_1.ERC721_ABI,
                functionName: "transferFrom",
                args: [args.fromAddress, args.destination, BigInt(args.tokenId)],
            });
            const hash = await walletProvider.sendTransaction({
                to: args.contractAddress,
                data,
            });
            await walletProvider.waitForTransactionReceipt(hash);
            return `Successfully transferred NFT ${args.contractAddress} with tokenId ${args.tokenId} to ${args.destination}`;
        }
        catch (error) {
            return `Error transferring NFT ${args.contractAddress} with tokenId ${args.tokenId} to ${args.destination}: ${error}`;
        }
    }
    /**
     * Gets the NFT balance for a given address and contract.
     *
     * @param walletProvider - The wallet provider to check the balance with.
     * @param args - The input arguments for the action.
     * @returns A message containing the NFT balance details.
     */
    async getBalance(walletProvider, args) {
        try {
            const address = args.address || walletProvider.getAddress();
            const balance = await walletProvider.readContract({
                address: args.contractAddress,
                abi: constants_1.ERC721_ABI,
                functionName: "balanceOf",
                args: [address],
            });
            return `Balance of NFTs for contract ${args.contractAddress} at address ${address} is ${balance}`;
        }
        catch (error) {
            return `Error getting NFT balance for contract ${args.contractAddress}: ${error}`;
        }
    }
}
exports.Erc721ActionProvider = Erc721ActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "mint",
        description: `
This tool will mint an NFT (ERC-721) to a specified destination address onchain via a contract invocation. 
It takes the contract address of the NFT onchain and the destination address onchain that will receive the NFT as inputs. 
Do not use the contract address as the destination address. If you are unsure of the destination address, please ask the user before proceeding.
`,
        schema: schemas_1.MintSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], Erc721ActionProvider.prototype, "mint", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "transfer",
        description: `
This tool will transfer an NFT (ERC721 token) from the wallet to another onchain address.

It takes the following inputs:
- contractAddress: The NFT contract address
- tokenId: The ID of the specific NFT to transfer
- destination: Onchain address to send the NFT

Important notes:
- Ensure you have ownership of the NFT before attempting transfer
- Ensure there is sufficient native token balance for gas fees
- The wallet must either own the NFT or have approval to transfer it
`,
        schema: schemas_1.TransferSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], Erc721ActionProvider.prototype, "transfer", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "get_balance",
        description: `
This tool will check the NFT (ERC721 token) balance for a given address.

It takes the following inputs:
- contractAddress: The NFT contract address to check balance for
- address: (Optional) The address to check NFT balance for. If not provided, uses the wallet's address
`,
        schema: schemas_1.GetBalanceSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_providers_1.EvmWalletProvider, void 0]),
    __metadata("design:returntype", Promise)
], Erc721ActionProvider.prototype, "getBalance", null);
const erc721ActionProvider = () => new Erc721ActionProvider();
exports.erc721ActionProvider = erc721ActionProvider;
