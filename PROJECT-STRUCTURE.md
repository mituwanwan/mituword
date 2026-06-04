# 个人网站系统 - 项目结构规范

> **版本**: v1.0  
> **创建日期**: 2026-05-14  
> **适用范围**: 个人网站系统全栈应用

---

## 1. 项目根目录结构

```
个人网站/
├── docs/                          # 项目文档目录
│   ├── INDEX.md                   # 文档索引与导航
│   ├── README.md                  # 文档总览入口
│   ├── VERSIONING.md              # 文档版本控制规范
│   ├── 01-SDD/                    # 软件设计文档
│   ├── 02-API-Spec/               # API接口规范
│   ├── 03-UI-UX/                  # UI/UX设计系统
│   ├── 04-Deployment/             # 部署指南
│   ├── 05-Development-Guide/      # 开发规范
│   ├── 06-Testing/                # 测试策略
│   ├── 07-Maintenance/            # 维护指南
│   └── 08-Plans/                  # 实现计划
│
├── my-app/                        # Next.js应用主目录
│   ├── app/                       # Next.js App Router
│   │   ├── (routes)/              # 路由分组
│   │   ├── api/                   # API路由
│   │   ├── layout.tsx             # 根布局
│   │   ├── loading.tsx            # 全局加载
│   │   ├── error.tsx              # 全局错误
│   │   └── globals.css            # 全局样式
│   │
│   ├── components/                # 组件目录
│   │   ├── ui/                    # UI组件 (shadcn/ui)
│   │   ├── layout/                # 布局组件
│   │   ├── sections/              # 页面区块组件
│   │   └── common/                # 通用组件
│   │
│   ├── hooks/                     # 自定义Hooks
│   ├── lib/                       # 工具库
│   ├── types/                     # 类型定义
│   ├── prisma/                    # Prisma配置
│   ├── public/                    # 静态资源
│   ├── styles/                    # 样式文件
│   ├── tests/                     # 测试文件
│   ├── docker/                    # Docker配置
│   ├── nginx/                     # Nginx配置
│   ├── scripts/                   # 脚本文件
│   ├── .env                       # 环境变量
│   ├── .env.example               # 环境变量示例
│   ├── .eslintrc.js               # ESLint配置
│   ├── .prettierrc                # Prettier配置
│   ├── next.config.js             # Next.js配置
│   ├── tailwind.config.ts         # Tailwind配置
│   ├── tsconfig.json              # TypeScript配置
│   ├── jest.config.js             # Jest配置
│   └── package.json               # 依赖管理
│
├── .gitignore                     # Git忽略规则
└── README.md                      # 项目总览
```

---

## 2. 目录详细说明

### 2.1 文档目录 (docs/)

| 目录 | 用途 | 内容 |
|------|------|------|
| `01-SDD/` | 软件设计文档 | 系统架构、数据库设计、模块划分 |
| `02-API-Spec/` | API接口规范 | 接口定义、请求响应格式、错误码 |
| `03-UI-UX/` | 设计系统 | 色彩、字体、组件、动画规范 |
| `04-Deployment/` | 部署指南 | 服务器配置、Docker、Nginx |
| `05-Development-Guide/` | 开发规范 | 代码规范、Git工作流、命名约定 |
| `06-Testing/` | 测试策略 | 测试计划、用例、覆盖率要求 |
| `07-Maintenance/` | 维护指南 | 运维手册、故障排查、备份恢复 |
| `08-Plans/` | 实现计划 | 开发任务分解、里程碑、进度跟踪 |

### 2.2 应用目录 (my-app/)

#### app/ - Next.js App Router

```
app/
├── (routes)/                    # 路由分组 (无URL前缀)
│   ├── page.tsx                 # 首页
│   ├── about/                   # 关于页面
│   ├── projects/                # 项目展示
│   ├── music/                   # 音乐收藏
│   ├── diary/                   # 日记分享
│   └── github/                  # GitHub集成
├── api/                         # API路由
│   ├── auth/                    # 认证接口
│   ├── profile/                 # 个人介绍接口
│   ├── projects/                # 项目接口
│   ├── github/                  # GitHub同步接口
│   ├── music/                   # 音乐接口
│   ├── diaries/                 # 日记接口
│   └── upload/                  # 文件上传接口
├── layout.tsx                   # 根布局组件
├── loading.tsx                  # 全局加载状态
├── error.tsx                    # 全局错误处理
└── globals.css                  # 全局CSS样式
```

