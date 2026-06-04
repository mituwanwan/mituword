import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200, "标题最多200个字符"),
  slug: z
    .string()
    .min(1, "Slug不能为空")
    .max(200, "Slug最多200个字符")
    .regex(/^[a-z0-9-]+$/, "Slug只能包含小写字母、数字和连字符"),
  description: z
    .string()
    .min(1, "描述不能为空")
    .max(5000, "描述最多5000个字符"),
  categoryId: z.string().optional(),
  demoUrl: z
    .string()
    .url("请输入有效的演示URL")
    .optional()
    .or(z.literal("")),
  repoUrl: z
    .string()
    .url("请输入有效的仓库URL")
    .optional()
    .or(z.literal("")),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.string().default("COMPLETED"),
  featured: z.boolean().default(false),
  thumbnail: z
    .string()
    .url("请输入有效的图片URL")
    .optional()
    .or(z.literal("")),
});

export const projectCategorySchema = z.object({
  name: z.string().min(1, "名称不能为空").max(100, "名称最多100个字符"),
  slug: z
    .string()
    .min(1, "Slug不能为空")
    .regex(/^[a-z0-9-]+$/, "Slug只能包含小写字母、数字和连字符"),
  description: z.string().max(500, "描述最多500个字符").optional(),
  color: z.string().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectCategoryInput = z.infer<typeof projectCategorySchema>;
