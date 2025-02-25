"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WowSellTokenInput = exports.WowCreateTokenInput = exports.WowBuyTokenInput = void 0;
const zod_1 = require("zod");
const viem_1 = require("viem");
const ethereumAddress = zod_1.z.custom(val => typeof val === "string" && (0, viem_1.isAddress)(val), "Invalid address");
/**
 * Input schema for buying WOW tokens.
 */
exports.WowBuyTokenInput = zod_1.z
    .object({
    contractAddress: ethereumAddress.describe("The WOW token contract address"),
    amountEthInWei: zod_1.z
        .string()
        .regex(/^\d+$/, "Must be a valid wei amount")
        .describe("Amount of ETH to spend (in wei)"),
})
    .strip()
    .describe("Instructions for buying WOW tokens");
/**
 * Input schema for creating WOW tokens.
 */
exports.WowCreateTokenInput = zod_1.z
    .object({
    name: zod_1.z.string().min(1).describe("The name of the token to create, e.g. WowCoin"),
    symbol: zod_1.z.string().min(1).describe("The symbol of the token to create, e.g. WOW"),
    tokenUri: zod_1.z
        .string()
        .url()
        .optional()
        .describe("The URI of the token metadata to store on IPFS, e.g. ipfs://QmY1GqprFYvojCcUEKgqHeDj9uhZD9jmYGrQTfA9vAE78J"),
})
    .strip()
    .describe("Instructions for creating a WOW token");
/**
 * Input schema for selling WOW tokens.
 */
exports.WowSellTokenInput = zod_1.z
    .object({
    contractAddress: ethereumAddress.describe("The WOW token contract address, such as `0x036CbD53842c5426634e7929541eC2318f3dCF7e`"),
    amountTokensInWei: zod_1.z
        .string()
        .regex(/^\d+$/, "Must be a valid wei amount")
        .describe("Amount of tokens to sell (in wei), meaning 1 is 1 wei or 0.000000000000000001 of the token"),
})
    .strip()
    .describe("Instructions for selling WOW tokens");
