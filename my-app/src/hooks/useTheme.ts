'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'void' | 'realm';

const STORAGE_KEY = 'theme';

function migrateLegacyTheme(saved: string | null): Theme {
  if (saved === 'cosmic') return 'void';
  if (saved === 'solar') return 'realm';
  if (saved === 'void' || saved === 'realm') return saved;
  return 'void';
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'void';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'void' : 'realm';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('void');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const initialTheme = savedTheme ? migrateLegacyTheme(savedTheme) : getSystemTheme();

    setTheme(initialTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(initialTheme === 'void' ? 'dark' : 'light');
    setMounted(true);

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          const next: Theme = e.matches ? 'void' : 'realm';
          setTheme(next);
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(next === 'void' ? 'dark' : 'light');
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'void' ? 'realm' : 'void';
      const root = document.documentElement;

      root.classList.remove('dark', 'light');
      root.classList.add(next === 'void' ? 'dark' : 'light');
      localStorage.setItem(STORAGE_KEY, next);

      return next;
    });
  }, []);

  const setThemeExplicitly = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(next === 'void' ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }, []);

  return {
    theme,
    isVoid: theme === 'void',
    isRealm: theme === 'realm',
    toggleTheme,
    setTheme: setThemeExplicitly,
    mounted,
  };
}
