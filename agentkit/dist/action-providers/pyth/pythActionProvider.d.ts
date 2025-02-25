import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { PythFetchPriceFeedIDSchema, PythFetchPriceSchema } from "./schemas";
/**
 * PythActionProvider is an action provider for Pyth.
 */
export declare class PythActionProvider extends ActionProvider {
    /**
     * Constructs a new PythActionProvider.
     */
    constructor();
    /**
     * Fetch the price feed ID for a given token symbol from Pyth.
     *
     * @param args - The arguments for the action.
     * @returns The price feed ID as a string.
     */
    fetchPriceFeed(args: z.infer<typeof PythFetchPriceFeedIDSchema>): Promise<string>;
    /**
     * Fetches the price from Pyth given a Pyth price feed ID.
     *
     * @param args - The arguments for the action.
     * @returns The price as a string.
     */
    fetchPrice(args: z.infer<typeof PythFetchPriceSchema>): Promise<string>;
    /**
     * Checks if the Pyth action provider supports the given network.
     *
     * @returns True if the Pyth action provider supports the network, false otherwise.
     */
    supportsNetwork: () => boolean;
}
export declare const pythActionProvider: () => PythActionProvider;
