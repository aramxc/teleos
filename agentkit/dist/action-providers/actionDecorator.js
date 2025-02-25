"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTION_DECORATOR_KEY = void 0;
exports.CreateAction = CreateAction;
const wallet_providers_1 = require("../wallet-providers");
const analytics_1 = require("../analytics");
require("reflect-metadata");
/**
 * Metadata key for the action decorator
 */
exports.ACTION_DECORATOR_KEY = Symbol("agentkit:action");
/**
 * Decorator to embed metadata on class methods to indicate they are actions accessible to the agent
 *
 * @param params - The parameters for the action decorator
 * @returns A decorator function
 *
 * @example
 * ```typescript
 * class MyActionProvider extends ActionProvider {
 *   @CreateAction({ name: "my_action", description: "My action", schema: myActionSchema })
 *   public myAction(args: z.infer<typeof myActionSchema>) {
 *     // ...
 *   }
 * }
 * ```
 */
function CreateAction(params) {
    return (target, propertyKey, descriptor) => {
        const prefixedActionName = `${target.constructor.name}_${params.name}`;
        const originalMethod = descriptor.value;
        const { isWalletProvider } = validateActionMethodArguments(target, propertyKey);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        descriptor.value = function (...args) {
            let walletMetrics = {};
            if (isWalletProvider) {
                walletMetrics = {
                    wallet_provider: args[0].getName(),
                    wallet_address: args[0].getAddress(),
                    network_id: args[0].getNetwork().networkId,
                    chain_id: args[0].getNetwork().chainId,
                    protocol_family: args[0].getNetwork().protocolFamily,
                };
            }
            (0, analytics_1.sendAnalyticsEvent)({
                name: "agent_action_invocation",
                action: "invoke_action",
                component: "agent_action",
                action_name: prefixedActionName,
                class_name: target.constructor.name,
                method_name: propertyKey,
                ...walletMetrics,
            });
            return originalMethod.apply(this, args);
        };
        const existingMetadata = Reflect.getMetadata(exports.ACTION_DECORATOR_KEY, target.constructor) || new Map();
        const metaData = {
            name: prefixedActionName,
            description: params.description,
            schema: params.schema,
            invoke: descriptor.value,
            walletProvider: isWalletProvider,
        };
        existingMetadata.set(propertyKey, metaData);
        Reflect.defineMetadata(exports.ACTION_DECORATOR_KEY, existingMetadata, target.constructor);
        return target;
    };
}
/**
 * Validates the arguments of an action method
 *
 * @param target - The target object
 * @param propertyKey - The property key
 * @returns An object containing the wallet provider flag
 */
function validateActionMethodArguments(target, propertyKey) {
    const className = target instanceof Object ? target.constructor.name : undefined;
    const params = Reflect.getMetadata("design:paramtypes", target, propertyKey);
    if (params == null) {
        throw new Error(`Failed to get parameters for action method ${propertyKey} on class ${className}`);
    }
    if (params.length > 2) {
        throw new Error(`Action method ${propertyKey} on class ${className} has more than 2 parameters`);
    }
    const walletProviderParam = params.find(param => {
        if (!param || !param.prototype) {
            return false;
        }
        if (param === wallet_providers_1.WalletProvider)
            return true;
        return param.prototype instanceof wallet_providers_1.WalletProvider;
    });
    return {
        isWalletProvider: !!walletProviderParam,
    };
}
