import { z } from "zod";
import { WalletProvider } from "../wallet-providers";
import { Network } from "../network";
/**
 * Action is the interface for all actions.
 */
export interface Action<TActionSchema extends z.ZodSchema = z.ZodSchema> {
    name: string;
    description: string;
    schema: TActionSchema;
    invoke: (args: z.infer<TActionSchema>) => Promise<string>;
}
/**
 * ActionProvider is the abstract base class for all action providers.
 *
 * @abstract
 */
export declare abstract class ActionProvider<TWalletProvider extends WalletProvider = WalletProvider> {
    /**
     * The name of the action provider.
     */
    readonly name: string;
    /**
     * The action providers to combine.
     */
    readonly actionProviders: ActionProvider<TWalletProvider>[];
    /**
     * The constructor for the action provider.
     *
     * @param name - The name of the action provider.
     * @param actionProviders - The action providers to combine.
     */
    constructor(name: string, actionProviders: ActionProvider<TWalletProvider>[]);
    /**
     * Gets the actions of the action provider bound to the given wallet provider.
     *
     * @param walletProvider - The wallet provider.
     * @returns The actions of the action provider.
     */
    getActions(walletProvider: TWalletProvider): Action[];
    /**
     * Checks if the action provider supports the given network.
     *
     * @param network - The network to check.
     * @returns True if the action provider supports the network, false otherwise.
     */
    abstract supportsNetwork(network: Network): boolean;
}
