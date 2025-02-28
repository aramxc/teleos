import { useState } from 'react';
import { Code, NextPlan } from "@mui/icons-material";
import AgentConfigModal from '../../modals/AgentModals';

interface Agent {
  name: string;
  description: string;
  websiteLink: string;
  tags: string[];
  icon: string;
  price: number;
}

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent: initialAgent }: AgentCardProps) {
  const agent = { ...initialAgent, price: 10 };
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to get first sentence
  const getFirstSentence = (text: string) => {
    const match = text.match(/^.*?[.!?](?:\s|$)/);
    return match ? match[0].trim() : text;
  };

  // Get visible and hidden tags
  const visibleTags = agent.tags.slice(0, 3);
  const remainingTags = agent.tags.length > 3 ? agent.tags.length - 3 : 0;

  return (
    <>
      <div className="bg-theme-panel-bg border border-theme-border-primary rounded-lg shadow-lg
      p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] h-auto min-h-[380px] flex flex-col
      w-full max-w-[300px] md:max-w-[400px] lg:max-w-[450px] mx-auto relative">
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
          <Code className="mb-4" />
          <p className="text-sm text-theme-text-secondary mb-4">
            {getFirstSentence(agent.description)}
          </p>
          
          <div className="mt-auto w-full">
            <hr className="pb-6"/>
            <div className="flex flex-wrap gap-2 mb-4">
              {visibleTags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-theme-button-primary to-theme-button-hover text-white border border-theme-border-primary"
                >
                  {tag}
                </span>
              ))}
              {remainingTags > 0 && (
                <span
                  className="px-2 py-1 text-xs rounded-full bg-theme-bg-accent text-theme-text-secondary border border-theme-border-primary cursor-pointer hover:bg-theme-bg-accent/80"
                  onClick={() => setIsModalOpen(true)}
                >
                  +{remainingTags} more
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <a
                href={agent.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-theme-accent-primary hover:underline"
              >
                Website
              </a>
              <NextPlan 
                className="cursor-pointer rounded-full text-theme-button-primary shadow-lg border border-theme-border-primary hover:text-theme-button-hover transition-colors"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <AgentConfigModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        agent={agent}
      />
    </>
  );
}