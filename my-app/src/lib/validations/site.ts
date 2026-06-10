import { z } from "zod";

export const siteShareSchema = z.object({
  name: z.string().min(1, "名称不能为空").max(200, "名称最多200个字符"),
  url: z.string().url("请输入有效的URL"),
  description: z.string().max(1000, "描述最多1000个字符").optional().or(z.literal("")),
  category: z.string().min(1, "分类不能为空").max(100, "分类最多100个字符"),
  icon: z.string().url("请输入有效的图标URL").optional().or(z.literal("")),
  order: z.number().int().min(0).default(0),
});

export type SiteShareInput = z.infer<typeof siteShareSchema>;
