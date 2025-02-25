import { EvmWalletProvider } from "../../../wallet-providers";
export interface PriceInfo {
    eth: string;
    usd: number;
}
export interface Balance {
    erc20z: string;
    weth: string;
}
export interface Price {
    perToken: PriceInfo;
    total: PriceInfo;
}
export interface Quote {
    amountIn: number;
    amountOut: number;
    balance: Balance | null;
    fee: number | null;
    error: string | null;
}
export interface PoolInfo {
    token0: string;
    balance0: number;
    token1: string;
    balance1: number;
    fee: number;
    liquidity: number;
    sqrtPriceX96: number;
}
/**
 * Creates a PriceInfo object from wei amount and ETH price.
 *
 * @param weiAmount - Amount in wei
 * @param ethPriceInUsd - Current ETH price in USD
 * @returns A PriceInfo object containing the amount in ETH and USD
 */
export declare function createPriceInfo(weiAmount: string, ethPriceInUsd: number): PriceInfo;
/**
 * Gets pool info for a given uniswap v3 pool address.
 *
 * @param wallet - The wallet provider to use for contract calls
 * @param poolAddress - Uniswap v3 pool address
 * @returns A PoolInfo object containing pool details
 */
export declare function getPoolInfo(wallet: EvmWalletProvider, poolAddress: string): Promise<PoolInfo>;
/**
 * Gets exact input quote from Uniswap.
 *
 * @param wallet - The wallet provider to use for contract calls
 * @param tokenIn - Token address to swap from
 * @param tokenOut - Token address to swap to
 * @param amountIn - Amount of tokens to swap (in Wei)
 * @param fee - Fee for the swap
 * @returns Amount of tokens to receive (in Wei)
 */
export declare function exactInputSingle(wallet: EvmWalletProvider, tokenIn: string, tokenOut: string, amountIn: string, fee: string): Promise<number>;
/**
 * Gets Uniswap quote for buying or selling tokens.
 *
 * @param wallet - The wallet provider to use for contract calls
 * @param tokenAddress - Token address
 * @param amount - Amount of tokens (in Wei)
 * @param quoteType - 'buy' or 'sell'
 * @returns A Quote object containing quote details
 */
export declare function getUniswapQuote(wallet: EvmWalletProvider, tokenAddress: string, amount: number, quoteType: "buy" | "sell"): Promise<Quote>;
/**
 * Checks if a token has graduated from the Zora Wow protocol.
 *
 * @param wallet - The wallet provider to use for contract calls
 * @param tokenAddress - Token address
 * @returns True if the token has graduated, false otherwise
 */
export declare function getHasGraduated(wallet: EvmWalletProvider, tokenAddress: string): Promise<boolean>;
/**
 * Fetches the uniswap v3 pool address for a given token.
 *
 * @param wallet - The wallet provider to use for contract calls
 * @param tokenAddress - The address of the token contract
 * @returns The uniswap v3 pool address associated with the token
 */
export declare function getPoolAddress(wallet: EvmWalletProvider, tokenAddress: string): Promise<string>;
