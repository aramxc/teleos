"use strict";
// TODO: Improve type safety
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvmWalletProvider = void 0;
const walletProvider_1 = require("./walletProvider");
/**
 * EvmWalletProvider is the abstract base class for all EVM wallet providers.
 *
 * @abstract
 */
class EvmWalletProvider extends walletProvider_1.WalletProvider {
}
exports.EvmWalletProvider = EvmWalletProvider;
