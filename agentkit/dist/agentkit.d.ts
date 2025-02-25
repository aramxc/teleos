import { WalletProvider } from "./wallet-providers";
import { Action, ActionProvider } from "./action-providers";
/**
 * Configuration options for AgentKit
 */
export type AgentKitOptions = {
    cdpApiKeyName?: string;
    cdpApiKeyPrivateKey?: string;
    walletProvider?: WalletProvider;
    actionProviders?: ActionProvider[];
};
/**
 * AgentKit
 */
export declare class AgentKit {
    private walletProvider;
    private actionProviders;
    /**
     * Initializes a new AgentKit instance
     *
     * @param config - Configuration options for the AgentKit
     * @param config.walletProvider - The wallet provider to use
     * @param config.actionProviders - The action providers to use
     * @param config.actions - The actions to use
     */
    private constructor();
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
    static from(config?: AgentKitOptions): Promise<AgentKit>;
    /**
     * Returns the actions available to the AgentKit.
     *
     * @returns An array of actions
     */
    getActions(): Action[];
}
