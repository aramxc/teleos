"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeTransferSchema = exports.GetWalletDetailsSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the get_wallet_details action.
 * This action doesn't require any input parameters, so we use an empty object schema.
 */
exports.GetWalletDetailsSchema = zod_1.z.object({});
/**
 * Input schema for native transfer action.
 */
exports.NativeTransferSchema = zod_1.z
    .object({
    to: zod_1.z.string().describe("The destination address to receive the funds"),
    value: zod_1.z.string().describe("The amount to transfer in whole units e.g. 1 ETH or 0.00001 ETH"),
})
    .strip()
    .describe("Instructions for transferring native tokens");
