"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBalanceSchema = exports.TransferSchema = void 0;
const zod_1 = require("zod");
/**
 * Input schema for transfer action.
 */
exports.TransferSchema = zod_1.z
    .object({
    amount: zod_1.z.custom().describe("The amount of the asset to transfer"),
    contractAddress: zod_1.z.string().describe("The contract address of the token to transfer"),
    destination: zod_1.z.string().describe("The destination to transfer the funds"),
})
    .strip()
    .describe("Instructions for transferring assets");
/**
 * Input schema for get balance action.
 */
exports.GetBalanceSchema = zod_1.z
    .object({
    contractAddress: zod_1.z
        .string()
        .describe("The contract address of the token to get the balance for"),
})
    .strip()
    .describe("Instructions for getting wallet balance");
