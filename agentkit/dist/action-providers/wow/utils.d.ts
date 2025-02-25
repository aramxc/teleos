import { EvmWalletProvider } from "../../wallet-providers";
/**
 * Gets the current supply of a token.
 *
 * @param wallet - The wallet provider to use for contract calls
 * @param tokenAddress - Address of the token contract
 * @returns The current token supply
 */
export declare function getCurrentSupply(wallet: EvmWalletProvider, tokenAddress: string): Promise<string>;
/**
 * Gets quote for buying tokens.
 *
 * @param wallet - The wallet provider to use for contract calls
 * @param tokenAddress - Address of the token contract
 * @param amountEthInWei - Amount of ETH to buy (in wei)
 * @returns The buy quote amount
 */
export declare function getBuyQuote(wallet: EvmWalletProvider, tokenAddress: string, amountEthInWei: string): Promise<string>;
/**
 * Gets quote for selling tokens.
 *
 * @param wallet - The wallet provider to use for contract calls
 * @param tokenAddress - Address of the token contract
 * @param amountTokensInWei - Amount of tokens to sell (in wei)
 * @returns The sell quote amount
 */
export declare function getSellQuote(wallet: EvmWalletProvider, tokenAddress: string, amountTokensInWei: string): Promise<string>;
