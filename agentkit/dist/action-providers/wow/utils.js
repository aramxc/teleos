"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentSupply = getCurrentSupply;
exports.getBuyQuote = getBuyQuote;
exports.getSellQuote = getSellQuote;
const constants_1 = require("./constants");
const utils_1 = require("./uniswap/utils");
/**
 * Gets the current supply of a token.
 *
 * @param wallet - The wallet provider to use for contract calls
 * @param tokenAddress - Address of the token contract
 * @returns The current token supply
 */
async function getCurrentSupply(wallet, tokenAddress) {
    const supply = await wallet.readContract({
        address: tokenAddress,
        abi: constants_1.WOW_ABI,
        functionName: "totalSupply",
        args: [],
    });
    return supply;
}
/**
 * Gets quote for buying tokens.
 *
 * @param wallet - The wallet provider to use for contract calls
 * @param tokenAddress - Address of the token contract
 * @param amountEthInWei - Amount of ETH to buy (in wei)
 * @returns The buy quote amount
 */
async function getBuyQuote(wallet, tokenAddress, amountEthInWei) {
    const hasGraduated = await (0, utils_1.getHasGraduated)(wallet, tokenAddress);
    const tokenQuote = (hasGraduated
        ? (await (0, utils_1.getUniswapQuote)(wallet, tokenAddress, Number(amountEthInWei), "buy")).amountOut
        : await wallet.readContract({
            address: tokenAddress,
            abi: constants_1.WOW_ABI,
            functionName: "getEthBuyQuote",
            args: [amountEthInWei],
        }));
    return tokenQuote.toString();
}
/**
 * Gets quote for selling tokens.
 *
 * @param wallet - The wallet provider to use for contract calls
 * @param tokenAddress - Address of the token contract
 * @param amountTokensInWei - Amount of tokens to sell (in wei)
 * @returns The sell quote amount
 */
async function getSellQuote(wallet, tokenAddress, amountTokensInWei) {
    const hasGraduated = await (0, utils_1.getHasGraduated)(wallet, tokenAddress);
    const tokenQuote = (hasGraduated
        ? (await (0, utils_1.getUniswapQuote)(wallet, tokenAddress, Number(amountTokensInWei), "sell")).amountOut
        : await wallet.readContract({
            address: tokenAddress,
            abi: constants_1.WOW_ABI,
            functionName: "getTokenSellQuote",
            args: [amountTokensInWei],
        }));
    return tokenQuote.toString();
}
