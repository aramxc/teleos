import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { SvmWalletProvider } from "../../wallet-providers/svmWalletProvider";
import { z } from "zod";
import { TransferTokenSchema, GetBalanceSchema } from "./schemas";
/**
 * SplActionProvider serves as a provider for SPL token actions.
 * It provides SPL token transfer functionality.
 */
export declare class SplActionProvider extends ActionProvider<SvmWalletProvider> {
    /**
     * Creates a new SplActionProvider instance.
     */
    constructor();
    /**
     * Get the balance of SPL tokens for an address.
     *
     * @param walletProvider - The wallet provider to use
     * @param args - Parameters including mint address and optional target address
     * @returns A message indicating the token balance
     */
    getBalance(walletProvider: SvmWalletProvider, args: z.infer<typeof GetBalanceSchema>): Promise<string>;
    /**
     * Transfer SPL tokens to another address.
     *
     * @param walletProvider - The wallet provider to use for the transfer
     * @param args - Transfer parameters including recipient address, mint address, and amount
     * @returns A message indicating success or failure with transaction details
     */
    transfer(walletProvider: SvmWalletProvider, args: z.infer<typeof TransferTokenSchema>): Promise<string>;
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
 * Factory function to create a new SplActionProvider instance.
 *
 * @returns A new SplActionProvider instance
 */
export declare const splActionProvider: () => SplActionProvider;
