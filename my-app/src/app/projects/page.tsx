import { getProjects } from '@/lib/db/project';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '项目展示 - 我的作品集',
  description: '查看我开发的各类项目，包括Web应用、工具库和创意实验',
  keywords: ['项目', '作品集', '开源项目', 'Web开发'],
  openGraph: {
    title: '项目展示 - 我的作品集',
    description: '查看我开发的各类项目，包括Web应用、工具库和创意实验',
    type: 'website',
  },
};

// 项目状态标签
function StatusBadge({ status }: { status: string }) {
  let displayText = '';
  let cosmicClasses = '';
  let solarClasses = '';
  
  switch (status) {
    case 'COMPLETED':
      displayText = '已完成';
      cosmicClasses = 'bg-void-cyan/20 text-void-cyan';
      solarClasses = 'bg-realm-grass/20 text-realm-grass';
      break;
    case 'IN_PROGRESS':
      displayText = '进行中';
      cosmicClasses = 'bg-void-sun/20 text-void-sun';
      solarClasses = 'bg-realm-sunset/20 text-realm-sunset';
      break;
    default:
      displayText = '计划中';
      cosmicClasses = 'bg-void-purple/10 text-void-star';
      solarClasses = 'bg-realm-sky/10 text-realm-foreground';
  }
  
  return (
    <span className={`
      px-3 py-1 text-xs rounded-full transition-all duration-1000
      dark:${cosmicClasses}
      ${solarClasses}
    `}>
      {displayText}
    </span>
  );
}

// 项目卡片
function ProjectCard({ project }: { project: any }) {
  return (
    <Link
      key={project.id}
      href={`/projects/${project.slug}`}
      className="
        block relative overflow-hidden rounded-2xl 
        transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        theme-card
      "
    >
      {/* 玻璃效果背景 */}
      <div className="theme-glass h-full">
        {/* 装饰性渐变背景 */}
        <div className="
          absolute top-0 right-0 w-40 h-40 opacity-10
          dark:bg-nebula-gradient
          bg-sunrise-gradient
          rounded-full blur-3xl pointer-events-none
        " />
        
        <div className="relative z-10">
          {project.thumbnail && (
            <div className="w-full h-48 relative overflow-hidden rounded-t-2xl">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <StatusBadge status={project.status} />
              {project.featured && (
                <span className="text-lg">⭐</span>
              )}
            </div>
            
            <h2 className="
              text-xl font-semibold mb-2
              dark:text-void-star
              text-realm-foreground
            ">
              {project.title}
            </h2>
            
            <p className="
              dark:text-void-dust
              text-realm-mist
              text-sm mb-4 line-clamp-3 leading-relaxed
            ">
              {project.description}
            </p>
            
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="
                dark:text-void-dust/70
                text-realm-mist/70
              ">
                👁 {project.views || 0}
              </span>
              {project.category && (
                <span className="
                  px-3 py-1 rounded-full text-xs
                  dark:bg-void-purple/10 dark:text-void-star
                  bg-realm-sky/10 text-realm-foreground
                ">
                  {project.category.name}
                </span>
              )}
            </div>
            
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tagRelation: any) => (
                  <span
                    key={tagRelation.id}
                    className="
                      text-xs px-2 py-1 rounded-full
                      dark:bg-void-purple/10 dark:text-void-cyan
                      bg-realm-sky/10 text-realm-ocean
                    "
                  >
                    {tagRelation.tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const options = {
    category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
    tag: typeof searchParams.tag === 'string' ? searchParams.tag : undefined,
    status: typeof searchParams.status === 'string' ? searchParams.status : undefined,
    featured: searchParams.featured === 'true' ? true : undefined,
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
  };

  const projects = await getProjects(options);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* 页面标题区 */}
      <div className="text-center mb-16 relative">
        {/* 装饰性光晕 */}
        <div className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-80 h-80 opacity-10 blur-3xl rounded-full pointer-events-none
          dark:bg-nebula-gradient
          bg-sunrise-gradient
        " />
        
        <div className="relative z-10">
          <h1 className="
            text-4xl md:text-5xl font-bold mb-4
            bg-gradient-to-r
            dark:from-void-sun dark:via-void-purple dark:to-void-cyan
            from-realm-sunset via-realm-sun to-realm-gold
            bg-clip-text text-transparent
            theme-glow-text
          ">
            项目展示
          </h1>
          <p className="
            text-lg max-w-2xl mx-auto
            dark:text-void-dust/80
            text-realm-mist/80
          ">
            查看我开发的各类项目，包括Web应用、工具库和创意实验
          </p>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="
          text-center py-20 theme-glass rounded-2xl
        ">
          <p className="
            text-lg
            dark:text-void-dust/50
            text-realm-mist/50
          ">
            暂无项目
          </p>
        </div>
      )}
    </div>
  );
}