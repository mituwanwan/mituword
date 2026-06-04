"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Theme = 'cosmic' | 'solar';

export default function Footer() {
  const [theme, setTheme] = useState<Theme>('cosmic');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // 监听主题变化
    const observer = new MutationObserver(() => {
      const isLight = document.documentElement.classList.contains('light');
      setTheme(isLight ? 'solar' : 'cosmic');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const isCosmic = theme === 'cosmic';

  return (
    <footer className={`relative mt-20 border-t ${isCosmic ? 'border-cosmic-purple/20 glass' : 'border-solar-sun/20 glass-solar'} theme-transition`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative w-8 h-8">
                <div className={`absolute inset-0 ${isCosmic ? 'bg-sun-gradient' : 'bg-sunrise-gradient'} rounded-full animate-pulse-glow`} />
                <div className={`absolute inset-1 ${isCosmic ? 'bg-cosmic-dark' : 'bg-solar-light'} rounded-full`} />
              </div>
              <span className={`text-xl font-bold bg-gradient-to-r ${isCosmic ? 'from-cosmic-sun to-cosmic-sunRed' : 'from-solar-sunset to-solar-sun'} bg-clip-text text-transparent`}>
                个人网站
              </span>
            </div>
            <p className={`text-sm ${isCosmic ? 'text-cosmic-dust/70' : 'text-solar-mist/70'} max-w-md`}>
              {isCosmic
                ? '探索宇宙的无限可能，记录技术的成长轨迹。在这里分享项目、文章和音乐，构建属于我的数字宇宙。'
                : '感受阳光的温暖，记录生活的美好瞬间。在这里分享项目、文章和音乐，构建属于我的数字花园。'
              }
            </p>
            {/* 社交链接 */}
            <div className="mt-6 flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isCosmic
                    ? "text-cosmic-dust/60 hover:text-cosmic-star hover:bg-cosmic-purple/20"
                    : "text-solar-mist/60 hover:text-solar-foreground hover:bg-solar-sky/20"
                }`}
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="mailto:your@email.com"
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isCosmic
                    ? "text-cosmic-dust/60 hover:text-cosmic-star hover:bg-cosmic-purple/20"
                    : "text-solar-mist/60 hover:text-solar-foreground hover:bg-solar-sky/20"
                }`}
                aria-label="Email"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isCosmic
                    ? "text-cosmic-dust/60 hover:text-cosmic-star hover:bg-cosmic-purple/20"
                    : "text-solar-mist/60 hover:text-solar-foreground hover:bg-solar-sky/20"
                }`}
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isCosmic ? 'text-cosmic-star' : 'text-solar-foreground'}`}>
              快速链接
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className={`text-sm transition-colors duration-300 ${
                    isCosmic
                      ? "text-cosmic-dust/70 hover:text-cosmic-sun"
                      : "text-solar-mist/70 hover:text-solar-sunset"
                  }`}
                >
                  关于我
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className={`text-sm transition-colors duration-300 ${
                    isCosmic
                      ? "text-cosmic-dust/70 hover:text-cosmic-sun"
                      : "text-solar-mist/70 hover:text-solar-sunset"
                  }`}
                >
                  项目展示
                </Link>
              </li>
              <li>
                <Link
                  href="/diary"
                  className={`text-sm transition-colors duration-300 ${
                    isCosmic
                      ? "text-cosmic-dust/70 hover:text-cosmic-sun"
                      : "text-solar-mist/70 hover:text-solar-sunset"
                  }`}
                >
                  日记分享
                </Link>
              </li>
              <li>
                <Link
                  href="/music"
                  className={`text-sm transition-colors duration-300 ${
                    isCosmic
                      ? "text-cosmic-dust/70 hover:text-cosmic-sun"
                      : "text-solar-mist/70 hover:text-solar-sunset"
                  }`}
                >
                  音乐空间
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系信息 */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isCosmic ? 'text-cosmic-star' : 'text-solar-foreground'}`}>
              联系方式
            </h3>
            <ul className={`space-y-3 text-sm ${isCosmic ? 'text-cosmic-dust/70' : 'text-solar-mist/70'}`}>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>your@email.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors duration-300 ${isCosmic ? 'hover:text-cosmic-sun' : 'hover:text-solar-sunset'}`}
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className={`mt-12 pt-8 border-t ${isCosmic ? 'border-cosmic-purple/20' : 'border-solar-sun/20'}`}>
          <p className={`text-sm text-center ${isCosmic ? 'text-cosmic-dust/50' : 'text-solar-mist/50'}`}>
            &copy; {new Date().getFullYear()} 个人网站 · {isCosmic ? '在宇宙中留下我的痕迹' : '在阳光下记录美好时光'}
          </p>
        </div>
      </div>
    </footer>
  );
}
