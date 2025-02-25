"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentKit = void 0;
const wallet_providers_1 = require("./wallet-providers");
const action_providers_1 = require("./action-providers");
/**
 * AgentKit
 */
class AgentKit {
    /**
     * Initializes a new AgentKit instance
     *
     * @param config - Configuration options for the AgentKit
     * @param config.walletProvider - The wallet provider to use
     * @param config.actionProviders - The action providers to use
     * @param config.actions - The actions to use
     */
    constructor(config) {
        this.walletProvider = config.walletProvider;
        this.actionProviders = config.actionProviders || [(0, action_providers_1.walletActionProvider)()];
    }
    /**
     * Initializes a new AgentKit instance
     *
     * @param config - Configuration options for the AgentKit
     * @param config.walletProvider - The wallet provider to use
     * @param config.actionProviders - The action providers to use
     * @param config.actions - The actions to use
     *
     * @returns A new AgentKit instance
     */
    static async from(config = { actionProviders: [(0, action_providers_1.walletActionProvider)()] }) {
        let walletProvider = config.walletProvider;
        if (!config.walletProvider) {
            if (!config.cdpApiKeyName || !config.cdpApiKeyPrivateKey) {
                throw new Error("cdpApiKeyName and cdpApiKeyPrivateKey are required if not providing a walletProvider");
            }
            walletProvider = await wallet_providers_1.CdpWalletProvider.configureWithWallet({
                apiKeyName: config.cdpApiKeyName,
                apiKeyPrivateKey: config.cdpApiKeyPrivateKey,
            });
        }
        return new AgentKit({ ...config, walletProvider: walletProvider });
    }
    /**
     * Returns the actions available to the AgentKit.
     *
     * @returns An array of actions
     */
    getActions() {
        const actions = [];
        const unsupported = [];
        for (const actionProvider of this.actionProviders) {
            if (actionProvider.supportsNetwork(this.walletProvider.getNetwork())) {
                actions.push(...actionProvider.getActions(this.walletProvider));
            }
            else {
                unsupported.push(actionProvider.name);
            }
        }
        if (unsupported.length > 0) {
            console.log(`Warning: The following action providers are not supported on the current network and will be unavailable: ${unsupported.join(", ")}`);
            console.log("Current network:", this.walletProvider.getNetwork());
        }
        return actions;
    }
}
exports.AgentKit = AgentKit;
