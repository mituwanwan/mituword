import { prisma } from "@/lib/prisma";

export async function getProjects(options?: {
  category?: string;
  tag?: string;
  status?: string;
  featured?: boolean;
  search?: string;
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

  if (options?.featured !== undefined) {
    where.featured = options.featured;
  }

  if (options?.search) {
    where.OR = [
      { title: { contains: options.search } },
      { description: { contains: options.search } },
    ];
  }

  return prisma.project.findMany({
    where,
    include: {
      category: true,
      tags: { include: { tag: true } },
      images: { orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
    take: options?.limit,
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
      images: { orderBy: { order: "asc" } },
    },
  });
}

export async function createProject(data: {
  title: string;
  slug: string;
  description: string;
  categoryId?: string;
  demoUrl?: string;
  repoUrl?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  featured?: boolean;
  thumbnail?: string;
}) {
  return prisma.project.create({ data });
}

export async function updateProject(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    description: string;
    categoryId: string;
    demoUrl: string;
    repoUrl: string;
    startDate: Date;
    endDate: Date;
    status: string;
    featured: boolean;
    thumbnail: string;
  }>
) {
  return prisma.project.update({
    where: { id },
    data,
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

export async function incrementProjectViews(id: string) {
  return prisma.project.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}
