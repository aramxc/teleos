export interface AgentAction {
  prompt: string;
  // Add other relevant fields
}

export interface AgentResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface Agent {
  name: string;
  description: string;
  tags: string[];
  websiteLink: string;
  icon: string;
  price: number;
  address: string;
  id?: string;
}
