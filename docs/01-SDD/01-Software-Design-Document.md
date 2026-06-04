# 迷途世界 (MituWorld) - 软件设计文档 (SDD)

> **文档版本**: v2.0  
> **创建日期**: 2026-05-14  
> **最后更新**: 2026-06-04  
> **文档状态**: 开发中  
> **作者**: 系统架构师

---

## 1. 文档概述

### 1.1 目的
本文档为**迷途世界 (MituWorld)** 个人网站系统提供全面的软件设计规范，涵盖系统架构、模块划分、数据库设计、API接口规范、UI/UX设计规范、技术选型说明及项目开发计划。本文档作为后续开发、测试、部署的权威参考依据。

### 1.2 项目背景
构建一个功能完善的个人网站系统，融合个人展示、技术博客、音乐分享和资源导航功能。系统采用**双主题设计**（华丽宇宙深色主题 + 我的世界像素白天主题），支持响应式设计和良好的用户体验。

### 1.3 目标读者
- 前端开发工程师
- 后端开发工程师
- 测试工程师
- 运维工程师
- 项目经理

### 1.4 参考文档
- [02-API-Specification.md](../02-API-Spec/01-API-Specification.md)
- [03-UI-UX-Design-System.md](../03-UI-UX/01-Design-System.md)
- [04-Deployment-Guide.md](../04-Deployment/01-Deployment-Guide.md)
- [05-Development-Standards.md](../05-Development-Guide/01-Development-Standards.md)
- [迷途世界设计文档](../MituWorld/)

---

## 2. 系统架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         客户端层                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   桌面端     │  │   平板端    │  │        移动端            │ │
│  │  (≥1200px)  │  │ (768-1199px)│  │       (≤767px)          │ │
│  └──────┬──────┘  └──────┬──────┘  └────────────┬────────────┘ │
└─────────┼────────────────┼──────────────────────┼──────────────┘
          │                │                      │
          └────────────────┴──────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Nginx 反向代理  │
                    │  - SSL 终止      │
                    │  - 静态资源服务   │
                    │  - 负载均衡      │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
   ┌──────▼──────┐  ┌────────▼────────┐  ┌─────▼──────┐
   │  Next.js    │  │   Next.js API   │  │  静态资源   │
   │  前端应用    │  │   Server Actions│  │  (图片/CSS) │
   │  - React    │  │   - REST API    │  │            │
   │  - SSR/SSG  │  │   - 业务逻辑     │  │            │
   └─────────────┘  └────────┬────────┘  └────────────┘
                             │
                    ┌────────▼────────┐
                    │   Prisma ORM    │
                    │   - 数据模型     │
                    │   - 查询构建     │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
   ┌──────▼──────┐  ┌────────▼────────┐  ┌─────▼──────┐
   │   MySQL     │  │NeteaseCloudMusic│  │  (可选)    │
   │   - 主数据库 │  │ API (独立容器)  │  │ Redis     │
   │   - 数据持久化│  │   - 歌单获取    │  │  缓存      │
   └─────────────┘  │   - 歌曲播放    │  └────────────┘
                    └─────────────────┘
```

### 2.2 技术架构分层

| 层级 | 技术组件 | 职责 |
|------|---------|------|
| 表现层 | Next.js 14+ App Router, React 18+, TypeScript | UI渲染、路由管理、状态管理 |
| 样式层 | Tailwind CSS, Framer Motion | 响应式样式、双主题支持、动画效果 |
| 业务逻辑层 | Next.js Server Actions, API Routes | 业务处理、数据验证、权限控制 |
| 数据访问层 | Prisma ORM | 数据库操作、模型映射、查询优化 |
| 数据存储层 | MySQL 8.0+ | 数据持久化、事务管理 |
| 第三方服务层 | NeteaseCloudMusic API | 网易云音乐数据获取与播放 |
| 基础设施层 | Docker, Nginx, 阿里云ECS | 容器化、反向代理、SSL、部署 |

### 2.3 部署架构

```
阿里云ECS服务器
├── Docker Compose 编排
│   ├── web 服务 (Next.js)
│   │   ├── 端口: 3000 (内部)
│   │   ├── 环境: production
│   │   └── 健康检查: /api/health
│   ├── netease-api 服务 (NeteaseCloudMusicApi)
│   │   ├── 端口: 3001 (内部)
│   │   └── 网络隔离: 仅内部访问
│   ├── db 服务 (MySQL 8.0)
│   │   ├── 端口: 3306 (内部)
│   │   ├── 数据卷: mysql_data
│   │   └── 备份策略: 每日自动备份
│   └── nginx 服务
│       ├── 端口: 80 → 443
│       ├── SSL证书: Let's Encrypt
│       └── 反向代理: / → web:3000, /api/music → netease-api:3001
└── 数据持久化卷
    ├── mysql_data
    ├── app_uploads
    └── nginx_ssl
