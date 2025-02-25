'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { ThirdwebProvider } from "thirdweb/react";
import { WalletProvider } from '@/contexts/WalletContext';



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
    <html lang="en">
      <head>
        <title>teleos - AI blockchain assistant</title>
        <meta name="description" content="Your AI blockchain assistant" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThirdwebProvider>
          <WalletProvider>
            <ThemeProvider>
              <ChatProvider>
                {children}
              </ChatProvider>
            </ThemeProvider>
          </WalletProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
