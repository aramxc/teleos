import { z } from "zod";
/**
 * Input schema for buying WOW tokens.
 */
export declare const WowBuyTokenInput: z.ZodObject<{
    contractAddress: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
    amountEthInWei: z.ZodString;
}, "strip", z.ZodTypeAny, {
    contractAddress: `0x${string}`;
    amountEthInWei: string;
}, {
    contractAddress: `0x${string}`;
    amountEthInWei: string;
}>;
/**
 * Input schema for creating WOW tokens.
 */
export declare const WowCreateTokenInput: z.ZodObject<{
    name: z.ZodString;
    symbol: z.ZodString;
    tokenUri: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    name: string;
    tokenUri?: string | undefined;
}, {
    symbol: string;
    name: string;
    tokenUri?: string | undefined;
}>;
/**
 * Input schema for selling WOW tokens.
 */
export declare const WowSellTokenInput: z.ZodObject<{
    contractAddress: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
    amountTokensInWei: z.ZodString;
}, "strip", z.ZodTypeAny, {
    contractAddress: `0x${string}`;
    amountTokensInWei: string;
}, {
    contractAddress: `0x${string}`;
    amountTokensInWei: string;
}>;