```

---

## 3. 模块划分

### 3.1 模块总览

| 模块编号 | 模块名称 | 优先级 | 复杂度 | 依赖模块 |
|---------|---------|--------|--------|---------|
| M01 | 系统核心与认证 | P0 | 高 | 无 |
| M02 | 双主题系统 | P0 | 高 | M01 |
| M03 | 个人介绍 | P0 | 中 | M01 |
| M04 | 项目展示 | P0 | 高 | M01 |
| M05 | GitHub集成 | P1 | 中 | M01 |
| M06 | 网易云音乐接入 | P0 | 高 | M01 |
| M07 | 日记分享 | P1 | 高 | M01 |
| M08 | 好站分享 | P0 | 中 | M01 |
| M09 | 每日日报 | P0 | 中 | M01-M08 |
| M10 | 管理后台 | P1 | 中 | M01-M09 |

### 3.2 模块详细说明

#### M01 - 系统核心与认证模块
- **职责**: 提供系统基础功能、用户认证与授权
- **核心功能**:
  - 管理员登录/登出 (NextAuth.js)
  - 会话管理与权限控制
  - 系统配置管理
  - 健康检查端点
  - 错误处理与日志记录
- **技术要点**: JWT认证、中间件保护、RBAC权限模型

#### M02 - 双主题系统
- **职责**: 提供"华丽宇宙"与"MC像素"双主题切换
- **核心功能**:
  - 主题切换界面 (黑洞图标 ↔ 草地方块图标)
  - 主题状态持久化 (localStorage)
  - 系统偏好检测 (首次访问自动匹配系统主题)
  - 主题过渡动画
- **技术要点**: CSS变量、Tailwind主题配置、React Context

#### M03 - 个人介绍模块
- **职责**: 展示个人基本信息、教育背景、工作经历、技能特长
- **核心功能**:
  - 个人基本信息管理
  - 教育背景CRUD (时间倒序)
  - 工作经历CRUD (时间倒序)
  - 技能分类管理
  - 社交链接管理
  - 个人照片上传
- **技术要点**: 时间轴组件、图片压缩、响应式布局

#### M04 - 项目展示模块
- **职责**: 项目信息的展示与管理
- **核心功能**:
  - 项目CRUD操作
  - Markdown描述渲染
  - 技术栈标签管理
  - 多条件组合筛选
  - 全文搜索
  - 图片轮播与懒加载
  - 视频嵌入
- **技术要点**: 富文本渲染、文件上传、搜索索引

#### M05 - GitHub集成模块
- **职责**: 自动同步和展示GitHub仓库数据
- **核心功能**:
  - GitHub API数据获取
  - 仓库信息展示
  - 多维度分类筛选
  - 仓库搜索
  - 数据缓存机制
  - 定时同步任务
- **技术要点**: GitHub API v3、速率限制处理、数据缓存策略

#### M06 - 网易云音乐接入
- **职责**: 网易云音乐歌单展示与在线播放
- **核心功能**:
  - 网易云用户歌单获取 (uid: 17585834212)
  - "我喜欢的音乐"歌单展示
  - 在线播放功能 (HTML5 Audio API)
  - 迷你播放器 (跨页面播放状态保持)
  - 版权降级处理 (无法播放时提供跳转链接)
  - 播放控制 (播放/暂停/进度/音量/切歌)
  - 歌单元数据缓存 (避免频繁调用网易云API)
- **技术要点**: NeteaseCloudMusicApi、音频API、全局状态管理、服务隔离

#### M07 - 日记分享模块
- **职责**: 个人博客/日记系统
- **核心功能**:
  - 富文本编辑器
  - 草稿保存与预览
  - 分类与标签管理
  - 时间轴归档
  - 评论系统 (Markdown)
  - 评论审核
  - 点赞功能
  - 全文搜索与高亮
- **技术要点**: 富文本编辑器、语法高亮、搜索索引

#### M08 - 好站分享模块
- **职责**: 推荐网站的展示与管理
- **核心功能**:
  - 网站CRUD操作
  - 分类管理 (开发工具/设计/学习/音乐/游戏/效率/其他)
  - 标签系统
  - 星级评分
  - 点击计数
  - 精选推荐
  - 前台搜索与筛选
- **技术要点**: 分类筛选、点击统计

#### M09 - 每日日报模块
- **职责**: 每日生成和展示推荐内容
- **核心功能**:
  - 自动生成日报 (定时任务: 每日0:00)
  - 手动生成日报
  - 日报编辑功能
  - 内容组成: 今日一句 + 推荐音乐 + 推荐好站 + 推荐日记/项目
  - 历史日报归档
  - 状态管理 (草稿/发布/隐藏)
- **技术要点**: 定时任务、内容随机选择、状态管理

#### M10 - 管理后台模块
- **职责**: 提供统一的内容管理界面
- **核心功能**:
  - Dashboard概览 (数据统计)
  - 各模块数据管理
  - 系统设置
  - 主题预览
- **技术要点**: 数据表格、表单验证、权限控制

---

## 4. 数据库设计

### 4.1 ER关系图 (新增模块标记为 ⭐)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Profile   │       │  Education  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ id (PK)     │       │ id (PK)     │
│ email       │  1:1  │ userId (FK) │       │ profileId   │
│ name        │       │ avatar      │       │ school      │
│ role        │       │ bio         │       │ major       │
│ createdAt   │       │ location    │       │ degree      │
└─────────────┘       │ createdAt   │       │ startDate   │
                      └─────────────┘       │ endDate     │
                                            └─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│WorkExperience│      │    Skill    │       │ SocialLink  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ profileId   │       │ profileId   │       │ profileId   │
│ company     │       │ name        │       │ platform    │
│ position    │       │ category    │       │ url         │
│ startDate   │       │ proficiency │       │ icon        │
│ endDate     │       │ icon        │       └─────────────┘
│ description │       └─────────────┘
└─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Project   │◄─────►│ ProjectTag  │       │ ProjectImage│
├─────────────┤  M:N  ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ title       │       │ name        │       │ projectId   │
│ description │       │ color       │       │ url         │
│ category    │       └─────────────┘       │ alt         │
│ demoUrl     │                             │ order       │
│ repoUrl     │       ┌─────────────┐       └─────────────┘
│ startDate   │       │ProjectCategory│
│ endDate     │       ├─────────────┤
│ status      │       │ id (PK)     │
│ featured    │       │ name        │
└─────────────┘       │ slug        │
                      │ description │
                      └─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ GitHubRepo  │       │ GitHubSync  │       │MusicTrack⭐│
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ repoId      │       │ syncTime    │       │ neteaseId  │
│ name        │       │ status      │       │ title       │
│ fullName    │       │ reposCount  │       │ artist      │
│ description │       │ errorMsg    │       │ album       │
│ stars       │       └─────────────┘       │ coverUrl    │
│ forks       │                             │ duration    │
│ language    │                             │ url         │
│ updatedAt   │                             │ urlExpiry   │
│ syncAt      │                             └─────────────┘
└─────────────┘

┌───────────────┐     ┌─────────────────┐   ┌─────────────┐
│MusicPlaylist  │◄────►│PlaylistTrack    │   │    Diary    │
├───────────────┤ M:N ├─────────────────┤   ├─────────────┤
│ id (PK)       │     │ id (PK)         │   │ id (PK)     │
│ neteaseId     │     │ playlistId (FK) │   │ title       │
│ name          │     │ trackId (FK)    │   │ content     │
│ description   │     │ order           │   │ excerpt     │
│ coverUrl      │     └─────────────────┘   │ status      │
│ trackCount    │                             │ categoryId  │
│ createdAt     │                             │ tags        │
└───────────────┘                             │ views       │
                                               │ likes       │
┌─────────────────┐   ┌─────────────┐         │ createdAt   │
│SiteShare⭐     │   │DiaryCategory│         │ updatedAt   │
├─────────────────┤   ├─────────────┤         └─────────────┘
│ id (PK)         │   │ id (PK)     │
│ title           │   │ name        │
│ url             │   │ slug        │
│ description     │   │ description │
│ iconUrl         │   │ color       │
│ category        │   └─────────────┘
│ tags            │
│ rating          │   ┌─────────────┐       ┌─────────────┐
│ featured        │   │   Comment   │       │    Like     │
│ clickCount      │   ├─────────────┤       ├─────────────┤
│ createdAt       │   │ id (PK)     │       │ id (PK)     │
└─────────────────┘   │ diaryId     │       │ diaryId     │
                      │ authorName  │       │ ipAddress   │
┌─────────────────┐   │ content     │       │ createdAt   │
│DailyReport⭐    │   │ status      │       └─────────────┘
├─────────────────┤   │ createdAt   │
│ id (PK)         │   └─────────────┘
│ date (Unique)   │
│ title           │
│ status          │
│ quote           │
│ quoteAuthor     │
│ trackId (FK)    │
│ siteId (FK)     │
│ diaryId (FK)    │
│ projectId (FK)  │
│ customText      │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

### 4.2 数据表详细设计 (新增模块详细说明)

#### 4.2.1 用户认证相关表 (保持不变)

**User 表**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, UUID | 用户唯一标识 |
| email | String | Unique, Not Null | 邮箱地址 |
| name | String | Not Null | 用户名称 |
| password | String | Nullable | 加密密码 (bcrypt) |
| role | Enum | Default: ADMIN | 角色: ADMIN |
| image | String | Nullable | 头像URL |
| createdAt | DateTime | Default: now() | 创建时间 |
| updatedAt | DateTime | Auto Update | 更新时间 |

**Account 表** (NextAuth.js 第三方账号)
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, UUID | 唯一标识 |
| userId | String | FK → User.id | 关联用户 |
| type | String | Not Null | 账号类型 |
| provider | String | Not Null | 提供商 |
| providerAccountId | String | Not Null | 提供商账号ID |
| refresh_token | String | Nullable | 刷新令牌 |
| access_token | String | Nullable | 访问令牌 |
| expires_at | Int | Nullable | 过期时间 |

**Session 表**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, UUID | 唯一标识 |
| sessionToken | String | Unique, Not Null | 会话令牌 |
| userId | String | FK → User.id | 关联用户 |
| expires | DateTime | Not Null | 过期时间 |

#### 4.2.2 个人介绍模块表 (保持不变)

略。

#### 4.2.3 项目展示模块表 (保持不变)

略。

#### 4.2.4 GitHub集成模块表 (保持不变)

略。

#### 4.2.5 网易云音乐模块表 ⭐

**MusicTrack 表**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, UUID | 唯一标识 |
| neteaseId | String | Unique, Not Null | 网易云歌曲ID |
| title | String | Not Null | 歌曲名称 |
| artist | String | Not Null | 歌手 |
| album | String | Nullable | 专辑 |
| coverUrl | String | Nullable | 封面URL |
| duration | Int | Nullable | 时长(毫秒) |
| url | String | Nullable | 播放链接 (临时) |
| urlExpiry | DateTime | Nullable | 链接过期时间 |
| createdAt | DateTime | Default: now() | 创建时间 |
| updatedAt | DateTime | Auto Update | 更新时间 |

**MusicPlaylist 表**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, UUID | 唯一标识 |
| neteaseId | String | Unique, Not Null | 网易云歌单ID |
| name | String | Not Null | 歌单名称 |
| description | String | Text, Nullable | 描述 |
| coverUrl | String | Nullable | 封面URL |
| trackCount | Int | Default: 0 | 歌曲数量 |
| createdAt | DateTime | Default: now() | 创建时间 |
| updatedAt | DateTime | Auto Update | 更新时间 |

**PlaylistTrack 表** (M:N关联)
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, UUID | 唯一标识 |
| playlistId | String | FK → MusicPlaylist.id | 播放列表 |
| trackId | String | FK → MusicTrack.id | 歌曲 |
| order | Int | Default: 0 | 排序 |

#### 4.2.6 日记分享模块表 (保持不变)

略。

#### 4.2.7 好站分享模块表 ⭐

**SiteShare 表**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, UUID | 唯一标识 |
| title | String | Not Null | 网站名称 |
| url | String | Not Null | 网站链接 |
| description | String | Text, Not Null | 描述 (≤500字) |
| iconUrl | String | Nullable | 图标URL |
| category | Enum | Default: OTHER | 分类: DEV_TOOLS/DESIGN/LEARNING/MUSIC/GAME/PRODUCTIVITY/OTHER |
| tags | String | JSON, Nullable | 标签数组 |
| rating | Int | Nullable | 星级评分 (1-5) |
| featured | Boolean | Default: false | 是否精选 |
| clickCount | Int | Default: 0 | 点击次数 |
| createdAt | DateTime | Default: now() | 创建时间 |
| updatedAt | DateTime | Auto Update | 更新时间 |

#### 4.2.8 每日日报模块表 ⭐

**DailyReport 表**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, UUID | 唯一标识 |
| date | Date | Unique, Not Null | 日期 (YYYY-MM-DD) |
| title | String | Not Null | 日报标题 (如: 迷途日报 · 6月4日) |
| status | Enum | Default: DRAFT | 状态: DRAFT/PUBLISHED/HIDDEN |
| quote | String | Text, Nullable | 今日一句 |
| quoteAuthor | String | Nullable | 句子出处 |
| trackId | String | FK → MusicTrack.id, Nullable | 推荐音乐 |
| siteId | String | FK → SiteShare.id, Nullable | 推荐好站 |
| diaryId | String | FK → Diary.id, Nullable | 推荐日记 |
| projectId | String | FK → Project.id, Nullable | 推荐项目 |
| customText | String | Text, Nullable | 自定义补充内容 (Markdown) |
| createdAt | DateTime | Default: now() | 创建时间 |
| updatedAt | DateTime | Auto Update | 更新时间 |

### 4.3 索引设计

```sql
-- 用户认证索引
CREATE INDEX idx_account_user_id ON Account(userId);
CREATE INDEX idx_session_user_id ON Session(userId);

