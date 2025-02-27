import { Message } from "@/hooks/agents/useAgentKit";
import { useEffect, useRef } from "react";
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
  error?: string | null;
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

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden h-full w-full space-y-8">
      {mockAgentResponses.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' 
              ? 'justify-end' 
              : 'justify-center w-full'  // Center all assistant responses
          }`}
        >
          <div
            className={`${
              message.role === 'user'
                ? 'max-w-[85%] sm:max-w-[75%] bg-theme-button-primary text-white'
                : 'w-full bg-transparent relative'  // Added relative positioning
            } rounded-lg p-3`}
            style={{ zIndex: 1 }} // Ensure message content stays below carousel arrows
          >
            {renderMessage(message.content)}
          </div>
        </div>
      ))}
      {/* {console.log({ isLoading, currentResponse })} */}
      {isLoading &&
        (currentResponse ? (
          <div className="flex justify-start">
            <div className="max-w-[85%] sm:max-w-[75%] rounded-lg p-3 whitespace-pre-wrap break-words bg-theme-panel-bg border border-theme-border-primary">
              {currentResponse}
              <span className="inline-block w-2 h-4 ml-1 bg-theme-text-primary animate-pulse">
                |
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-start">
            <div className="max-w-[85%] sm:max-w-[75%] rounded-lg p-3 whitespace-pre-wrap break-words bg-theme-panel-bg border border-theme-border-primary">
              <MessageLoading />
            </div>
          </div>
        ))}
      {error && (
        <div className="flex justify-center">
          <div className="max-w-[85%] sm:max-w-[75%] rounded-lg p-3 bg-red-100 border border-red-300 text-red-700">
            {error}
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
