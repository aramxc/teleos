"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarcasterPostCastSchema = exports.FarcasterAccountDetailsSchema = void 0;
const zod_1 = require("zod");
/**
 * Input argument schema for the account_details action.
 */
exports.FarcasterAccountDetailsSchema = zod_1.z
    .object({})
    .strip()
    .describe("Input schema for retrieving account details");
/**
 * Input argument schema for the post cast action.
 */
exports.FarcasterPostCastSchema = zod_1.z
    .object({
    castText: zod_1.z.string().max(280, "Cast text must be a maximum of 280 characters."),
})
    .strip()
    .describe("Input schema for posting a text-based cast");
