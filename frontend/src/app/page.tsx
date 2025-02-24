'use client';

import { useTheme } from "@/contexts/ThemeContext";
import { ThemeType } from "@/types/themes";
import { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import TerminalIcon from '@mui/icons-material/Terminal';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [message, setMessage] = useState('');

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  return (
    <div className={`min-h-screen bg-theme-bg-primary text-theme-text-primary transition-all duration-300 ${spaceGrotesk.className}`}>
      {/* Refined gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-theme-bg-primary via-theme-bg-secondary to-theme-bg-accent opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.15),transparent_50%)]" />
      </div>

      {/* Header with proper theme colors */}
      <header className="fixed top-0 w-full border-b border-theme-border-primary bg-theme-panel-bg backdrop-blur-xl transition-all duration-300 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TerminalIcon className="w-5 h-5 text-theme-button-primary" />
            <h1 className="text-lg font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
              teleos
            </h1>
          </div>
          <select 
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value as ThemeType)}
            className="bg-theme-bg-secondary text-sm text-theme-text-primary px-3 py-1.5 rounded-full border border-theme-border-primary hover:border-theme-button-primary/50 focus:outline-none focus:border-theme-button-primary transition-all duration-200"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="amethyst">Amethyst</option>
          </select>
        </div>
      </header>

      {/* Main content with theme-aware styling */}
      <main className="container mx-auto px-4 pt-24 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-theme-panel-bg backdrop-blur-xl p-6 rounded-2xl border border-theme-border-primary transition-all duration-300 hover:bg-theme-bg-secondary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-theme-button-primary animate-pulse" />
              <h2 className="text-xl font-medium tracking-tight text-theme-text-primary">
                Welcome to Teleos
              </h2>
            </div>
            <p className="text-theme-text-secondary">
              What do you want to build?
            </p>
          </div>
        </div>
      </main>

      {/* Footer with theme-aware components */}
      <footer className="fixed bottom-0 w-full border-t border-theme-border-primary bg-theme-panel-bg backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-theme-bg-secondary text-sm text-theme-text-primary pl-5 pr-14 py-3 rounded-full border border-theme-border-primary placeholder:text-theme-text-accent focus:outline-none focus:border-theme-button-primary focus:ring-1 focus:ring-theme-button-primary/20 transition-all duration-200"
              />
              <button 
                className="absolute right-2 bg-theme-button-primary hover:bg-theme-button-hover text-theme-text-primary p-2 rounded-full transition-all duration-200 flex items-center justify-center hover:scale-105"
              >
                <SendIcon className="w-4 h-4" />
              </button>
            </div>
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
