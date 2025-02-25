import { z } from "zod";
/**
 * Input schema for registering a Basename.
 */
export declare const RegisterBasenameSchema: z.ZodObject<{
    basename: z.ZodString;
    amount: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: string;
    basename: string;
}, {
    basename: string;
    amount?: string | undefined;
}>;
