'use client';

export default function StarryBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      {/* 简单的宇宙背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 to-slate-900" />
    </div>
  );
}
