# 个人网站系统 - 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个功能完善的个人网站系统，包含个人介绍、项目展示、GitHub集成、音乐收藏、日记分享等核心模块。

**Architecture:** 使用 Next.js 14+ App Router 全栈架构，Prisma ORM + PostgreSQL 数据层，Tailwind CSS + shadcn/ui 样式层，Docker 容器化部署到阿里云ECS。

**Tech Stack:** Next.js 14, React 18, TypeScript 5, Tailwind CSS 3.4, shadcn/ui, Prisma 5, PostgreSQL 15, NextAuth.js 5, Docker

---

## 文件结构规划

```
my-app/
├── app/                          # Next.js App Router
│   ├── (routes)/                 # 路由分组
│   │   ├── page.tsx              # 首页
│   │   ├── about/
│   │   │   └── page.tsx          # 关于页面
│   │   ├── projects/
│   │   │   ├── page.tsx          # 项目列表
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 项目详情
│   │   ├── music/
│   │   │   └── page.tsx          # 音乐页面
│   │   ├── diary/
│   │   │   ├── page.tsx          # 日记列表
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 日记详情
│   │   └── github/
│   │       └── page.tsx          # GitHub页面
│   ├── api/                      # API路由
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── profile/
│   │   │   └── route.ts
│   │   ├── projects/
│   │   │   └── route.ts
│   │   ├── github/
│   │   │   └── route.ts
│   │   ├── music/
│   │   │   └── route.ts
│   │   ├── diaries/
│   │   │   └── route.ts
│   │   └── upload/
│   │       └── route.ts
│   ├── layout.tsx                # 根布局
│   ├── loading.tsx               # 全局加载
│   ├── error.tsx                 # 全局错误
│   └── globals.css               # 全局样式
├── components/                   # 组件
│   ├── ui/                       # UI组件 (shadcn)
│   ├── layout/                   # 布局组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Navigation.tsx
│   ├── sections/                 # 页面区块
│   │   ├── HeroSection.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── MusicPlayer.tsx
│   │   └── DiaryCard.tsx
│   └── common/                   # 通用组件
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── Modal.tsx
├── hooks/                        # 自定义Hooks
│   ├── useAuth.ts
│   ├── useFetch.ts
│   └── useMediaQuery.ts
├── lib/                          # 工具库
│   ├── utils.ts                  # 通用工具
│   ├── prisma.ts                 # Prisma客户端
│   ├── api.ts                    # API请求
│   └── constants.ts              # 常量
├── types/                        # 类型定义
│   ├── index.ts
│   ├── user.ts
│   ├── project.ts
│   └── music.ts
├── prisma/                       # Prisma配置
│   ├── schema.prisma             # 数据模型
│   └── migrations/               # 迁移文件
├── public/                       # 静态资源
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
├── styles/                       # 样式文件
│   └── variables.css
├── tests/                        # 测试文件
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                         # 项目文档
├── docker/                       # Docker配置
│   ├── Dockerfile
│   └── docker-compose.yml
├── nginx/                        # Nginx配置
│   └── nginx.conf
├── scripts/                      # 脚本
│   ├── backup.sh
│   └── deploy.sh
├── .env                          # 环境变量
├── .env.example                  # 环境变量示例
├── .eslintrc.js                  # ESLint配置
├── .prettierrc                   # Prettier配置
├── next.config.js                # Next.js配置
├── tailwind.config.ts            # Tailwind配置
├── tsconfig.json                 # TypeScript配置
├── jest.config.js                # Jest配置
└── package.json                  # 依赖
```

---

## 阶段一: 项目初始化 (Phase 1)

### Task 1: 初始化 Next.js 项目

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `.eslintrc.js`
- Create: `.prettierrc`
- Create: `.gitignore`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

- [ ] **Step 1: 创建 Next.js 项目**

