import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { EvmWalletProvider } from "../../wallet-providers";
import { Network } from "../../network";
import { WowBuyTokenInput, WowCreateTokenInput, WowSellTokenInput } from "./schemas";
/**
 * WowActionProvider is an action provider for Wow protocol interactions.
 */
export declare class WowActionProvider extends ActionProvider<EvmWalletProvider> {
    /**
     * Constructor for the WowActionProvider class.
     */
    constructor();
    /**
     * Buys a Zora Wow ERC20 memecoin with ETH.
     *
     * @param walletProvider - The wallet to create the token from.
     * @param args - The input arguments for the action.
     * @returns A message containing the token purchase details.
     */
    buyToken(walletProvider: EvmWalletProvider, args: z.infer<typeof WowBuyTokenInput>): Promise<string>;
    /**
     * Creates a Zora Wow ERC20 memecoin.
     *
     * @param wallet - The wallet to create the token from.
     * @param args - The input arguments for the action.
     * @returns A message containing the token creation details.
     */
    createToken(wallet: EvmWalletProvider, args: z.infer<typeof WowCreateTokenInput>): Promise<string>;
    /**
     * Sells WOW tokens for ETH.
     *
     * @param walletProvider - The wallet to sell the tokens from.
     * @param args - The input arguments for the action.
     * @returns A message confirming the sale with the transaction hash.
     */
    sellToken(walletProvider: EvmWalletProvider, args: z.infer<typeof WowSellTokenInput>): Promise<string>;
    /**
     * Checks if the Wow action provider supports the given network.
     *
     * @param network - The network to check.
     * @returns True if the Wow action provider supports the network, false otherwise.
     */
    supportsNetwork: (network: Network) => boolean;
}
export declare const wowActionProvider: () => WowActionProvider;
