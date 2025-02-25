"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeSchema = exports.RequestFaucetFundsSchema = exports.DeployTokenSchema = exports.DeployNftSchema = exports.DeployContractSchema = exports.AddressReputationSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("./constants");
/**
 * Input schema for address reputation check.
 */
exports.AddressReputationSchema = zod_1.z
    .object({
    address: zod_1.z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
        .describe("The Ethereum address to check"),
    network: zod_1.z.string().describe("The network to check the address on"),
})
    .strip()
    .describe("Input schema for address reputation check");
/**
 * Input schema for deploy contract action.
 */
exports.DeployContractSchema = zod_1.z
    .object({
    solidityVersion: zod_1.z
        .enum(Object.keys(constants_1.SolidityVersions))
        .describe("The solidity compiler version"),
    solidityInputJson: zod_1.z.string().describe("The input json for the solidity compiler"),
    contractName: zod_1.z.string().describe("The name of the contract class to be deployed"),
    constructorArgs: zod_1.z
        .record(zod_1.z.string(), zod_1.z.any())
        .describe("The constructor arguments for the contract")
        .optional(),
})
    .strip()
    .describe("Instructions for deploying an arbitrary contract");
/**
 * Input schema for deploy NFT action
 */
exports.DeployNftSchema = zod_1.z
    .object({
    name: zod_1.z.string().describe("The name of the NFT collection"),
    symbol: zod_1.z.string().describe("The symbol of the NFT collection"),
    baseURI: zod_1.z.string().describe("The base URI for the token metadata"),
})
    .strip()
    .describe("Instructions for deploying an NFT collection");
/**
 * Input schema for deploy token action.
 */
exports.DeployTokenSchema = zod_1.z
    .object({
    name: zod_1.z.string().describe("The name of the token"),
    symbol: zod_1.z.string().describe("The token symbol"),
    totalSupply: zod_1.z.custom().describe("The total supply of tokens to mint"),
})
    .strip()
    .describe("Instructions for deploying a token");
/**
 * Input schema for request faucet funds action.
 */
exports.RequestFaucetFundsSchema = zod_1.z
    .object({
    assetId: zod_1.z.string().optional().describe("The optional asset ID to request from faucet"),
})
    .strip()
    .describe("Instructions for requesting faucet funds");
/**
 * Input schema for trade action.
 */
exports.TradeSchema = zod_1.z
    .object({
    amount: zod_1.z.custom().describe("The amount of the from asset to trade"),
    fromAssetId: zod_1.z.string().describe("The from asset ID to trade"),
    toAssetId: zod_1.z.string().describe("The to asset ID to receive from the trade"),
})
    .strip()
    .describe("Instructions for trading assets");
