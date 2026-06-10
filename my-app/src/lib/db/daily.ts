import { prisma } from "../prisma";

export async function getDailyReports(options?: {
  status?: string;
  limit?: number;
  date?: Date;
}) {
  return prisma.dailyReport.findMany({
    where: {
      status: options?.status || "PUBLISHED",
      date: options?.date
        ? {
            gte: new Date(options.date.setHours(0, 0, 0, 0)),
            lt: new Date(options.date.setHours(23, 59, 59, 999)),
          }
        : undefined,
    },
    orderBy: { date: "desc" },
    take: options?.limit,
    include: {
      music: true,
      site: true,
      diary: true,
    },
  });
}

export async function getDailyReportByDate(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return prisma.dailyReport.findFirst({
    where: {
      status: "PUBLISHED",
      date: { gte: start, lt: end },
    },
    include: {
      music: true,
      site: true,
      diary: true,
    },
  });
}

export async function createDailyReport(data: {
  date: Date;
  title: string;
  status?: string;
  musicId?: string;
  siteId?: string;
  diaryId?: string;
  quote?: string;
}) {
  return prisma.dailyReport.create({ data });
}

export async function updateDailyReport(
  id: string,
  data: Partial<{
    date: Date;
    title: string;
    status: string;
    musicId?: string;
    siteId?: string;
    diaryId?: string;
    quote?: string;
  }>
) {
  return prisma.dailyReport.update({ where: { id }, data });
}

export async function deleteDailyReport(id: string) {
  return prisma.dailyReport.delete({ where: { id } });
}
