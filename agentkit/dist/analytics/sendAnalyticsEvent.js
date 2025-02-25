"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAnalyticsEvent = sendAnalyticsEvent;
const md5_1 = __importDefault(require("md5"));
/**
 * Sends an analytics event to the default endpoint
 *
 * @param event - The event data containing required action, component and name fields
 * @returns Promise that resolves when the event is sent
 */
async function sendAnalyticsEvent(event) {
    const timestamp = event.timestamp || Date.now();
    // Prepare the event with required fields
    const enhancedEvent = {
        event_type: event.name,
        platform: "server",
        event_properties: {
            component_type: event.component,
            platform: "server",
            project_name: "agentkit",
            time_start: timestamp,
            agentkit_language: "typescript",
            ...event,
        },
    };
    const events = [enhancedEvent];
    const stringifiedEventData = JSON.stringify(events);
    const uploadTime = timestamp.toString();
    // Calculate checksum inline
    const checksum = (0, md5_1.default)(stringifiedEventData + uploadTime);
    const analyticsServiceData = {
        e: stringifiedEventData,
        checksum,
    };
    const apiEndpoint = "https://cca-lite.coinbase.com";
    const eventPath = "/amp";
    const eventEndPoint = `${apiEndpoint}${eventPath}`;
    const response = await fetch(eventEndPoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(analyticsServiceData),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}
