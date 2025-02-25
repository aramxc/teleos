import { z } from "zod";
/**
 * Schema for swapping tokens using Jupiter.
 */
export declare const SwapTokenSchema: z.ZodObject<{
    inputMint: z.ZodString;
    outputMint: z.ZodString;
    amount: z.ZodNumber;
    slippageBps: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    inputMint: string;
    outputMint: string;
    slippageBps: number;
}, {
    amount: number;
    inputMint: string;
    outputMint: string;
    slippageBps?: number | undefined;
}>;
