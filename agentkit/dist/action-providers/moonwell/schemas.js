"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemSchema = exports.MintSchema = void 0;
const zod_1 = require("zod");
/**
 * Input schema for Moonwell MToken mint action.
 */
exports.MintSchema = zod_1.z
    .object({
    assets: zod_1.z
        .string()
        .regex(/^\d+(\.\d+)?$/, "Must be a valid integer or decimal value")
        .describe("The quantity of assets to use to mint, in whole units"),
    tokenAddress: zod_1.z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
        .describe("The address of the assets token to approve for minting"),
    mTokenAddress: zod_1.z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
        .describe("The address of the Moonwell MToken to mint from"),
})
    .describe("Input schema for Moonwell MToken mint action");
/**
 * Input schema for Moonwell MToken redeem action.
 */
exports.RedeemSchema = zod_1.z
    .object({
    mTokenAddress: zod_1.z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
        .describe("The address of the Moonwell MToken to redeem from"),
    assets: zod_1.z
        .string()
        .regex(/^\d+(\.\d+)?$/, "Must be a valid integer or decimal value")
        .describe("The quantity of assets to redeem, in whole units"),
})
    .strip()
    .describe("Input schema for Moonwell MToken redeem action");
