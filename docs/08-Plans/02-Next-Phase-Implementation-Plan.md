# 迷途世界 (MituWorld) - 下一阶段实施规划

> **文档版本**: v1.0
> **创建日期**: 2026-06-05
> **计划周期**: 2026-06-05 ~ 2026-06-23（共3周）
> **目标里程碑**: M4 优化完成（2026-06-16）→ M5 生产部署（2026-06-23）
> **文档状态**: 待审批

---

## 目录

1. [执行摘要](#一执行摘要)
2. [任务目标与验收标准](#二任务目标与验收标准)
3. [功能模块划分](#三功能模块划分)
4. [开发步骤与时间节点](#四开发步骤与时间节点)
5. [资源与技术栈清单](#五资源与技术栈清单)
6. [风险评估及应对方案](#六风险评估及应对方案)
7. [质量保障措施](#七质量保障措施)
8. [测试策略与验收流程](#八测试策略与验收流程)
9. [可追踪性机制](#九可追踪性机制)
10. [可调整性预案](#十可调整性预案)

---

## 一、执行摘要

### 1.1 当前项目状态

| 维度 | 状态 | 完成度 |
|------|------|--------|
| 后端/API 层 | 已完成 | 100% |
| 数据库模型 | 已完成 | 100% |
| 前端页面渲染 | 基本完成 | 90% |
| 设计系统升级 | 刚完成 | 100% |
| 数据接入完整性 | 部分完成 | 75% |
| 测试覆盖 | 严重不足 | 30% |
| 生产部署 | 未开始 | 0% |
| **项目总完成度** | — | **约 85%** |

### 1.2 本次规划范围

本规划覆盖从 **2026-06-05 至 2026-06-23** 共 **3 周**的开发周期，目标是在原计划 M4（优化完成）和 M5（生产部署）里程碑基础上，完成以下核心任务：

1. **数据层完善** — 消除 mock 数据，所有页面接入真实数据库
2. **管理后台建设** — 统一的内容管理界面（CRUD）
3. **测试体系构建** — 单元测试覆盖率提升至 60%+，E2E 测试覆盖核心流程
4. **性能优化** — Lighthouse 核心指标达标（FCP < 1.8s, LCP < 2.5s, TTI < 3.8s）
5. **生产部署** — 阿里云 ECS + Docker + Nginx + HTTPS 上线

### 1.3 预期交付成果

- 一个功能完整、数据真实、测试覆盖、性能达标、已上线的个人网站系统
- 完整的测试报告和部署文档
- 可维护的代码库和自动化部署流水线

---

## 二、任务目标与验收标准

### 2.1 总体目标

在 3 周内完成项目从"开发完成"到"生产就绪"的过渡，确保系统具备真实数据展示、管理后台、自动化测试、性能优化和生产部署能力。

### 2.2 分阶段目标与验收标准

#### 阶段 A：数据真实化与管理后台（Week 1，6.5 ~ 6.11）

| 任务 | 目标描述 | 验收标准（Definition of Done） |
|------|---------|------------------------------|
| **A1. 首页数据接入** | 将首页精选项目和最新日记从 mock 数据改为真实数据库查询 | 1. `HomeClient.tsx` 使用 `fetch('/api/projects?featured=true&limit=3')` 和 `fetch('/api/diaries?limit=2')` 获取数据<br>2. 空数据时显示友好提示，不报错<br>3. 加载状态使用 Skeleton 骨架屏<br>4. 服务端渲染（SSR）首屏数据 |
| **A2. 日记相关推荐** | 实现日记详情页的同分类相关推荐 | 1. 在 `diary/[slug]/page.tsx` 中添加 Prisma 查询：`findMany({ where: { categoryId, NOT: { id } }, take: 3 })`<br>2. 有推荐时显示卡片列表，无推荐时显示友好提示<br>3. 推荐条目包含标题、摘要、日期 |
| **A3. 管理后台框架** | 建设 `/admin` 路由组，包含统一布局、侧边栏、权限守卫 | 1. 新建 `app/admin/layout.tsx`（含侧边栏 + 顶部栏）<br>2. 未登录用户访问 `/admin/*` 自动跳转 `/login`<br>3. 非 ADMIN 角色返回 403<br>4. 侧边栏包含各模块管理入口 |
| **A4. 项目管理后台** | 项目 CRUD 管理界面 | 1. `/admin/projects` 列表页（分页/搜索/状态筛选）<br>2. `/admin/projects/new` 创建页<br>3. `/admin/projects/[id]/edit` 编辑页<br>4. 删除确认对话框<br>5. 图片上传（使用 `/api/upload`） |
| **A5. 日记管理后台** | 日记 CRUD 管理界面 | 1. `/admin/diaries` 列表页（分页/搜索/分类筛选）<br>2. `/admin/diaries/new` 创建页（Markdown 编辑器）<br>3. `/admin/diaries/[id]/edit` 编辑页<br>4. 支持置顶/取消置顶操作 |

#### 阶段 B：测试体系建设（Week 2，6.12 ~ 6.16）

| 任务 | 目标描述 | 验收标准 |
|------|---------|---------|
| **B1. 单元测试补充** | 为核心工具函数和组件编写单元测试，覆盖率 ≥ 60% | 1. `lib/utils.ts` 工具函数 100% 覆盖<br>2. `lib/db/*.ts` 数据访问层关键函数覆盖<br>3. `components/ui/` 通用组件渲染测试<br>4. `hooks/` 自定义 Hooks 测试<br>5. `npm run test:coverage` 报告显示总体 ≥ 60% |
| **B2. API 集成测试** | 测试关键 API 路由的请求/响应 | 1. `profile/route.ts` GET/PUT 测试<br>2. `projects/route.ts` GET/POST 测试<br>3. `diaries/route.ts` 评论/点赞测试<br>4. 使用 `@testing-library/react` + `msw` 模拟请求 |
| **B3. E2E 测试配置** | 配置 Playwright，覆盖核心用户流程 | 1. `playwright.config.ts` 配置完成<br>2. 测试用例：首页 → 项目列表 → 项目详情 → 返回<br>3. 测试用例：主题切换流程<br>4. 测试用例：登录流程（成功/失败）<br>5. CI 模式运行通过 |
| **B4. 性能审计与优化** | Lighthouse 性能评分 ≥ 90 | 1. FCP（首次内容绘制）< 1.8s<br>2. LCP（最大内容绘制）< 2.5s<br>3. TTI（可交互时间）< 3.8s<br>4. CLS（累积布局偏移）< 0.1<br>5. 构建产物分析：`@next/bundle-analyzer` 报告 |

#### 阶段 C：生产部署与收尾（Week 3，6.17 ~ 6.23）

| 任务 | 目标描述 | 验收标准 |
|------|---------|---------|
| **C1. 生产环境配置** | 准备生产环境变量和数据库迁移 | 1. `.env.production` 配置完整（DATABASE_URL/NEXTAUTH_URL/NEXTAUTH_SECRET/GITHUB_TOKEN）<br>2. SQLite → MySQL 迁移脚本验证通过<br>3. `prisma migrate deploy` 在生产数据库成功执行 |
| **C2. Docker 镜像构建** | 构建可运行的 Docker 镜像 | 1. `docker build -t mituworld .` 成功<br>2. `docker-compose up` 本地验证通过<br>3. 镜像大小 < 500MB<br>4. 健康检查端点 `/api/health` 返回 200 |
| **C3. 阿里云部署** | 部署到阿里云 ECS 并配置域名/SSL | 1. ECS 实例运行 Docker<br>2. Nginx 反向代理配置完成<br>3. Let's Encrypt SSL 证书自动续期<br>4. 域名解析指向 ECS 公网 IP<br>5. HTTPS 访问正常，HSTS 启用 |
| **C4. 监控与日志** | 配置基础监控和日志收集 | 1. Docker 容器日志持久化<br>2. Nginx access/error 日志配置<br>3. 基础健康监控（可用性检查）<br>4. 数据库备份脚本（每日自动） |
| **C5. 项目收尾** | 文档更新、代码清理、最终验收 | 1. 更新 README.md（部署说明/环境变量清单）<br>2. 更新 docs/04-Deployment/01-Deployment-Guide.md<br>3. 清理未使用的依赖和代码<br>4. 最终构建 + 测试全部通过 |

---

## 三、功能模块划分

### 3.1 模块总览

本次规划涉及 **3 个阶段、12 个任务、约 35 个具体步骤**：

```
下一阶段实施规划
├── 阶段 A：数据真实化与管理后台 (Week 1)
│   ├── A1. 首页数据接入
│   ├── A2. 日记相关推荐
│   ├── A3. 管理后台框架
│   ├── A4. 项目管理后台
│   └── A5. 日记管理后台
├── 阶段 B：测试体系建设 (Week 2)
│   ├── B1. 单元测试补充
│   ├── B2. API 集成测试
│   ├── B3. E2E 测试配置
│   └── B4. 性能审计与优化
└── 阶段 C：生产部署与收尾 (Week 3)
    ├── C1. 生产环境配置
    ├── C2. Docker 镜像构建
    ├── C3. 阿里云部署
    ├── C4. 监控与日志
    └── C5. 项目收尾
```

### 3.2 模块详细规格

#### A1. 首页数据接入

**输入**: 现有的 `HomeClient.tsx`（含 mock 数据）
**输出**: 接入真实 API 的首页组件
**技术方案**:
- 使用 `useEffect` + `fetch` 或 SWR 获取数据
- API 端点: `/api/projects?featured=true&limit=3` + `/api/diaries?status=PUBLISHED&limit=2&orderBy=publishedAt:desc`
- 加载状态: `<Skeleton />` 组件
- 错误状态: Toast 通知 + 重试按钮

**文件变更**:
- 修改: `src/components/home/HomeClient.tsx`
- 新增: `src/app/api/projects/featured/route.ts`（可选，复用现有路由）

#### A2. 日记相关推荐

**输入**: 现有的 `app/diary/[slug]/page.tsx`
**输出**: 包含相关推荐区域的日记详情页
**技术方案**:
- 在 `getDiaryBySlug` 同级添加 `getRelatedDiaries(categoryId, excludeId, limit)` 函数
- 使用 Prisma `findMany` 查询同分类日记
- UI: 3 列卡片网格（移动端 1 列）

**文件变更**:
- 修改: `src/app/diary/[slug]/page.tsx`
- 修改: `src/lib/db/diary.ts`（新增 `getRelatedDiaries`）

#### A3. 管理后台框架

**输入**: 现有的认证系统 + 布局组件
**输出**: `/admin` 路由组 + 统一布局
**技术方案**:
- 使用 Next.js `(group)` 路由: `app/admin/(dashboard)/`
- 侧边栏: shadcn/ui `Sidebar` 或自定义 glass 效果侧边栏
- 权限守卫: `middleware.ts` 或页面级 `getServerSession` 检查
- 主题: 复用现有双主题系统

**文件变更**:
- 新增: `src/app/admin/layout.tsx`
- 新增: `src/app/admin/page.tsx`（仪表盘）
- 新增: `src/components/admin/AdminSidebar.tsx`
- 新增: `src/components/admin/AdminHeader.tsx`
- 修改: `src/middleware.ts`（或新建，用于路由守卫）

#### A4/A5. 项目/日记管理后台

**输入**: 现有的 API CRUD 接口
**输出**: 完整的后台管理界面
**技术方案**:
- 列表页: 表格（shadcn/ui Table）+ 分页 + 搜索 + 筛选
- 表单页: shadcn/ui Form + react-hook-form + Zod 验证
- 图片上传: `/api/upload` + 预览
- Markdown 编辑器: `react-markdown` 编辑器（日记）
- 删除: AlertDialog 确认

**文件变更**:
- 新增: `src/app/admin/projects/page.tsx`
- 新增: `src/app/admin/projects/new/page.tsx`
- 新增: `src/app/admin/projects/[id]/edit/page.tsx`
- 新增: `src/app/admin/diaries/page.tsx`
- 新增: `src/app/admin/diaries/new/page.tsx`
- 新增: `src/app/admin/diaries/[id]/edit/page.tsx`
- 新增: `src/components/admin/DataTable.tsx`（通用表格）
- 新增: `src/components/admin/DeleteConfirmDialog.tsx`

#### B1/B2/B3. 测试体系

**输入**: Jest 已配置，少量测试文件
**输出**: 完整的单元测试 + 集成测试 + E2E 测试
**技术方案**:
- 单元测试: Jest + @testing-library/react + jest-environment-jsdom
- API 测试: jest + node-fetch（或直接使用 Next.js 的 `node-mocks-http`）
- E2E 测试: Playwright（配置 Chromium/Firefox/WebKit）
- 覆盖率: `jest --coverage`，阈值设置 ≥ 60%

**文件变更**:
- 修改: `jest.config.ts`
- 新增: `playwright.config.ts`
- 新增: `tests/unit/lib/utils.test.ts`
- 新增: `tests/unit/components/Button.test.tsx`
- 新增: `tests/integration/api/projects.test.ts`
- 新增: `tests/e2e/home.spec.ts`
- 新增: `tests/e2e/auth.spec.ts`

#### B4. 性能优化

**输入**: 现有构建产物
**输出**: 性能达标的优化版本
**技术方案**:
- 图片优化: 确保所有 Image 组件有 `sizes` 和 `priority` 属性
- 代码分割: 动态导入大型组件（`next/dynamic`）
- 字体优化: `next/font` 已使用，检查 `display: swap`
- Bundle 分析: `@next/bundle-analyzer`
- 缓存策略: API 路由添加 `Cache-Control` 头
- CDN: 静态资源可考虑阿里云 CDN

**文件变更**:
- 修改: 各页面 Image 组件
- 修改: `next.config.js`（添加 bundleAnalyzer）
- 修改: API 路由添加缓存头

#### C1 ~ C5. 部署与收尾

**输入**: 完整代码库
**输出**: 线上运行的网站 + 部署文档
**技术方案**:
- Docker: 多阶段构建，Alpine 基础镜像
- Nginx: 反向代理 + SSL + Gzip + 静态缓存
- SSL: Let's Encrypt + certbot 自动续期
- 数据库: MySQL 8.0（或保持 SQLite 简化部署）
- 监控: 基础健康检查 + 日志轮转

**文件变更**:
- 新增/修改: `Dockerfile`
- 新增/修改: `docker-compose.yml`
- 新增/修改: `nginx/nginx.conf`
- 新增: `scripts/deploy.sh`
- 新增: `scripts/backup.sh`
- 修改: `.env.example`

---

## 四、开发步骤与时间节点

### 4.1 甘特图式时间表

```
Week 1 (6.5 - 6.11) ────────────────────────────────────────────────
周一    周二    周三    周四    周五    周六    周日
├─A1────┤       │       │       │       │       │  首页数据接入 (2天)
│       ├─A2────┤       │       │       │       │  日记相关推荐 (2天)
│       │       ├─A3────┴───────┤       │       │  管理后台框架 (3天)
│       │       │       ├─A4────┴───────┤       │  项目管理后台 (3天)
│       │       │       │       ├─A5────┴───────┤  日记管理后台 (3天)

Week 2 (6.12 - 6.18) ───────────────────────────────────────────────
周一    周二    周三    周四    周五    周六    周日
├─B1────┴───────┤       │       │       │       │  单元测试 (3天)
│       ├─B2────┴───────┤       │       │       │  API集成测试 (3天)
│       │       ├─B3────┴───────┤       │       │  E2E测试 (3天)
│       │       │       ├─B4────┴───────┤       │  性能优化 (3天)

Week 3 (6.17 - 6.23) ───────────────────────────────────────────────
周一    周二    周三    周四    周五    周六    周日
├─C1────┤       │       │       │       │       │  生产环境配置 (2天)
│       ├─C2────┤       │       │       │       │  Docker构建 (2天)
│       │       ├─C3────┴───────┤       │       │  阿里云部署 (3天)
│       │       │       ├─C4────┤       │       │  监控日志 (2天)
│       │       │       │       ├─C5────┴───────┤  项目收尾 (3天)
```

### 4.2 详细时间线

| 日期 | 星期 | 阶段 | 任务 | 预期产出 | 负责人 |
|------|------|------|------|---------|--------|
| 6.5 | 四 | A | A1: 首页数据接入 | API 端点确认，组件修改完成 | 开发 |
| 6.6 | 五 | A | A1+A2: 首页完成 + 相关推荐 | PR 提交 | 开发 |
| 6.7 | 六 | A | A3: 管理后台框架 | /admin/layout.tsx + Sidebar + 权限守卫 | 开发 |
| 6.8 | 日 | A | A3: 管理后台框架 | 框架验收 | 开发 |
| 6.9 | 一 | A | A4: 项目管理后台 CRUD | /admin/projects/* 页面完成 | 开发 |
| 6.10 | 二 | A | A5: 日记管理后台 CRUD | /admin/diaries/* 页面完成 | 开发 |
| 6.11 | 三 | A | A阶段验收 | 管理后台功能完整测试 | 开发+测试 |
| 6.12 | 四 | B | B1: 单元测试 | tests/unit/ 覆盖 ≥ 30% | 开发 |
| 6.13 | 五 | B | B1+B2: 单元+集成测试 | tests/integration/ 完成 | 开发 |
| 6.14 | 六 | B | B3: E2E测试配置 | Playwright 配置 + 首页/登录测试 | 开发 |
| 6.15 | 日 | B | B3+B4: E2E+性能优化 | Lighthouse 评分 ≥ 90 | 开发 |
| 6.16 | 一 | B | B阶段验收 | 测试报告 + 性能报告 | 开发+测试 |
| 6.17 | 二 | C | C1: 生产环境配置 | .env.production + 数据库迁移 | 运维 |
| 6.18 | 三 | C | C2: Docker镜像构建 | docker build 成功，本地验证 | 运维 |
| 6.19 | 四 | C | C3: 阿里云部署 | ECS 部署完成，域名解析 | 运维 |
| 6.20 | 五 | C | C3+C4: 部署+监控 | SSL + 日志 + 备份 | 运维 |
| 6.21 | 六 | C | C4+C5: 监控+收尾 | 文档更新 + 最终测试 | 运维+开发 |
| 6.22 | 日 | C | C5: 项目收尾 | 代码清理 + 最终构建 | 开发 |
| 6.23 | 一 | C | 最终验收 | 正式上线 + 验收报告 | 全团队 |

---

## 五、资源与技术栈清单

### 5.1 人力资源

| 角色 | 职责 | 投入时间 | 所需技能 |
|------|------|---------|---------|
| **前端开发工程师** | React/Next.js 组件开发、UI 实现、交互逻辑 | 3 周全职 | React, TypeScript, Tailwind CSS, Next.js App Router |
| **后端/全栈工程师** | API 开发、数据库操作、业务逻辑 | 2 周全职 | Node.js, Prisma, Next.js API Routes, SQL |
| **测试工程师** | 测试用例设计、自动化测试、性能测试 | 1 周全职 | Jest, Playwright, Lighthouse |
| **运维工程师** | Docker 配置、服务器部署、CI/CD、监控 | 1 周兼职 | Docker, Linux, Nginx, 阿里云 |

> **注**: 在小型团队或个人开发场景中，以上角色可由同一人兼任，但需按阶段聚焦不同职责。

### 5.2 技术栈清单

#### 核心框架（已有，无需新增）

| 技术 | 版本 | 用途 | 状态 |
|------|------|------|------|
| Next.js | ^14.2.5 | 全栈 React 框架 | ✅ 已安装 |
| React | ^18.3.1 | UI 库 | ✅ 已安装 |
| TypeScript | ^5.x | 类型安全 | ✅ 已安装 |
| Tailwind CSS | ^3.4.1 | 原子化 CSS | ✅ 已安装 |
| Prisma | ^5.22.0 | ORM | ✅ 已安装 |
| NextAuth.js | ^4.24.14 | 认证 | ✅ 已安装 |
| Framer Motion | ^12.39.0 | 动画 | ✅ 已安装 |

#### 测试相关（需新增/配置）

| 技术 | 版本 | 用途 | 状态 | 安装命令 |
|------|------|------|------|---------|
| Jest | ^30.4.2 | 单元测试框架 | ✅ 已安装 | — |
| jest-environment-jsdom | ^30.4.1 | DOM 测试环境 | ✅ 已安装 | — |
| @testing-library/react | ^16.3.2 | React 组件测试 | ✅ 已安装 | — |
| @testing-library/jest-dom | ^6.x | DOM 断言扩展 | ⚠️ 需确认 | `npm i -D @testing-library/jest-dom` |
| @testing-library/user-event | ^14.x | 用户交互模拟 | ⚠️ 需确认 | `npm i -D @testing-library/user-event` |
| Playwright | ^1.x | E2E 测试 | ❌ 未安装 | `npm i -D @playwright/test` |
| msw (Mock Service Worker) | ^2.x | API Mock | ❌ 未安装 | `npm i -D msw` |
| @next/bundle-analyzer | ^14.x | Bundle 分析 | ❌ 未安装 | `npm i -D @next/bundle-analyzer` |

#### 部署相关（需新增/配置）

| 技术 | 版本 | 用途 | 状态 |
|------|------|------|------|
| Docker | ≥ 24.0 | 容器化 | ⚠️ 需安装/验证 |
| Docker Compose | ≥ 2.20 | 多容器编排 | ⚠️ 需安装/验证 |
| Nginx | ≥ 1.24 | 反向代理 | ⚠️ 需配置 |
| Let's Encrypt / certbot | latest | SSL 证书 | ⚠️ 需配置 |
| 阿里云 ECS | — | 云服务器 | ❌ 需购买/配置 |
| 阿里云域名 | — | 域名解析 | ❌ 需购买/备案 |

#### 开发工具

| 工具 | 用途 | 状态 |
|------|------|------|
| VS Code | 代码编辑器 | ✅ 已有 |
| ESLint + Prettier | 代码规范 | ✅ 已配置 |
| Git | 版本控制 | ✅ 已使用 |
| Chrome DevTools | 调试 + Lighthouse | ✅ 已有 |
| Postman / Hoppscotch | API 调试 | ⚠️ 建议使用 |

### 5.3 环境需求

| 环境 | 配置 | 用途 | 成本估算 |
|------|------|------|---------|
| **开发环境** | 本地机器，Node.js ≥ 18 | 日常开发 | 已有，¥0 |
| **测试环境** | Docker Compose 本地 | 集成测试、E2E 测试 | 已有，¥0 |
| **生产环境** | 阿里云 ECS 2核4G + 40G SSD | 线上服务 | ~¥200-400/月 |
| **数据库** | 阿里云 RDS MySQL 或 ECS 自建 | 数据持久化 | ~¥100-200/月（或免费 SQLite） |
| **域名** | .com/.cn 域名 | 网站访问 | ~¥50-100/年 |
| **SSL 证书** | Let's Encrypt（免费） | HTTPS | ¥0 |
| **CDN** | 阿里云 CDN（可选） | 静态资源加速 | ~¥50/月（可选） |

---

## 六、风险评估及应对方案

### 6.1 风险矩阵

| 风险编号 | 风险描述 | 发生概率 | 影响程度 | 风险等级 | 应对方案 | 责任人 |
|---------|---------|---------|---------|---------|---------|--------|
| **R1** | 管理后台开发工作量超预期 | 高 | 中 | ⚠️ 高 | 1. 采用极简设计，复用现有组件<br>2. 优先实现列表+编辑，删除和筛选可简化<br>3. 预留 1 天缓冲时间 | 开发 |
| **R2** | 测试覆盖率难以达到 60% | 中 | 中 | ⚠️ 中 | 1. 优先覆盖核心工具函数和 API<br>2. UI 组件测试可适当降低目标至 40%<br>3. 使用覆盖率报告精准定位缺口 | 测试 |
| **R3** | 性能优化（Lighthouse ≥ 90）困难 | 中 | 中 | ⚠️ 中 | 1. 重点关注图片优化和 Bundle 体积<br>2. 使用 `next/dynamic` 延迟加载非首屏组件<br>3. 如无法达标，接受 ≥ 85 分 | 开发 |
| **R4** | 阿里云部署遇到网络/权限问题 | 中 | 高 | ⚠️ 高 | 1. 提前申请阿里云账号和实名认证<br>2. 域名备案需 7-20 天，提前启动<br>3. 准备本地 Docker 验证环境作为 fallback<br>4. 如时间不足，使用 Vercel 作为临时部署方案 | 运维 |
| **R5** | 数据库从 SQLite 迁移到 MySQL 出现问题 | 低 | 高 | ⚠️ 中 | 1. 提前在本地用 Docker 运行 MySQL 验证迁移<br>2. 保留 SQLite 作为 fallback 方案<br>3. 编写数据导出/导入脚本<br>4. 如风险过高，生产环境继续使用 SQLite（对于个人站完全可行） | 开发 |
| **R6** | GitHub API 速率限制导致同步失败 | 中 | 低 | ⚠️ 低 | 1. 使用 GITHUB_TOKEN 提高限额<br>2. 添加指数退避重试机制<br>3. 缓存同步结果，减少调用频率 | 开发 |
| **R7** | 代码回归（改造引入新 Bug） | 中 | 中 | ⚠️ 中 | 1. 每个阶段结束后运行完整构建和测试<br>2. 使用 Git 分支隔离开发（feature/xxx）<br>3. 关键路径代码变更需 Code Review | 全团队 |
| **R8** | 第三方依赖更新导致兼容性问题 | 低 | 中 | ⚠️ 低 | 1. 锁定 package.json 版本（已使用 ^ 范围）<br>2. 使用 package-lock.json 确保一致性<br>3. 升级前在本地验证 | 开发 |

### 6.2 风险监控机制

- **每日站会**（或每日自查）：确认前日任务完成度，识别阻塞
- **阶段验收节点**：每个阶段结束（6.11 / 6.16 / 6.23）进行正式验收
- **风险升级路径**：低风险自行处理 → 中风险团队讨论 → 高风险立即上报并调整计划

---

## 七、质量保障措施

### 7.1 代码质量

| 措施 | 工具/方法 | 执行时机 | 验收标准 |
|------|----------|---------|---------|
| **代码规范检查** | ESLint + Prettier | 每次保存/提交前 | 0 errors, warnings 需评审 |
| **类型安全检查** | TypeScript `strict` 模式 | 每次构建 | `npm run build` 0 类型错误 |
| **代码审查** | Git PR Review | 每个任务完成后 | 至少 1 人 approve |
| **复杂度控制** | ESLint `complexity` 规则 | 持续 | 函数圈复杂度 ≤ 10 |
| **重复代码检测** | 人工 + IDE 提示 | 持续 | 无显著重复逻辑 |

### 7.2 设计质量

| 措施 | 方法 | 验收标准 |
|------|------|---------|
| **设计规范一致性** | 对照 `docs/03-UI-UX/01-Design-System.md` | 所有新增页面/组件符合设计 token |
| **响应式验证** | Chrome DevTools 设备模拟 | 6 个断点均正常显示 |
| **可访问性检查** | Lighthouse A11y 审计 | 评分 ≥ 90 |
| **主题一致性** | 手动切换 dark/light | 所有元素正确切换，无闪烁 |

### 7.3 数据质量

| 措施 | 方法 | 验收标准 |
|------|------|---------|
| **数据库迁移验证** | `prisma migrate dev` + 数据校验 | 迁移成功，数据完整性 100% |
| **API 响应格式** | 统一 `successResponse`/`errorResponse` | 所有 API 符合规范 |
| **输入验证** | Zod Schema | 所有用户输入均有验证 |

### 7.4 质量门禁（Quality Gates）

每个阶段必须通过以下门禁才能进入下一阶段：

```
阶段 A 门禁 (6.11):
├── ✅ Lint: npm run lint → 0 errors
├── ✅ Build: npm run build → 成功
├── ✅ 功能验收: 管理后台 CRUD 全部可用
└── ✅ 代码审查: PR 已合并

阶段 B 门禁 (6.16):
├── ✅ Lint + Build 通过
├── ✅ 单元测试: npm run test → 全部通过
├── ✅ 覆盖率: ≥ 60%（或约定的底线）
├── ✅ E2E 测试: npx playwright test → 全部通过
├── ✅ Lighthouse: 性能 ≥ 85, 可访问性 ≥ 90
└── ✅ 代码审查: PR 已合并

阶段 C 门禁 (6.23):
├── ✅ 本地 Docker 运行正常
├── ✅ 生产环境部署成功
├── ✅ HTTPS 访问正常
├── ✅ 健康检查: /api/health → 200
├── ✅ 核心功能线上验证通过
└── ✅ 文档更新完成
```

---

## 八、测试策略与验收流程

### 8.1 测试金字塔

```
        ▲
       /  \
      / E2E \      ← 5% 覆盖核心用户流程 (Playwright)
     /─────────\
    / Integration \  ← 15% 覆盖 API 集成 (Jest + node-mocks-http)
   /───────────────\
  /     Unit         \ ← 80% 覆盖工具/组件/Hooks (Jest + Testing Library)
 /─────────────────────\
```

### 8.2 测试分层详细规划

#### 单元测试（Unit Tests）

| 测试对象 | 测试内容 | 预期用例数 | 优先级 |
|---------|---------|-----------|--------|
| `lib/utils.ts` | 日期格式化、字符串处理、数组操作 | ~15 | P0 |
| `lib/db/*.ts` | 数据访问层关键函数（mock Prisma） | ~20 | P0 |
| `hooks/useTheme.ts` | 主题切换逻辑、localStorage 持久化 | ~8 | P0 |
| `hooks/useAuth.ts` | 登录状态、权限判断 | ~6 | P1 |
| `components/ui/` | Button, Card, Input 渲染 + 交互 | ~12 | P1 |
| `components/layout/` | Header, Footer 渲染 | ~6 | P2 |

#### 集成测试（Integration Tests）

| 测试对象 | 测试内容 | 预期用例数 | 优先级 |
|---------|---------|-----------|--------|
| `api/profile/route.ts` | GET/PUT 请求响应、权限控制 | ~6 | P0 |
| `api/projects/route.ts` | GET/POST/PUT/DELETE | ~10 | P0 |
| `api/diaries/route.ts` | 列表/详情/评论/点赞 | ~8 | P0 |
| `api/auth/register/route.ts` | 注册流程、验证、限流 | ~6 | P1 |
| `api/github/route.ts` | 同步流程、错误处理 | ~4 | P2 |

#### E2E 测试（End-to-End Tests）

| 测试场景 | 测试步骤 | 优先级 |
|---------|---------|--------|
| **首页浏览** | 访问首页 → 验证主题切换 → 验证项目卡片 → 验证日记卡片 | P0 |
| **项目浏览** | 首页 → 项目列表 → 点击项目 → 详情页 → 返回 | P0 |
| **日记浏览** | 首页 → 日记列表 → 点击日记 → 详情页 → 评论 → 点赞 | P0 |
| **主题切换** | 访问首页 → 切换主题 → 验证所有页面主题一致 → 刷新后保持 | P0 |
| **登录流程** | 访问 /login → 输入正确凭据 → 跳转首页 → 显示用户信息 → 登出 | P0 |
| **登录失败** | 访问 /login → 输入错误凭据 → 显示错误提示 → 不跳转 | P0 |
| **管理后台** | 登录 → 访问 /admin → 验证导航 → 创建项目 → 验证列表 | P1 |
| **响应式** | 在 375px / 768px / 1440px 下验证布局 | P1 |

### 8.3 性能测试

| 指标 | 工具 | 目标值 | 测试方法 |
|------|------|--------|---------|
| FCP | Lighthouse | < 1.8s | `npm run build && npx serve@latest out` + Lighthouse |
| LCP | Lighthouse | < 2.5s | 同上 |
| TTI | Lighthouse | < 3.8s | 同上 |
| CLS | Lighthouse | < 0.1 | 同上 |
| TBT | Lighthouse | < 200ms | 同上 |
| Bundle Size | @next/bundle-analyzer | 首屏 < 200KB | `ANALYZE=true npm run build` |
| API 响应时间 | 手动/脚本 | < 200ms (p95) | curl + 计时 |

### 8.4 验收流程

```
阶段验收流程:
1. 开发人员自测
   ├── 本地运行 npm run dev，手动验证功能
   ├── 运行 npm run lint && npm run build，确保无错误
   └── 运行相关测试 npm run test

2. 代码审查
   ├── 提交 PR 到 main 分支
   ├── Reviewer 检查代码质量、设计规范一致性
   └── Reviewer 运行测试确认通过

3. 阶段验收会议
   ├── 演示功能（Screen Share）
   ├── 对照验收标准逐项检查
   ├── 记录发现的问题（Issue Tracker）
   └── 决策：通过 / 有条件通过 / 返工

4. 合并与部署
   ├── PR approve 后合并到 main
   ├── 打标签（如 v0.2.0）
   └── 触发部署（如适用）
```

---

## 九、可追踪性机制

### 9.1 任务追踪体系

| 层级 | 追踪对象 | 追踪方式 | 查看位置 |
|------|---------|---------|---------|
| **阶段** | Phase A / B / C | 本文档 + Git Milestone | `docs/08-Plans/02-Next-Phase-Plan.md` |
| **任务** | A1 ~ C5 | GitHub Issues / Todo List | Issue 编号 + 标题 |
| **子任务** | 具体步骤（如"创建 AdminSidebar"） | GitHub Checklist / TodoWrite | Issue 描述中的 `- [ ]` |
| **代码变更** | 每个功能对应 1 个 PR | GitHub PR | PR #xxx |
| **Bug/问题** | 验收中发现的问题 | GitHub Issues + 标签 `bug` | Issue Tracker |

### 9.2 进度可视化

**每日进度更新格式**:

```markdown
## 进度日报 - 2026-06-05

### 今日完成
- [x] A1: 首页数据接入 - API 端点设计完成
- [x] 阅读并确认项目设计文档

### 进行中
- [ ] A1: 修改 HomeClient.tsx 接入真实数据 (50%)

### 阻塞/风险
- 无

### 明日计划
- [ ] 完成 A1 首页数据接入
- [ ] 开始 A2 日记相关推荐

### 累计进度
- 阶段 A: 10%
- 整体: 85% → 87%
```

### 9.3 度量指标（Metrics）

| 指标 | 计算方法 | 目标 | 追踪频率 |
|------|---------|------|---------|
| **代码完成度** | 已完成任务数 / 总任务数 | 100% | 每日 |
| **测试通过率** | 通过用例数 / 总用例数 | ≥ 95% | 每次提交 |
| **测试覆盖率** | 覆盖行数 / 总行数 | ≥ 60% | 每日 |
| **构建成功率** | 成功构建次数 / 总构建次数 | 100% | 每次提交 |
| **Bug 数** | 未关闭 Bug 数 | 阶段验收时 = 0 | 每周 |
| **性能评分** | Lighthouse Performance | ≥ 85 | 阶段 B 结束时 |
| **部署状态** | 线上服务可用性 | 100% | 持续 |

---

## 十、可调整性预案

### 10.1 时间压缩预案

如项目进度落后于计划，按以下优先级裁剪功能：

| 优先级 | 功能 | 裁剪方案 | 影响 |
|--------|------|---------|------|
| **P0（不可裁剪）** | 首页数据接入、日记相关推荐、登录/主题切换 E2E 测试、生产部署 | — | — |
| **P1（可延期）** | 管理后台（完整 CRUD）、单元测试覆盖率 60%、性能优化至 90 分 | 简化管理后台为仅列表+编辑；测试覆盖率目标降至 40%；性能目标降至 80 分 | 后台功能简化，技术债务增加 |
| **P2（可裁剪）** | E2E 测试（除核心流程外）、监控与日志、CDN 配置 | 仅保留首页+登录 E2E 测试；使用基础日志；暂不使用 CDN | 测试覆盖降低，性能略降 |
| **P3（可取消）** | SiteShare/DailyReport 功能、高级监控（APM）、自动化 CI/CD | 完全取消，留待后续版本 | 无即时影响 |

### 10.2 资源调整预案

| 场景 | 调整方案 |
|------|---------|
| **开发人员不足** | 优先完成 P0 任务；管理后台可简化；测试可延后 |
| **运维人员不足** | 使用 Vercel 一键部署替代阿里云手动部署；使用 SQLite 替代 MySQL |
| **测试环境不足** | 本地 Docker 完成全部测试；推迟 E2E 多浏览器测试 |
| **预算不足** | 使用 Vercel Hobby（免费）+ SQLite（免费）+ 阿里云轻量应用服务器（¥50/月） |

### 10.3 技术方案调整预案

| 原方案 | 备选方案 | 触发条件 |
|--------|---------|---------|
| 阿里云 ECS + Docker | Vercel 托管（Serverless） | 部署时间不足 / 运维经验不足 |
| MySQL 生产数据库 | SQLite（继续使用） | 迁移风险过高 / 成本考虑 |
| 自建文件上传 | 阿里云 OSS / Cloudinary | 需要更可靠的文件存储 |
| Playwright E2E | Cypress / 手动测试 | Playwright 配置困难 |
| 完整管理后台 | 使用 Prisma Studio + 简易表单 | 管理后台开发时间不足 |

### 10.4 里程碑调整机制

如某阶段无法按时完成：

1. **1 天以内延迟**：通过加班/调整每日任务分配消化，不调整里程碑
2. **2~3 天延迟**：压缩下一阶段时间，或裁剪 P2/P3 功能
3. **超过 3 天延迟**：召开调整会议，重新评估时间表，必要时调整 M4/M5 里程碑日期
4. **严重阻塞**（如架构重构）：立即暂停当前工作，评估影响范围，制定新计划

---

## 附录

### A. 参考文档

| 文档 | 路径 | 用途 |
|------|------|------|
| 软件设计文档 (SDD) | `docs/01-SDD/01-Software-Design-Document.md` | 架构参考 |
| API 规范 | `docs/02-API-Spec/01-API-Specification.md` | API 开发参考 |
| UI/UX 设计系统 | `docs/03-UI-UX/01-Design-System.md` | 视觉规范 |
| 部署指南 | `docs/04-Deployment/01-Deployment-Guide.md` | 部署参考 |
| 开发规范 | `docs/05-Development-Guide/01-Development-Standards.md` | 编码规范 |
| 测试策略 | `docs/06-Testing/01-Testing-Strategy.md` | 测试参考 |
| 维护指南 | `docs/07-Maintenance/01-Maintenance-Guide.md` | 运维参考 |
| 原始实施计划 | `docs/08-Plans/01-Implementation-Plan.md` | 原始计划 |

### B. 术语表

| 术语 | 说明 |
|------|------|
| **DoD** | Definition of Done（完成的定义） |
| **FCP** | First Contentful Paint（首次内容绘制） |
| **LCP** | Largest Contentful Paint（最大内容绘制） |
| **TTI** | Time to Interactive（可交互时间） |
| **CLS** | Cumulative Layout Shift（累积布局偏移） |
| **TBT** | Total Blocking Time（总阻塞时间） |
| **CRUD** | Create, Read, Update, Delete（增删改查） |
| **E2E** | End-to-End（端到端测试） |
| **SSR** | Server-Side Rendering（服务端渲染） |

### C. 变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-06-05 | 初始版本 | 系统架构师 |

---

> **下一步行动**: 本规划文档需经团队评审确认后执行。确认后，将按照阶段 A → B → C 的顺序依次实施，每个阶段结束时进行正式验收。
