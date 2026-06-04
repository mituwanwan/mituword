"use client";

import Link from "next/link";

// 简单的 Rocket 组件
function SmallRocket() {
  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
      <div 
        className="relative text-5xl animate-bounce"
        style={{ animationDuration: '4s' }}
      >
        🚀
      </div>
    </div>
  );
}

export default function HomeClient() {
  return (
    <div className="flex-1 relative">
      <SmallRocket />
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* 主标题区 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            探索我的数字宇宙
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            通过精心构建的项目和持续更新的思考，与我一起探索技术与创意的边界
          </p>
        </div>
        
        {/* 精选项目 */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              精选项目
            </h2>
            <Link href="/projects" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              查看全部
              <span>→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-xl p-6 border border-gray-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-amber-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <span className="text-white">💻</span>
                </div>
                <h3 className="text-xl font-semibold text-white">示例项目</h3>
              </div>
              <p className="text-gray-400 mb-4 line-clamp-3">这是一个示例项目，展示我的开发能力和技术栈</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-700/80 text-gray-300">Next.js</span>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-700/80 text-gray-300">React</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* 最新日记 */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              最新日记
            </h2>
            <Link href="/diary" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
              查看全部
              <span>→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl p-6 border border-gray-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <span className="text-white text-sm">📝</span>
                </div>
                <span className="text-gray-400 text-sm">2026-06-03</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">第一篇日记</h3>
              <p className="text-gray-400 line-clamp-2">开始记录我的开发历程和技术学习心得...</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
