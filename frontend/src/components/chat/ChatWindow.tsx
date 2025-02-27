import { Message } from "@/hooks/agents/useAgentKit";
import { useEffect, useRef } from "react";
import MessageLoading from "./MessageLoading";

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

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-3 whitespace-pre-wrap break-words ${
              message.role === "user"
                ? "bg-theme-button-primary text-white"
                : "bg-theme-panel-bg border border-theme-border-primary"
            }`}
          >
            {message.content}
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
