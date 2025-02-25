import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { CdpProviderConfig, WalletProvider } from "../../wallet-providers";
import { AddressReputationSchema, RequestFaucetFundsSchema } from "./schemas";
/**
 * CdpApiActionProvider is an action provider for CDP API.
 *
 * This provider is used for any action that uses the CDP API, but does not require a CDP Wallet.
 */
export declare class CdpApiActionProvider extends ActionProvider<WalletProvider> {
    /**
     * Constructor for the CdpApiActionProvider class.
     *
     * @param config - The configuration options for the CdpApiActionProvider.
     */
    constructor(config?: CdpProviderConfig);
    /**
     * Check the reputation of an address.
     *
     * @param args - The input arguments for the action
     * @returns A string containing reputation data or error message
     */
    addressReputation(args: z.infer<typeof AddressReputationSchema>): Promise<string>;
    /**
     * Requests test tokens from the faucet for the default address in the wallet.
     *
     * @param walletProvider - The wallet provider to request funds from.
     * @param args - The input arguments for the action.
     * @returns A confirmation message with transaction details.
     */
    faucet(walletProvider: WalletProvider, args: z.infer<typeof RequestFaucetFundsSchema>): Promise<string>;
    /**
     * Checks if the Cdp action provider supports the given network.
     *
     * NOTE: Network scoping is done at the action implementation level
     *
     * @param _ - The network to check.
     * @returns True if the Cdp action provider supports the network, false otherwise.
     */
    supportsNetwork: (_: Network) => boolean;
}
export declare const cdpApiActionProvider: (config?: CdpProviderConfig) => CdpApiActionProvider;
