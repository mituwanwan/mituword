"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cosmic-dark relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-cosmic-gradient opacity-50" />

      <div className="relative text-center p-8 max-w-md glass rounded-2xl cosmic-card z-10">
        {/* 错误图标 - 爆炸的星球 */}
        <div className="text-6xl mb-4 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-sun-gradient opacity-50 animate-pulse" />
          </div>
          <span className="relative">💥</span>
        </div>
        <h1 className="text-2xl font-bold text-cosmic-star mb-2">
          出错了
        </h1>
        <p className="text-cosmic-dust/70 mb-6">
          {error.message || "发生了未知错误"}
        </p>
        <button
          onClick={reset}
          className="btn-cosmic px-6 py-2 bg-sun-gradient text-white rounded-xl hover:shadow-sun transition-all duration-300"
        >
          重试
        </button>
      </div>
    </div>
  );
}
