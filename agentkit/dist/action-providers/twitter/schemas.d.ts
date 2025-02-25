import { z } from "zod";
/**
 * Input schema for retrieving account details.
 */
export declare const TwitterAccountDetailsSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
/**
 * Input schema for retrieving account mentions.
 */
export declare const TwitterAccountMentionsSchema: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
/**
 * Input schema for posting a tweet.
 */
export declare const TwitterPostTweetSchema: z.ZodObject<{
    tweet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tweet: string;
}, {
    tweet: string;
}>;
/**
 * Input schema for posting a tweet reply.
 */
export declare const TwitterPostTweetReplySchema: z.ZodObject<{
    tweetId: z.ZodString;
    tweetReply: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tweetId: string;
    tweetReply: string;
}, {
    tweetId: string;
    tweetReply: string;
}>;
