import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { WrapEthSchema } from "./schemas";
import { EvmWalletProvider } from "../../wallet-providers";
/**
 * WethActionProvider is an action provider for WETH.
 */
export declare class WethActionProvider extends ActionProvider<EvmWalletProvider> {
    /**
     * Constructor for the WethActionProvider.
     */
    constructor();
    /**
     * Wraps ETH to WETH.
     *
     * @param walletProvider - The wallet provider to use for the action.
     * @param args - The input arguments for the action.
     * @returns A message containing the transaction hash.
     */
    wrapEth(walletProvider: EvmWalletProvider, args: z.infer<typeof WrapEthSchema>): Promise<string>;
    /**
     * Checks if the Weth action provider supports the given network.
     *
     * @param network - The network to check.
     * @returns True if the Weth action provider supports the network, false otherwise.
     */
    supportsNetwork: (network: Network) => boolean;
}
export declare const wethActionProvider: () => WethActionProvider;
