'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/config/themes';
import { ThemeType } from '@/types/themes';
import { useState, useRef, useEffect } from 'react';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (key: string) => {
    setTheme(key as ThemeType);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-theme-panel-bg border border-theme-panel-border hover:border-theme-button-primary transition-colors"
      >
        <div className="w-4 h-4 rounded-full border-2" style={{ 
          backgroundColor: themes[theme].colors.button.primary,
          borderColor: themes[theme].colors.border.primary 
        }} />
        <span className="hidden sm:inline text-theme-text-primary text-sm font-medium">
          {themes[theme].name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 md:left-auto md:right-0 top-0 md:top-full ml-12 md:ml-0 md:mt-2 
                       w-40 py-2 rounded-lg bg-theme-panel-bg border border-theme-panel-border shadow-lg">
          {Object.entries(themes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleThemeChange(key)}
              className={`w-full px-4 py-2 text-left text-sm transition-all duration-200
                hover:bg-theme-button-primary hover:bg-opacity-10
                ${theme === key ? 'text-theme-button-primary' : 'text-theme-text-primary'}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2" style={{ 
                  backgroundColor: value.colors.button.primary,
                  borderColor: value.colors.border.primary 
                }} />
                {value.name}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}