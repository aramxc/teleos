import { useState } from 'react';

interface AgentSubmissionData {
  name: string;
  description: string;
  websiteLink: string;
  icon: string;
  url: string;
  tags: string[];
  price: number;
  address: string;
}

interface SubmissionResponse {
  loading: boolean;
  error: string | null;
  submitAgent: (data: AgentSubmissionData) => Promise<void>;
}

export function useAgentSubmission(): SubmissionResponse {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAgent = async (data: AgentSubmissionData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit agent');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submitAgent };
}