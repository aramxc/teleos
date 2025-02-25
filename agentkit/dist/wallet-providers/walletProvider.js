"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletProvider = void 0;
const analytics_1 = require("../analytics");
/**
 * WalletProvider is the abstract base class for all wallet providers.
 *
 * @abstract
 */
class WalletProvider {
    /**
     * Initializes the wallet provider.
     */
    constructor() {
        // Wait for the next tick to ensure child class is initialized
        Promise.resolve().then(() => {
            this.trackInitialization();
        });
    }
    /**
     * Tracks the initialization of the wallet provider.
     */
    trackInitialization() {
        try {
            (0, analytics_1.sendAnalyticsEvent)({
                name: "agent_initialization",
                action: "initialize_wallet_provider",
                component: "wallet_provider",
                wallet_provider: this.getName(),
                wallet_address: this.getAddress(),
                network_id: this.getNetwork().networkId,
                chain_id: this.getNetwork().chainId,
                protocol_family: this.getNetwork().protocolFamily,
            });
        }
        catch (error) {
            console.warn("Failed to track wallet provider initialization:", error);
        }
    }
}
exports.WalletProvider = WalletProvider;