-- 项目展示索引
CREATE INDEX idx_project_category ON Project(categoryId);
CREATE INDEX idx_project_status ON Project(status);
CREATE INDEX idx_project_featured ON Project(featured);
CREATE INDEX idx_project_created_at ON Project(createdAt DESC);

-- GitHub索引
CREATE INDEX idx_github_repo_stars ON GitHubRepo(stars DESC);
CREATE INDEX idx_github_repo_language ON GitHubRepo(language);
CREATE INDEX idx_github_repo_updated ON GitHubRepo(updatedAt DESC);

-- 音乐索引 ⭐
CREATE INDEX idx_music_track_netease_id ON MusicTrack(neteaseId);
CREATE INDEX idx_music_playlist_netease_id ON MusicPlaylist(neteaseId);

-- 好站分享索引 ⭐
CREATE INDEX idx_site_category ON SiteShare(category);
CREATE INDEX idx_site_featured ON SiteShare(featured);
CREATE INDEX idx_site_created_at ON SiteShare(createdAt DESC);

-- 日报索引 ⭐
CREATE INDEX idx_daily_report_date ON DailyReport(date);
CREATE INDEX idx_daily_report_status ON DailyReport(status);

-- 日记索引
CREATE INDEX idx_diary_category ON Diary(categoryId);
CREATE INDEX idx_diary_status ON Diary(status);
CREATE INDEX idx_diary_published_at ON Diary(publishedAt DESC);
CREATE INDEX idx_diary_created_at ON Diary(createdAt DESC);

