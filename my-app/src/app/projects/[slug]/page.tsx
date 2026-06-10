import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProjectDetailClient from "./ProjectDetailClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!project) {
    return {
      title: "项目未找到",
      description: "该项目不存在或已被删除",
    };
  }

  return {
    title: `${project.title} - 项目详情`,
    description: project.description,
    keywords: [
      "项目",
      project.category?.name,
      ...project.tags?.map((t: any) => t.tag.name) || [],
    ],
    openGraph: {
      title: `${project.title} - 项目详情`,
      description: project.description,
      type: "website",
      images: project.thumbnail ? [{ url: project.thumbnail }] : [],
    },
  };
}

async function getProject(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!project) return null;

  await prisma.project.update({
    where: { id: project.id },
    data: { views: { increment: 1 } },
  });

  return project;
}

async function getRelatedProjects(currentSlug: string, categoryId?: string | null) {
  const where: any = {
    slug: { not: currentSlug },
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  return prisma.project.findMany({
    where,
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
    return null;
  }

  const relatedProjects = await getRelatedProjects(slug, project.categoryId);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm dark:text-void-dust/70 text-realm-mist/70">
            <li>
              <Link href="/" className="dark:hover:text-void-sun hover:text-realm-sunset transition-colors">
                首页
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/projects" className="dark:hover:text-void-sun hover:text-realm-sunset transition-colors">
                项目
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="dark:text-void-star text-realm-foreground font-medium truncate max-w-[200px]">
              {project.title}
            </li>
          </ol>
        </nav>

        {/* Project Header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
                  project.status === "COMPLETED"
                    ? "dark:bg-void-cyan/20 dark:text-void-cyan bg-realm-grass/20 text-realm-grass"
                    : project.status === "IN_PROGRESS"
                    ? "dark:bg-void-sun/20 dark:text-void-sun bg-realm-sunset/20 text-realm-sunset"
                    : "dark:bg-void-purple/10 dark:text-void-star bg-realm-sky/10 text-realm-foreground"
                }`}>
                  {project.status === "COMPLETED" ? "已完成" : project.status === "IN_PROGRESS" ? "进行中" : "计划中"}
                </span>
                {project.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-gradient-to-r dark:from-void-sun dark:to-void-sunRed from-realm-sunset to-realm-sun text-white">
                    精选项目
                  </span>
                )}
                {project.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium dark:bg-void-purple/10 dark:text-void-cyan bg-realm-sky/10 text-realm-ocean">
                    {project.category.name}
                  </span>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold dark:text-void-star text-realm-foreground leading-tight tracking-tight">
                {project.title}
              </h1>
            </div>
            <ProjectDetailClient project={project} />
          </div>

          <p className="text-lg dark:text-void-dust text-realm-mist leading-relaxed max-w-3xl">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6 text-sm dark:text-void-dust/70 text-realm-mist/70">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {project.views} 次浏览
            </span>
            {project.startDate && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(project.startDate).getFullYear()}
                {project.endDate && ` - ${new Date(project.endDate).getFullYear()}`}
              </span>
            )}
          </div>
        </header>

        {/* Project Images Gallery */}
        {project.images && project.images.length > 0 && (
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images.map((image: any, index: number) => (
                <div
                  key={image.id}
                  className={`relative overflow-hidden rounded-2xl dark:bg-void-deeper bg-realm-sky/10 ${
                    index === 0 ? "md:col-span-2 aspect-video" : "aspect-square"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || project.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Project Thumbnail (if no images) */}
        {(!project.images || project.images.length === 0) && project.thumbnail && (
          <section className="mb-12">
            <div className="relative overflow-hidden rounded-2xl dark:bg-void-deeper bg-realm-sky/10 aspect-video">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </section>
        )}

        {/* Project Links */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                查看演示
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 dark:bg-void-deeper dark:hover:bg-void-blue bg-realm-mist/20 hover:bg-realm-mist/30 dark:text-void-star text-realm-foreground rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                源代码
              </a>
            )}
          </div>
        </section>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold dark:text-void-star text-realm-foreground mb-4">技术栈</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tagRelation: any) => (
                <Link
                  key={tagRelation.id}
                  href={`/projects?tag=${tagRelation.tag.name}`}
                  className="px-4 py-2 dark:bg-void-deeper/50 bg-white/70 dark:border-void-purple/20 border-realm-sun/20 border rounded-lg text-sm font-medium dark:text-void-dust text-realm-mist dark:hover:border-void-cyan hover:border-realm-ocean dark:hover:text-void-cyan hover:text-realm-ocean transition-all duration-200"
                >
                  {tagRelation.tag.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold dark:text-void-star text-realm-foreground mb-6">相关项目</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((relatedProject: any) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.slug}`}
                  className="group block dark:glass glass-realm rounded-2xl overflow-hidden dark:hover:shadow-glow hover:shadow-sunny transition-all duration-300"
                >
                  {relatedProject.thumbnail && (
                    <div className="aspect-video overflow-hidden relative">
                      <Image
                        src={relatedProject.thumbnail}
                        alt={relatedProject.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold dark:text-void-star text-realm-foreground group-hover:dark:text-void-cyan group-hover:text-realm-ocean transition-colors">
                      {relatedProject.title}
                    </h3>
                    <p className="mt-2 text-sm dark:text-void-dust/70 text-realm-mist/70 line-clamp-2">
                      {relatedProject.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
