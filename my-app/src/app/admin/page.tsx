import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getStats() {
  const [
    projectCount,
    diaryCount,
    musicTrackCount,
    commentCount,
    githubRepoCount,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.diary.count(),
    prisma.musicTrack.count(),
    prisma.comment.count(),
    prisma.gitHubRepo.count(),
  ]);

  return {
    projectCount,
    diaryCount,
    musicTrackCount,
    commentCount,
    githubRepoCount,
  };
}

function StatCard({
  title,
  value,
  icon,
  href,
}: {
  title: string;
  value: number;
  icon: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="theme-glass rounded-2xl p-6 theme-card transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-3xl font-bold bg-gradient-to-r dark:from-void-sun dark:to-void-cyan from-realm-sunset to-realm-ocean bg-clip-text text-transparent">
          {value}
        </span>
      </div>
      <h3 className="text-sm font-medium dark:text-void-dust/80 text-realm-mist/80">
        {title}
      </h3>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r dark:from-void-sun dark:to-void-purple from-realm-sunset to-realm-ocean bg-clip-text text-transparent">
        仪表盘
      </h1>
      <p className="dark:text-void-dust/60 text-realm-mist/60 mb-8">
        欢迎回到管理后台，以下是网站数据概览
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="项目总数"
          value={stats.projectCount}
          icon="💻"
          href="/admin/projects"
        />
        <StatCard
          title="日记总数"
          value={stats.diaryCount}
          icon="📝"
          href="/admin/diaries"
        />
        <StatCard
          title="音乐曲目"
          value={stats.musicTrackCount}
          icon="🎵"
          href="/admin/music"
        />
        <StatCard
          title="评论总数"
          value={stats.commentCount}
          icon="💬"
          href="/diary"
        />
        <StatCard
          title="GitHub 仓库"
          value={stats.githubRepoCount}
          icon="⭐"
          href="/github"
        />
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 dark:text-void-star text-realm-foreground">
          快速操作
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/projects/new"
            className="btn-void px-6 py-3 theme-glass-light dark:text-void-star text-realm-foreground rounded-xl dark:hover:bg-void-purple/20 hover:bg-realm-sky/20 transition-all duration-300"
          >
            + 新建项目
          </Link>
          <Link
            href="/admin/diaries/new"
            className="btn-void px-6 py-3 theme-glass-light dark:text-void-star text-realm-foreground rounded-xl dark:hover:bg-void-purple/20 hover:bg-realm-sky/20 transition-all duration-300"
          >
            + 新建日记
          </Link>
        </div>
      </div>
    </div>
  );
}
