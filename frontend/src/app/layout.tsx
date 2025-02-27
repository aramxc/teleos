"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ThirdwebProvider } from "thirdweb/react";
import { WalletProvider } from "@/contexts/WalletContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/chat/Tooltip";

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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden bg-theme-bg-primary`}
        style={{
          backgroundColor: "#111827", // Dark theme background color
          color: "#F9FAFB", // Dark theme text color
        }}
      >
        <ThirdwebProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider delayDuration={0}>
              <WalletProvider>
                <ThemeProvider>
                  <ChatProvider>{children}</ChatProvider>
                </ThemeProvider>
              </WalletProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
