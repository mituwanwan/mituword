'use client';

import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 从 localStorage 获取保存的主题
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'solar') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else if (savedTheme === 'cosmic') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      // 如果没有保存的主题，检查系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.add('light');
      }
    }
  }, []);

  return <>{children}</>;
}
