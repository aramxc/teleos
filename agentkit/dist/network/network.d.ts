import { Chain } from "viem/chains";
/**
 * Maps EVM chain IDs to Coinbase network IDs
 */
export declare const CHAIN_ID_TO_NETWORK_ID: Record<number, string>;
/**
 * Maps Coinbase network IDs to EVM chain IDs
 */
export declare const NETWORK_ID_TO_CHAIN_ID: Record<string, string>;
/**
 * Maps Coinbase network IDs to Viem chain objects
 */
export declare const NETWORK_ID_TO_VIEM_CHAIN: Record<string, Chain>;
/**
 * Get a chain from the viem chains object
 *
 * @param id - The chain ID
 * @returns The chain
 */
export declare const getChain: (id: string) => Chain;
