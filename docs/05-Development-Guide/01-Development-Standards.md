# 开发规范文档

> **文档版本**: v2.0  
> **创建日期**: 2026-05-14  
> **最后更新**: 2026-06-02  
> **关联文档**: [SDD](../01-SDD/01-Software-Design-Document.md)

---

## 1. 代码规范

### 1.1 TypeScript规范

#### 类型定义

```typescript
// ✅ 正确：使用接口定义对象类型
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ 正确：使用类型别名定义联合类型
type Status = 'pending' | 'approved' | 'rejected';

// ✅ 正确：泛型使用
declare function fetchData<T>(url: string): Promise<T>;

// ❌ 错误：避免使用 any
declare function processData(data: any): any;

// ✅ 正确：使用 unknown 替代 any
declare function processData(data: unknown): unknown;
```

#### 命名规范

| 类型 | 命名方式 | 示例 |
|------|---------|------|
| 接口 | PascalCase, 不加前缀 | `User`, `ProjectConfig` |
| 类型别名 | PascalCase | `UserRole`, `ApiResponse` |
| 枚举 | PascalCase, 单数 | `Status`, `UserRole` |
| 枚举成员 | UPPER_SNAKE_CASE | `PENDING`, `APPROVED` |
| 函数 | camelCase | `getUserById`, `handleSubmit` |
| 常量 | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `API_BASE_URL` |
| 变量 | camelCase | `userList`, `isLoading` |
| 布尔变量 | 前缀 is/has/should | `isActive`, `hasPermission` |
| 类 | PascalCase | `UserService`, `AuthController` |
| 组件 | PascalCase | `UserCard`, `ProjectList` |
| 钩子 | 前缀 use | `useAuth`, `useTheme` |
| 工具函数 | 前缀 with/without | `withAuth`, `withoutLoading` |

#### 文件命名

| 类型 | 命名方式 | 示例 |
|------|---------|------|
| 组件 | PascalCase | `UserCard.tsx` |
| 页面 | kebab-case 或默认 | `page.tsx`, `layout.tsx` |
| 工具函数 | camelCase | `formatDate.ts` |
| 常量 | camelCase | `constants.ts` |
| 类型定义 | camelCase | `types.ts` |
| 样式模块 | kebab-case | `styles.module.css` |
| 测试文件 | 原文件名.test | `UserCard.test.tsx` |

### 1.2 React组件规范

#### 函数组件

```typescript
// ✅ 正确：使用函数声明
interface UserCardProps {
  user: User;
  onEdit?: (id: string) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  const handleClick = () => {
    onEdit?.(user.id);
  };

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && (
        <button onClick={handleClick}>编辑</button>
      )}
    </div>
  );
}

// ❌ 错误：避免使用默认导出
export default function UserCard() {}

// ✅ 正确：使用命名导出
export function UserCard() {}
```

#### Hooks规范

```typescript
// ✅ 正确：自定义Hook
export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      setIsLoading(true);
      try {
        const data = await api.getUser(id);
        if (!cancelled) {
          setUser(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { user, isLoading, error };
}
```

### 1.3 CSS/Tailwind规范

#### Tailwind使用

```tsx
// ✅ 正确：使用 cn 工具函数合并类名
import { cn } from '@/lib/utils';

function Button({ className, variant = 'primary' }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-purple-500 text-white hover:bg-purple-600',
        variant === 'secondary' && 'bg-slate-700 text-slate-200 hover:bg-slate-600',
        className
      )}
    >
      按钮
    </button>
  );
}

// ❌ 错误：避免内联样式
<div style={{ backgroundColor: 'blue', padding: '10px' }}>

// ✅ 正确：使用Tailwind类
<div className="bg-purple-500 p-2.5">
```

#### 响应式设计

```tsx
// ✅ 正确：移动优先
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ✅ 正确：使用断点前缀
<div className="text-sm md:text-base lg:text-lg">
```

#### 双主题支持

```tsx
// ✅ 正确：使用 CSS 变量实现主题切换
<div className="theme-transition bg-background text-foreground">
  支持主题切换的内容
</div>

// ✅ 正确：使用 Tailwind 自定义颜色
<div className="bg-cosmic-dark text-cosmic-foreground dark:block hidden">
  宇宙主题内容
</div>
<div className="bg-solar-light text-solar-foreground light:block hidden">
  太阳主题内容
</div>
```

---

## 2. 项目结构

### 2.1 目录结构

