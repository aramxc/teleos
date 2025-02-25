export interface AgentAction {
    prompt: string;
    // Add other relevant fields
  }
  
  export interface AgentResponse {
    success: boolean;
    data?: unknown;
    error?: string;
  }