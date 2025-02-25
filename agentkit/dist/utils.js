"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approve = approve;
exports.applyGasMultiplier = applyGasMultiplier;
const viem_1 = require("viem");
const ERC20_ABI = [
    {
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
];
/**
 * Approves a spender to spend tokens on behalf of the owner
 *
 * @param wallet - The wallet provider
 * @param tokenAddress - The address of the token contract
 * @param spenderAddress - The address of the spender
 * @param amount - The amount to approve in atomic units (wei)
 * @returns A success message or error message
 */
async function approve(wallet, tokenAddress, spenderAddress, amount) {
    try {
        const data = (0, viem_1.encodeFunctionData)({
            abi: ERC20_ABI,
            functionName: "approve",
            args: [spenderAddress, amount],
        });
        const txHash = await wallet.sendTransaction({
            to: tokenAddress,
            data,
        });
        await wallet.waitForTransactionReceipt(txHash);
        return `Successfully approved ${spenderAddress} to spend ${amount} tokens`;
    }
    catch (error) {
        return `Error approving tokens: ${error}`;
    }
}
/**
 * Scales a gas estimate by a given multiplier.
 *
 * This function converts the gas estimate to a number, applies the multiplier,
 * rounds the result to the nearest integer, and returns it as a bigint.
 *
 * @param gas - The original gas estimate (bigint).
 * @param multiplier - The factor by which to scale the estimate.
 * @returns The adjusted gas estimate as a bigint.
 */
function applyGasMultiplier(gas, multiplier) {
    return BigInt(Math.round(Number(gas) * multiplier));
}