```bash
cd e:\桌面\个人网站
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

- [ ] **Step 2: 安装 shadcn/ui**

```bash
cd my-app
npx shadcn-ui@latest init --yes --template next --base-color slate
```

- [ ] **Step 3: 安装核心依赖**

```bash
npm install @prisma/client next-auth bcryptjs zod react-hook-form @hookform/resolvers
npm install -D prisma @types/bcryptjs
```

- [ ] **Step 4: 配置 Tailwind 深色主题**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

- [ ] **Step 5: 配置全局样式**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 47% 4%;
    --foreground: 210 40% 98%;
    --card: 222 47% 8%;
    --card-foreground: 210 40% 98%;
    --popover: 222 47% 8%;
    --popover-foreground: 210 40% 98%;
    --primary: 217 91% 60%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 217 91% 60%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 6: 配置根布局**

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "个人网站",
  description: "我的个人网站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: 提交**

```bash
git add .
git commit -m "chore: 初始化 Next.js 项目"
```

---

### Task 2: 配置 Prisma 数据库

**Files:**
- Create: `prisma/schema.prisma`
- Create: `.env`
- Create: `.env.example`
- Create: `lib/prisma.ts`

- [ ] **Step 1: 初始化 Prisma**

```bash
npx prisma init
```

- [ ] **Step 2: 配置数据库连接**

```env
# .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/personal_website"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

- [ ] **Step 3: 创建 Prisma Schema**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  password      String?
  image         String?
  role          UserRole  @default(ADMIN)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  profile       Profile?
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Profile {
  id        String   @id @default(uuid())
  userId    String   @unique
  fullName  String
  title     String
  bio       String   @db.Text
  avatar    String?
  location  String?
  phone     String?
  email     String?
  website   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  education Education[]
  experience WorkExperience[]
  skills    Skill[]
  socialLinks SocialLink[]
}

model Education {
  id          String   @id @default(uuid())
  profileId   String
  school      String
  major       String
  degree      Degree
  startDate   DateTime
  endDate     DateTime?
  description String?  @db.Text
  order       Int      @default(0)
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
}

model WorkExperience {
  id          String   @id @default(uuid())
  profileId   String
  company     String
  position    String
  startDate   DateTime
  endDate     DateTime?
  isCurrent   Boolean  @default(false)
  description String?  @db.Text
  order       Int      @default(0)
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
}

model Skill {
  id          String      @id @default(uuid())
  profileId   String
  name        String
  category    SkillCategory
  proficiency Int
  icon        String?
  order       Int         @default(0)
  profile     Profile     @relation(fields: [profileId], references: [id], onDelete: Cascade)
}

model SocialLink {
  id        String  @id @default(uuid())
  profileId String
  platform  String
  url       String
  icon      String?
  order     Int     @default(0)
  profile   Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
}

model Project {
  id          String           @id @default(uuid())
  title       String
  slug        String           @unique
  description String           @db.Text
  categoryId  String?
  demoUrl     String?
  repoUrl     String?
  startDate   DateTime?
  endDate     DateTime?
  status      ProjectStatus    @default(COMPLETED)
  featured    Boolean          @default(false)
  thumbnail   String?
  views       Int              @default(0)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  category    ProjectCategory? @relation(fields: [categoryId], references: [id])
  tags        ProjectTagRelation[]
  images      ProjectImage[]
}

model ProjectCategory {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  color       String?
  order       Int       @default(0)
  projects    Project[]
}

model ProjectTag {
  id        String               @id @default(uuid())
  name      String               @unique
  color     String?
  projects  ProjectTagRelation[]
}

model ProjectTagRelation {
  id        String     @id @default(uuid())
  projectId String
  tagId     String
  project   Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  tag       ProjectTag @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([projectId, tagId])
}

