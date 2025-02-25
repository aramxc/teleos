"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeType } from "@/types/themes";
import { themes } from "@/config/themes";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  isLoading: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with dark theme for SSR
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<ThemeType>("dark");
  
  // Only run on client-side
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    if (!mounted) return;

    const applyTheme = () => {
      const currentTheme = themes[theme];
      const root = document.documentElement;
      
      root.setAttribute('data-theme', theme);
      
      Object.entries(currentTheme.colors).forEach(([category, values]) => {
        Object.entries(values).forEach(([name, value]) => {
          root.style.setProperty(`--${category}-${name}`, value);
        });
      });
    };

    applyTheme();
  }, [theme, mounted]);

  // Prevent hydration mismatch by not rendering theme-dependent UI until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading: false }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
