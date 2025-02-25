import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { WalletProvider } from "../../wallet-providers";
import { Network } from "../../network";
import { NativeTransferSchema, GetWalletDetailsSchema } from "./schemas";
/**
 * WalletActionProvider provides actions for getting basic wallet information.
 */
export declare class WalletActionProvider extends ActionProvider {
    /**
     * Constructor for the WalletActionProvider.
     */
    constructor();
    /**
     * Gets the details of the connected wallet including address, network, and balance.
     *
     * @param walletProvider - The wallet provider to get the details from.
     * @param _ - Empty args object (not used).
     * @returns A formatted string containing the wallet details.
     */
    getWalletDetails(walletProvider: WalletProvider, _: z.infer<typeof GetWalletDetailsSchema>): Promise<string>;
    /**
     * Transfers a specified amount of native currency to a destination onchain.
     *
     * @param walletProvider - The wallet provider to transfer from.
     * @param args - The input arguments for the action.
     * @returns A message containing the transfer details.
     */
    nativeTransfer(walletProvider: WalletProvider, args: z.infer<typeof NativeTransferSchema>): Promise<string>;
    /**
     * Checks if the wallet action provider supports the given network.
     * Since wallet actions are network-agnostic, this always returns true.
     *
     * @param _ - The network to check.
     * @returns True, as wallet actions are supported on all networks.
     */
    supportsNetwork: (_: Network) => boolean;
}
/**
 * Factory function to create a new WalletActionProvider instance.
 *
 * @returns A new WalletActionProvider instance.
 */
export declare const walletActionProvider: () => WalletActionProvider;
