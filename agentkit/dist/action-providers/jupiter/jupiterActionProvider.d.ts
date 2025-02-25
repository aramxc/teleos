import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { SvmWalletProvider } from "../../wallet-providers/svmWalletProvider";
import { z } from "zod";
import { SwapTokenSchema } from "./schemas";
/**
 * JupiterActionProvider handles token swaps using Jupiter's API.
 */
export declare class JupiterActionProvider extends ActionProvider<SvmWalletProvider> {
    /**
     * Initializes Jupiter API client.
     */
    constructor();
    /**
     * Swaps tokens using Jupiter's API.
     *
     * @param walletProvider - The wallet provider to use for the swap
     * @param args - Swap parameters including input token, output token, and amount
     * @returns A message indicating success or failure with transaction details
     */
    swap(walletProvider: SvmWalletProvider, args: z.infer<typeof SwapTokenSchema>): Promise<string>;
    /**
     * Checks if the action provider supports the given network.
     * Only supports Solana networks.
     *
     * @param network - The network to check support for
     * @returns True if the network is a Solana network
     */
    supportsNetwork(network: Network): boolean;
}
/**
 * Factory function to create a new JupiterActionProvider instance.
 *
 * @returns A new JupiterActionProvider instance
 */
export declare const jupiterActionProvider: () => JupiterActionProvider;