model ProjectImage {
  id        String  @id @default(uuid())
  projectId String
  url       String
  alt       String?
  order     Int     @default(0)
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

model GitHubRepo {
  id          String   @id @default(uuid())
  repoId      Int      @unique
  name        String
  fullName    String
  description String?  @db.Text
  htmlUrl     String
  stars       Int      @default(0)
  forks       Int      @default(0)
  watchers    Int      @default(0)
  language    String?
  languages   Json?
  topics      Json?
  createdAt   DateTime
  updatedAt   DateTime
  pushedAt    DateTime?
  syncAt      DateTime @default(now())
}

model GitHubSyncLog {
  id         String     @id @default(uuid())
  syncTime   DateTime   @default(now())
  status     SyncStatus
  reposCount Int        @default(0)
  errorMsg   String?    @db.Text
}

model MusicTrack {
  id          String   @id @default(uuid())
  title       String
  artist      String
  album       String?
  releaseDate DateTime?
  genre       String?
  playUrl     String?
  coverUrl    String?
  duration    Int?
  copyright   String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  playlists   PlaylistTrack[]
}

model MusicPlaylist {
  id          String          @id @default(uuid())
  name        String
  description String?         @db.Text
  coverUrl    String?
  order       Int             @default(0)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  tracks      PlaylistTrack[]
}

model PlaylistTrack {
  id         String        @id @default(uuid())
  playlistId String
  trackId    String
  order      Int           @default(0)
  playlist   MusicPlaylist @relation(fields: [playlistId], references: [id], onDelete: Cascade)
  track      MusicTrack    @relation(fields: [trackId], references: [id], onDelete: Cascade)

  @@unique([playlistId, trackId])
}

model Diary {
  id          String         @id @default(uuid())
  title       String
  slug        String         @unique
  content     String         @db.Text
  excerpt     String?        @db.Text
  status      DiaryStatus    @default(DRAFT)
  categoryId  String?
  coverImage  String?
  views       Int            @default(0)
  likes       Int            @default(0)
  isPinned    Boolean        @default(false)
  publishedAt DateTime?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  category    DiaryCategory? @relation(fields: [categoryId], references: [id])
  tags        DiaryTagRelation[]
  comments    Comment[]
  likesList   Like[]
}

model DiaryCategory {
  id          String  @id @default(uuid())
  name        String
  slug        String  @unique
  description String?
  color       String?
  order       Int     @default(0)
  diaries     Diary[]
}

model DiaryTag {
  id       String             @id @default(uuid())
  name     String             @unique
  color    String?
  diaries  DiaryTagRelation[]
}

model DiaryTagRelation {
  id      String   @id @default(uuid())
  diaryId String
  tagId   String
  diary   Diary    @relation(fields: [diaryId], references: [id], onDelete: Cascade)
  tag     DiaryTag @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([diaryId, tagId])
}

model Comment {
  id            String        @id @default(uuid())
  diaryId       String
  parentId      String?
  authorName    String
  authorEmail   String
  authorWebsite String?
  content       String        @db.Text
  status        CommentStatus @default(PENDING)
  ipAddress     String?
  userAgent     String?
  createdAt     DateTime      @default(now())
  diary         Diary         @relation(fields: [diaryId], references: [id], onDelete: Cascade)
  parent        Comment?      @relation("CommentReplies", fields: [parentId], references: [id])
  replies       Comment[]     @relation("CommentReplies")
}

model Like {
  id        String   @id @default(uuid())
  diaryId   String
  ipAddress String
  createdAt DateTime @default(now())
  diary     Diary    @relation(fields: [diaryId], references: [id], onDelete: Cascade)

  @@unique([diaryId, ipAddress])
}

enum UserRole {
  ADMIN
  USER
}

enum Degree {
  BACHELOR
  MASTER
  PHD
  OTHER
}

enum SkillCategory {
  TECHNICAL
  SOFT
}

enum ProjectStatus {
  COMPLETED
  IN_PROGRESS
  PLANNED
}

enum SyncStatus {
  SUCCESS
  FAIL
}

enum DiaryStatus {
  DRAFT
  PUBLISHED
}

enum CommentStatus {
  PENDING
  APPROVED
  REJECTED
}
```

- [ ] **Step 4: 创建 Prisma 客户端**

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

- [ ] **Step 5: 运行数据库迁移**

```bash
npx prisma migrate dev --name init
```

- [ ] **Step 6: 生成 Prisma 客户端**

```bash
npx prisma generate
```

- [ ] **Step 7: 提交**

```bash
git add .
git commit -m "feat: 配置 Prisma 数据库"
```

---

### Task 3: 配置 NextAuth.js 认证

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `types/next-auth.d.ts`

- [ ] **Step 1: 安装依赖**

```bash
npm install next-auth bcryptjs
npm install -D @types/bcryptjs
```

- [ ] **Step 2: 创建认证配置**

```typescript
// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
```

- [ ] **Step 3: 创建 API 路由**

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

- [ ] **Step 4: 扩展类型**

```typescript
// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
```

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat: 配置 NextAuth.js 认证"
```

---

## 阶段二: 核心模块开发 (Phase 2)

### Task 4: 个人介绍模块

**Files:**
- Create: `app/api/profile/route.ts`
- Create: `app/api/profile/education/route.ts`
- Create: `app/api/profile/experience/route.ts`
- Create: `app/api/profile/skills/route.ts`
- Create: `app/api/profile/social/route.ts`
- Create: `app/about/page.tsx`
- Create: `components/sections/ProfileSection.tsx`
- Create: `components/sections/EducationSection.tsx`
- Create: `components/sections/ExperienceSection.tsx`
- Create: `components/sections/SkillsSection.tsx`

- [ ] **Step 1: 创建个人介绍 API**

```typescript
// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().min(2).max(50),
  title: z.string().min(2).max(100),
  bio: z.string().max(300),
  avatar: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
});

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      include: {
        education: {
          orderBy: { startDate: "desc" },
        },
        experience: {
          orderBy: { startDate: "desc" },
        },
        skills: {
          orderBy: { order: "asc" },
        },
        socialLinks: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: profile });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    const profile = await prisma.profile.upsert({
      where: { id: body.id || "" },
      update: validatedData,
      create: validatedData,
    });

    return NextResponse.json({ data: profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 创建个人介绍页面**

```tsx
// app/about/page.tsx
import { ProfileSection } from "@/components/sections/ProfileSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { SkillsSection } from "@/components/sections/SkillsSection";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileSection />
      <EducationSection />
      <ExperienceSection />
      <SkillsSection />
    </div>
  );
}
```

- [ ] **Step 3: 创建个人介绍组件**

```tsx
// components/sections/ProfileSection.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Profile {
  fullName: string;
  title: string;
  bio: string;
  avatar?: string;
  location?: string;
  email?: string;
  website?: string;
}

