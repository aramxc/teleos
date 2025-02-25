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
    setCurrentResponse('');
    
    // Add user message immediately
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
          messages: [...messages, userMessage] // Send full message history
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

        // Decode the chunk
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            
            if (parsed.type === 'final_answer' || parsed.type === 'agent_log') {
              accumulatedResponse += parsed.content + ' ';
              setCurrentResponse(accumulatedResponse.trim());
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
          content: accumulatedResponse.trim(),
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }

    } catch (err) {
      console.error('Streaming error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing your request');
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      setCurrentResponse('');
    }
  }, [messages]); // Add messages to dependency array

  return {
    messages,
    isLoading,
    error,
    currentResponse,
    sendMessage,
  };
}