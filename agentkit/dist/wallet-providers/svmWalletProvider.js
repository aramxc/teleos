"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvmWalletProvider = void 0;
const walletProvider_1 = require("./walletProvider");
/**
 * SvmWalletProvider is the abstract base class for all Solana wallet providers (non browsers).
 *
 * @abstract
 */
class SvmWalletProvider extends walletProvider_1.WalletProvider {
}
exports.SvmWalletProvider = SvmWalletProvider;
