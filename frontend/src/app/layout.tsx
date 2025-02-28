"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/chat/Tooltip";
import { AgentProvider } from "@/contexts/AgentContext";
import { ModalProvider } from "@/contexts/ModalContext";

// Create a client
const queryClient = new QueryClient();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden dark" data-theme="dark">
      <head>
        <title>teleos - AI blockchain assistant</title>
        <meta name="description" content="Your AI blockchain assistant" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden bg-theme-bg-primary`}
        style={{
          backgroundColor: "#111827", // Dark theme background color
          color: "#F9FAFB", // Dark theme text color
        }}
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delayDuration={0}>
            <WalletProvider>
              <ThemeProvider>
                <AgentProvider>
                  <ModalProvider>
                    <ChatProvider>{children}</ChatProvider>
                  </ModalProvider>
                </AgentProvider>
              </ThemeProvider>
            </WalletProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
