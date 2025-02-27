import { useState } from 'react';
// import { type UUID, type Character } from "@elizaos/core";

const BASE_URL = process.env.NEXT_PUBLIC_ELIZA_URL ?? 'http://localhost:3001';

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
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [currentResponse, setCurrentResponse] = useState('');

  // Helper function for API requests
  const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const url = `${BASE_URL}${endpoint}`;
    console.log('Fetching from:', url); // Debug log

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
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

      const { response } = await fetchApi(`/${agentId}/message`, {
        method: 'POST',
        body: formData
      });

      setCurrentResponse(response);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setCurrentResponse('');
      return response;
    } catch (err) {
      console.error('Failed to send message:', err);
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
