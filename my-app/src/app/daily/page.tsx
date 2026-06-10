'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';

interface DailyReport {
  id: string;
  date: string;
  title: string;
  status: string;
  quote: string | null;
  music: { title: string; artist: string } | null;
  site: { name: string; url: string } | null;
  diary: { title: string; slug: string; excerpt: string | null } | null;
}

export default function DailyPage() {
  const { isVoid } = useTheme();
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [todayReport, setTodayReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [todayRes, listRes] = await Promise.all([
        fetch('/api/daily?action=today').catch(() => null),
        fetch('/api/daily?limit=30'),
      ]);

      if (listRes.ok) {
        const listData = await listRes.json();
        setReports(Array.isArray(listData) ? listData : []);
      }

      if (todayRes && todayRes.ok) {
        const todayData = await todayRes.json();
        setTodayReport(todayData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
          每日日报
        </h1>
        <p className={`text-lg max-w-2xl mx-auto ${isVoid ? 'text-void-dust/80' : 'text-realm-mist/80'}`}>
          记录每一天的发现与感悟，分享生活的点滴美好
        </p>
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
        <div className="space-y-6">
          <div className="animate-pulse theme-glass rounded-2xl p-8">
            <div className="h-6 bg-gray-200/20 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200/10 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200/10 rounded w-1/2" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse theme-glass rounded-2xl p-6">
              <div className="h-5 bg-gray-200/20 rounded w-1/4 mb-3" />
              <div className="h-4 bg-gray-200/10 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* 今日日报 */}
          {todayReport && (
            <section className={`rounded-2xl p-8 ${isVoid ? 'glass cosmic-card shadow-glow' : 'glass-solar solar-card shadow-sunny'}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📰</span>
                <h2 className={`text-xl font-bold ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
                  今日日报
                </h2>
                <span className={`text-xs px-2 py-1 rounded-full ${isVoid ? 'bg-void-purple/20 text-void-purple' : 'bg-realm-sky/20 text-realm-ocean'}`}>
                  {formatDate(todayReport.date)}
                </span>
              </div>
              <h3 className={`text-lg font-semibold mb-4 ${isVoid ? 'text-void-sun' : 'text-realm-sunset'}`}>
                {todayReport.title}
              </h3>

              {todayReport.quote && (
                <blockquote className={`border-l-4 pl-4 mb-6 italic ${isVoid ? 'border-void-purple/40 text-void-dust/80' : 'border-realm-sky/40 text-realm-mist/80'}`}>
                  “{todayReport.quote}”
                </blockquote>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {todayReport.music && (
                  <div className={`rounded-xl p-4 ${isVoid ? 'bg-void-purple/10' : 'bg-realm-sky/10'}`}>
                    <div className="text-sm mb-1">🎵 今日推荐音乐</div>
                    <div className={`font-medium ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
                      {todayReport.music.title}
                    </div>
                    <div className={`text-sm ${isVoid ? 'text-void-dust/60' : 'text-realm-mist/60'}`}>
                      {todayReport.music.artist}
                    </div>
                  </div>
                )}
                {todayReport.site && (
                  <a
                    href={todayReport.site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-xl p-4 transition-all hover:opacity-80 ${isVoid ? 'bg-void-purple/10' : 'bg-realm-sky/10'}`}
                  >
                    <div className="text-sm mb-1">🔗 今日推荐网站</div>
                    <div className={`font-medium ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
                      {todayReport.site.name}
                    </div>
                  </a>
                )}
                {todayReport.diary && (
                  <Link
                    href={`/diary/${todayReport.diary.slug}`}
                    className={`rounded-xl p-4 transition-all hover:opacity-80 ${isVoid ? 'bg-void-purple/10' : 'bg-realm-sky/10'}`}
                  >
                    <div className="text-sm mb-1">📝 今日推荐日记</div>
                    <div className={`font-medium line-clamp-1 ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
                      {todayReport.diary.title}
                    </div>
                  </Link>
                )}
              </div>
            </section>
          )}

          {/* 历史日报列表 */}
          {reports.length > 0 ? (
            <section>
              <h2 className={`text-xl font-bold mb-6 ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
                历史日报
              </h2>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className={`rounded-2xl p-6 transition-all duration-300 ${
                      isVoid
                        ? 'glass cosmic-card hover:shadow-glow'
                        : 'glass-solar solar-card hover:shadow-sunny'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${isVoid ? 'text-void-dust/60' : 'text-realm-mist/60'}`}>
                        {formatDate(report.date)}
                      </span>
                    </div>
                    <h3 className={`text-lg font-semibold ${isVoid ? 'text-void-star' : 'text-realm-foreground'}`}>
                      {report.title}
                    </h3>
                    {report.quote && (
                      <p className={`mt-2 text-sm italic ${isVoid ? 'text-void-dust/70' : 'text-realm-mist/70'}`}>
                        “{report.quote}”
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className={`text-center py-12 rounded-2xl theme-glass ${isVoid ? 'text-void-dust/50' : 'text-realm-mist/50'}`}>
              <p className="text-lg mb-2">📭</p>
              <p>暂无日报</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