#### components/ - 组件目录

```
components/
├── ui/                          # shadcn/ui 组件
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── layout/                      # 布局组件
│   ├── Header.tsx               # 页头
│   ├── Footer.tsx               # 页脚
│   ├── Navigation.tsx           # 导航
│   └── Sidebar.tsx              # 侧边栏
├── sections/                    # 页面区块
│   ├── HeroSection.tsx          # 首页横幅
│   ├── ProfileSection.tsx       # 个人介绍
│   ├── ProjectCard.tsx          # 项目卡片
│   ├── ProjectList.tsx          # 项目列表
│   ├── MusicPlayer.tsx          # 音乐播放器
│   ├── PlaylistManager.tsx      # 播放列表管理
│   ├── DiaryCard.tsx            # 日记卡片
│   ├── DiaryList.tsx            # 日记列表
│   ├── GitHubRepos.tsx          # GitHub仓库展示
│   ├── EducationSection.tsx     # 教育背景
│   ├── ExperienceSection.tsx    # 工作经历
│   └── SkillsSection.tsx        # 技能展示
└── common/                      # 通用组件
    ├── Button.tsx               # 按钮
    ├── Input.tsx                # 输入框
    ├── Card.tsx                 # 卡片
    └── Modal.tsx                # 弹窗
```

#### 其他重要目录

| 目录 | 用途 | 关键文件 |
|------|------|---------|
| `hooks/` | 自定义React Hooks | `useAuth.ts`, `useFetch.ts`, `useMediaQuery.ts` |
| `lib/` | 工具库和配置 | `prisma.ts`, `utils.ts`, `api.ts`, `constants.ts` |
| `types/` | TypeScript类型定义 | `index.ts`, `user.ts`, `project.ts`, `music.ts` |
| `prisma/` | 数据库配置 | `schema.prisma`, `migrations/` |
| `public/` | 静态资源 | `images/`, `fonts/`, `favicon.ico` |
| `tests/` | 测试文件 | `unit/`, `integration/`, `e2e/` |
| `docker/` | Docker配置 | `Dockerfile`, `docker-compose.yml` |
| `nginx/` | Nginx配置 | `nginx.conf`, `conf.d/` |
| `scripts/` | 脚本文件 | `backup.sh`, `deploy.sh` |

---

## 3. 文件命名规范

### 3.1 通用规则

| 类型 | 命名规范 | 示例 |
|------|---------|------|
| **组件文件** | PascalCase.tsx | `ProjectCard.tsx`, `MusicPlayer.tsx` |
| **工具文件** | camelCase.ts | `utils.ts`, `api.ts` |
| **类型文件** | camelCase.ts | `user.ts`, `project.ts` |
| **样式文件** | kebab-case.css | `globals.css`, `variables.css` |
| **配置文件** | kebab-case.config.js | `next.config.js`, `jest.config.js` |
| **页面文件** | page.tsx | `app/about/page.tsx` |
| **布局文件** | layout.tsx | `app/layout.tsx` |
| **API路由** | route.ts | `app/api/profile/route.ts` |

### 3.2 特殊文件

| 文件 | 用途 | 位置 |
|------|------|------|
| `page.tsx` | Next.js页面组件 | `app/[route]/page.tsx` |
| `layout.tsx` | Next.js布局组件 | `app/layout.tsx` 或 `app/[route]/layout.tsx` |
| `loading.tsx` | Next.js加载状态 | `app/loading.tsx` |
| `error.tsx` | Next.js错误处理 | `app/error.tsx` |
| `route.ts` | Next.js API路由 | `app/api/[endpoint]/route.ts` |
| `middleware.ts` | Next.js中间件 | `app/middleware.ts` |

---

## 4. 导入路径规范

### 4.1 路径别名

```typescript
// tsconfig.json 配置
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"],
      "@/hooks/*": ["./hooks/*"]
    }
  }
}
```

