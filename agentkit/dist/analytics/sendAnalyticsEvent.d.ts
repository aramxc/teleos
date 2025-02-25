/**
 * The required data for an analytics event
 *
 * Accepts arbitrary additional fields
 */
type RequiredEventData = {
    /**
     * The event that took place, e.g. initialize_wallet_provider, agent_action_invocation
     */
    action: string;
    /**
     * The component that the event took place in, e.g. wallet_provider, agent_action
     */
    component: string;
    /**
     * The name of the event. This should match the name in AEC
     */
    name: string;
    /**
     * The timestamp of the event. If not provided, the current time will be used.
     */
    timestamp?: number;
} & Record<string, string | undefined>;
/**
 * Sends an analytics event to the default endpoint
 *
 * @param event - The event data containing required action, component and name fields
 * @returns Promise that resolves when the event is sent
 */
export declare function sendAnalyticsEvent(event: RequiredEventData): Promise<void>;
export {};
