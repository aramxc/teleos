import { z } from "zod";
/**
 * Input schema for Moonwell MToken mint action.
 */
export declare const MintSchema: z.ZodObject<{
    assets: z.ZodString;
    tokenAddress: z.ZodString;
    mTokenAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    assets: string;
    tokenAddress: string;
    mTokenAddress: string;
}, {
    assets: string;
    tokenAddress: string;
    mTokenAddress: string;
}>;
/**
 * Input schema for Moonwell MToken redeem action.
 */
export declare const RedeemSchema: z.ZodObject<{
    mTokenAddress: z.ZodString;
    assets: z.ZodString;
}, "strip", z.ZodTypeAny, {
    assets: string;
    mTokenAddress: string;
}, {
    assets: string;
    mTokenAddress: string;
}>;
