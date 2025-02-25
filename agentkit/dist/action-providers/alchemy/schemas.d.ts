import { z } from "zod";
/**
 * Input schema for fetching token prices by symbol.
 *
 * The API expects a list of token symbols.
 */
export declare const AlchemyTokenPricesBySymbolSchema: z.ZodObject<{
    symbols: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    symbols: string[];
}, {
    symbols: string[];
}>;
/**
 * Input schema for fetching token prices by address.
 *
 * The API expects an object with an array of addresses, where each address contains
 * a network identifier and a token contract address.
 */
export declare const AlchemyTokenPricesByAddressSchema: z.ZodObject<{
    addresses: z.ZodArray<z.ZodObject<{
        network: z.ZodString;
        address: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        address: string;
        network: string;
    }, {
        address: string;
        network: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    addresses: {
        address: string;
        network: string;
    }[];
}, {
    addresses: {
        address: string;
        network: string;
    }[];
}>;
