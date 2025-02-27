import { useState } from 'react';
import { Code, NextPlan } from "@mui/icons-material";
import { Fade } from '@mui/material';
import RequirementsModal from '../modals/RequirementsModal';
import ReviewModal from '../modals/ReviewModal';
import { AgentRequirements } from '../modals/RequirementsModal';

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
  const [currentModal, setCurrentModal] = useState<'requirements' | 'review' | null>(null);
  const [requirements, setRequirements] = useState<AgentRequirements | null>(null);

  const handleRequirementsContinue = (reqs: AgentRequirements) => {
    setRequirements(reqs);
    setTimeout(() => setCurrentModal('review'), 50);
  };

  const handleBack = () => {
    setTimeout(() => setCurrentModal('requirements'), 50);
  };

  const handleClose = () => {
    setCurrentModal(null);
    setTimeout(() => setRequirements(null), 300);
  };

  return (
    <>
      <div className="bg-theme-panel-bg border border-theme-border-primary rounded-lg 
      p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] h-[400px] flex flex-col
      min-w-[200px] sm:min-w-[280px] mt-4 mb-4 relative">
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
          <Code className="mb-4" />
          <p className="text-sm text-theme-text-secondary flex-1 mb-4 line-clamp-3 hover:line-clamp-none">
            {agent.description}
          </p>
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {agent.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-theme-button-primary to-theme-button-hover text-white border border-theme-border-primary"
                >
                  {tag}
                </span>
              ))}
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
                className="cursor-pointer text-theme-button-primary hover:text-theme-button-hover transition-colors"
                onClick={() => setCurrentModal('requirements')}
              />
            </div>
          </div>
        </div>
      </div>

      <Fade in={currentModal === 'requirements'} timeout={300}>
        <div style={{ display: currentModal === 'requirements' ? 'block' : 'none' }}>
          <RequirementsModal
            open={currentModal === 'requirements'}
            onClose={handleClose}
            agent={agent}
            onContinue={handleRequirementsContinue}
          />
        </div>
      </Fade>

      <Fade in={currentModal === 'review'} timeout={300}>
        <div style={{ display: currentModal === 'review' ? 'block' : 'none' }}>
          {requirements && (
            <ReviewModal
              open={currentModal === 'review'}
              onClose={handleClose}
              agent={agent}
              requirements={requirements}
              onBack={handleBack}
            />
          )}
        </div>
      </Fade>
    </>
  );
}