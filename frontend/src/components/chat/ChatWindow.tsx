import { useEffect, useRef } from "react";
import { Message } from "@/hooks/agents/useEliza";
import MessageLoading from "./MessageLoading";
import AgentCard from "./agentDisplay/AgentCard";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import AgentCardCarousel from "./agentDisplay/AgentCardCarousel";

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
      if (Array.isArray(jsonContent.results)) {
        return <AgentCardCarousel agents={jsonContent.results} />;
      } else if (
        jsonContent.name &&
        jsonContent.description &&
        jsonContent.tags
      ) {
        // Generate id from URL if not present
        const urlParts = jsonContent.url?.split('/') || [];
        const id = jsonContent.id || urlParts[urlParts.length - 1];
        
        // Create agent object with id
        const agent = {
          ...jsonContent,
          id: id || jsonContent.name.toLowerCase().replace(/\s+/g, '-')
        };
        
        return <AgentCard agent={agent} />;
      }
    } catch {
      // If content is not JSON, render as regular text
      return content;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden h-full w-full max-w-[1400px] mx-auto space-y-8 px-4 md:px-0">
      {messages.map((message, index) => {
        const isCarousel = (() => {
          try {
            const content = JSON.parse(message.content);
            return Array.isArray(content.results);
          } catch {
            return false;
          }
        })();

        return (
          <div
            key={index}
            className={`${
              message.role === "user" ? "justify-end" : "justify-start"
            } flex ${
              isCarousel ? "w-full" : "w-full"
            }`}
          >
            <div
              className={`${
                message.role === "user"
                  ? "max-w-[85%] sm:max-w-[75%] bg-gradient-to-r from-theme-chat-userBubble-background to-theme-button-hover text-theme-text-secondary shadow-lg rounded-2xl border border-black/20"
                  : isCarousel
                  ? "w-full overflow-visible px-4"
                  : "inline-block max-w-[85%] sm:max-w-[75%] bg-gradient-to-br from-theme-chat-agentBubble-background via-theme-bg-accent/70 to-theme-bg-accent/60 backdrop-blur-sm rounded-2xl border border-black/20"
              } ${!isCarousel ? "shadow-[0_8px_16px_-6px_rgba(0,0,0,0.2)] p-4" : ""} break-words overflow-wrap-anywhere word-break-break-word`}
            >
              {renderMessage(message.content)}
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div
          className={
            "inline-block max-w-[85%] sm:max-w-[75%] bg-gradient-to-br from-theme-chat-agentBubble-background via-theme-bg-accent/70 to-theme-bg-accent/60 backdrop-blur-sm rounded-2xl border border-black/20 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.2)] p-4"
          }
        >
          <MessageLoading />
        </div>
      )}

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
