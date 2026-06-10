import { z } from "zod";

export const dailyReportSchema = z.object({
  date: z.string().datetime("请输入有效的日期"),
  title: z.string().min(1, "标题不能为空").max(200, "标题最多200个字符"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  musicId: z.string().optional().or(z.literal("")),
  siteId: z.string().optional().or(z.literal("")),
  diaryId: z.string().optional().or(z.literal("")),
  quote: z.string().max(500, "引言最多500个字符").optional().or(z.literal("")),
});

export type DailyReportInput = z.infer<typeof dailyReportSchema>;
