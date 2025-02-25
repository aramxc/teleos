import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { CdpWalletProvider, CdpProviderConfig } from "../../wallet-providers";
import { DeployContractSchema, DeployNftSchema, DeployTokenSchema, TradeSchema } from "./schemas";
/**
 * CdpWalletActionProvider is an action provider for Cdp.
 *
 * This provider is used for any action that requires a CDP Wallet.
 */
export declare class CdpWalletActionProvider extends ActionProvider<CdpWalletProvider> {
    /**
     * Constructor for the CdpWalletActionProvider class.
     *
     * @param config - The configuration options for the CdpWalletActionProvider.
     */
    constructor(config?: CdpProviderConfig);
    /**
     * Deploys a contract.
     *
     * @param walletProvider - The wallet provider to deploy the contract from
     * @param args - The input arguments for the action
     * @returns A message containing the deployed contract address and details
     */
    deployContract(walletProvider: CdpWalletProvider, args: z.infer<typeof DeployContractSchema>): Promise<string>;
    /**
     * Deploys an NFT (ERC-721) token collection onchain from the wallet.
     *
     * @param walletProvider - The wallet provider to deploy the NFT from.
     * @param args - The input arguments for the action.
     * @returns A message containing the NFT token deployment details.
     */
    deployNFT(walletProvider: CdpWalletProvider, args: z.infer<typeof DeployNftSchema>): Promise<string>;
    /**
     * Deploys a token.
     *
     * @param walletProvider - The wallet provider to deploy the token.
     * @param args - The arguments for the token deployment.
     * @returns The deployed token.
     */
    deployToken(walletProvider: CdpWalletProvider, args: z.infer<typeof DeployTokenSchema>): Promise<string>;
    /**
     * Trades a specified amount of a from asset to a to asset for the wallet.
     *
     * @param walletProvider - The wallet provider to trade the asset from.
     * @param args - The input arguments for the action.
     * @returns A message containing the trade details.
     */
    trade(walletProvider: CdpWalletProvider, args: z.infer<typeof TradeSchema>): Promise<string>;
    /**
     * Checks if the Cdp action provider supports the given network.
     *
     * @param network - The network to check.
     * @returns True if the Cdp action provider supports the network, false otherwise.
     */
    supportsNetwork: (network: Network) => boolean;
}
export declare const cdpWalletActionProvider: (config?: CdpProviderConfig) => CdpWalletActionProvider;
