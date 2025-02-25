"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBalanceSchema = exports.TransferTokenSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for transferring SPL tokens to another address.
 */
exports.TransferTokenSchema = zod_1.z
    .object({
    recipient: zod_1.z.string().describe("The recipient's Solana address"),
    mintAddress: zod_1.z.string().describe("The SPL token's mint address"),
    amount: zod_1.z.number().positive().describe("Amount of tokens to transfer"),
})
    .describe("Transfer SPL tokens to another Solana address");
/**
 * Schema for getting SPL token balance.
 */
exports.GetBalanceSchema = zod_1.z
    .object({
    mintAddress: zod_1.z.string().describe("The SPL token's mint address"),
    address: zod_1.z
        .string()
        .optional()
        .describe("Optional address to check balance for. If not provided, uses the wallet's address"),
})
    .describe("Get SPL token balance for an address");
