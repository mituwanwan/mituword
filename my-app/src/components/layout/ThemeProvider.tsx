'use client';

import { useTheme } from '@/hooks/useTheme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mounted } = useTheme();

  // 避免主题闪烁：在客户端挂载前不渲染内容，防止 hydration mismatch
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
