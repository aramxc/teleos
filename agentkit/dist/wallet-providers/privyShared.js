"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrivyWallet = createPrivyWallet;
const server_auth_1 = require("@privy-io/server-auth");
/**
 * Create a Privy wallet
 *
 * @param config - The configuration options for the Privy wallet
 * @returns The created Privy wallet
 */
async function createPrivyWallet(config) {
    const privy = new server_auth_1.PrivyClient(config.appId, config.appSecret, {
        walletApi: config.authorizationPrivateKey
            ? {
                authorizationPrivateKey: config.authorizationPrivateKey,
            }
            : undefined,
    });
    if (config.walletId) {
        const wallet = await privy.walletApi.getWallet({ id: config.walletId });
        if (!wallet) {
            throw new Error(`Wallet with ID ${config.walletId} not found`);
        }
        return { wallet, privy };
    }
    if (config.authorizationPrivateKey && !config.authorizationKeyId) {
        throw new Error("authorizationKeyId is required when creating a new wallet with an authorization key, this can be found in your Privy Dashboard");
    }
    if (config.authorizationKeyId && !config.authorizationPrivateKey) {
        throw new Error("authorizationPrivateKey is required when creating a new wallet with an authorizationKeyId. " +
            "If you don't have it, you can create a new one in your Privy Dashboard, or delete the authorization key.");
    }
    try {
        const wallet = await privy.walletApi.create({
            chainType: config.chainType,
            authorizationKeyIds: config.authorizationKeyId ? [config.authorizationKeyId] : undefined,
        });
        return { wallet, privy };
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error &&
            error.message.includes("Missing `privy-authorization-signature` header")) {
            // Providing a more informative error message, see context: https://github.com/coinbase/agentkit/pull/242#discussion_r1956428617
            throw new Error("Privy error: you have an authorization key on your account which can create and modify wallets, please delete this key or pass it to the PrivyWalletProvider to create a new wallet");
        }
        throw new Error("Failed to create wallet");
    }
}
