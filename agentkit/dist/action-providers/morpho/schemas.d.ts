import { z } from "zod";
/**
 * Input schema for Morpho Vault deposit action.
 */
export declare const DepositSchema: z.ZodObject<{
    assets: z.ZodString;
    receiver: z.ZodString;
    tokenAddress: z.ZodString;
    vaultAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    receiver: string;
    assets: string;
    tokenAddress: string;
    vaultAddress: string;
}, {
    receiver: string;
    assets: string;
    tokenAddress: string;
    vaultAddress: string;
}>;
/**
 * Input schema for Morpho Vault withdraw action.
 */
export declare const WithdrawSchema: z.ZodObject<{
    vaultAddress: z.ZodString;
    assets: z.ZodString;
    receiver: z.ZodString;
}, "strip", z.ZodTypeAny, {
    receiver: string;
    assets: string;
    vaultAddress: string;
}, {
    receiver: string;
    assets: string;
    vaultAddress: string;
}>;
