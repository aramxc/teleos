import { useState, useCallback } from 'react';
import { useWallet } from '@/contexts/WalletContext';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

export type AgentResponse = {
  type: 'tool_start' | 'tool_end' | 'agent_log' | 'final_answer';
  content: string;
};

export function useAgentChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const { address } = useWallet();

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentResponse('');
    
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/agents/agentKit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          walletAddress: address
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.type === 'agent_log') {
              accumulatedResponse += parsed.content;
              setCurrentResponse(accumulatedResponse);
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }

      if (accumulatedResponse) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: accumulatedResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }

    } catch (err) {
      console.error('Streaming error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing your request');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      setCurrentResponse('');
    }
  }, [messages, address]);

  return {
    messages,
    isLoading,
    error,
    currentResponse,
    sendMessage,
  };
}