"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { Message, useElizaApi } from "@/hooks/agents/useEliza";
import { useAgent } from "@/contexts/AgentContext";

interface ChatContextType {
  messages: Message[];
  currentResponse: string;
  isLoading: boolean;
  error: string | null;
  isInitialState: boolean;
  setInitialState: (value: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const {
    messages,
    currentResponse,
    isLoading,
    error,
    sendMessage: elizaSendMessage,
  } = useElizaApi();
  const { agentId } = useAgent();
  const [isInitialState, setInitialState] = useState(true);

  return (
    <ChatContext.Provider
      value={{
        messages,
        currentResponse,
        isLoading,
        error,
        isInitialState,
        setInitialState,
        sendMessage: async (content: string) => {
          if (!agentId) {
            console.error("No agent selected");
            return;
          }

          try {
            await elizaSendMessage(agentId, content);
          } catch (error) {
            console.error("Error sending message:", error);
          }
        },
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context)
    throw new Error("useChatContext must be used within ChatProvider");
  return context;
}
