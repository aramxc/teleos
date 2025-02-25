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
  theme: "light",
  setTheme: () => {},
  isLoading: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("dark");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const applyTheme = () => {
      setIsLoading(true);
      const currentTheme = themes[theme];

      try {
        const root = document.documentElement;
        Object.entries(currentTheme.colors).forEach(([category, values]) => {
          Object.entries(values).forEach(([name, value]) => {
            root.style.setProperty(`--${category}-${name}`, value);
          });
        });
      } catch (error) {
        console.error("Failed to apply theme:", error);
      } finally {
        setIsLoading(false);
      }
    };

    applyTheme();
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
