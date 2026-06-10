import Image from "next/image";
import Link from "next/link";

interface DiaryCategory {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

interface DiaryTag {
  id: string;
  name: string;
  color?: string;
}

interface DiaryTagRelation {
  id: string;
  tag: DiaryTag;
}

interface Diary {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: string;
  coverImage?: string;
  views: number;
  likes: number;
  isPinned: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: DiaryCategory;
  tags: DiaryTagRelation[];
  _count: {
    comments: number;
    likesList: number;
  };
}

interface DiaryCardProps {
  diary: Diary;
}

export function DiaryCard({ diary }: DiaryCardProps) {
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <article className="dark:glass glass-realm rounded-lg overflow-hidden dark:hover:shadow-glow hover:shadow-sunny transition-all duration-300">
      {diary.coverImage && (
        <Link href={`/diary/${diary.slug}`}>
          <div className="relative h-48 overflow-hidden">
            <Image
              src={diary.coverImage}
              alt={diary.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </Link>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {diary.isPinned && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium dark:bg-void-sun/20 dark:text-void-sun bg-realm-sunset/20 text-realm-sunset">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 4v7l2 3v2h-6v5l-1 1-1-1v-5H5v-2l2-3V4h10z" />
              </svg>
              置顶
            </span>
          )}
          {diary.category && (
            <span
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: diary.category.color || "#3b82f6",
                color: "white",
              }}
            >
              {diary.category.name}
            </span>
          )}
        </div>
        <h2 className="text-xl font-semibold dark:text-void-star text-realm-foreground mb-2">
          <Link
            href={`/diary/${diary.slug}`}
            className="dark:hover:text-void-sun hover:text-realm-sunset transition-colors"
          >
            {diary.title}
          </Link>
        </h2>
        <p className="dark:text-void-dust/80 text-realm-mist/80 mb-4 line-clamp-3">
          {diary.excerpt || diary.content.substring(0, 150)}
          {!diary.excerpt && diary.content.length > 150 && "..."}
        </p>
        {diary.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {diary.tags.map(({ tag }) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium dark:bg-void-purple/10 dark:text-void-star bg-realm-sky/10 text-realm-foreground"
                style={tag.color ? { backgroundColor: tag.color, color: "white" } : undefined}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-sm dark:text-void-dust/70 text-realm-mist/70">
          <time dateTime={diary.publishedAt || diary.createdAt}>
            {formatDate(diary.publishedAt || diary.createdAt)}
          </time>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {diary.views}
            </span>
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {diary._count.likesList || diary.likes}
            </span>
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {diary._count.comments}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
