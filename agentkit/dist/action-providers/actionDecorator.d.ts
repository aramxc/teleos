import { z } from "zod";
import "reflect-metadata";
/**
 * Parameters for the create action decorator
 */
export interface CreateActionDecoratorParams {
    /**
     * The name of the action
     */
    name: string;
    /**
     * The description of the action
     */
    description: string;
    /**
     * The schema of the action
     */
    schema: z.ZodSchema;
}
/**
 * Metadata key for the action decorator
 */
export declare const ACTION_DECORATOR_KEY: unique symbol;
/**
 * Metadata for AgentKit actions
 */
export interface ActionMetadata {
    /**
     * The name of the action
     */
    name: string;
    /**
     * The description of the action
     */
    description: string;
    /**
     * The schema of the action
     */
    schema: z.ZodSchema;
    /**
     * The function to invoke the action
     */
    invoke: (...args: any[]) => any;
    /**
     * The wallet provider to use for the action
     */
    walletProvider: boolean;
}
/**
 * A map of action names to their metadata
 */
export type StoredActionMetadata = Map<string, ActionMetadata>;
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
export declare function CreateAction(params: CreateActionDecoratorParams): (target: object, propertyKey: string, descriptor: PropertyDescriptor) => object;
