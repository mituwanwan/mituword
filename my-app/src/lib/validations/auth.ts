import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "密码不能为空"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "用户名至少2个字符").max(50, "用户名最多50个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z
    .string()
    .min(8, "密码至少8个字符")
    .max(100, "密码最多100个字符")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "密码需包含大小写字母、数字和特殊字符"
    ),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
