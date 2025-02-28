import { Theme } from '@/types/themes';

export const themes: Record<string, Theme> = {
  light: {
    name: 'Light',
    colors: {
      background: {
        primary: '#FFFFFF',
        secondary: '#F9FAFB',
        accent: '#F3F4F6',
      },
      text: {
        primary: '#000000',
        secondary: '#374151',
        accent: '#6B7280',
        dark: '#4B5563',
      },
      border: {
        primary: 'rgba(209, 213, 219, 1)',
        secondary: 'rgba(209, 213, 219, 0.3)',
      },
      panel: {
        background: 'rgba(249, 250, 251, 1)',
        border: 'rgba(209, 213, 219, 0.8)',
      },
      button: {
        primary: '#8B5CF6',
        secondary: '#6D28D9',
        hover: '#7C3AED',
        accent: '#A78BFA',
      },
    
      chat: {
        userBubble: {
          background: '#8B5CF6',
          gradient: 'from-[#8B5CF6] to-[#7C3AED]',
        },
        agentBubble: {
          background: 'rgba(139, 92, 246, 0.1)',
          gradient: 'from-[#8B5CF6]/10 via-[#8B5CF6]/5 to-[#8B5CF6]/2',
        },
      },
    },
  },
  dark: {
    name: 'Dark',
    colors: {
      background: {
        primary: '#111827',
        secondary: '#1F2937',
        accent: '#374151',
      },
      text: {
        primary: '#F9FAFB',
        secondary: '#E5E7EB',
        accent: '#9CA3AF',
        dark: '#6B7280',
      },
      border: {
        primary: 'rgba(75, 85, 99, 0.5)',
        secondary: 'rgba(75, 85, 99, 0.3)',
      },
      panel: {
        background: 'rgba(17, 24, 39, 1)',
        border: 'rgba(75, 85, 99, 0.8)',
      },
      button: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        hover: '#2563EB',
        accent: '#1D4ED8',
      },
      chat: {
        userBubble: {
          background: '#3B82F6',
          gradient: 'from-[#3B82F6] to-[#2563EB]',
        },
        agentBubble: {
          background: 'rgba(31, 41, 55, 0.8)',
          gradient: 'from-[#1F2937]/80 via-[#374151]/70 to-[#4B5563]/60',
        },
      },
    },
  },
  amethyst: {
    name: 'Amethyst',
    colors: {
      background: {
        primary: '#1E1B2E',
        secondary: '#2D2640',
        accent: '#453A67',
      },
      text: {
        primary: '#F8F7FF',
        secondary: '#E2E1F3',
        accent: '#B8B5CC',
        dark: '#A78BFA',
      },
      border: {
        primary: 'rgba(51, 65, 85, 0.5)',
        secondary: 'rgba(51, 65, 85, 0.3)',
      },
      panel: {
        background: 'rgba(30, 27, 46, 1)',
        border: 'rgba(51, 65, 85, 0.8)',
      },
      button: {
        primary: '#8B5CF6',
        secondary: '#6D28D9',
        hover: '#7C3AED',
        accent: '#5B21B6',
      },
      chat: {
        userBubble: {
          background: '#8B5CF6',
          gradient: 'from-[#8B5CF6] to-[#7C3AED]',
        },
        agentBubble: {
          background: 'rgba(45, 38, 64, 0.8)',
          gradient: 'from-[#2D2640]/80 via-[#453A67]/70 to-[#574D84]/60',
        },
      },
    },
  },
};