import { z } from "zod";
/**
 * Schema for the get_wallet_details action.
 * This action doesn't require any input parameters, so we use an empty object schema.
 */
export declare const GetWalletDetailsSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
/**
 * Input schema for native transfer action.
 */
export declare const NativeTransferSchema: z.ZodObject<{
    to: z.ZodString;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    to: string;
    value: string;
}, {
    to: string;
    value: string;
}>;
