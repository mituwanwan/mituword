export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cosmic-dark">
      <div className="text-center">
        {/* 黑洞加载动画 */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* 外圈旋转 */}
          <div className="absolute inset-0 rounded-full border-4 border-cosmic-purple/30 border-t-cosmic-sun animate-spin" />
          {/* 中圈旋转 */}
          <div className="absolute inset-3 rounded-full border-4 border-cosmic-earth/30 border-t-cosmic-purple animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          {/* 内圈旋转 */}
          <div className="absolute inset-6 rounded-full border-4 border-cosmic-pink/30 border-t-cosmic-earth animate-spin" style={{ animationDuration: '2s' }} />
          {/* 中心黑洞 */}
          <div className="absolute inset-9 rounded-full bg-cosmic-deeper shadow-glow animate-pulse" />
        </div>
        <p className="text-cosmic-dust/70 text-lg">加载中...</p>
        <p className="text-cosmic-dust/40 text-sm mt-2">正在穿越宇宙时空</p>
      </div>
    </div>
  );
}