-- 评论索引
CREATE INDEX idx_comment_diary_id ON Comment(diaryId);
CREATE INDEX idx_comment_status ON Comment(status);
```

---

## 5. API接口规范 (新增模块标记为 ⭐)

### 5.1 接口设计原则

- **RESTful风格**: 使用标准HTTP方法 (GET/POST/PUT/DELETE)
- **响应式设计**: 支持参数化查询
- **统一响应格式**:

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2026-06-04T12:00:00Z"
}
```

错误响应:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数验证失败",
    "details": []
  },
  "timestamp": "2026-06-04T12:00:00Z"
}
```

### 5.2 认证接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/auth/signin | 管理员登录 | 否 |
| POST | /api/auth/signout | 登出 | 是 |
| GET | /api/auth/session | 获取当前会话 | 是 |

### 5.3 系统接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/health | 健康检查 | 否 |
| GET | /api/stats | 首页统计数据 | 否 |

### 5.4 个人介绍接口 (保持不变)

略。

### 5.5 项目展示接口 (保持不变)

略。

### 5.6 GitHub集成接口 (保持不变)

略。

### 5.7 网易云音乐接口 ⭐

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/music/playlists | 获取歌单列表 | 否 |
| GET | /api/music/playlists/:id | 获取歌单详情 | 否 |
| GET | /api/music/tracks | 获取歌曲列表 | 否 |
| GET | /api/music/tracks/:id | 获取歌曲详情 | 否 |
| GET | /api/music/tracks/:id/url | 获取播放链接 (实时) | 否 |
| POST | /api/music/sync | 同步歌单数据 | 是 |
| GET | /api/music/netease/* | 代理网易云API (内部使用) | 否 |

### 5.8 日记分享接口 (保持不变)

略。

### 5.9 好站分享接口 ⭐

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/sites | 获取网站列表 | 否 |
| GET | /api/sites/:id | 获取网站详情 | 否 |
| POST | /api/sites | 添加网站 | 是 |
| PUT | /api/sites/:id | 更新网站 | 是 |
| DELETE | /api/sites/:id | 删除网站 | 是 |
| POST | /api/sites/:id/click | 记录点击 | 否 |
| GET | /api/site-categories | 获取分类列表 | 否 |
| GET | /api/sites/search | 搜索网站 | 否 |

### 5.10 每日日报接口 ⭐

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/daily/today | 获取今日日报 | 否 |
| GET | /api/daily/history | 获取历史日报 | 否 |
| GET | /api/daily/:id | 获取日报详情 | 否 |
| POST | /api/daily/generate | 手动生成日报 | 是 |
| PUT | /api/daily/:id | 更新日报 | 是 |
| DELETE | /api/daily/:id | 删除日报 | 是 |
| PATCH | /api/daily/:id/status | 变更状态 | 是 |

### 5.11 文件上传接口 (保持不变)

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/upload/image | 上传图片 | 是 |
| POST | /api/upload/file | 上传文件 | 是 |

---

## 6. UI/UX设计规范 (双主题规范)

### 6.1 设计原则

- **双主题系统**: 提供"华丽宇宙"与"MC像素"两种主题，支持无缝切换
- **简洁现代**: 每个主题都保持自身风格的一致性
- **响应优先**: 移动优先设计，适配所有设备
- **交互流畅**: 平滑过渡动画，即时反馈
- **无障碍**: 支持键盘导航、屏幕阅读器

### 6.2 双主题色彩系统

#### 6.2.1 主题一: 华丽宇宙 (Void Theme) - 深色

| 角色 | 颜色值 | Tailwind类 | 用途 |
|------|--------|-----------|------|
| 主背景 | `#000000` | `bg-black` | 页面背景 |
| 二级背景 | `#030305` | (自定义) | 卡片背景 |
| 悬浮背景 | `#0a0a12` | (自定义) | 悬停状态 |
| 主要文字 | `#e0e7ff` | (自定义) | 标题、正文 |
| 次要文字 | `#6b7280` | `text-gray-500` | 描述、辅助 |
| 强调色-紫 | `#6d28d9` | `bg-purple-700` | 主按钮、边框 |
| 强调色-青 | `#06b6d4` | `bg-cyan-500` | 次按钮、交互 |
| 强调色-粉 | `#db2777` | `bg-pink-600` | 特殊强调 |
| 边框 | `#1a1a2e` | (自定义) | 分割线 |
| 光晕 | `rgba(109,40,217,0.15)` | (自定义) | 卡片悬停效果 |

