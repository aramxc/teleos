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
import { queryAgents } from "../../utils/fileDB";

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
    try {
      let currentState = state || (await runtime.composeState(message));
      currentState = await runtime.updateRecentMessageState(currentState);

      const searchContext = composeContext({
        state: currentState,
        template: getAgentCategoryTemplate,
      });

      const searchParams = await generateMessageResponse({
        runtime: runtime,
        context: searchContext,
        modelClass: ModelClass.SMALL,
      });

      console.log("Search params:", searchParams);

      if (!searchParams?.category) {
        callback({
          text: "Please specify a category to search for agents",
          action: "FIND_AGENTS"
        });
        return true;
      }

      const results = await queryAgents(
        searchParams.category as string,
        (searchParams.numResults as number) || 10
      );

      if (!results?.results?.length) {
        callback({
          text: `No agents found for category: ${searchParams.category}`,
          action: "FIND_AGENTS"
        });
        return true;
      }

      // First send the results
      await callback({
        text: JSON.stringify({
          results: results
        }),
        action: "FIND_AGENTS"
      });

      // Then send a follow-up message
      await callback({
        text: `I've found ${results.results.length} agents that fit your criteria. Do any of these look good?`,
        action: "FIND_AGENTS"
      });

      return true;
    } catch (error) {
      console.error("Error in findAgents:", error);
      callback({
        text: `Error searching for agents: ${error.message}`,
        action: "FIND_AGENTS"
      });
      return true;
    }
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
