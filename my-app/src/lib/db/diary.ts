import { prisma } from "@/lib/prisma";

export async function getDiaries(options?: {
  category?: string;
  tag?: string;
  status?: string;
  search?: string;
  pinned?: boolean;
  limit?: number;
}) {
  const where: any = {};

  if (options?.category) {
    where.category = { slug: options.category };
  }

  if (options?.tag) {
    where.tags = { some: { tag: { name: options.tag } } };
  }

  if (options?.status) {
    where.status = options.status;
  }

  if (options?.pinned !== undefined) {
    where.isPinned = options.pinned;
  }

  if (options?.search) {
    where.OR = [
      { title: { contains: options.search } },
      { content: { contains: options.search } },
    ];
  }

  return prisma.diary.findMany({
    where,
    include: {
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { comments: true, likesList: true } },
    },
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    take: options?.limit,
  });
}

export async function getDiaryBySlug(slug: string) {
  return prisma.diary.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
      comments: {
        where: { status: "APPROVED", parentId: null },
        include: {
          replies: {
            where: { status: "APPROVED" },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { comments: true, likesList: true } },
    },
  });
}

export async function createDiary(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status?: string;
  categoryId?: string;
  coverImage?: string;
  publishedAt?: Date;
}) {
  return prisma.diary.create({ data });
}

export async function updateDiary(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: string;
    categoryId: string;
    coverImage: string;
    isPinned: boolean;
    publishedAt: Date;
  }>
) {
  return prisma.diary.update({
    where: { id },
    data,
  });
}

export async function deleteDiary(id: string) {
  return prisma.diary.delete({ where: { id } });
}

export async function incrementViews(id: string) {
  return prisma.diary.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}

export async function incrementDiaryViews(id: string) {
  return prisma.diary.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}

export async function addComment(data: {
  diaryId: string;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  content: string;
  parentId?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  return prisma.comment.create({ data });
}

export async function addLike(diaryId: string, ipAddress: string) {
  return prisma.like.create({
    data: { diaryId, ipAddress },
  });
}
