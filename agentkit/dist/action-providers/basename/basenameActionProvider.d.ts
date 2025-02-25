import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { RegisterBasenameSchema } from "./schemas";
import { EvmWalletProvider } from "../../wallet-providers";
/**
 * Action provider for registering Basenames.
 */
export declare class BasenameActionProvider extends ActionProvider<EvmWalletProvider> {
    /**
     * Constructs a new BasenameActionProvider.
     */
    constructor();
    /**
     * Registers a Basename.
     *
     * @param wallet - The wallet to use for the registration.
     * @param args - The arguments for the registration.
     * @returns A string indicating the success or failure of the registration.
     */
    register(wallet: EvmWalletProvider, args: z.infer<typeof RegisterBasenameSchema>): Promise<string>;
    /**
     * Checks if the Basename action provider supports the given network.
     *
     * @param network - The network to check.
     * @returns True if the Basename action provider supports the network, false otherwise.
     */
    supportsNetwork: (network: Network) => boolean;
}
export declare const basenameActionProvider: () => BasenameActionProvider;
