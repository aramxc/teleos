import { useState, useEffect } from "react";
// import { type UUID, type Character } from "@elizaos/core";
import { coinbaseProvider } from '@/lib/coinbaseWallet';

const BASE_URL = process.env.NEXT_PUBLIC_ELIZA_URL ?? "http://localhost:3001";

export interface Message {
  role: "user" | "assistant";
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
  const [error] = useState<string | null>(null);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [address, setAddress] = useState<string | null>(null);

  // Get wallet address on mount
  useEffect(() => {
    if (!coinbaseProvider) return;
    
    coinbaseProvider.send('eth_accounts', [])
      .then((accounts: string[]) => {
        if (accounts[0]) {
          setAddress(accounts[0]);
        }
      })
      .catch(console.error);
  }, []);

  // Helper function for API requests
  const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const url = `${BASE_URL}${endpoint}`;

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
   * @param message - Message content
   */
  const sendMessage = async (agentId: string, message: string) => {
    try {
      // Add user message to chat
      setIsLoading(true);
      setMessages((prev) => [...prev, { role: "user", content: message }]);
      setCurrentResponse("");

      // Use JSON instead of FormData
      const requestBody = {
        text: message,
        user: "user",
        walletAddress: address, // Include the wallet address in the request
      };

      const response = await fetchApi(`/${agentId}/message`, {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      // Handle all messages in the response array
      for (const msg of response) {
        const { text, user } = msg;
        // Wrap array results in {results: [...]} format
        const content = text.startsWith("[")
          ? JSON.stringify({ results: JSON.parse(text) })
          : text;

        setCurrentResponse(content);
        setMessages((prev) => [...prev, { role: user, content }]);
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to send message:", err);
      throw err;
    }
  };

  const getAgents = async () => {
    const { agents } = await fetchApi("/agents", { method: "GET" });
    return agents;
  };

  return {
    messages, // Array of chat messages
    currentResponse, // Current streaming response (if any)
    isLoading, // Loading state
    error, // Error state
    sendMessage, // Function to send messages
    getAgents, // Function to get agents
    address, // Expose the address
  };
};
