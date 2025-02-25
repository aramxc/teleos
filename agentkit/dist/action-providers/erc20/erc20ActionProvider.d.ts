import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { GetBalanceSchema, TransferSchema } from "./schemas";
import { EvmWalletProvider } from "../../wallet-providers";
/**
 * ERC20ActionProvider is an action provider for ERC20 tokens.
 */
export declare class ERC20ActionProvider extends ActionProvider<EvmWalletProvider> {
    /**
     * Constructor for the ERC20ActionProvider.
     */
    constructor();
    /**
     * Gets the balance of an ERC20 token.
     *
     * @param walletProvider - The wallet provider to get the balance from.
     * @param args - The input arguments for the action.
     * @returns A message containing the balance.
     */
    getBalance(walletProvider: EvmWalletProvider, args: z.infer<typeof GetBalanceSchema>): Promise<string>;
    /**
     * Transfers a specified amount of an ERC20 token to a destination onchain.
     *
     * @param walletProvider - The wallet provider to transfer the asset from.
     * @param args - The input arguments for the action.
     * @returns A message containing the transfer details.
     */
    transfer(walletProvider: EvmWalletProvider, args: z.infer<typeof TransferSchema>): Promise<string>;
    /**
     * Checks if the ERC20 action provider supports the given network.
     *
     * @param network - The network to check.
     * @returns True if the ERC20 action provider supports the network, false otherwise.
     */
    supportsNetwork: (network: Network) => boolean;
}
export declare const erc20ActionProvider: () => ERC20ActionProvider;
