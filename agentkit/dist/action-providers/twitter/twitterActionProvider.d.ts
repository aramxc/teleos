import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { TwitterAccountDetailsSchema, TwitterAccountMentionsSchema, TwitterPostTweetSchema, TwitterPostTweetReplySchema } from "./schemas";
/**
 * Configuration options for the TwitterActionProvider.
 */
export interface TwitterActionProviderConfig {
    /**
     * Twitter API Key
     */
    apiKey?: string;
    /**
     * Twitter API Secret
     */
    apiSecret?: string;
    /**
     * Twitter Access Token
     */
    accessToken?: string;
    /**
     * Twitter Access Token Secret
     */
    accessTokenSecret?: string;
}
/**
 * TwitterActionProvider is an action provider for Twitter (X) interactions.
 *
 * @augments ActionProvider
 */
export declare class TwitterActionProvider extends ActionProvider {
    private readonly client;
    /**
     * Constructor for the TwitterActionProvider class.
     *
     * @param config - The configuration options for the TwitterActionProvider
     */
    constructor(config?: TwitterActionProviderConfig);
    /**
     * Get account details for the currently authenticated Twitter (X) user.
     *
     * @param _ - Empty parameter object (not used)
     * @returns A JSON string containing the account details or error message
     */
    accountDetails(_: z.infer<typeof TwitterAccountDetailsSchema>): Promise<string>;
    /**
     * Get mentions for a specified Twitter (X) user.
     *
     * @param args - The arguments containing userId
     * @returns A JSON string containing the mentions or error message
     */
    accountMentions(args: z.infer<typeof TwitterAccountMentionsSchema>): Promise<string>;
    /**
     * Post a tweet on Twitter (X).
     *
     * @param args - The arguments containing the tweet text
     * @returns A JSON string containing the posted tweet details or error message
     */
    postTweet(args: z.infer<typeof TwitterPostTweetSchema>): Promise<string>;
    /**
     * Post a reply to a tweet on Twitter (X).
     *
     * @param args - The arguments containing the reply text and tweet ID
     * @returns A JSON string containing the posted reply details or error message
     */
    postTweetReply(args: z.infer<typeof TwitterPostTweetReplySchema>): Promise<string>;
    /**
     * Checks if the Twitter action provider supports the given network.
     * Twitter actions don't depend on blockchain networks, so always return true.
     *
     * @param _ - The network to check (not used)
     * @returns Always returns true as Twitter actions are network-independent
     */
    supportsNetwork(_: Network): boolean;
}
/**
 * Factory function to create a new TwitterActionProvider instance.
 *
 * @param config - The configuration options for the TwitterActionProvider
 * @returns A new instance of TwitterActionProvider
 */
export declare const twitterActionProvider: (config?: TwitterActionProviderConfig) => TwitterActionProvider;
