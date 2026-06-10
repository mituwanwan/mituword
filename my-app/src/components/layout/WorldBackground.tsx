'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

/* ========== Void 模式 — 华丽宇宙星空 ========== */

function VoidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: { x: number; y: number; r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
      });
    }

    const meteors: { x: number; y: number; len: number; speed: number; angle: number; active: boolean }[] = [];

    function spawnMeteor() {
      if (meteors.length < 3 && Math.random() < 0.005) {
        const startY = Math.random() * height * 0.5;
        meteors.push({
          x: -100,
          y: startY,
          len: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 6,
          active: true,
        });
      }
    }

    function drawBlackHole() {
      if (!ctx) return;
      const cx = width * 0.5;
      const cy = height * 0.5;
      const radius = Math.min(width, height) * 0.08;

      // 吸积盘外环
      const gradient = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 2.5);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
      gradient.addColorStop(0.4, 'rgba(59, 130, 246, 0.08)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 事件视界
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // 光环
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.stroke();
    }

    function draw() {
      if (!ctx) return;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // 星星
      stars.forEach((star) => {
        star.alpha += star.speed;
        const opacity = 0.3 + Math.abs(Math.sin(star.alpha)) * 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 黑洞
      drawBlackHole();

      // 流星
      spawnMeteor();
      meteors.forEach((m) => {
        if (!m.active) return;
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        const tailX = m.x - Math.cos(m.angle) * m.len;
        const tailY = m.y - Math.sin(m.angle) * m.len;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, 'rgba(255,255,255,0.9)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        if (m.x > width + 200 || m.y > height + 200) {
          m.active = false;
        }
      });

      // 清理失效流星
      for (let i = meteors.length - 1; i >= 0; i--) {
        if (!meteors[i].active) meteors.splice(i, 1);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ========== Realm 模式 — 我的世界像素风景 ========== */

function PixelCloud({ top, left, scale = 1, delay = 0 }: { top: string; left: string; scale?: number; delay?: number }) {
  return (
    <div
      className="absolute opacity-80"
      style={{ top, left, transform: `scale(${scale})`, animation: `cloudFloat 40s linear ${delay}s infinite` }}
    >
      <div className="relative w-24 h-10">
        <div className="absolute top-2 left-0 w-6 h-6 bg-white rounded-sm" />
        <div className="absolute top-0 left-5 w-8 h-8 bg-white rounded-sm" />
        <div className="absolute top-1 left-12 w-7 h-7 bg-white rounded-sm" />
        <div className="absolute top-3 left-18 w-5 h-5 bg-white rounded-sm" />
        <div className="absolute top-2 left-4 w-14 h-4 bg-white rounded-sm" />
      </div>
    </div>
  );
}

function RealmBackground() {
  return (
    <div className="absolute inset-0">
      {/* 天空 */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-amber-50" />

      {/* 太阳 */}
      <div
        className="absolute top-8 right-[15%] w-14 h-14 bg-yellow-400 animate-pulse"
        style={{
          borderRadius: '2px',
          boxShadow: '0 0 24px rgba(250, 204, 21, 0.6), 0 0 48px rgba(250, 204, 21, 0.3)',
        }}
      />

      {/* 像素云 */}
      <PixelCloud top="12%" left="10%" scale={1.2} delay={0} />
      <PixelCloud top="18%" left="55%" scale={0.9} delay={-15} />
      <PixelCloud top="8%" left="75%" scale={1.1} delay={-30} />
      <PixelCloud top="22%" left="30%" scale={0.7} delay={-8} />

      {/* 远山（像素风格） */}
      <div className="absolute bottom-[15%] left-0 right-0 h-32 flex items-end opacity-60">
        <div className="w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-b-[120px] border-b-emerald-600 mx-4" />
        <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[90px] border-b-emerald-500 mx-8" />
        <div className="w-0 h-0 border-l-[100px] border-l-transparent border-r-[100px] border-r-transparent border-b-[140px] border-b-emerald-700 mx-6" />
        <div className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[70px] border-b-emerald-500 mx-12" />
        <div className="w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[110px] border-b-emerald-600 mx-4" />
      </div>

      {/* 草地条 */}
      <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-green-600 to-green-500">
        {/* 像素草 */}
        <div className="absolute top-0 left-0 right-0 h-3 flex">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-green-700"
              style={{
                clipPath: i % 2 === 0 ? 'polygon(0 100%, 50% 0, 100% 100%)' : 'polygon(0 100%, 50% 30%, 100% 100%)',
                opacity: 0.6 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ========== 主组件 ========== */

export default function WorldBackground() {
  const { isVoid, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-black" />
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden theme-transition">
      {isVoid ? <VoidBackground /> : <RealmBackground />}
    </div>
  );
}
