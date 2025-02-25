'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/config/themes';
import { ThemeType } from '@/types/themes';
import { useState, useRef, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ThemeCircle = ({ themeKey }: { themeKey: string }) => (
    <div 
      className="w-3 h-3 rounded-full border-2"
      style={{ 
        backgroundColor: themes[themeKey].colors.button.primary,
        borderColor: themes[themeKey].colors.border.primary
      }} 
    />
  );

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-theme-bg-secondary 
                 border border-theme-border-primary hover:border-theme-button-primary 
                 focus:outline-none focus:border-theme-button-primary transition-colors duration-200 relative pr-8"
      >
        <ThemeCircle themeKey={theme} />
        <span className="text-sm font-medium text-theme-text-primary">{themes[theme].name}</span>
        <KeyboardArrowDownIcon className={`w-4 h-4 text-theme-text-accent transition-transform duration-200 absolute right-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 py-2 rounded-lg bg-theme-panel-bg border border-theme-border-primary shadow-lg">
          {Object.entries(themes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => {
                setTheme(key as ThemeType);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-all duration-200
                hover:bg-theme-button-primary/10
                ${theme === key ? 'text-theme-button-primary bg-theme-button-primary/20' : 'text-theme-text-primary'}`}
            >
              <div className="flex items-center gap-2">
                <ThemeCircle themeKey={key} />
                {value.name}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}