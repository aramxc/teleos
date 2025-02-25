import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { EvmWalletProvider } from "../../wallet-providers";
import { DepositSchema, WithdrawSchema } from "./schemas";
import { Network } from "../../network";
export declare const SUPPORTED_NETWORKS: string[];
/**
 * MorphoActionProvider is an action provider for Morpho Vault interactions.
 */
export declare class MorphoActionProvider extends ActionProvider<EvmWalletProvider> {
    /**
     * Constructor for the MorphoActionProvider class.
     */
    constructor();
    /**
     * Deposits assets into a Morpho Vault
     *
     * @param wallet - The wallet instance to execute the transaction
     * @param args - The input arguments for the action
     * @returns A success message with transaction details or an error message
     */
    deposit(wallet: EvmWalletProvider, args: z.infer<typeof DepositSchema>): Promise<string>;
    /**
     * Withdraws assets from a Morpho Vault
     *
     * @param wallet - The wallet instance to execute the transaction
     * @param args - The input arguments for the action
     * @returns A success message with transaction details or an error message
     */
    withdraw(wallet: EvmWalletProvider, args: z.infer<typeof WithdrawSchema>): Promise<string>;
    /**
     * Checks if the Morpho action provider supports the given network.
     *
     * @param network - The network to check.
     * @returns True if the Morpho action provider supports the network, false otherwise.
     */
    supportsNetwork: (network: Network) => boolean;
}
export declare const morphoActionProvider: () => MorphoActionProvider;
