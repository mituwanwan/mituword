import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDiaryBySlug, incrementViews } from "@/lib/db/diary";
import type { Metadata } from "next";
import FadeIn from "@/components/ui/FadeIn";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const diary = await getDiaryBySlug(params.slug);

  if (!diary) {
    return {
      title: "日记未找到",
      description: "该日记不存在或已被删除",
    };
  }

  return {
    title: `${diary.title} - 我的日记`,
    description: diary.excerpt || diary.content.substring(0, 150) + "...",
    keywords: [
      "日记",
      diary.category?.name,
      ...diary.tags?.map((t: any) => t.tag.name) || [],
    ],
    openGraph: {
      title: `${diary.title} - 我的日记`,
      description: diary.excerpt || diary.content.substring(0, 150) + "...",
      type: "article",
      publishedTime: diary.publishedAt?.toISOString(),
      authors: ["个人网站"],
      tags: diary.tags?.map((t: any) => t.tag.name) || [],
    },
  };
}

export default async function DiaryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const diary = await getDiaryBySlug(params.slug);

  if (!diary) {
    notFound();
  }

  await incrementViews(diary.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <FadeIn>
        <nav className="mb-8 text-sm text-cosmic-dust/60">
          <Link href="/" className="hover:text-cosmic-sun transition-colors">
            首页
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/diary"
            className="hover:text-cosmic-sun transition-colors"
          >
            日记
          </Link>
          <span className="mx-2">/</span>
          <span className="text-cosmic-star">{diary.title}</span>
        </nav>
      </FadeIn>

      {/* Header */}
      <FadeIn>
        <article className="glass rounded-2xl overflow-hidden cosmic-card">
          {diary.coverImage && (
            <div className="w-full h-64 md:h-96 relative">
              <Image
                src={diary.coverImage}
                alt={diary.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw"
                priority
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-cosmic-dust/60">
              {diary.isPinned && (
                <span className="bg-gradient-to-r from-cosmic-sun to-cosmic-sunRed text-white font-bold px-3 py-1 rounded-full">
                  置顶
                </span>
              )}
              {diary.category && (
                <span
                  className="px-3 py-1 rounded-full glass-light font-medium"
                  style={{
                    color: diary.category.color || undefined,
                  }}
                >
                  {diary.category.name}
                </span>
              )}
              <span>
                {new Date(
                  diary.publishedAt || diary.createdAt
                ).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {diary.views} 次浏览
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {diary.likes} 次点赞
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-cosmic-star mb-6 bg-gradient-to-r from-cosmic-sun to-cosmic-earth bg-clip-text text-transparent">
              {diary.title}
            </h1>

            {/* Tags */}
            {diary.tags && diary.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {diary.tags.map((tagRelation: any) => (
                  <span
                    key={tagRelation.id}
                    className="text-sm glass-light text-cosmic-cyan px-3 py-1 rounded-full"
                  >
                    #{tagRelation.tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Content - Markdown 渲染 */}
            <div className="prose prose-lg max-w-none">
              <MarkdownRenderer content={diary.content} />
            </div>

            {/* Action Buttons */}
            <div className="mt-12 pt-8 border-t border-cosmic-purple/20 flex flex-wrap gap-4">
              <Link
                href="/diary"
                className="btn-cosmic px-6 py-2 glass-light text-cosmic-star rounded-lg hover:bg-cosmic-purple/20 transition-all duration-300"
              >
                ← 返回日记列表
              </Link>
            </div>
          </div>
        </article>
      </FadeIn>

      {/* Related Diaries */}
      {diary.category && (
        <section className="mt-12">
          <FadeIn>
            <h2 className="text-2xl font-bold text-cosmic-star mb-6 bg-gradient-to-r from-cosmic-purple to-cosmic-pink bg-clip-text text-transparent">
              同一分类的日记
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p className="text-cosmic-dust/50 col-span-full text-center py-8">暂无相关推荐</p>
            </div>
          </FadeIn>
        </section>
      )}
    </div>
  );
}