#### 6.2.2 主题二: MC像素 (Realm Theme) - 像素风格

| 角色 | 颜色值 | 用途 |
|------|--------|------|
| 天空 | `#87CEEB` | 页面背景 |
| 草地 | `#5D8C22` | 底部装饰、绿色元素 |
| 泥土 | `#866043` | 棕色元素 |
| 石头 | `#7D7D7D` | 按钮背景、灰色元素 |
| 面板 | `#C6C6C6` | 卡片背景 |
| 边框高光 | `#FFFFFF` | 浮雕边框顶部左侧 |
| 边框阴影 | `#373737` | 浮雕边框底部右侧 |
| 主要文字 | `#3F3F3F` | 标题、正文 |
| 次要文字 | `#6B6B6B` | 描述、辅助 |
| 成功 | `#22c55e` | 绿色提示 |
| 错误 | `#ef4444` | 红色提示 |

### 6.3 字体规范

| 元素 | 宇宙主题字体 | 像素主题字体 | 大小 | 字重 |
|------|-------------|-------------|------|------|
| H1 | Inter/System | ZCOOL KuaiLe | 48-64px | 700 |
| H2 | Inter/System | ZCOOL KuaiLe | 32-40px | 600 |
| H3 | Inter/System | ZCOOL KuaiLe | 24-32px | 600 |
| 正文 | Inter/System | ZCOOL KuaiLe | 16px | 400 |
| 小字 | Inter/System | ZCOOL KuaiLe | 14px | 400 |
| 英文/数字 | Inter | Press Start 2P | 同中文 | 同中文 |

