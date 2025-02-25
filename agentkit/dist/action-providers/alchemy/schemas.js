"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlchemyTokenPricesByAddressSchema = exports.AlchemyTokenPricesBySymbolSchema = void 0;
const zod_1 = require("zod");
/**
 * Input schema for fetching token prices by symbol.
 *
 * The API expects a list of token symbols.
 */
exports.AlchemyTokenPricesBySymbolSchema = zod_1.z
    .object({
    symbols: zod_1.z
        .array(zod_1.z.string())
        .min(1, "At least one token symbol is required. Example: ETH, BTC, SOL, etc.")
        .max(25, "A maximum of 25 token symbols can be provided."),
})
    .describe("Input schema for fetching token prices by symbol from Alchemy");
/**
 * Input schema for fetching token prices by address.
 *
 * The API expects an object with an array of addresses, where each address contains
 * a network identifier and a token contract address.
 */
exports.AlchemyTokenPricesByAddressSchema = zod_1.z
    .object({
    addresses: zod_1.z
        .array(zod_1.z.object({
        network: zod_1.z.string().describe("Network identifier (e.g., eth-mainnet, base-mainnet etc.)"),
        address: zod_1.z.string().describe("Token contract address"),
    }))
        .min(1, "At least one address is required.")
        .max(25, "A maximum of 25 addresses can be provided."),
})
    .describe("Input schema for fetching token prices by address from Alchemy");
