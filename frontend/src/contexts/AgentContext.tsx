"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useElizaApi } from "@/hooks/agents/useEliza";

interface Agent {
  id: string;
  name: string;
}

interface AgentContextType {
  agentId: string | null;
  setAgentId: (id: string) => void;
  isLoading: boolean;
  error: Error | null;
  agents: Agent[] | undefined;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [agentId, setAgentId] = useState<string | null>(null);
  const elizaApi = useElizaApi();

  const query = useQuery({
    queryKey: ["agents"],
    queryFn: () => elizaApi.getAgents(),
    refetchInterval: 5000,
  });

  // Set the first agent as default when agents are loaded
  useEffect(() => {
    if (query.data && query.data.length > 0 && !agentId) {
      setAgentId(query.data[0].id);
    }
  }, [query.data, agentId]);

  return (
    <AgentContext.Provider
      value={{
        agentId,
        setAgentId,
        isLoading: query.isLoading,
        error: query.error as Error | null,
        agents: query.data?.agents,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
}
