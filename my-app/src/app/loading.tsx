export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-void-dark bg-realm-light">
      <div className="text-center">
        {/* 黑洞加载动画 */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* 外圈旋转 */}
          <div className="absolute inset-0 rounded-full border-4 dark:border-void-purple/30 border-realm-sky/30 dark:border-t-void-sun border-t-realm-sun animate-spin" />
          {/* 中圈旋转 */}
          <div className="absolute inset-3 rounded-full border-4 dark:border-void-earth/30 border-realm-ocean/30 dark:border-t-void-purple border-t-realm-ocean animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          {/* 内圈旋转 */}
          <div className="absolute inset-6 rounded-full border-4 dark:border-void-pink/30 border-realm-grass/30 dark:border-t-void-earth border-t-realm-ocean animate-spin" style={{ animationDuration: '2s' }} />
          {/* 中心黑洞 */}
          <div className="absolute inset-9 rounded-full dark:bg-void-deeper bg-realm-brighter shadow-glow animate-pulse" />
        </div>
        <p className="dark:text-void-dust/70 text-realm-mist/70 text-lg">加载中...</p>
        <p className="dark:text-void-dust/40 text-realm-mist/40 text-sm mt-2">正在穿越宇宙时空</p>
      </div>
    </div>
  );
}
