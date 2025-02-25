"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterBasenameSchema = void 0;
const zod_1 = require("zod");
/**
 * Input schema for registering a Basename.
 */
exports.RegisterBasenameSchema = zod_1.z
    .object({
    basename: zod_1.z.string().describe("The Basename to assign to the agent"),
    amount: zod_1.z.string().default("0.002").describe("The amount of ETH to pay for registration"),
})
    .strip()
    .describe("Instructions for registering a Basename");
