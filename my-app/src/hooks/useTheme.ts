'use client';

import { useState, useEffect } from 'react';

export type Theme = 'cosmic' | 'solar';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('cosmic');
  const [isCosmic, setIsCosmic] = useState(true);

  useEffect(() => {
    // 从 localStorage 读取主题
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      setIsCosmic(savedTheme === 'cosmic');
    } else {
      // 检查系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'cosmic' : 'solar';
      setTheme(initialTheme);
      setIsCosmic(initialTheme === 'cosmic');
    }

    // 监听 html 元素的 class 变化
    const observer = new MutationObserver(() => {
      const isLight = document.documentElement.classList.contains('light');
      const currentTheme = isLight ? 'solar' : 'cosmic';
      setTheme(currentTheme);
      setIsCosmic(currentTheme === 'cosmic');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'cosmic' ? 'solar' : 'cosmic';
    const root = document.documentElement;

    if (newTheme === 'cosmic') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    setIsCosmic(newTheme === 'cosmic');
  };

  return {
    theme,
    isCosmic,
    isSolar: !isCosmic,
    toggleTheme,
  };
}
