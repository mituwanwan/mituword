'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';

// ========== 类型定义 ==========
interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail: string | null;
  status: string;
  views: number;
  category: { name: string; slug: string } | null;
  tags: { tag: { name: string } }[];
}

interface Diary {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  coverImage: string | null;
  publishedAt: string;
  isPinned: boolean;
  category: { name: string; slug: string } | null;
  _count: { comments: number; likesList: number };
}

// ========== 骨架屏组件 ==========
function ProjectCardSkeleton() {
  return (
    <div className="block relative overflow-hidden rounded-2xl p-6 animate-pulse theme-glass">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-200/20" />
        <div className="h-6 bg-gray-200/20 rounded w-2/3" />
      </div>
      <div className="h-4 bg-gray-200/10 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200/10 rounded w-3/4 mb-4" />
      <div className="flex flex-wrap gap-2">
        <div className="h-6 bg-gray-200/10 rounded-full w-16" />
        <div className="h-6 bg-gray-200/10 rounded-full w-20" />
      </div>
    </div>
  );
}

function DiaryCardSkeleton() {
  return (
    <div className="block relative overflow-hidden rounded-2xl p-6 animate-pulse theme-glass">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-gray-200/20" />
        <div className="h-4 bg-gray-200/10 rounded w-24" />
      </div>
      <div className="h-5 bg-gray-200/20 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200/10 rounded w-full" />
      <div className="h-4 bg-gray-200/10 rounded w-2/3" />
    </div>
  );
}

