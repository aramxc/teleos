"use client";

import { motion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";
import TerminalIcon from "@mui/icons-material/Terminal";
import ThemeSelector from "@/components/themes/ThemeSelector";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import { useChatContext } from "@/contexts/ChatContext";
import SuggestionBubbles from "@/components/chat/InitialSuggestions";
import WalletConnectionButton from "@/components/wallet/WalletConnectionButton";
import ConnectionStatus from "@/components/chat/ConnectionStatus";
import { useEffect, useState } from "react";
import { useModal } from "@/contexts/ModalContext";
import Link from "next/link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const {
    messages,
    isLoading,
    currentResponse,
    error,
    sendMessage,
    isInitialState,
    setInitialState,
  } = useChatContext();

  const { isModalOpen } = useModal();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const suggestions = [
    "What can Teleos do?",
    "Deploy an ERC-20 Token",
    "USDC contract address on Ethereum",
    "Analyze WETH smart contract",
    "Transfer 0.001 ETH to aramxc.ethdenver.com",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInitialState(false);
    sendMessage(suggestion);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <div
      className={`min-h-screen bg-theme-bg-primary text-theme-text-primary transition-all duration-300 ${
        spaceGrotesk.className
      } ${isModalOpen ? "overflow-hidden" : ""}`}
    >
      {/* Background gradients */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-theme-bg-primary via-theme-bg-secondary to-theme-bg-accent opacity-20 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.15),transparent_50%)]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full border-b border-theme-border-primary bg-theme-panel-bg backdrop-blur-xl z-50"
      >
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <TerminalIcon className="w-5 h-5 text-theme-button-primary" />
              <h1 className="text-lg font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
                _teleos
              </h1>
              <KeyboardArrowDownIcon className="w-4 h-4 text-theme-button-primary" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-theme-panel-bg border border-theme-border-primary">
                <Link
                  href="/upload-agent"
                  className="block px-4 py-2 text-sm text-theme-text-primary hover:bg-theme-bg-secondary transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Upload Contract
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <WalletConnectionButton />
            <ThemeSelector />
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <motion.main
        initial={{ height: "100vh", display: "flex", alignItems: "center" }}
        animate={{
          height: isInitialState ? "100vh" : "100%",
          alignItems: isInitialState ? "center" : "flex-start",
        }}
        transition={{ duration: 0.5 }}
        className={`container mx-auto px-4 width:[80%] ${
          !isInitialState && "pt-20 pb-32"
        } relative`}
      >
        <div className="w-full max-w-2xl mx-auto relative">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: isInitialState ? 0 : "24px" }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            {isInitialState ? (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center pointer-events-auto"
              >
                <h1 className="text-2xl font-medium mb-4 text-theme-text-primary">
                  How can I help you with the blockchain today?
                </h1>
                <SuggestionBubbles
                  suggestions={suggestions}
                  onSelect={handleSuggestionClick}
                />
              </motion.div>
            ) : (
              <ChatWindow
                messages={messages}
                currentResponse={currentResponse}
                isLoading={isLoading}
                error={error}
              />
            )}
          </motion.div>
        </div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        initial={{ y: 0 }}
        animate={{ y: isInitialState ? 0 : "0" }}
        transition={{ duration: 0.5 }}
        className={`fixed bottom-0 w-full ${
          !isInitialState && "border-t border-theme-border-primary"
        } bg-theme-panel-bg backdrop-blur-xl z-50`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-2xl mx-auto relative z-50">
            <ChatInput />
            <div className="flex items-center justify-center p-2">
              <ConnectionStatus />
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
