"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapTokenSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for swapping tokens using Jupiter.
 */
exports.SwapTokenSchema = zod_1.z
    .object({
    inputMint: zod_1.z.string().describe("The mint address of the token to swap from"),
    outputMint: zod_1.z.string().describe("The mint address of the token to swap to"),
    amount: zod_1.z.number().positive().describe("Amount of tokens to swap"),
    slippageBps: zod_1.z
        .number()
        .int()
        .positive()
        .default(50)
        .describe("Slippage tolerance in basis points (e.g., 50 = 0.5%)"),
})
    .describe("Swap tokens using Jupiter DEX aggregator");
