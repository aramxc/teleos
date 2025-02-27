import { useState } from 'react';
// import { type UUID, type Character } from "@elizaos/core";

const BASE_URL = process.env.NEXT_PUBLIC_ELIZA_URL ?? 'http://localhost:8000';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Hook for interacting with Eliza API
 * 
 * Usage:
 * const { messages, sendMessage, isLoading } = useElizaApi();
 * 
 * // Send a message
 * await sendMessage('default', 'Hello Eliza!');
 * 
 * // Access chat history
 * messages.map(msg => console.log(msg.content));
 */
export const useElizaApi = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentResponse, setCurrentResponse] = useState('');

  // Helper function for API requests
  const fetchApi = async <T>({ 
    url, 
    method = 'GET', 
    body = null 
  }: {
    url: string;
    method?: string;
    body?: BodyInit | null;
  }): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare request options
      const options: RequestInit = {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        } as Record<string, string>
      };

      // Handle FormData vs JSON body
      if (body) {
        options.body = body instanceof FormData 
          ? (delete (options.headers as Record<string, string>)['Content-Type'], body)
          : JSON.stringify(body);
      }

      // Make request
      const response = await fetch(`${BASE_URL}${url}`, options);
      if (!response.ok) throw new Error(await response.text());

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send a message to Eliza
   * @param agentId - ID of the agent to message
   * @param content - Message content
   */
  const sendMessage = async (agentId: string, content: string) => {
    try {
      // Add user message to chat
      setMessages(prev => [...prev, { role: 'user', content }]);
      setCurrentResponse('');

      const formData = new FormData();
      formData.append('text', content);
      formData.append('user', 'user');

      const { response } = await fetchApi<{ response: string }>({
        url: `/${agentId}/message`,
        method: 'POST',
        body: formData
      });

      setCurrentResponse(response);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setCurrentResponse('');
      return response;
    } catch (err) {
      throw err;
    }
  };

  return {
    messages,      // Array of chat messages
    currentResponse, // Current streaming response (if any)
    isLoading,     // Loading state
    error,         // Error state
    sendMessage    // Function to send messages
  };
};
