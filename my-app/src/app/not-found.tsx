import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-void-dark bg-realm-light relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 dark:bg-void-gradient bg-realm-gradient opacity-50" />

      {/* 黑洞效果 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-20">
        <div className="absolute inset-0 rounded-full dark:bg-void-deeper bg-realm-brighter shadow-glow-lg animate-pulse" />
        <div className="absolute inset-4 rounded-full border-4 dark:border-void-purple/30 border-realm-sky/30 animate-spin" />
        <div className="absolute inset-8 rounded-full border-4 dark:border-void-earth/20 border-realm-ocean/20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>

      <div className="relative text-center px-4 z-10">
        <h1 className="text-9xl font-bold bg-gradient-to-r dark:from-void-sun dark:via-void-earth dark:to-void-purple from-realm-sunset via-realm-ocean to-realm-grass bg-clip-text text-transparent glow-text">
          404
        </h1>
        <h2 className="text-2xl font-semibold dark:text-void-star text-realm-foreground mt-4 mb-2">
          页面迷失在宇宙中
        </h2>
        <p className="dark:text-void-dust/70 text-realm-mist/70 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面已被黑洞吞噬，或从未存在过
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="dark:btn-void btn-realm px-6 py-3 bg-sun-gradient text-white rounded-xl hover:shadow-sun transition-all duration-300 font-medium"
          >
            返回首页
          </Link>
          <Link
            href="/about"
            className="dark:btn-void btn-realm px-6 py-3 dark:glass-light glass-realm-light dark:text-void-star text-realm-foreground rounded-xl hover:dark:bg-void-purple/30 hover:bg-realm-sky/30 transition-all duration-300 font-medium"
          >
            关于我
          </Link>
        </div>
      </div>
    </div>
  );
}
