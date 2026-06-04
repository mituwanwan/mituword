import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cosmic-dark relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-cosmic-gradient opacity-50" />

      {/* 黑洞效果 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-20">
        <div className="absolute inset-0 rounded-full bg-cosmic-deeper shadow-glow-lg animate-pulse" />
        <div className="absolute inset-4 rounded-full border-4 border-cosmic-purple/30 animate-spin" />
        <div className="absolute inset-8 rounded-full border-4 border-cosmic-earth/20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>

      <div className="relative text-center px-4 z-10">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-cosmic-sun via-cosmic-earth to-cosmic-purple bg-clip-text text-transparent glow-text">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-cosmic-star mt-4 mb-2">
          页面迷失在宇宙中
        </h2>
        <p className="text-cosmic-dust/70 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面已被黑洞吞噬，或从未存在过
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn-cosmic px-6 py-3 bg-sun-gradient text-white rounded-xl hover:shadow-sun transition-all duration-300 font-medium"
          >
            返回首页
          </Link>
          <Link
            href="/about"
            className="btn-cosmic px-6 py-3 glass-light text-cosmic-star rounded-xl hover:bg-cosmic-purple/30 transition-all duration-300 font-medium"
          >
            关于我
          </Link>
        </div>
      </div>
    </div>
  );
}
