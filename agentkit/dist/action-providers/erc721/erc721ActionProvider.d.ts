import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { EvmWalletProvider } from "../../wallet-providers";
import { GetBalanceSchema, MintSchema, TransferSchema } from "./schemas";
import { Network } from "../../network";
/**
 * Erc721ActionProvider is an action provider for Erc721 contract interactions.
 */
export declare class Erc721ActionProvider extends ActionProvider<EvmWalletProvider> {
    /**
     * Constructor for the Erc721ActionProvider class.
     */
    constructor();
    /**
     * Mints an NFT (ERC-721) to a specified destination address onchain.
     *
     * @param walletProvider - The wallet provider to mint the NFT from.
     * @param args - The input arguments for the action.
     * @returns A message containing the NFT mint details.
     */
    mint(walletProvider: EvmWalletProvider, args: z.infer<typeof MintSchema>): Promise<string>;
    /**
     * Transfers an NFT (ERC721 token) to a destination address.
     *
     * @param walletProvider - The wallet provider to transfer the NFT from.
     * @param args - The input arguments for the action.
     * @returns A message containing the transfer details.
     */
    transfer(walletProvider: EvmWalletProvider, args: z.infer<typeof TransferSchema>): Promise<string>;
    /**
     * Gets the NFT balance for a given address and contract.
     *
     * @param walletProvider - The wallet provider to check the balance with.
     * @param args - The input arguments for the action.
     * @returns A message containing the NFT balance details.
     */
    getBalance(walletProvider: EvmWalletProvider, args: z.infer<typeof GetBalanceSchema>): Promise<string>;
    /**
     * Checks if the Erc721 action provider supports the given network.
     *
     * @param network - The network to check.
     * @returns True if the Erc721 action provider supports the network, false otherwise.
     */
    supportsNetwork: (network: Network) => boolean;
}
export declare const erc721ActionProvider: () => Erc721ActionProvider;