### 6.4 组件规范 (双主题适配)

#### 按钮

**宇宙主题**:
- 主按钮: 紫蓝渐变背景，白色文字，圆角8px，悬停紫色光晕
- 次按钮: 透明背景，紫色边框，紫色文字

**像素主题**:
- 主按钮: 灰色石头背景，浮雕边框，像素字体，按下边框反转 + 下移2px
- 次按钮: 绿色草地背景，浮雕边框

#### 卡片

**宇宙主题**:
- 背景: 半透明深黑 `rgba(3,3,5,0.8)`
- 圆角: 12px
- 边框: 细紫边框
- 悬停: 上浮 + 紫色光晕

**像素主题**:
- 背景: 浅灰面板 `#C6C6C6`
- 圆角: 极小或无圆角
- 边框: 4px浮雕边框 (上左白, 下右深灰)
- 悬停: 轻微抖动效果

#### 输入框

**宇宙主题**:
- 背景: 半透明深黑
- 边框: 1px solid 深色
- 聚焦: 紫色边框 + 光晕

**像素主题**:
- 背景: 白色
- 边框: 4px浮雕边框 (上左深灰, 下右白)
- 聚焦: 绿色草地边框

#### 主题切换按钮

- 宇宙模式: 黑洞图标 → 切换到像素
- 像素模式: 草方块图标 → 切换到宇宙
- 动画: 旋转180度 + 缩放

