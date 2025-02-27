import { useEffect, useRef } from "react";
import { Message } from "@/hooks/agents/useEliza";
import MessageLoading from "./MessageLoading";
import AgentCard from './AgentCard';
import { mockAgentResponses } from './mockData';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import AgentCardCarousel from './AgentCardCarousel';

type ChatWindowProps = {
  messages: Message[];
  currentResponse: string;
  isLoading: boolean;
  error?: Error | null;
};

export default function ChatWindow({
  messages,
  currentResponse,
  isLoading,
  error,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or during streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentResponse]);

  const renderMessage = (content: string) => {
    try {
      const jsonContent = JSON.parse(content);
      if (Array.isArray(jsonContent)) {
        return <AgentCardCarousel agents={jsonContent} />;
      } else if (jsonContent.name && jsonContent.description && jsonContent.tags) {
        return <AgentCard agent={jsonContent} />;
      }
    } catch {
      // If content is not JSON, render as regular text
      return content;
    }
  };

  // Check if currentResponse is already in messages
  const shouldShowCurrentResponse = currentResponse && 
    !messages.some(msg => msg.content === currentResponse);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden h-full w-full max-w-[1400px] mx-auto space-y-8">
      {mockAgentResponses.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' 
              ? 'justify-end' 
              : 'justify-center w-full'
          }`}
        >
          <div
            className={`${
              message.role === 'user'
                ? 'max-w-[85%] sm:max-w-[75%] shadow-lg border border-theme-border-primary bg-theme-button-primary text-white'
                : 'w-full max-w-[85%] sm:max-w-[75%] bg-theme-panel-bg border border-theme-border-primary'
            } rounded-lg p-3`}
          >
            {renderMessage(message.content)}
          </div>
        </div>
      ))}
      
      {shouldShowCurrentResponse && (
        <div className="flex justify-center">
          <div className="max-w-[85%] sm:max-w-[75%] rounded-lg p-3 whitespace-pre-wrap break-words bg-theme-panel-bg border border-theme-border-primary">
            {renderMessage(currentResponse)}
          </div>
        </div>
      )}
      
      {isLoading && !currentResponse && <MessageLoading />}
      
      {error && (
        <div className="flex justify-center">
          <div className="max-w-[85%] sm:max-w-[75%] rounded-lg p-3 bg-red-100 border border-red-300 text-red-700">
            {error.message}
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
