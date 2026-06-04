import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(1, "姓名不能为空").max(100, "姓名最多100个字符"),
  title: z.string().min(1, "职位不能为空").max(100, "职位最多100个字符"),
  bio: z.string().min(1, "简介不能为空").max(2000, "简介最多2000个字符"),
  avatar: z.string().url("请输入有效的图片URL").optional().or(z.literal("")),
  location: z.string().max(100, "地点最多100个字符").optional(),
  phone: z.string().max(20, "电话最多20个字符").optional(),
  email: z.string().email("请输入有效的邮箱").optional().or(z.literal("")),
  website: z.string().url("请输入有效的网址").optional().or(z.literal("")),
});

export const educationSchema = z.object({
  school: z.string().min(1, "学校不能为空").max(200, "学校最多200个字符"),
  major: z.string().min(1, "专业不能为空").max(200, "专业最多200个字符"),
  degree: z.string().min(1, "学位不能为空"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  description: z.string().max(1000, "描述最多1000个字符").optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1, "公司不能为空").max(200, "公司最多200个字符"),
  position: z.string().min(1, "职位不能为空").max(200, "职位最多200个字符"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(2000, "描述最多2000个字符").optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1, "技能名称不能为空").max(100, "技能名称最多100个字符"),
  category: z.string().min(1, "分类不能为空"),
  proficiency: z.number().min(0).max(100, "熟练度范围为0-100"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
