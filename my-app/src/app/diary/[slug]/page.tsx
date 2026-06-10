import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDiaryBySlug, incrementViews, getRelatedDiaries } from "@/lib/db/diary";
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
      authors: ["迷途世界"],
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

  // 获取相关推荐日记
  const relatedDiaries = diary.category
    ? await getRelatedDiaries(diary.category.id, diary.id, 3)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <FadeIn>
        <nav className="mb-8 text-sm dark:text-void-dust/60 text-realm-mist/60">
          <Link href="/" className="dark:hover:text-void-sun hover:text-realm-sunset transition-colors">
            首页
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/diary"
            className="dark:hover:text-void-sun hover:text-realm-sunset transition-colors"
          >
            日记
          </Link>
          <span className="mx-2">/</span>
          <span className="dark:text-void-star text-realm-foreground">{diary.title}</span>
        </nav>
      </FadeIn>

      {/* Header */}
      <FadeIn>
        <article className="theme-glass rounded-2xl overflow-hidden theme-card">
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
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm dark:text-void-dust/60 text-realm-mist/60">
              {diary.isPinned && (
                <span className="bg-gradient-to-r dark:from-void-sun dark:to-void-sunRed from-realm-sunset to-realm-sun text-white font-bold px-3 py-1 rounded-full">
                  置顶
                </span>
              )}
              {diary.category && (
                <span
                  className="px-3 py-1 rounded-full theme-glass-light font-medium"
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
            <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r dark:from-void-sun dark:to-void-earth from-realm-sunset to-realm-ocean bg-clip-text text-transparent">
              {diary.title}
            </h1>

            {/* Tags */}
            {diary.tags && diary.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {diary.tags.map((tagRelation: any) => (
                  <span
                    key={tagRelation.id}
                    className="text-sm theme-glass-light dark:text-void-cyan text-realm-ocean px-3 py-1 rounded-full"
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
            <div className="mt-12 pt-8 border-t dark:border-void-purple/20 border-realm-sun/20 flex flex-wrap gap-4">
              <Link
                href="/diary"
                className="btn-void px-6 py-2 theme-glass-light dark:text-void-star text-realm-foreground rounded-lg dark:hover:bg-void-purple/20 hover:bg-realm-sky/20 transition-all duration-300"
              >
                ← 返回日记列表
              </Link>
            </div>
          </div>
        </article>
      </FadeIn>

      {/* Related Diaries */}
      {relatedDiaries.length > 0 && (
        <section className="mt-12">
          <FadeIn>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r dark:from-void-purple dark:to-void-pink from-realm-ocean to-realm-grass bg-clip-text text-transparent">
              同一分类的日记
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedDiaries.map((related: any) => (
                <Link
                  key={related.id}
                  href={`/diary/${related.slug}`}
                  className="theme-glass rounded-2xl overflow-hidden theme-card p-6 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3 text-sm dark:text-void-dust/60 text-realm-mist/60">
                    {related.isPinned && (
                      <span className="text-xs bg-gradient-to-r dark:from-void-sun dark:to-void-sunRed from-realm-sunset to-realm-sun text-white font-bold px-2 py-0.5 rounded-full">
                        置顶
                      </span>
                    )}
                    <span>
                      {new Date(related.publishedAt || related.createdAt).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {related.views}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-void-star text-realm-foreground line-clamp-1">
                    {related.title}
                  </h3>
                  <p className="text-sm dark:text-void-dust/70 text-realm-mist/70 line-clamp-2">
                    {related.excerpt || related.content.substring(0, 120) + "..."}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs dark:text-void-dust/50 text-realm-mist/50">
                    <span>💬 {related._count.comments}</span>
                    <span>❤️ {related._count.likesList}</span>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </section>
      )}
    </div>
  );
}
