import {
  type ActionExample,
  type IAgentRuntime,
  type Memory,
  type Action,
  composeContext,
  State,
  ModelClass,
  generateMessageResponse,
  HandlerCallback,
} from "@elizaos/core";
import { getAgentCategoryTemplate } from "./getAgentCategoryTemplate.ts";
import { queryChromaDB } from "../../utils/chromaDB.ts";

export const findAgents: Action = {
  name: "FIND_AGENTS",
  similes: ["AGENT_LOOKUP", "AGENT_SEARCH", "AGENT_FIND"],
  suppressInitialMessage: true,
  // Simple validation - always returns true for now
  validate: async (_runtime: IAgentRuntime, _message: Memory) => true,
  description: "Search and return AI agents based on user query parameters",
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: { [key: string]: unknown },
    callback: HandlerCallback
  ): Promise<boolean> => {
    let currentState: State = state;
    if (!currentState) {
      currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const categoryContext = composeContext({
      state: currentState,
      template: getAgentCategoryTemplate,
    });

    const response = await generateMessageResponse({
      runtime: runtime,
      context: categoryContext,
      modelClass: ModelClass.SMALL,
    });

    if (response.category) {
      const numResults = response.numResults || 10;
      const results = await queryChromaDB(
        response.category as string,
        numResults as number
      );
      callback({
        text: JSON.stringify(results),
        action: "FIND_AGENTS",
      });
    }
    return true;
  },

  // Example interactions for training
  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "Find me 3 marketing agents" },
      },
      {
        user: "{{user2}}",
        content: {
          text: "Here are 3 marketing agents...",
          action: "FIND_AGENTS",
        },
      },
    ],
    // Add more examples as needed
  ] as ActionExample[][],
} as Action;
