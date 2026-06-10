import { prisma } from "../prisma";

export async function getSiteShares(category?: string) {
  return prisma.siteShare.findMany({
    where: category ? { category } : undefined,
    orderBy: { order: "asc" },
  });
}

export async function getSiteShareCategories() {
  const sites = await prisma.siteShare.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  return sites.map((s) => s.category);
}

export async function createSiteShare(data: {
  name: string;
  url: string;
  description?: string;
  category: string;
  icon?: string;
  order?: number;
}) {
  return prisma.siteShare.create({ data });
}

export async function updateSiteShare(
  id: string,
  data: Partial<{
    name: string;
    url: string;
    description?: string;
    category: string;
    icon?: string;
    order: number;
  }>
) {
  return prisma.siteShare.update({ where: { id }, data });
}

export async function deleteSiteShare(id: string) {
  return prisma.siteShare.delete({ where: { id } });
}
