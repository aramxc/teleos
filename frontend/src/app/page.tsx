'use client';

import { Space_Grotesk } from 'next/font/google';
import TerminalIcon from '@mui/icons-material/Terminal';
import ThemeSelector from "@/components/themes/ThemeSelector";
import ChatWindow from '@/components/chat/ChatWindow';
import ChatInput from '@/components/chat/ChatInput';
import { useAgentChat } from '@/hooks/useAgentKit';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  const { messages, isLoading, currentResponse, sendMessage } = useAgentChat();

  return (
    <div className={`min-h-screen bg-theme-bg-primary text-theme-text-primary transition-all duration-300 ${spaceGrotesk.className}`}>
      {/* Refined gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-theme-bg-primary via-theme-bg-secondary to-theme-bg-accent opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.15),transparent_50%)]" />
      </div>

      {/* Header with proper theme colors */}
      <header className="fixed top-0 w-full border-b border-theme-border-primary bg-theme-panel-bg backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TerminalIcon className="w-5 h-5 text-theme-button-primary" />
            <h1 className="text-lg font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
              teleos
            </h1>
          </div>
          <ThemeSelector />
        </div>
      </header>

      {/* Main content with ChatWindow */}
      <main className="container mx-auto px-4 pt-24 pb-24">
        <div className="max-w-2xl mx-auto">
          <ChatWindow 
            messages={messages}
            currentResponse={currentResponse}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Footer with ChatInput */}
      <footer className="fixed bottom-0 w-full border-t border-theme-border-primary bg-theme-panel-bg backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-2xl mx-auto">
            <ChatInput 
              onSendMessage={sendMessage}
              isLoading={isLoading}
            />
            <div className="text-center mt-2 text-[10px] text-theme-text-accent">
              <kbd className="px-1.5 py-0.5 bg-theme-bg-secondary/20 rounded border border-theme-border-secondary">⌘</kbd>
              <span className="mx-1">+</span>
              <kbd className="px-1.5 py-0.5 bg-theme-bg-secondary/20 rounded border border-theme-border-secondary">Enter</kbd>
              <span className="ml-2">to send</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
