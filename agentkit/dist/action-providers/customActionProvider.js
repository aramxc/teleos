"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.customActionProvider = exports.CustomActionProvider = void 0;
const actionDecorator_1 = require("./actionDecorator");
const actionProvider_1 = require("./actionProvider");
const wallet_providers_1 = require("../wallet-providers");
/**
 * CustomActionProvider is a custom action provider that allows for custom action registration
 */
class CustomActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Creates a new CustomActionProvider that dynamically adds decorated action methods
     *
     * @param actions - Array of custom actions to be added to the provider
     */
    constructor(actions) {
        super("custom", []);
        actions.forEach(({ name, description, schema, invoke }) => {
            // Check if the invoke function expects a wallet provider
            const takesWalletProvider = invoke.length === 2;
            // Define the method on the prototype with the correct signature
            Object.defineProperty(CustomActionProvider.prototype, name, {
                value: takesWalletProvider
                    ? async function (walletProvider, args) {
                        const parsedArgs = schema.parse(args);
                        return await invoke(walletProvider, parsedArgs);
                    }
                    : async function (args) {
                        const parsedArgs = schema.parse(args);
                        return await invoke(parsedArgs);
                    },
                configurable: true,
                writable: true,
                enumerable: true,
            });
            // Manually set the parameter metadata
            const paramTypes = takesWalletProvider ? [wallet_providers_1.WalletProvider, Object] : [Object];
            Reflect.defineMetadata("design:paramtypes", paramTypes, CustomActionProvider.prototype, name);
            // Apply the decorator using original name
            const decoratedMethod = (0, actionDecorator_1.CreateAction)({
                name,
                description,
                schema,
            })(CustomActionProvider.prototype, name, Object.getOwnPropertyDescriptor(CustomActionProvider.prototype, name));
            // Add the decorated method to the instance
            Object.defineProperty(this, name, {
                value: decoratedMethod,
                configurable: true,
                writable: true,
            });
        });
    }
    /**
     * Custom action providers are supported on all networks
     *
     * @param _ - The network to checkpointSaver
     * @returns true
     */
    supportsNetwork(_) {
        return true;
    }
}
exports.CustomActionProvider = CustomActionProvider;
const customActionProvider = (actions) => new CustomActionProvider(Array.isArray(actions) ? actions : [actions]);
exports.customActionProvider = customActionProvider;
