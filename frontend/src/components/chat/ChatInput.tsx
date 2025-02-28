import { useState, KeyboardEvent, useRef, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useChatContext } from "@/contexts/ChatContext";

export default function ChatInput() {
  const { sendMessage, isLoading, setInitialState } = useChatContext();
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      try {
        setMessage("");
        setInitialState(false);
        await sendMessage(trimmedMessage);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything..."
        disabled={isLoading}
        className="w-full bg-theme-bg-secondary text-sm text-theme-text-primary pl-5 pr-14 py-3 rounded-full border border-theme-border-primary placeholder:text-theme-text-accent focus:outline-none focus:border-theme-button-primary focus:ring-1 focus:ring-theme-button-primary/20 transition-all duration-200 disabled:opacity-50"
        style={{ fontSize: "16px" }}
        autocomplete="off"
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !message.trim()}
        className="absolute right-2 hover:scale-110 text-theme-text-primary p-2 rounded-full transition-all duration-200 disabled:opacity-50"
      >
        <SendIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
