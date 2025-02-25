"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterPostTweetReplySchema = exports.TwitterPostTweetSchema = exports.TwitterAccountMentionsSchema = exports.TwitterAccountDetailsSchema = void 0;
const zod_1 = require("zod");
/**
 * Input schema for retrieving account details.
 */
exports.TwitterAccountDetailsSchema = zod_1.z
    .object({})
    .strip()
    .describe("Input schema for retrieving account details");
/**
 * Input schema for retrieving account mentions.
 */
exports.TwitterAccountMentionsSchema = zod_1.z
    .object({
    userId: zod_1.z
        .string()
        .min(1, "Account ID is required.")
        .describe("The Twitter (X) user id to return mentions for"),
})
    .strip()
    .describe("Input schema for retrieving account mentions");
/**
 * Input schema for posting a tweet.
 */
exports.TwitterPostTweetSchema = zod_1.z
    .object({
    tweet: zod_1.z.string().max(280, "Tweet must be a maximum of 280 characters."),
})
    .strip()
    .describe("Input schema for posting a tweet");
/**
 * Input schema for posting a tweet reply.
 */
exports.TwitterPostTweetReplySchema = zod_1.z
    .object({
    tweetId: zod_1.z.string().describe("The id of the tweet to reply to"),
    tweetReply: zod_1.z
        .string()
        .max(280, "The reply to the tweet which must be a maximum of 280 characters."),
})
    .strip()
    .describe("Input schema for posting a tweet reply");
