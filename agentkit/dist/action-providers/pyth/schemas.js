"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythFetchPriceSchema = exports.PythFetchPriceFeedIDSchema = void 0;
const zod_1 = require("zod");
/**
 * Input schema for Pyth fetch price feed ID action.
 */
exports.PythFetchPriceFeedIDSchema = zod_1.z
    .object({
    tokenSymbol: zod_1.z.string().describe("The token symbol to fetch the price feed ID for"),
})
    .strict();
/**
 * Input schema for Pyth fetch price action.
 */
exports.PythFetchPriceSchema = zod_1.z
    .object({
    priceFeedID: zod_1.z.string().describe("The price feed ID to fetch the price for"),
})
    .strict();
