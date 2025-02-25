import { z } from "zod";
/**
 * Input schema for address reputation check.
 */
export declare const AddressReputationSchema: z.ZodObject<{
    address: z.ZodString;
    network: z.ZodString;
}, "strip", z.ZodTypeAny, {
    address: string;
    network: string;
}, {
    address: string;
    network: string;
}>;
/**
 * Input schema for deploy contract action.
 */
export declare const DeployContractSchema: z.ZodObject<{
    solidityVersion: z.ZodEnum<[string, ...string[]]>;
    solidityInputJson: z.ZodString;
    contractName: z.ZodString;
    constructorArgs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    solidityVersion: string;
    solidityInputJson: string;
    contractName: string;
    constructorArgs?: Record<string, any> | undefined;
}, {
    solidityVersion: string;
    solidityInputJson: string;
    contractName: string;
    constructorArgs?: Record<string, any> | undefined;
}>;
/**
 * Input schema for deploy NFT action
 */
export declare const DeployNftSchema: z.ZodObject<{
    name: z.ZodString;
    symbol: z.ZodString;
    baseURI: z.ZodString;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    name: string;
    baseURI: string;
}, {
    symbol: string;
    name: string;
    baseURI: string;
}>;
/**
 * Input schema for deploy token action.
 */
export declare const DeployTokenSchema: z.ZodObject<{
    name: z.ZodString;
    symbol: z.ZodString;
    totalSupply: z.ZodType<bigint, z.ZodTypeDef, bigint>;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    name: string;
    totalSupply: bigint;
}, {
    symbol: string;
    name: string;
    totalSupply: bigint;
}>;
/**
 * Input schema for request faucet funds action.
 */
export declare const RequestFaucetFundsSchema: z.ZodObject<{
    assetId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    assetId?: string | undefined;
}, {
    assetId?: string | undefined;
}>;
/**
 * Input schema for trade action.
 */
export declare const TradeSchema: z.ZodObject<{
    amount: z.ZodType<bigint, z.ZodTypeDef, bigint>;
    fromAssetId: z.ZodString;
    toAssetId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amount: bigint;
    fromAssetId: string;
    toAssetId: string;
}, {
    amount: bigint;
    fromAssetId: string;
    toAssetId: string;
}>;
