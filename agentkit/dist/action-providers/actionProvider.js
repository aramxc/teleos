"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionProvider = void 0;
const actionDecorator_1 = require("./actionDecorator");
/**
 * ActionProvider is the abstract base class for all action providers.
 *
 * @abstract
 */
class ActionProvider {
    /**
     * The constructor for the action provider.
     *
     * @param name - The name of the action provider.
     * @param actionProviders - The action providers to combine.
     */
    constructor(name, 
    // Update parameter type to match property type
    actionProviders) {
        this.name = name;
        this.actionProviders = actionProviders;
    }
    /**
     * Gets the actions of the action provider bound to the given wallet provider.
     *
     * @param walletProvider - The wallet provider.
     * @returns The actions of the action provider.
     */
    getActions(walletProvider) {
        const actions = [];
        const actionProviders = [this, ...this.actionProviders];
        for (const actionProvider of actionProviders) {
            const actionsMetadataMap = Reflect.getMetadata(actionDecorator_1.ACTION_DECORATOR_KEY, actionProvider.constructor);
            if (!actionsMetadataMap) {
                if (!(actionProvider instanceof ActionProvider)) {
                    console.warn(`Warning: ${actionProvider} is not an instance of ActionProvider.`);
                }
                else {
                    console.warn(`Warning: ${actionProvider} has no actions.`);
                }
                continue;
            }
            for (const actionMetadata of actionsMetadataMap.values()) {
                actions.push({
                    name: actionMetadata.name,
                    description: actionMetadata.description,
                    schema: actionMetadata.schema,
                    invoke: schemaArgs => {
                        const args = [];
                        if (actionMetadata.walletProvider) {
                            args[0] = walletProvider;
                        }
                        args.push(schemaArgs);
                        return actionMetadata.invoke.apply(actionProvider, args);
                    },
                });
            }
        }
        return actions;
    }
}
exports.ActionProvider = ActionProvider;
