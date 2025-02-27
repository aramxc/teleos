export type ThemeType = 'light' | 'dark' | 'amethyst';

export interface Theme {
  name: string;
  colors: {
    background: {
      primary: string;
      secondary: string;
      accent: string;
    };
    text: {
      primary: string;
      secondary: string;
      accent: string;
      dark: string;
    };
    border: {
      primary: string;
      secondary: string;
    };
    panel: {
      background: string;
      border: string;
    };
    button: {
      primary: string;
      secondary: string;
      hover: string;
      accent: string;
    };
    chat: {
      userBubble: {
        background: string;
        gradient: string;
      };
      agentBubble: {
        background: string;
        gradient: string;
      };
    };
  };
}