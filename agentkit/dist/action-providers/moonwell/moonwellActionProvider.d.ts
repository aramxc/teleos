import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { EvmWalletProvider } from "../../wallet-providers";
import { MintSchema, RedeemSchema } from "./schemas";
import { Network } from "../../network";
export declare const SUPPORTED_NETWORKS: string[];
/**
 * MoonwellActionProvider is an action provider for Moonwell MToken interactions.
 */
export declare class MoonwellActionProvider extends ActionProvider<EvmWalletProvider> {
    /**
     * Constructor for the MoonwellActionProvider class.
     */
    constructor();
    /**
     * Deposits assets into a Moonwell MToken
     *
     * @param wallet - The wallet instance to execute the transaction
     * @param args - The input arguments for the action
     * @returns A success message with transaction details or an error message
     */
    mint(wallet: EvmWalletProvider, args: z.infer<typeof MintSchema>): Promise<string>;
    /**
     * Redeems assets from a Moonwell MToken
     *
     * @param wallet - The wallet instance to execute the transaction
     * @param args - The input arguments for the action
     * @returns A success message with transaction details or an error message
     */
    redeem(wallet: EvmWalletProvider, args: z.infer<typeof RedeemSchema>): Promise<string>;
    /**
     * Checks if the Moonwell action provider supports the given network.
     *
     * @param network - The network to check.
     * @returns True if the Moonwell action provider supports the network, false otherwise.
     */
    supportsNetwork: (network: Network) => boolean;
}
export declare const moonwellActionProvider: () => MoonwellActionProvider;
