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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                首页
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/projects" className="hover:text-blue-600 transition-colors">
                项目
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-slate-900 dark:text-slate-100 font-medium truncate max-w-[200px]">
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
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : project.status === "IN_PROGRESS"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                }`}>
                  {project.status === "COMPLETED" ? "已完成" : project.status === "IN_PROGRESS" ? "进行中" : "计划中"}
                </span>
                {project.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                    精选项目
                  </span>
                )}
                {project.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {project.category.name}
                  </span>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                {project.title}
              </h1>
            </div>
            <ProjectDetailClient project={project} />
          </div>

          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-slate-500 dark:text-slate-400">
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
                  className={`relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 ${
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
            <div className="relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 aspect-video">
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
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
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">技术栈</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tagRelation: any) => (
                <Link
                  key={tagRelation.id}
                  href={`/projects?tag=${tagRelation.tag.name}`}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all duration-200"
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">相关项目</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((relatedProject: any) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.slug}`}
                  className="group block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700"
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
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {relatedProject.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
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