export function ProfileSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setProfile(data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!profile) {
    return <div>暂无个人介绍</div>;
  }

  return (
    <section className="py-12">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {profile.avatar && (
          <div className="relative w-48 h-48 rounded-full overflow-hidden">
            <Image
              src={profile.avatar}
              alt={profile.fullName}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2">{profile.fullName}</h1>
          <p className="text-xl text-muted-foreground mb-4">{profile.title}</p>
          <p className="text-muted-foreground max-w-2xl">{profile.bio}</p>
          <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
            {profile.location && (
              <span className="text-sm text-muted-foreground">
                📍 {profile.location}
              </span>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="text-sm text-primary hover:underline"
              >
                ✉️ {profile.email}
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                🌐 {profile.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "feat: 实现个人介绍模块"
```

---

### Task 5: 项目展示模块

**Files:**
- Create: `app/api/projects/route.ts`
- Create: `app/projects/page.tsx`
- Create: `app/projects/[slug]/page.tsx`
- Create: `components/sections/ProjectCard.tsx`
- Create: `components/sections/ProjectList.tsx`

- [ ] **Step 1: 创建项目 API**

```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    const where: any = {};

    if (category) {
      where.category = { slug: category };
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          images: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      data: {
        items: projects,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
          hasNext: page * pageSize < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 创建项目列表页面**

```tsx
// app/projects/page.tsx
import { ProjectList } from "@/components/sections/ProjectList";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">项目展示</h1>
      <ProjectList />
    </div>
  );
}
```

- [ ] **Step 3: 创建项目列表组件**

```tsx
// components/sections/ProjectList.tsx
"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  category?: {
    name: string;
    color?: string;
  };
  tags: {
    tag: {
      name: string;
      color?: string;
    };
  }[];
  demoUrl?: string;
  repoUrl?: string;
  views: number;
  createdAt: string;
}

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data.data.items);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="搜索项目..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-border bg-background"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 创建项目卡片组件**

```tsx
// components/sections/ProjectCard.tsx
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail?: string;
    category?: {
      name: string;
      color?: string;
    };
    tags: {
      tag: {
        name: string;
        color?: string;
      };
    }[];
    demoUrl?: string;
    repoUrl?: string;
    views: number;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
      {project.thumbnail && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          {project.category && (
            <span
              className="px-2 py-1 text-xs rounded-full"
              style={{ backgroundColor: project.category.color || "#3b82f6" }}
            >
              {project.category.name}
            </span>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2">
          <Link href={`/projects/${project.slug}`} className="hover:text-primary">
            {project.title}
          </Link>
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(({ tag }) => (
            <span
              key={tag.name}
              className="px-2 py-1 text-xs rounded-md bg-secondary"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              演示
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              源码
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat: 实现项目展示模块"
```

---

## 阶段三: 扩展模块开发 (Phase 3)

### Task 6: GitHub集成模块

**Files:**
- Create: `app/api/github/route.ts`
- Create: `app/github/page.tsx`
- Create: `components/sections/GitHubRepos.tsx`

- [ ] **Step 1: 创建 GitHub API**

```typescript
// app/api/github/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const GITHUB_API = "https://api.github.com";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const language = searchParams.get("language");
    const sortBy = searchParams.get("sortBy") || "updated";

    const where: any = {};
    if (language) {
      where.language = language;
    }

    const [repos, total] = await Promise.all([
      prisma.gitHubRepo.findMany({
        where,
        orderBy: { [sortBy]: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.gitHubRepo.count({ where }),
    ]);

    return NextResponse.json({
      data: {
        items: repos,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const username = process.env.GITHUB_USERNAME;
    const token = process.env.GITHUB_TOKEN;

    if (!username) {
      return NextResponse.json(
        { error: "GitHub username not configured" },
        { status: 500 }
      );
    }

    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers.Authorization = `token ${token}`;
    }

    const response = await fetch(
      `${GITHUB_API}/users/${username}/repos?sort=updated&per_page=100`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    // 同步到数据库
    for (const repo of repos) {
      await prisma.gitHubRepo.upsert({
        where: { repoId: repo.id },
        update: {
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          htmlUrl: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          watchers: repo.watchers_count,
          language: repo.language,
          topics: repo.topics,
          updatedAt: new Date(repo.updated_at),
          pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
          syncAt: new Date(),
        },
        create: {
          repoId: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          htmlUrl: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          watchers: repo.watchers_count,
          language: repo.language,
          topics: repo.topics,
          createdAt: new Date(repo.created_at),
          updatedAt: new Date(repo.updated_at),
          pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
        },
      });
    }

    await prisma.gitHubSyncLog.create({
      data: {
        status: "SUCCESS",
        reposCount: repos.length,
      },
    });

    return NextResponse.json({
      data: {
        syncedCount: repos.length,
      },
    });
  } catch (error) {
    await prisma.gitHubSyncLog.create({
      data: {
        status: "FAIL",
        errorMsg: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json(
      { error: "Failed to sync repositories" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 创建 GitHub 页面**

```tsx
// app/github/page.tsx
import { GitHubRepos } from "@/components/sections/GitHubRepos";

export default function GitHubPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">GitHub 仓库</h1>
      <GitHubRepos />
    </div>
  );
}
```

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: 实现 GitHub 集成模块"
```

---

### Task 7: 音乐收藏模块

**Files:**
- Create: `app/api/music/route.ts`
- Create: `app/music/page.tsx`
- Create: `components/sections/MusicPlayer.tsx`
- Create: `components/sections/PlaylistManager.tsx`

- [ ] **Step 1: 创建音乐 API**

```typescript
// app/api/music/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "tracks";

    if (type === "tracks") {
      const tracks = await prisma.musicTrack.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ data: tracks });
    }

    if (type === "playlists") {
      const playlists = await prisma.musicPlaylist.findMany({
        include: {
          tracks: {
            include: {
              track: true,
            },
            orderBy: { order: "asc" },
          },
        },
      });
      return NextResponse.json({ data: playlists });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch music data" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 创建音乐播放器组件**

```tsx
// components/sections/MusicPlayer.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  playUrl?: string;
  duration?: number;
}

interface MusicPlayerProps {
  tracks: Track[];
}

export function MusicPlayer({ tracks }: MusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);

    if (audioRef.current) {
      audioRef.current.src = track.playUrl || "";
      audioRef.current.play();
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextTrack = tracks[currentIndex + 1] || tracks[0];
    playTrack(nextTrack);
  };

  const playPrev = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevTrack = tracks[currentIndex - 1] || tracks[tracks.length - 1];
    playTrack(prevTrack);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={playNext}
      />
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {currentTrack?.coverUrl && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{currentTrack?.title || "未播放"}</p>
            <p className="text-sm text-muted-foreground truncate">
              {currentTrack?.artist || "选择一首歌曲"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={playPrev}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={playNext}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-2 w-32">
            <Volume2 className="w-4 h-4" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1"
            />
          </div>
          <div className="hidden md:block text-sm text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(currentTrack?.duration || 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: 实现音乐收藏模块"
```

---

### Task 8: 日记分享模块

**Files:**
- Create: `app/api/diaries/route.ts`
- Create: `app/diary/page.tsx`
- Create: `app/diary/[slug]/page.tsx`
- Create: `components/sections/DiaryCard.tsx`
- Create: `components/sections/DiaryList.tsx`

- [ ] **Step 1: 创建日记 API**

```typescript
// app/api/diaries/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "PUBLISHED";

    const where: any = { status };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const [diaries, total] = await Promise.all([
      prisma.diary.findMany({
        where,
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: [
          { isPinned: "desc" },
          { publishedAt: "desc" },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.diary.count({ where }),
    ]);

    return NextResponse.json({
      data: {
        items: diaries,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch diaries" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 创建日记列表页面**

```tsx
// app/diary/page.tsx
import { DiaryList } from "@/components/sections/DiaryList";

export default function DiaryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">日记分享</h1>
      <DiaryList />
    </div>
  );
}
```

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: 实现日记分享模块"
```

---

## 阶段四: 完善与优化 (Phase 4)

### Task 9: 全局布局与导航

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/layout/Header.tsx`
- Create: `components/layout/Footer.tsx`
- Create: `components/layout/Navigation.tsx`

- [ ] **Step 1: 创建导航组件**

```tsx
// components/layout/Navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, FolderGit2, Music, BookOpen, Github } from "lucide-react";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/about", label: "关于", icon: User },
  { href: "/projects", label: "项目", icon: FolderGit2 },
  { href: "/github", label: "GitHub", icon: Github },
  { href: "/music", label: "音乐", icon: Music },
  { href: "/diary", label: "日记", icon: BookOpen },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: 创建头部组件**

```tsx
// components/layout/Header.tsx
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold">
          个人网站
        </a>
        <Navigation />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: 创建页脚组件**

```tsx
// components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>© 2026 个人网站. All rights reserved.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: 更新根布局**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "个人网站",
  description: "我的个人网站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat: 实现全局布局与导航"
```

---

### Task 10: Docker 配置

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `nginx/nginx.conf`
- Create: `nginx/conf.d/default.conf`

- [ ] **Step 1: 创建 Dockerfile**

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
RUN mkdir -p /app/uploads
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

- [ ] **Step 2: 创建 Docker Compose**

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: personal-website-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    volumes:
      - ./uploads:/app/uploads
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    container_name: personal-website-db
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=personal_website
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: personal-website-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: 配置 Docker 部署"
```

---

## 阶段五: 测试与部署 (Phase 5)

### Task 11: 配置测试

**Files:**
- Create: `jest.config.js`
- Create: `jest.setup.js`
- Create: `playwright.config.ts`
- Create: `tests/unit/utils.test.ts`

- [ ] **Step 1: 安装测试依赖**

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
npm install -D @playwright/test
```

- [ ] **Step 2: 配置 Jest**

```javascript
// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/tests/**/*.test.tsx"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
```

- [ ] **Step 3: 配置 Playwright**

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
```

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "feat: 配置测试环境"
```

---

## 总结

本实现计划将项目分为5个阶段，共11个任务：

| 阶段 | 任务 | 说明 |
|------|------|------|
| Phase 1 | Task 1-3 | 项目初始化、数据库配置、认证系统 |
| Phase 2 | Task 4-5 | 个人介绍模块、项目展示模块 |
| Phase 3 | Task 6-8 | GitHub集成、音乐收藏、日记分享 |
| Phase 4 | Task 9-10 | 全局布局、Docker配置 |
| Phase 5 | Task 11 | 测试配置 |

每个任务都包含详细的步骤和代码示例，确保开发过程可控可追踪。

---

> **计划完成**