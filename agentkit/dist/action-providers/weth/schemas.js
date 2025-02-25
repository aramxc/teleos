"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrapEthSchema = void 0;
const zod_1 = require("zod");
exports.WrapEthSchema = zod_1.z
    .object({
    amountToWrap: zod_1.z.string().describe("Amount of ETH to wrap in wei"),
})
    .strip()
    .describe("Instructions for wrapping ETH to WETH");
