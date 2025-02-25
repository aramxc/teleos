import { Message } from '@/hooks/useAgentKit';

type ChatWindowProps = {
  messages: Message[];
  currentResponse: string;
  isLoading: boolean;
};

export default function ChatWindow({ messages, currentResponse, isLoading }: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-4 ${
              message.role === 'user'
                ? 'bg-theme-button-primary text-white'
                : 'bg-theme-panel-bg border border-theme-border-primary'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      {isLoading && currentResponse && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg p-4 bg-theme-panel-bg border border-theme-border-primary">
            {currentResponse}
          </div>
        </div>
      )}
    </div>
  );
}