import { z } from "zod";

export const diarySchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200, "标题最多200个字符"),
  slug: z
    .string()
    .min(1, "Slug不能为空")
    .max(200, "Slug最多200个字符")
    .regex(/^[a-z0-9-]+$/, "Slug只能包含小写字母、数字和连字符"),
  content: z.string().min(1, "内容不能为空").max(50000, "内容最多50000个字符"),
  excerpt: z.string().max(500, "摘要最多500个字符").optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  categoryId: z.string().optional().or(z.literal("")),
  coverImage: z.string().url("请输入有效的图片URL").optional().or(z.literal("")),
  publishedAt: z.string().datetime().optional().or(z.literal("")),
});

export const diaryCategorySchema = z.object({
  name: z.string().min(1, "名称不能为空").max(100, "名称最多100个字符"),
  slug: z
    .string()
    .min(1, "Slug不能为空")
    .regex(/^[a-z0-9-]+$/, "Slug只能包含小写字母、数字和连字符"),
  description: z.string().max(500, "描述最多500个字符").optional(),
  color: z.string().optional(),
});

export const commentSchema = z.object({
  diaryId: z.string().min(1, "日记ID不能为空"),
  authorName: z.string().min(1, "姓名不能为空").max(100, "姓名最多100个字符"),
  authorEmail: z.string().email("请输入有效的邮箱地址"),
  authorWebsite: z.string().url("请输入有效的网址").optional().or(z.literal("")),
  content: z.string().min(1, "评论内容不能为空").max(5000, "评论内容最多5000个字符"),
  parentId: z.string().optional(),
});

export type DiaryInput = z.infer<typeof diarySchema>;
export type DiaryCategoryInput = z.infer<typeof diaryCategorySchema>;
export type CommentInput = z.infer<typeof commentSchema>;
