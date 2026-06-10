'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';

interface SiteShare {
  id: string;
  name: string;
  url: string;
  description: string | null;
  category: string;
  icon: string | null;
}

const categoryIcons: Record<string, string> = {
  '开发工具': '🔧',
  '设计': '🎨',
  '学习': '📚',
  '音乐': '🎵',
  '游戏': '🎮',
};

export default function SitesPage() {
  const { isVoid } = useTheme();
  const [sites, setSites] = useState<SiteShare[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sitesRes, categoriesRes] = await Promise.all([
        fetch('/api/sites'),
        fetch('/api/sites?action=categories'),
      ]);

      if (!sitesRes.ok) throw new Error('Failed to load sites');
      if (!categoriesRes.ok) throw new Error('Failed to load categories');

      const sitesData = await sitesRes.json();
      const categoriesData = await categoriesRes.json();

      setSites(Array.isArray(sitesData) ? sitesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSites = activeCategory === '全部'
    ? sites
    : sites.filter((s) => s.category === activeCategory);

  const grouped = filteredSites.reduce<Record<string, SiteShare[]>>((acc, site) => {
    if (!acc[site.category]) acc[site.category] = [];
    acc[site.category].push(site);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
          好站分享
        </h1>
        <p className={`text-lg max-w-2xl mx-auto ${isVoid ? 'text-void-dust/80' : 'text-realm-mist/80'}`}>
          收集和分享有趣的网站，探索互联网的无限可能
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button
          onClick={() => setActiveCategory('全部')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeCategory === '全部'
              ? isVoid
                ? 'bg-void-purple/30 text-void-sun'
                : 'bg-realm-sky/30 text-realm-ocean'
              : isVoid
                ? 'bg-void-purple/10 text-void-dust/70 hover:bg-void-purple/20'
                : 'bg-realm-sky/10 text-realm-mist/70 hover:bg-realm-sky/20'
          }`}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === cat
                ? isVoid
                  ? 'bg-void-purple/30 text-void-sun'
                  : 'bg-realm-sky/30 text-realm-ocean'
                : isVoid
                  ? 'bg-void-purple/10 text-void-dust/70 hover:bg-void-purple/20'
                  : 'bg-realm-sky/10 text-realm-mist/70 hover:bg-realm-sky/20'
            }`}
          >
            {categoryIcons[cat] || '🔗'} {cat}
          </button>
        ))}
      </div>

      {error ? (
        <div className={`text-center py-12 rounded-2xl theme-glass ${isVoid ? 'text-void-dust/70' : 'text-realm-mist/70'}`}>
          <p className="text-2xl mb-2">⚠️</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchData}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${isVoid ? 'bg-void-purple/20 text-void-purple hover:bg-void-purple/30' : 'bg-realm-sky/20 text-realm-ocean hover:bg-realm-sky/30'}`}
          >
            重新加载
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse theme-glass rounded-2xl p-6">
              <div className="h-6 bg-gray-200/20 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200/10 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200/10 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : Object.keys(grouped).length > 0 ? (
        <div className="space-y-12">
          {Object.entries(grouped).map(([category, categorySites]) => (
            <section key={category}>
              <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
                <span>{categoryIcons[category] || '🔗'}</span>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySites.map((site) => (
                  <a
                    key={site.id}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                      isVoid
                        ? 'glass cosmic-card hover:shadow-glow'
                        : 'glass-solar solar-card hover:shadow-sunny'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${isVoid ? 'bg-void-purple/20' : 'bg-realm-sky/20'}`}>
                        {site.icon ? (
                          <Image src={site.icon} alt="" width={32} height={32} className="object-contain" unoptimized />
                        ) : (
                          '🌐'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-semibold mb-1 truncate ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
                          {site.name}
                        </h3>
                        <p className={`text-sm line-clamp-2 ${isVoid ? 'text-void-dust/70' : 'text-realm-mist/70'}`}>
                          {site.description || '暂无描述'}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 rounded-2xl theme-glass ${isVoid ? 'text-void-dust/50' : 'text-realm-mist/50'}`}>
          <p className="text-lg mb-2">📭</p>
          <p>暂无网站分享</p>
        </div>
      )}
    </div>
  );
}
