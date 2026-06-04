import { prisma } from "@/lib/prisma";

export async function getGitHubRepos(options?: {
  language?: string;
  search?: string;
  sortBy?: string;
  limit?: number;
}) {
  const where: any = {};

  if (options?.language) {
    where.language = options.language;
  }

  if (options?.search) {
    where.OR = [
      { name: { contains: options.search } },
      { description: { contains: options.search } },
    ];
  }

  let orderBy: any = { updatedAt: "desc" };
  if (options?.sortBy === "stars") {
    orderBy = { stars: "desc" };
  } else if (options?.sortBy === "name") {
    orderBy = { name: "asc" };
  }

  return prisma.gitHubRepo.findMany({
    where,
    orderBy,
    take: options?.limit,
  });
}

export async function getGitHubRepoByRepoId(repoId: number) {
  return prisma.gitHubRepo.findUnique({
    where: { repoId },
  });
}

export async function syncGitHubRepo(data: {
  repoId: number;
  name: string;
  fullName: string;
  description?: string;
  htmlUrl: string;
  stars: number;
  forks: number;
  watchers: number;
  language?: string;
  topics?: string;
  createdAt: Date;
  updatedAt: Date;
  pushedAt?: Date;
}) {
  return prisma.gitHubRepo.upsert({
    where: { repoId: data.repoId },
    update: {
      name: data.name,
      fullName: data.fullName,
      description: data.description,
      htmlUrl: data.htmlUrl,
      stars: data.stars,
      forks: data.forks,
      watchers: data.watchers,
      language: data.language,
      topics: data.topics,
      updatedAt: data.updatedAt,
      pushedAt: data.pushedAt,
      syncAt: new Date(),
    },
    create: data,
  });
}

export async function createGitHubSyncLog(data: {
  status: string;
  reposCount?: number;
  errorMsg?: string;
}) {
  return prisma.gitHubSyncLog.create({
    data: {
      status: data.status,
      reposCount: data.reposCount || 0,
      errorMsg: data.errorMsg,
    },
  });
}

export async function getLastGitHubSyncLog() {
  return prisma.gitHubSyncLog.findFirst({
    orderBy: { syncTime: "desc" },
  });
}