```
my-app/
├── app/                          # Next.js App Router
│   ├── about/
│   │   └── page.tsx              # 关于页面
│   ├── api/                      # API路由
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── diaries/
│   │   │   └── route.ts
│   │   ├── github/
│   │   │   └── route.ts
│   │   ├── health/
│   │   │   └── route.ts
│   │   ├── music/
│   │   │   └── route.ts
│   │   ├── profile/
│   │   │   └── route.ts
│   │   └── projects/
│   │       ├── route.ts
│   │       └── [slug]/
│   │           └── route.ts
│   ├── diary/
│   │   ├── page.tsx              # 日记列表
│   │   └── [slug]/
│   │       └── page.tsx          # 日记详情
│   ├── error.tsx                 # 全局错误
│   ├── favicon.ico
│   ├── github/
│   │   └── page.tsx              # GitHub页面
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   ├── loading.tsx               # 全局加载
│   ├── login/
│   │   └── page.tsx              # 登录页面
│   ├── music/
│   │   └── page.tsx              # 音乐页面
│   ├── page.tsx                  # 首页
│   ├── projects/
│   │   ├── page.tsx              # 项目列表
│   │   └── [slug]/
│   │       ├── page.tsx          # 项目详情
│   │       └── __tests__/
│   │           └── page.test.tsx
│   └── register/
│       └── page.tsx              # 注册页面
├── components/                   # 组件
│   ├── home/
│   │   └── HomeClient.tsx
│   ├── layout/                   # 布局组件
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Rocket.tsx
│   │   ├── StarryBackground.tsx
│   │   └── ThemeProvider.tsx
│   ├── sections/                 # 页面区块
│   │   ├── DiaryCard.tsx
│   │   ├── DiaryList.tsx
│   │   ├── GitHubRepos.tsx
│   │   └── MusicPlayer.tsx
│   └── ui/                       # UI组件
│       ├── FadeIn.tsx
│       ├── MarkdownRenderer.tsx
│       ├── Skeleton.tsx
│       └── Toast.tsx
├── hooks/                        # 自定义Hooks
│   └── useTheme.ts
├── lib/                          # 工具库
│   ├── db/                       # 数据库相关
│   │   ├── __tests__/
│   │   │   ├── profile.test.ts
│   │   │   └── project.test.ts
│   │   ├── diary.ts
│   │   ├── github.ts
│   │   ├── index.ts
│   │   ├── music.ts
│   │   ├── profile.ts
│   │   └── project.ts
│   ├── utils/
│   │   └── api-response.ts
│   ├── validations/              # 验证
│   │   ├── auth.ts
│   │   └── index.ts
│   ├── auth.ts
│   └── prisma.ts
├── prisma/                       # Prisma配置
│   ├── migrations/               # 迁移文件
│   │   └── 20260602071457_init_mysql/
│   │       └── migration.sql
│   ├── migrations_backup/
│   ├── schema.prisma             # 数据模型
│   ├── seed.js
│   └── seed.ts
├── public/                       # 静态资源
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── scripts/                      # 脚本
│   ├── backup.sh
│   ├── destroy.sh
│   ├── logs.sh
│   ├── restore.sh
│   ├── setup.sh
│   ├── start.sh
│   └── stop.sh
├── types/                        # 类型定义
│   └── next-auth.d.ts
├── .dockerignore
├── .env                          # 环境变量
├── .env.example                  # 环境变量示例
├── .eslintrc.js                  # ESLint配置
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── fix-network.sh
├── jest.config.js
├── jest.setup.js
├── mock-prisma.js
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts            # Tailwind配置
├── test-db.js
├── test-mock.js
├── test-prisma.js
├── tsconfig.json                 # TypeScript配置
└── wan
```

### 2.2 文件组织原则

1. **就近原则**: 相关文件放在一起
2. **扁平原则**: 避免过深的嵌套
3. **单一职责**: 每个文件只做一件事
4. **命名清晰**: 文件名能表达内容

---

## 3. Git工作流

### 3.1 分支策略 (Git Flow)

```
main        ●────●────●────●────●────●
             │    │    │    │    │
develop      ●────●────●────●────●────●
             │         │         │
feature/*    ●────●    ●────●    ●────●
                  │         │
release/*         ●────●    ●────●
                       │
hotfix/*               ●────●
```

#### 分支说明