### 4.2 导入示例

```typescript
// ✅ 正确: 使用路径别名
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { User } from "@/types/user";

// ❌ 错误: 使用相对路径
import { Button } from "../../../components/ui/button";
import { prisma } from "../../lib/prisma";
```

---

## 5. 环境变量规范

### 5.1 文件说明

| 文件 | 用途 | 是否提交Git |
|------|------|-----------|
| `.env` | 本地开发环境变量 | ❌ 否 |
| `.env.local` | 本地覆盖配置 | ❌ 否 |
| `.env.development` | 开发环境配置 | ❌ 否 |
| `.env.production` | 生产环境配置 | ❌ 否 |
| `.env.example` | 环境变量示例模板 | ✅ 是 |

### 5.2 必需环境变量

```env
# 数据库
DATABASE_URL="postgresql://postgres:password@localhost:5432/personal_website"

# 认证
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# GitHub集成
GITHUB_USERNAME="your-github-username"
GITHUB_TOKEN="your-github-token"

# 文件上传
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10485760"

# 应用配置
APP_URL="http://localhost:3000"
APP_NAME="个人网站"
```

---

## 6. 配置规范

### 6.1 核心配置文件

| 文件 | 用途 | 关键配置 |
|------|------|---------|
| `next.config.js` | Next.js配置 | output: 'standalone', images, rewrites |
| `tailwind.config.ts` | Tailwind配置 | theme, colors, plugins |
| `tsconfig.json` | TypeScript配置 | paths, strict, target |
| `jest.config.js` | Jest测试配置 | testEnvironment, setupFiles |
| `.eslintrc.js` | ESLint配置 | extends, rules, plugins |
| `.prettierrc` | Prettier配置 | semi, singleQuote, tabWidth |

---

## 7. Git忽略规则

### 7.1 .gitignore 配置

```gitignore
# 依赖
node_modules/
.pnp
.pnp.js

# 构建输出
.next/
out/
dist/
build/

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 编辑器
.vscode/
.idea/
*.swp
*.swo

# 操作系统
.DS_Store
Thumbs.db

# 上传文件
uploads/

# 测试覆盖率
coverage/

# Prisma
prisma/*.db
prisma/migrations/*/migration_lock.toml
```

---

## 8. 项目初始化流程

### 8.1 开发环境搭建

```bash
# 1. 克隆项目
git clone <repository-url>
cd 个人网站/my-app

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写必要配置

# 4. 初始化数据库
npx prisma migrate dev
npx prisma generate

# 5. 启动开发服务器
npm run dev
```

### 8.2 目录创建命令

```bash
# 创建组件目录
mkdir -p components/{ui,layout,sections,common}

# 创建页面目录
mkdir -p app/{about,projects,music,diary,github}
mkdir -p app/api/{auth,profile,projects,github,music,diaries,upload}

# 创建其他目录
mkdir -p hooks lib types prisma/migrations public/images
mkdir -p tests/{unit,integration,e2e}
mkdir -p docker nginx/conf.d scripts
```

---

## 9. 文档与代码关联

### 9.1 文档到代码的映射

| 文档 | 关联代码目录 | 关联文件 |
|------|------------|---------|
| [SDD - 数据库设计](docs/01-SDD/01-Software-Design-Document.md#4-数据库设计) | `prisma/` | `schema.prisma` |
| [SDD - API设计](docs/01-SDD/01-Software-Design-Document.md#5-api接口规范) | `app/api/` | `*/route.ts` |
| [API规范](docs/02-API-Spec/01-API-Specification.md) | `app/api/` | `*/route.ts` |
| [UI/UX设计](docs/03-UI-UX/01-Design-System.md) | `components/`, `app/` | `*.tsx`, `*.css` |
| [部署指南](docs/04-Deployment/01-Deployment-Guide.md) | `docker/`, `nginx/` | `Dockerfile`, `nginx.conf` |
| [测试策略](docs/06-Testing/01-Testing-Strategy.md) | `tests/` | `*.test.ts`, `*.spec.ts` |

---

## 文档变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-05-14 | 初始版本，建立项目结构规范 | 系统架构师 |

---

> **文档结束**
