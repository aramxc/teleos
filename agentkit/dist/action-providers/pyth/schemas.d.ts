import { z } from "zod";
/**
 * Input schema for Pyth fetch price feed ID action.
 */
export declare const PythFetchPriceFeedIDSchema: z.ZodObject<{
    tokenSymbol: z.ZodString;
}, "strict", z.ZodTypeAny, {
    tokenSymbol: string;
}, {
    tokenSymbol: string;
}>;
/**
 * Input schema for Pyth fetch price action.
 */
export declare const PythFetchPriceSchema: z.ZodObject<{
    priceFeedID: z.ZodString;
}, "strict", z.ZodTypeAny, {
    priceFeedID: string;
}, {
    priceFeedID: string;
}>;