| 分支 | 用途 | 来源 | 合并到 |
|------|------|------|--------|
| main | 生产环境 | - | - |
| develop | 开发环境 | main | - |
| feature/* | 新功能 | develop | develop |
| release/* | 版本发布 | develop | main + develop |
| hotfix/* | 紧急修复 | main | main + develop |

### 3.2 提交规范 (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 类型说明

| 类型 | 说明 | 示例 |
|------|------|------|
| feat | 新功能 | `feat(auth): 添加用户登录功能` |
| fix | 修复 | `fix(api): 修复用户查询空指针` |
| docs | 文档 | `docs(readme): 更新部署说明` |
| style | 格式 | `style: 格式化代码` |
| refactor | 重构 | `refactor(user): 重构用户服务` |
| perf | 性能 | `perf(query): 优化数据库查询` |
| test | 测试 | `test(auth): 添加登录测试` |
| chore | 构建 | `chore: 更新依赖` |
| ci | CI/CD | `ci: 添加自动化部署` |
| revert | 回滚 | `revert: 回滚登录功能` |

#### 提交示例

```bash
# 新功能
git commit -m "feat(profile): 添加教育背景管理功能

- 实现教育背景的增删改查
- 添加时间轴组件
- 支持拖拽排序"

# 修复
git commit -m "fix(api): 修复项目列表分页错误

修复当page参数为0时的空指针异常
Closes #123"

# 文档
git commit -m "docs(deploy): 更新Docker部署说明

添加SSL证书配置步骤"
```

### 3.3 提交前检查

```bash
# 1. 代码格式化
npm run format

# 2. 代码检查
npm run lint

# 3. 类型检查
npm run type-check

# 4. 运行测试
npm run test

# 5. 构建检查
npm run build
```

---

## 4. 代码审查规范

### 4.1 审查清单

#### 功能性
- [ ] 代码实现了需求描述的功能
- [ ] 边界条件处理正确
- [ ] 错误处理完善
- [ ] 无明显的逻辑错误

#### 可读性
- [ ] 命名清晰有意义
- [ ] 函数长度适中 (≤50行)
- [ ] 注释清晰必要
- [ ] 代码结构清晰

#### 性能
- [ ] 无明显的性能问题
- [ ] 避免不必要的重渲染
- [ ] 数据库查询优化
- [ ] 资源释放正确

#### 安全性
- [ ] 输入验证完善
- [ ] 无SQL注入风险
- [ ] 无XSS风险
- [ ] 敏感信息未泄露

#### 测试
- [ ] 新功能有对应测试
- [ ] 测试覆盖关键路径
- [ ] 测试用例有意义

### 4.2 审查流程

1. **创建PR**: 从 feature 分支到 develop 分支
2. **填写描述**: 说明改动内容、原因、影响
3. **自动化检查**: CI/CD 运行测试和检查
4. **人工审查**: 至少1人审查通过
5. **合并**: 使用 Squash Merge 或 Rebase Merge

---

## 5. 测试规范

### 5.1 测试策略

| 类型 | 范围 | 工具 | 覆盖率 |
|------|------|------|--------|
| 单元测试 | 函数、组件 | Jest + React Testing Library | ≥80% |
| 集成测试 | API、数据库 | Jest + Supertest | ≥60% |
| E2E测试 | 完整流程 | Playwright | 核心流程 |

### 5.2 测试文件组织

```
__tests__/
├── components/
│   └── UserCard.test.tsx
├── lib/
│   └── db/
│       ├── profile.test.ts
│       └── project.test.ts
└── pages/
    └── projects/
        └── [slug]/
            └── page.test.tsx
```

### 5.3 测试示例

#### 组件测试

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '@/components/UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
  };

  it('应该渲染用户信息', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('zhangsan@example.com')).toBeInTheDocument();
  });

  it('点击编辑应该触发回调', () => {
    const onEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText('编辑'));
    expect(onEdit).toHaveBeenCalledWith('1');
  });
});
```

#### API测试

```typescript
import { createMocks } from 'node-mocks-http';
import { GET } from '@/app/api/profile/route';

describe('GET /api/profile', () => {
  it('应该返回用户档案', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await GET(req);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('data');
  });
});
```

---

## 6. 性能规范

### 6.1 前端性能

| 指标 | 目标 | 检测方式 |
|------|------|---------|
| FCP (首次内容绘制) | ≤1.8s | Lighthouse |
| LCP (最大内容绘制) | ≤2.5s | Lighthouse |
| TTI (可交互时间) | ≤3.8s | Lighthouse |
| CLS (累积布局偏移) | ≤0.1 | Lighthouse |
| 首屏加载 | ≤3s | 实际测试 |
| 完全加载 | ≤5s | 实际测试 |

### 6.2 优化策略

#### 图片优化
- 使用 Next.js Image 组件
- 使用 WebP 格式
- 设置合适的 sizes 属性
- 懒加载非首屏图片

#### 代码优化
- 代码分割 (dynamic import)
-  Tree Shaking
- 压缩和混淆
- 使用 CDN

#### 数据优化
- 合理使用 SSG/SSR
- API 响应压缩
- 数据库查询优化
- 使用索引优化查询

---

## 7. 安全规范

### 7.1 输入验证

```typescript
import { z } from 'zod';

// ✅ 正确：使用 Zod 验证
const userSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(8, '密码至少8位'),
  name: z.string().min(2, '名称至少2位').max(50, '名称最多50位'),
});

// 在API中使用
export async function POST(request: Request) {
  const body = await request.json();
  const result = userSchema.safeParse(body);
  
  if (!result.success) {
    return Response.json(
      { error: result.error.errors },
      { status: 422 }
    );
  }
  
  // 处理数据
}
```

### 7.2 XSS防护

```tsx
// ✅ 正确：React自动转义
<div>{userInput}</div>

// ✅ 正确：使用DOMPurify
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(htmlContent) 
}} />

// ❌ 错误：直接渲染HTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 7.3 CSRF防护

- 使用 NextAuth.js 内置 CSRF 保护
- API 路由验证来源
- 敏感操作使用 POST 方法

### 7.4 敏感信息

```typescript
// ❌ 错误：硬编码密钥
const SECRET = 'my-secret-key';

// ✅ 正确：使用环境变量
const SECRET = process.env.NEXTAUTH_SECRET;

// ❌ 错误：日志输出敏感信息
console.log('User password:', user.password);

// ✅ 正确：脱敏处理
console.log('User login:', { 
  id: user.id, 
  email: user.email 
});
```

---

## 8. 文档规范

### 8.1 代码注释

```typescript
/**
 * 获取用户信息
 * @param id - 用户ID
 * @returns 用户对象，如果未找到返回null
 * @throws {NotFoundError} 当用户不存在时
 * @example
 * const user = await getUserById('123');
 * if (user) {
 *   console.log(user.name);
 * }
 */
