import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { AlchemyTokenPricesBySymbolSchema, AlchemyTokenPricesByAddressSchema } from "./schemas";
/**
 * Configuration options for the AlchemyTokenPricesActionProvider.
 */
export interface AlchemyTokenPricesActionProviderConfig {
    /**
     * Alchemy API Key
     */
    apiKey?: string;
}
/**
 * AlchemyTokenPricesActionProvider is an action provider for fetching token prices via the Alchemy Prices API.
 * This provider enables querying current and historical token prices using symbols or addresses.
 *
 */
export declare class AlchemyTokenPricesActionProvider extends ActionProvider {
    private readonly apiKey;
    private readonly baseUrl;
    /**
     * Creates a new instance of AlchemyTokenPricesActionProvider
     *
     * @param config - Configuration options including the API key
     */
    constructor(config?: AlchemyTokenPricesActionProviderConfig);
    /**
     * Fetch current token prices for one or more token symbols.
     *
     * @param args - The arguments containing an array of token symbols.
     * @returns A JSON string with the token prices or an error message.
     */
    tokenPricesBySymbol(args: z.infer<typeof AlchemyTokenPricesBySymbolSchema>): Promise<string>;
    /**
     * Fetch current token prices for one or more tokens identified by network and address pairs.
     *
     * @param args - The arguments containing an array of token network/address pairs.
     * @returns A JSON string with the token prices or an error message.
     */
    tokenPricesByAddress(args: z.infer<typeof AlchemyTokenPricesByAddressSchema>): Promise<string>;
    /**
     * Checks if the Alchemy Prices action provider supports the given network.
     * Since the API works with multiple networks, this always returns true.
     *
     * @returns Always returns true.
     */
    supportsNetwork: () => boolean;
}
/**
 * Factory function to create a new AlchemyTokenPricesActionProvider instance.
 *
 * @param config - The configuration options for the provider.
 * @returns A new instance of AlchemyTokenPricesActionProvider.
 */
export declare const alchemyTokenPricesActionProvider: (config?: AlchemyTokenPricesActionProviderConfig) => AlchemyTokenPricesActionProvider;
