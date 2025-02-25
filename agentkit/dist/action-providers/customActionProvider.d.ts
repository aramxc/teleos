import { z } from "zod";
import { ActionProvider } from "./actionProvider";
import { Network } from "../network";
import { WalletProvider } from "../wallet-providers";
interface CustomActionProviderOptions<TWalletProvider extends WalletProvider> {
    name: string;
    description: string;
    schema: z.ZodSchema;
    invoke: ((args: any) => Promise<any>) | ((walletProvider: TWalletProvider, args: any) => Promise<any>);
}
/**
 * CustomActionProvider is a custom action provider that allows for custom action registration
 */
export declare class CustomActionProvider<TWalletProvider extends WalletProvider> extends ActionProvider {
    /**
     * Creates a new CustomActionProvider that dynamically adds decorated action methods
     *
     * @param actions - Array of custom actions to be added to the provider
     */
    constructor(actions: CustomActionProviderOptions<TWalletProvider>[]);
    /**
     * Custom action providers are supported on all networks
     *
     * @param _ - The network to checkpointSaver
     * @returns true
     */
    supportsNetwork(_: Network): boolean;
}
export declare const customActionProvider: <TWalletProvider extends WalletProvider>(actions: CustomActionProviderOptions<TWalletProvider> | CustomActionProviderOptions<TWalletProvider>[]) => CustomActionProvider<TWalletProvider>;
export {};
