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
        primary: '#111827',
        secondary: '#374151',
        accent: '#6B7280',
        dark: '#4B5563',
      },
      border: {
        primary: 'rgba(209, 213, 219, 1)',
        secondary: 'rgba(209, 213, 219, 0.3)',
      },
      panel: {
        background: 'rgba(249, 250, 251, 0.97)',
        border: 'rgba(209, 213, 219, 0.8)',
      },
      button: {
        primary: '#8B5CF6',
        secondary: '#6D28D9',
        hover: '#7C3AED',
        accent: '#A78BFA',
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
        background: 'rgba(17, 24, 39, 0.7)',
        border: 'rgba(75, 85, 99, 0.8)',
      },
      button: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        hover: '#2563EB',
        accent: '#1D4ED8',
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
        background: 'rgba(30, 27, 46, 0.7)',
        border: 'rgba(51, 65, 85, 0.8)',
      },
      button: {
        primary: '#8B5CF6',
        secondary: '#6D28D9',
        hover: '#7C3AED',
        accent: '#5B21B6',
      },
    },
  },
};