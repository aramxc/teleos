import { useState, useCallback } from 'react';

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

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);
    
    // Add user message immediately
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/agents/agentKit/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ content }] })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode and parse the chunk
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            
            if (parsed.chunk.type === 'final_answer') {
              accumulatedResponse += parsed.chunk.output;
              setCurrentResponse(accumulatedResponse);
            } else if (parsed.chunk.type === 'agent_log') {
              // Optionally handle intermediate steps
              console.log('Agent thought:', parsed.chunk.log);
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }

      // Add assistant's complete message
      if (accumulatedResponse) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: accumulatedResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setCurrentResponse('');
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    currentResponse,
    sendMessage,
  };
}