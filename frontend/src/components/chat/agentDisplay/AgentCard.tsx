import { useState } from 'react';
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import { AgentConfigModal } from '../../modals/AgentModals';
import Image from 'next/image';
import { useModal } from '../../../contexts/ModalContext';
import TagBubble from '@/components/shared/TagBubble';
import { Agent } from '@/types/agents';
interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent: initialAgent }: AgentCardProps) {
  
  const agent = { 
    ...initialAgent,
    id: initialAgent.id ,
    price: 10, 
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '' 
  };
  const { setModalOpen } = useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalOpen(false);
  };

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
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image 
                src={agent.icon} 
                alt={agent.name} 
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h3 className="text-lg font-semibold">{agent.name}</h3>
          </div>
          <p className="text-sm text-theme-text-secondary mb-4">
            {getFirstSentence(agent.description)}
          </p>
          
          <div className="mt-auto w-full">
            <hr className="pb-6 border-theme-border-primary"/>
            <div className="flex flex-wrap gap-2 mb-4">
              {visibleTags.map((tag: string, index: number) => (
                <TagBubble key={index} tag={tag} />
              ))}
              {remainingTags > 0 && (
                <span
                  className="px-2 py-1 text-xs rounded-full bg-theme-bg-accent text-theme-text-secondary border border-theme-border-primary cursor-pointer hover:bg-theme-bg-accent/80"
                  onClick={() => openModal()}
                >
                  +{remainingTags} more
                </span>
              )}
            </div>
            <div className="pt-6 flex justify-between items-center w-full">
              <a
                href={agent.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-theme-accent-primary hover:underline"
              >
                Website
              </a>
              <KeyboardDoubleArrowRight 
                className="cursor-pointer rounded-full text-theme-button-primary shadow-lg border0.5 border-slate hover:text-theme-button-hover transition-colors"
                onClick={openModal}
              />
            </div>
          </div>
        </div>
      </div>

      <AgentConfigModal
        open={isModalOpen}
        onClose={closeModal}
        agent={agent}
      />
    </>
  );
}