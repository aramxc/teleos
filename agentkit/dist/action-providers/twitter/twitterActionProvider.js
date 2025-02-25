"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitterActionProvider = exports.TwitterActionProvider = void 0;
const zod_1 = require("zod");
const actionProvider_1 = require("../actionProvider");
const actionDecorator_1 = require("../actionDecorator");
const twitter_api_v2_1 = require("twitter-api-v2");
const schemas_1 = require("./schemas");
/**
 * TwitterActionProvider is an action provider for Twitter (X) interactions.
 *
 * @augments ActionProvider
 */
class TwitterActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructor for the TwitterActionProvider class.
     *
     * @param config - The configuration options for the TwitterActionProvider
     */
    constructor(config = {}) {
        super("twitter", []);
        config.apiKey || (config.apiKey = process.env.TWITTER_API_KEY);
        config.apiSecret || (config.apiSecret = process.env.TWITTER_API_SECRET);
        config.accessToken || (config.accessToken = process.env.TWITTER_ACCESS_TOKEN);
        config.accessTokenSecret || (config.accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET);
        if (!config.apiKey) {
            throw new Error("TWITTER_API_KEY is not configured.");
        }
        if (!config.apiSecret) {
            throw new Error("TWITTER_API_SECRET is not configured.");
        }
        if (!config.accessToken) {
            throw new Error("TWITTER_ACCESS_TOKEN is not configured.");
        }
        if (!config.accessTokenSecret) {
            throw new Error("TWITTER_ACCESS_TOKEN_SECRET is not configured.");
        }
        this.client = new twitter_api_v2_1.TwitterApi({
            appKey: config.apiKey,
            appSecret: config.apiSecret,
            accessToken: config.accessToken,
            accessSecret: config.accessTokenSecret,
        });
    }
    /**
     * Get account details for the currently authenticated Twitter (X) user.
     *
     * @param _ - Empty parameter object (not used)
     * @returns A JSON string containing the account details or error message
     */
    async accountDetails(_) {
        try {
            const response = await this.client.v2.me();
            response.data.url = `https://x.com/${response.data.username}`;
            return `Successfully retrieved authenticated user account details:\n${JSON.stringify(response)}`;
        }
        catch (error) {
            return `Error retrieving authenticated user account details: ${error}`;
        }
    }
    /**
     * Get mentions for a specified Twitter (X) user.
     *
     * @param args - The arguments containing userId
     * @returns A JSON string containing the mentions or error message
     */
    async accountMentions(args) {
        try {
            const response = await this.client.v2.userMentionTimeline(args.userId);
            return `Successfully retrieved account mentions:\n${JSON.stringify(response)}`;
        }
        catch (error) {
            return `Error retrieving authenticated account mentions: ${error}`;
        }
    }
    /**
     * Post a tweet on Twitter (X).
     *
     * @param args - The arguments containing the tweet text
     * @returns A JSON string containing the posted tweet details or error message
     */
    async postTweet(args) {
        try {
            const response = await this.client.v2.tweet(args.tweet);
            return `Successfully posted to Twitter:\n${JSON.stringify(response)}`;
        }
        catch (error) {
            return `Error posting to Twitter:\n${error}`;
        }
    }
    /**
     * Post a reply to a tweet on Twitter (X).
     *
     * @param args - The arguments containing the reply text and tweet ID
     * @returns A JSON string containing the posted reply details or error message
     */
    async postTweetReply(args) {
        try {
            const response = await this.client.v2.tweet(args.tweetReply, {
                reply: { in_reply_to_tweet_id: args.tweetId },
            });
            return `Successfully posted reply to Twitter:\n${JSON.stringify(response)}`;
        }
        catch (error) {
            return `Error posting reply to Twitter: ${error}`;
        }
    }
    /**
     * Checks if the Twitter action provider supports the given network.
     * Twitter actions don't depend on blockchain networks, so always return true.
     *
     * @param _ - The network to check (not used)
     * @returns Always returns true as Twitter actions are network-independent
     */
    supportsNetwork(_) {
        return true;
    }
}
exports.TwitterActionProvider = TwitterActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "account_details",
        description: `
This tool will return account details for the currently authenticated Twitter (X) user context.

A successful response will return a message with the api response as a json payload:
    {"data": {"id": "1853889445319331840", "name": "CDP AgentKit", "username": "CDPAgentKit"}}

A failure response will return a message with a Twitter API request error:
    Error retrieving authenticated user account: 429 Too Many Requests`,
        schema: schemas_1.TwitterAccountDetailsSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", Promise)
], TwitterActionProvider.prototype, "accountDetails", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "account_mentions",
        description: `
This tool will return mentions for the specified Twitter (X) user id.

A successful response will return a message with the API response as a JSON payload:
    {"data": [{"id": "1857479287504584856", "text": "@CDPAgentKit reply"}]}

A failure response will return a message with the Twitter API request error:
    Error retrieving user mentions: 429 Too Many Requests`,
        schema: schemas_1.TwitterAccountMentionsSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", Promise)
], TwitterActionProvider.prototype, "accountMentions", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "post_tweet",
        description: `
This tool will post a tweet on Twitter. The tool takes the text of the tweet as input. Tweets can be maximum 280 characters.

A successful response will return a message with the API response as a JSON payload:
    {"data": {"text": "hello, world!", "id": "0123456789012345678", "edit_history_tweet_ids": ["0123456789012345678"]}}

A failure response will return a message with the Twitter API request error:
    You are not allowed to create a Tweet with duplicate content.`,
        schema: schemas_1.TwitterPostTweetSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", Promise)
], TwitterActionProvider.prototype, "postTweet", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "post_tweet_reply",
        description: `
This tool will post a tweet on Twitter. The tool takes the text of the tweet as input. Tweets can be maximum 280 characters.

A successful response will return a message with the API response as a JSON payload:
    {"data": {"text": "hello, world!", "id": "0123456789012345678", "edit_history_tweet_ids": ["0123456789012345678"]}}

A failure response will return a message with the Twitter API request error:
    You are not allowed to create a Tweet with duplicate content.`,
        schema: schemas_1.TwitterPostTweetReplySchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", Promise)
], TwitterActionProvider.prototype, "postTweetReply", null);
/**
 * Factory function to create a new TwitterActionProvider instance.
 *
 * @param config - The configuration options for the TwitterActionProvider
 * @returns A new instance of TwitterActionProvider
 */
const twitterActionProvider = (config = {}) => new TwitterActionProvider(config);
exports.twitterActionProvider = twitterActionProvider;