### 6.5 装饰元素

#### 宇宙主题装饰
- 星空背景: Canvas或CSS实现，星星闪烁动画
- 黑洞效果: 页面底部或顶部固定，缓慢旋转
- 流星: 偶尔划过的流星
- 光晕: 卡片悬停时的紫色/青色光晕

#### 像素主题装饰
- 像素云朵: 页面顶部飘浮的方块云 (CSS实现)
- 像素太阳: 右上角固定，光芒动画
- 草地装饰: 页面底部固定草地方块
- 像素化: 某些图标使用像素风格

---

## 7. 技术选型说明

### 7.1 核心技术栈

| 层级 | 技术 | 版本 | 选型理由 |
|------|------|------|---------|
| 框架 | Next.js | 14+ | App Router, SSR/SSG, Server Actions |
| 语言 | TypeScript | 5+ | 类型安全，开发体验好 |
| UI库 | React | 18+ | 组件化，生态丰富 |
| 样式 | Tailwind CSS | 3.4+ | 原子化CSS，双主题支持好 |
| 动画 | Framer Motion | 11+ | React友好动画库 |
| ORM | Prisma | 5+ | 类型安全，迁移方便 |
| 数据库 | MySQL | 8.0+ | 稳定可靠，适合个人项目 |
| 认证 | NextAuth.js | 5+ | Next.js原生支持 |
| 表单 | React Hook Form | 7+ | 性能优秀，验证灵活 |
| 验证 | Zod | 3+ | TypeScript友好验证 |
| 查询 | TanStack Query | 5+ | 服务端状态管理 |
| 富文本 | TipTap | 2+ | 无依赖，可扩展 |
| 图标 | Lucide React | latest | 轻量，风格统一 |
| 音乐API | NeteaseCloudMusicApi | latest | 成熟的网易云API逆向工程 |

### 7.2 开发工具

| 工具 | 用途 |
|------|------|
| ESLint | 代码规范检查 |
| Prettier | 代码格式化 |
| Husky | Git钩子管理 |
| lint-staged | 暂存区代码检查 |
| Commitlint | 提交信息规范 |

### 7.3 部署工具

| 工具 | 用途 |
|------|------|
| Docker | 容器化 |
| Docker Compose | 多容器编排 |
| Nginx | 反向代理 |