// ========== 首页火箭装饰组件 ==========
function HomeRocket() {
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

// ========== 精选项目卡片 ==========
function FeaturedProjectCard({ project }: { project: Project }) {
  const { isVoid } = useTheme();

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`
        block relative overflow-hidden rounded-2xl p-6
        transition-all duration-300
        hover:transform hover:-translate-y-1
        ${isVoid
          ? 'glass cosmic-card hover:shadow-glow'
          : 'glass-solar solar-card hover:shadow-sunny'
        }
      `}
    >
      <div className={`
        absolute top-0 right-0 w-32 h-32 opacity-10
        ${isVoid ? 'bg-nebula-gradient' : 'bg-sunrise-gradient'}
        rounded-full blur-3xl
      `} />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm
            ${isVoid ? 'bg-nebula-gradient' : 'bg-sunrise-gradient'}
          `}>
            {project.thumbnail ? (
              <Image src={project.thumbnail} alt="" width={40} height={40} className="object-cover rounded-xl" unoptimized />
            ) : (
              '💻'
            )}
          </div>
          <h3 className={`
            text-xl font-semibold line-clamp-1
            ${isVoid ? 'text-void-star' : 'text-realm-foreground'}
          `}>
            {project.title}
          </h3>
        </div>

        <p className={`
          mb-4 leading-relaxed line-clamp-2
          ${isVoid ? 'text-void-dust/80' : 'text-realm-mist/80'}
        `}>
          {project.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tagRelation, index) => (
              <span
                key={index}
                className={`
                  text-xs px-3 py-1 rounded-full
                  ${isVoid
                    ? 'bg-void-purple/20 text-void-purple'
                    : 'bg-realm-sky/20 text-realm-ocean'
                  }
                `}
              >
                {tagRelation.tag.name}
              </span>
            ))}
          </div>
          <span className={`text-xs ${isVoid ? 'text-void-dust/50' : 'text-realm-mist/50'}`}>
            👁 {project.views}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ========== 最新日记卡片 ==========
function LatestDiaryCard({ diary }: { diary: Diary }) {
  const { isVoid } = useTheme();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link
      href={`/diary/${diary.slug}`}
      className={`
        block relative overflow-hidden rounded-2xl p-6
        transition-all duration-300
        hover:transform hover:-translate-y-1
        ${isVoid
          ? 'glass cosmic-card hover:shadow-glow'
          : 'glass-solar solar-card hover:shadow-sunny'
        }
      `}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-white text-sm
            ${isVoid ? 'bg-nebula-gradient' : 'bg-sunrise-gradient'}
          `}>
            {diary.coverImage ? (
              <Image src={diary.coverImage} alt="" width={32} height={32} className="object-cover rounded-full" unoptimized />
            ) : (
              '📝'
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isVoid ? 'text-void-dust/60' : 'text-realm-mist/60'}`}>
              {formatDate(diary.publishedAt)}
            </span>
            {diary.isPinned && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                置顶
              </span>
            )}
          </div>
        </div>

        <h3 className={`
          text-lg font-semibold mb-2 line-clamp-1
          ${isVoid ? 'text-void-star' : 'text-realm-foreground'}
        `}>
          {diary.title}
        </h3>

        <p className={`
          line-clamp-2
          ${isVoid ? 'text-void-dust/80' : 'text-realm-mist/80'}
        `}>
          {diary.excerpt || '暂无摘要'}
        </p>

        <div className={`flex items-center gap-4 mt-3 text-xs ${isVoid ? 'text-void-dust/50' : 'text-realm-mist/50'}`}>
          <span>💬 {diary._count.comments}</span>
          <span>❤️ {diary._count.likesList}</span>
        </div>
      </div>
    </Link>
  );
}

// ========== 空状态组件 ==========
function EmptyState({ message }: { message: string }) {
  const { isVoid } = useTheme();
  return (
    <div className={`text-center py-12 theme-glass rounded-2xl ${isVoid ? 'text-void-dust/50' : 'text-realm-mist/50'}`}>
      <p className="text-lg mb-2">📭</p>
      <p>{message}</p>
    </div>
  );
}

// ========== 错误状态组件 ==========
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { isVoid } = useTheme();
  return (
    <div className={`text-center py-12 theme-glass rounded-2xl ${isVoid ? 'text-void-dust/70' : 'text-realm-mist/70'}`}>
      <p className="text-2xl mb-2">⚠️</p>
      <p className="mb-4">{message}</p>
      <button
        onClick={onRetry}
        className={`
          px-4 py-2 rounded-lg text-sm transition-all duration-300
          ${isVoid
            ? 'bg-void-purple/20 text-void-purple hover:bg-void-purple/30'
            : 'bg-realm-sky/20 text-realm-ocean hover:bg-realm-sky/30'
          }
        `}
      >
        重新加载
      </button>
    </div>
  );
}

// ========== 主组件 ==========
export default function HomeClient() {
  const { isVoid } = useTheme();

  const [projects, setProjects] = useState<Project[]>([]);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [projectsRes, diariesRes] = await Promise.all([
        fetch('/api/projects?featured=true&limit=3'),
        fetch('/api/diaries?status=PUBLISHED&limit=2'),
      ]);

      if (!projectsRes.ok) throw new Error(`Projects API failed: ${projectsRes.status}`);
      if (!diariesRes.ok) throw new Error(`Diaries API failed: ${diariesRes.status}`);

      const projectsData = await projectsRes.json();
      const diariesData = await diariesRes.json();

      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setDiaries(Array.isArray(diariesData) ? diariesData : []);
    } catch (err) {
      console.error('Home data fetch error:', err);
      setError(err instanceof Error ? err.message : '数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 relative">
      <HomeRocket />

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* 主标题区 */}
        <div className="text-center mb-16 relative">
          <div className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-96 h-96 opacity-20 blur-3xl rounded-full pointer-events-none
            ${isVoid ? 'bg-nebula-gradient' : 'bg-sunrise-gradient'}
          `} />

          <div className="relative z-10">
            <h1 className={`
              text-4xl md:text-5xl lg:text-6xl font-bold mb-6
              bg-gradient-to-r
              ${isVoid
                ? 'from-void-sun via-void-purple to-void-cyan'
                : 'from-realm-sunset via-realm-sun to-realm-gold'
              }
              bg-clip-text text-transparent
              theme-glow-text
            `}>
              探索我的数字宇宙
            </h1>

            <p className={`
              text-lg md:text-xl max-w-2xl mx-auto leading-relaxed
              ${isVoid ? 'text-void-dust/80' : 'text-realm-mist/80'}
            `}>
              通过精心构建的项目和持续更新的思考，与我一起探索技术与创意的边界
            </p>
          </div>
        </div>

        {/* 精选项目 */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`
              text-2xl md:text-3xl font-bold
              ${isVoid ? 'text-void-star' : 'text-realm-foreground'}
            `}>
              精选项目
            </h2>
            <Link
              href="/projects"
              className={`
                flex items-center gap-1 transition-all duration-300
                hover:opacity-80
                ${isVoid ? 'text-void-cyan' : 'text-realm-ocean'}
              `}
            >
              查看全部
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {error ? (
            <ErrorState message="项目数据加载失败" onRetry={fetchData} />
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <FeaturedProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState message="暂无精选项目" />
          )}
        </section>

        {/* 最新日记 */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className={`
              text-2xl md:text-3xl font-bold
              ${isVoid ? 'text-void-star' : 'text-realm-foreground'}
            `}>
              最新日记
            </h2>
            <Link
              href="/diary"
              className={`
                flex items-center gap-1 transition-all duration-300
                hover:opacity-80
                ${isVoid ? 'text-void-purple' : 'text-realm-grass'}
              `}
            >
              查看全部
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {error ? (
            <ErrorState message="日记数据加载失败" onRetry={fetchData} />
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DiaryCardSkeleton />
              <DiaryCardSkeleton />
            </div>
          ) : diaries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {diaries.map((diary) => (
                <LatestDiaryCard key={diary.id} diary={diary} />
              ))}
            </div>
          ) : (
            <EmptyState message="暂无日记" />
          )}
        </section>
      </div>
    </div>
  );
}
