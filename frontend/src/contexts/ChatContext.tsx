"use client";

import { createContext, useContext, ReactNode, useState } from 'react';
import { useAgentChat } from '@/hooks/agents/useAgentKit';

interface ChatContextType extends ReturnType<typeof useAgentChat> {
  isInitialState: boolean;
  setInitialState: (value: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useAgentChat();
  const [isInitialState, setInitialState] = useState(true);

  return (
    <ChatContext.Provider 
      value={{ 
        ...chat, 
        isInitialState,
        setInitialState
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChatContext must be used within ChatProvider');
  return context;
}