---

## 8. 项目开发计划

### 8.1 开发阶段划分

#### 第一阶段: 基础设施与品牌重塑 (Week 1 - 6/4~6/10)
- [x] 项目文档更新
- [ ] 主题系统重构 (cosmic → void, solar → realm)
- [ ] 更新Tailwind配置与全局样式
- [ ] 添加像素字体 (ZCOOL KuaiLe/Press Start 2P)
- [ ] 重写WorldBackground组件
- [ ] 品牌更名 (个人网站 → 迷途世界)
- [ ] 主题切换按钮重设计
- [ ] 数据库迁移 (添加新表结构)

#### 第二阶段: 首页与核心模块 (Week 2 - 6/11~6/17)
- [ ] 首页重构 (品牌展示、数据统计、内容展示)
- [ ] 项目展示模块统一主题
- [ ] 日记分享模块统一主题
- [ ] 关于页统一主题
- [ ] 空状态设计
- [ ] Loading组件 (双主题)

#### 第三阶段: 新功能模块开发 (Week 3 - 6/18~6/24)
- [ ] 好站分享模块
- [ ] 每日日报模块
- [ ] 管理后台新功能页面

#### 第四阶段: 网易云音乐接入 (Week 4 - 6/25~7/1)
- [ ] 网易云API服务部署
- [ ] 音乐数据同步
- [ ] 音乐播放器组件
- [ ] 迷你播放器
- [ ] 版权降级处理

#### 第五阶段: 完善与优化 (Week 5 - 7/2~7/8)
- [ ] 性能优化
- [ ] SEO优化
- [ ] 安全加固
- [ ] 全面测试
- [ ] 生产环境部署

### 8.2 里程碑

| 里程碑 | 日期 | 交付物 |
|--------|------|--------|
| M1 | 2026-06-10 | 基础设施完成，双主题系统可用 |
| M2 | 2026-06-17 | 首页与核心模块主题统一完成 |
| M3 | 2026-06-24 | 好站分享+每日日报功能上线 |
| M4 | 2026-07-01 | 网易云音乐接入完成 |
| M5 | 2026-07-08 | 生产部署完成，正式上线 |

---

## 9. 风险评估

| 风险 | 可能性 | 影响 | 优先级 | 缓解措施 |
|------|--------|------|------|---------|
| 网易云API限制 | 中 | 高 | P0 | 实现缓存机制，合理控制同步频率，提供降级体验 |
| 网易云API变更 | 中 | 高 | P0 | 关注开源项目更新，及时升级镜像，保留降级方案 |
| 版权问题 | 低 | 高 | P1 | 不存储音频文件，仅展示元数据，版权歌曲提供跳转链接 |
| 服务器资源不足 | 中 | 中 | P1 | 阿里云ECS建议2核4G配置，MySQL调优，添加Swap分区 |
| 主题冲突 | 中 | 中 | P1 | 使用CSS变量统一管理样式，全面测试 |
| 字体加载问题 | 高 | 低 | P2 | 使用font-display: swap，提供系统字体降级 |
| 数据库性能 | 低 | 中 | P2 | 合理索引，查询优化，连接池配置 |
| 安全漏洞 | 低 | 高 | P1 | 输入验证，XSS防护，定期安全扫描 |

---

## 10. 附录

### 10.1 术语表

| 术语 | 说明 |
|------|------|
| Void Theme | 华丽宇宙深色主题 |
| Realm Theme | MC像素白天主题 |
| SSR | 服务端渲染 (Server-Side Rendering) |
| SSG | 静态站点生成 (Static Site Generation) |
| ORM | 对象关系映射 (Object-Relational Mapping) |
| CRUD | 增删改查 (Create, Read, Update, Delete) |
| JWT | JSON Web Token |
| XSS | 跨站脚本攻击 (Cross-Site Scripting) |
| NeteaseCloudMusicApi | 开源网易云音乐API逆向项目 |

### 10.2 文档变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v2.0 | 2026-06-04 | 重大更新: 项目更名为迷途世界，添加双主题系统、好站分享、每日日报、网易云音乐接入模块 | 系统架构师 |
| v1.0 | 2026-05-14 | 初始版本 | 系统架构师 |

---

> **文档结束**  
> 如有疑问，请联系项目技术负责人。
