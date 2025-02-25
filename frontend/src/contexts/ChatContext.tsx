"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useAgentChat } from '@/hooks/useAgentKit';

const ChatContext = createContext<ReturnType<typeof useAgentChat> | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useAgentChat();
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChatContext must be used within ChatProvider');
  return context;
}