import { z } from "zod";
/**
 * Input schema for get NFT (ERC721) balance action.
 */
export declare const GetBalanceSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    contractAddress: string;
    address?: string | undefined;
}, {
    contractAddress: string;
    address?: string | undefined;
}>;
/**
 * Input schema for mint NFT (ERC721) action.
 */
export declare const MintSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    destination: z.ZodString;
}, "strip", z.ZodTypeAny, {
    contractAddress: string;
    destination: string;
}, {
    contractAddress: string;
    destination: string;
}>;
/**
 * Input schema for NFT (ERC721) transfer action.
 */
export declare const TransferSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    destination: z.ZodString;
    fromAddress: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    contractAddress: string;
    destination: string;
    tokenId: string;
    fromAddress?: string | undefined;
}, {
    contractAddress: string;
    destination: string;
    tokenId: string;
    fromAddress?: string | undefined;
}>;
