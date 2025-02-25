import { z } from "zod";
/**
 * Input argument schema for the account_details action.
 */
export declare const FarcasterAccountDetailsSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
/**
 * Input argument schema for the post cast action.
 */
export declare const FarcasterPostCastSchema: z.ZodObject<{
    castText: z.ZodString;
}, "strip", z.ZodTypeAny, {
    castText: string;
}, {
    castText: string;
}>;
