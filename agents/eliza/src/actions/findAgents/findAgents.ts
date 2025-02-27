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
import { queryChromaDB } from "../../utils/chomaDB.ts";

export const findAgents: Action = {
  name: "FIND_AGENTS",
  similes: ["AGENT_LOOKUP", "AGENT_SEARCH", "AGENT_FIND"],
  suppressInitialMessage: true,
  validate: async (_runtime: IAgentRuntime, _message: Memory) => {
    return true;
  },
  description:
    "Respond but perform no additional action. This is the default if the agent is speaking and not doing anything additional.",
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
      console.log(results);
    }
    return true;
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "Can you find me a marketing agent?" },
      },
      {
        user: "{{user2}}",
        content: {
          text: "Here's 5 marketing agents for you",
          action: "FIND_AGENTS",
        },
      },
    ],

    [
      {
        user: "{{user1}}",
        content: {
          text: "did u see some faster whisper just came out",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "yeah but its a pain to get into node.js",
          action: "NONE",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "the things that were funny 6 months ago are very cringe now",
          action: "NONE",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "lol true",
          action: "NONE",
        },
      },
      {
        user: "{{user1}}",
        content: { text: "too real haha", action: "NONE" },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: { text: "gotta run", action: "NONE" },
      },
      {
        user: "{{user2}}",
        content: { text: "Okay, ttyl", action: "NONE" },
      },
      {
        user: "{{user1}}",
        content: { text: "", action: "IGNORE" },
      },
    ],

    [
      {
        user: "{{user1}}",
        content: { text: "heyyyyyy", action: "NONE" },
      },
      {
        user: "{{user2}}",
        content: { text: "whats up long time no see" },
      },
      {
        user: "{{user1}}",
        content: {
          text: "chillin man. playing lots of fortnite. what about you",
          action: "FIND_AGENTS",
        },
      },
    ],

    [
      {
        user: "{{user1}}",
        content: { text: "u think aliens are real", action: "NONE" },
      },
      {
        user: "{{user2}}",
        content: { text: "ya obviously", action: "NONE" },
      },
    ],

    [
      {
        user: "{{user1}}",
        content: { text: "drop a joke on me", action: "NONE" },
      },
      {
        user: "{{user2}}",
        content: {
          text: "why dont scientists trust atoms cuz they make up everything lmao",
          action: "NONE",
        },
      },
      {
        user: "{{user1}}",
        content: { text: "haha good one", action: "NONE" },
      },
    ],

    [
      {
        user: "{{user1}}",
        content: {
          text: "hows the weather where ur at",
          action: "NONE",
        },
      },
      {
        user: "{{user2}}",
        content: { text: "beautiful all week", action: "NONE" },
      },
    ],
  ] as ActionExample[][],
} as Action;
