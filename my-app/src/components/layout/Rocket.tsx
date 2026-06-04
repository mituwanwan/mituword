'use client';

export default function Rocket() {
  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
      <div 
        className="relative text-5xl animate-bounce-slow"
        style={{ animationDuration: '4s' }}
      >
        🚀
        {/* 小火苗装饰 */}
        <div 
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-5"
          style={{
            background: 'linear-gradient(to bottom, #f59e0b, #ef4444, transparent)',
            borderRadius: '0 0 3px 3px',
            filter: 'blur(1px)',
            animation: 'rocketFlame 0.8s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  );
}