export async function getUserById(id: string): Promise<User | null> {
  // 实现
}

// 单行注释：解释为什么这么做
// 使用事务确保数据一致性
await prisma.$transaction([
  prisma.user.update({...}),
  prisma.profile.update({...}),
]);
```

### 8.2 README规范

每个模块/目录应包含 README.md：

```markdown
# 模块名称

## 功能说明
简要说明模块功能

## 文件结构
```
目录结构
```

## 使用方式
使用示例

## API接口
接口说明

## 注意事项
重要提示
```

---

## 9. 工具配置

### 9.1 ESLint配置

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': ['warn', { allow: ['error', 'warn'] }],
  },
};
```

### 9.2 Prettier配置

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### 9.3 TypeScript配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noE": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 10. 环境管理

### 10.1 环境变量

```bash
# .env.local (本地开发)
NODE_ENV=development
DATABASE_URL=mysql://myapp_user:myapp_password123@localhost:3306/myapp_db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret

# .env.production (生产环境)
NODE_ENV=production
DATABASE_URL=mysql://myapp_user:myapp_password123@db:3306/myapp_db
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=production-secret
```

### 10.2 环境检查

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  GITHUB_USERNAME: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

---

## 11. 主题开发规范

### 11.1 双主题实现

项目使用 Tailwind CSS 的 dark/light 模式实现双主题：

```css
/* globals.css */
:root {
  /* 宇宙主题变量 */
  --cosmic-dark: #0a0e27;
  --cosmic-purple: #8b5cf6;
  /* ... */
}

.light {
  /* 太阳主题变量 */
  --solar-light: #fef7ed;
  --solar-sun: #f59e0b;
  /* ... */
}
```

### 11.2 ThemeProvider 使用

```tsx
// components/layout/ThemeProvider.tsx
'use client';

import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'solar') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else if (savedTheme === 'cosmic') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.add('light');
      }
    }
  }, []);

  return <>{children}</>;
}
```

---

## 12. 数据库操作规范

### 12.1 Prisma 使用

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
```

### 12.2 迁移命令

```bash
# 创建新迁移
npx prisma migrate dev --name <migration_name>

# 部署迁移到生产环境
npx prisma migrate deploy

# 查看数据库状态
npx prisma studio
```

---

> **文档结束**
