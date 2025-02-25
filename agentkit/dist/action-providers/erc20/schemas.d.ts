import { z } from "zod";
/**
 * Input schema for transfer action.
 */
export declare const TransferSchema: z.ZodObject<{
    amount: z.ZodType<bigint, z.ZodTypeDef, bigint>;
    contractAddress: z.ZodString;
    destination: z.ZodString;
}, "strip", z.ZodTypeAny, {
    contractAddress: string;
    amount: bigint;
    destination: string;
}, {
    contractAddress: string;
    amount: bigint;
    destination: string;
}>;
/**
 * Input schema for get balance action.
 */
export declare const GetBalanceSchema: z.ZodObject<{
    contractAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    contractAddress: string;
}, {
    contractAddress: string;
}>;
