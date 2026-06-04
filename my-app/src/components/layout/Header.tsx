"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "首页", href: "/" },
  { name: "关于", href: "/about" },
  { name: "项目", href: "/projects" },
  { name: "日记", href: "/diary" },
  { name: "音乐", href: "/music" },
  { name: "GitHub", href: "/github" },
];

type Theme = 'cosmic' | 'solar';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('cosmic');
  const pathname = usePathname();

  // 初始化主题
  useEffect(() => {
    // 从 localStorage 读取主题偏好
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // 应用主题
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'cosmic') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    // 保存到 localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'cosmic' ? 'solar' : 'cosmic');
  };

  const isCosmic = theme === 'cosmic';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isCosmic ? 'glass-header-cosmic' : 'glass-header-solar'} theme-transition`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative w-8 h-8">
                <div className={`absolute inset-0 ${isCosmic ? 'bg-sun-gradient' : 'bg-sunrise-gradient'} rounded-full animate-pulse-glow`} />
                <div className={`absolute inset-1 ${isCosmic ? 'bg-cosmic-dark' : 'bg-solar-light'} rounded-full`} />
              </div>
              <span className={`text-xl font-bold bg-gradient-to-r ${isCosmic ? 'from-cosmic-sun to-cosmic-sunRed glow-sun' : 'from-solar-sunset to-solar-sun glow-solar'} bg-clip-text text-transparent group-hover:${isCosmic ? 'from-cosmic-cyan to-cosmic-earth' : 'from-solar-ocean to-solar-grass'} transition-all duration-300`}>
                个人网站
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:space-x-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                    isActive
                      ? isCosmic
                        ? "text-cosmic-sun bg-cosmic-purple/20"
                        : "text-solar-sunset bg-solar-sky/20"
                      : isCosmic
                        ? "text-cosmic-dust/80 hover:text-cosmic-star hover:bg-cosmic-purple/10"
                        : "text-solar-mist/80 hover:text-solar-foreground hover:bg-solar-sky/10"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isCosmic ? 'bg-sun-gradient' : 'bg-sunrise-gradient'} rounded-full`} />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* 主题切换 - 宇宙黑洞 ↔ 太阳地球 */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isCosmic
                  ? "text-cosmic-dust hover:text-cosmic-star hover:bg-cosmic-purple/20"
                  : "text-solar-mist hover:text-solar-foreground hover:bg-solar-sky/20"
              }`}
              aria-label={isCosmic ? "切换到太阳地球主题" : "切换到宇宙黑洞主题"}
              title={isCosmic ? "太阳地球主题" : "宇宙黑洞主题"}
            >
              {isCosmic ? (
                // 宇宙主题图标 - 黑洞/星星
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3" />
                </svg>
              ) : (
                // 太阳地球主题图标 - 太阳
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 0 11-8 0 4 0 018 0z" />
                </svg>
              )}
            </button>

            <Link
              href="/login"
              className={`text-sm font-medium transition-colors duration-300 ${
                isCosmic
                  ? "text-cosmic-dust hover:text-cosmic-star"
                  : "text-solar-mist hover:text-solar-foreground"
              }`}
            >
              登录
            </Link>
            <Link
              href="/admin"
              className={`${isCosmic ? 'btn-cosmic bg-sun-gradient hover:shadow-sun' : 'btn-solar bg-sunrise-gradient hover:shadow-sunny'} rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-300`}
            >
              管理
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isCosmic
                  ? "text-cosmic-dust hover:text-cosmic-star hover:bg-cosmic-purple/20"
                  : "text-solar-mist hover:text-solar-foreground hover:bg-solar-sky/20"
              }`}
              aria-label={isCosmic ? "切换到太阳地球主题" : "切换到宇宙黑洞主题"}
            >
              {isCosmic ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 0 11-8 0 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className={`inline-flex items-center justify-center rounded-lg p-2 transition-all duration-300 ${
                isCosmic
                  ? "text-cosmic-dust hover:bg-cosmic-purple/20 hover:text-cosmic-star"
                  : "text-solar-mist hover:bg-solar-sky/20 hover:text-solar-foreground"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">打开菜单</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-base font-medium transition-all duration-300 ${
                      isActive
                        ? isCosmic
                          ? "text-cosmic-sun bg-cosmic-purple/20"
                          : "text-solar-sunset bg-solar-sky/20"
                        : isCosmic
                          ? "text-cosmic-dust/80 hover:text-cosmic-star hover:bg-cosmic-purple/10"
                          : "text-solar-mist/80 hover:text-solar-foreground hover:bg-solar-sky/10"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Link
                href="/login"
                className={`block rounded-lg px-3 py-2 text-base font-medium transition-all duration-300 ${
                  isCosmic
                    ? "text-cosmic-dust/80 hover:text-cosmic-star hover:bg-cosmic-purple/10"
                    : "text-solar-mist/80 hover:text-solar-foreground hover:bg-solar-sky/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                登录
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
