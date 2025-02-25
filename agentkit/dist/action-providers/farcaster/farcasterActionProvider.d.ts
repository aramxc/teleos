import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { FarcasterAccountDetailsSchema, FarcasterPostCastSchema } from "./schemas";
/**
 * Configuration options for the FarcasterActionProvider.
 */
export interface FarcasterActionProviderConfig {
    /**
     * Neynar API Key.
     */
    neynarApiKey?: string;
    /**
     * Neynar managed signer UUID.
     */
    signerUuid?: string;
    /**
     * Agent FID.
     */
    agentFid?: string;
}
/**
 * FarcasterActionProvider is an action provider for Farcaster.
 */
export declare class FarcasterActionProvider extends ActionProvider {
    private readonly neynarApiKey;
    private readonly signerUuid;
    private readonly agentFid;
    /**
     * Constructor for the FarcasterActionProvider class.
     *
     * @param config - The configuration options for the FarcasterActionProvider.
     */
    constructor(config?: FarcasterActionProviderConfig);
    /**
     * Retrieves agent's Farcaster account details.
     *
     * @param _ - The input arguments for the action.
     * @returns A message containing account details for the agent's Farcaster account.
     */
    accountDetails(_: z.infer<typeof FarcasterAccountDetailsSchema>): Promise<string>;
    /**
     * Posts a cast on Farcaster.
     *
     * @param args - The input arguments for the action.
     * @returns A message indicating the success or failure of the cast posting.
     */
    postCast(args: z.infer<typeof FarcasterPostCastSchema>): Promise<string>;
    /**
     * Checks if the Farcaster action provider supports the given network.
     *
     * @param network - The network to check.
     * @returns True if the Farcaster action provider supports the network, false otherwise.
     */
    supportsNetwork: (network: Network) => boolean;
}
export declare const farcasterActionProvider: (config?: FarcasterActionProviderConfig) => FarcasterActionProvider;
