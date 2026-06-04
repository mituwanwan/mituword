# 个人网站系统 - 文档索引

> **版本**: v2.0  
> **更新日期**: 2026-06-04  
> **文档状态**: 开发中  
> **项目名称**: 迷途世界 (MituWorld)

---

## 迷途世界项目文档

这是一个全新的项目阶段，实现**双主题设计**（华丽宇宙 × MC像素）、**网易云音乐接入**、**好站分享**和**每日日报**功能。

| 文档 | 说明 |
|------|------|
| [01-PRD: 产品需求文档](MituWorld/01-PRD-产品需求文档.md) | 项目需求、功能列表、验收标准 |
| [02-ARCH: 技术架构文档](MituWorld/02-ARCH-技术架构文档.md) | 技术栈、部署架构、服务边界 |
| [03-DB: 数据库设计文档](MituWorld/03-DB-数据库设计文档.md) | 数据表结构、索引设计、迁移计划 |
| [04-API: API接口文档](MituWorld/04-API-接口文档.md) | 业务接口、网易云代理、认证接口 |
| [05-UI: UI设计规范](MituWorld/05-UI-设计规范.md) | 双主题色彩、字体、组件、动画规范 |
| [06-Schedule: 开发排期](MituWorld/06-开发排期.md) | 5周开发计划，任务分解，里程碑 |
| [07-Risk: 风险评估](MituWorld/07-风险评估.md) | 技术、版权、运维风险与应对方案 |

---

## 旧版文档导航

### 按角色导航

| 角色 | 相关文档 | 说明 |
|------|---------|------|
| **项目经理** | [SDD](01-SDD/01-Software-Design-Document.md) → [实现计划](08-Plans/01-Implementation-Plan.md) → [部署指南](04-Deployment/01-Deployment-Guide.md) | 项目整体规划与进度跟踪 |
| **前端开发** | [SDD](01-SDD/01-Software-Design-Document.md) → [UI/UX设计](03-UI-UX/01-Design-System.md) → [开发规范](05-Development-Guide/01-Development-Standards.md) → [实现计划](08-Plans/01-Implementation-Plan.md) | 界面开发与组件实现 |
| **后端开发** | [SDD](01-SDD/01-Software-Design-Document.md) → [API规范](02-API-Spec/01-API-Specification.md) → [开发规范](05-Development-Guide/01-Development-Standards.md) → [实现计划](08-Plans/01-Implementation-Plan.md) | 接口开发与数据库操作 |
| **测试工程师** | [测试策略](06-Testing/01-Testing-Strategy.md) → [实现计划](08-Plans/01-Implementation-Plan.md) → [开发规范](05-Development-Guide/01-Development-Standards.md) | 测试用例设计与执行 |
| **运维工程师** | [部署指南](04-Deployment/01-Deployment-Guide.md) → [维护指南](07-Maintenance/01-Maintenance-Guide.md) → [SDD](01-SDD/01-Software-Design-Document.md) | 环境搭建与系统维护 |

### 按阶段导航

| 阶段 | 核心文档 | 辅助文档 |
|------|---------|---------|
| **设计阶段** | [软件设计文档](01-SDD/01-Software-Design-Document.md) | [UI/UX设计系统](03-UI-UX/01-Design-System.md) |
| **开发阶段** | [实现计划](08-Plans/01-Implementation-Plan.md) | [开发规范](05-Development-Guide/01-Development-Standards.md), [API规范](02-API-Spec/01-API-Specification.md) |
| **测试阶段** | [测试策略](06-Testing/01-Testing-Strategy.md) | [实现计划](08-Plans/01-Implementation-Plan.md) |
| **部署阶段** | [部署指南](04-Deployment/01-Deployment-Guide.md) | [维护指南](07-Maintenance/01-Maintenance-Guide.md) |
| **维护阶段** | [维护指南](07-Maintenance/01-Maintenance-Guide.md) | [部署指南](04-Deployment/01-Deployment-Guide.md) |

---

## 文档依赖关系

```
01-SDD (软件设计文档)
    ├── 依赖: 无 (基础文档)
    ├── 被依赖: 所有其他文档
    └── 关联: 02-API-Spec, 03-UI-UX

02-API-Spec (API接口规范)
    ├── 依赖: 01-SDD (数据库设计)
    ├── 被依赖: 05-Development-Guide, 08-Plans
    └── 关联: 01-SDD

03-UI-UX (设计系统)
    ├── 依赖: 01-SDD (设计原则)
    ├── 被依赖: 05-Development-Guide, 08-Plans
    └── 关联: 01-SDD

04-Deployment (部署指南)
    ├── 依赖: 01-SDD (架构设计)
    ├── 被依赖: 07-Maintenance
    └── 关联: 06-Testing

05-Development-Guide (开发规范)
    ├── 依赖: 01-SDD, 02-API-Spec, 03-UI-UX
    ├── 被依赖: 08-Plans
    └── 关联: 06-Testing

06-Testing (测试策略)
    ├── 依赖: 05-Development-Guide
    ├── 被依赖: 04-Deployment
    └── 关联: 08-Plans

07-Maintenance (维护指南)
    ├── 依赖: 04-Deployment
    ├── 被依赖: 无
    └── 关联: 01-SDD

08-Plans (实现计划)
    ├── 依赖: 所有其他文档
    ├── 被依赖: 无 (执行文档)
    └── 关联: 所有文档
```

---

## 快速参考

### 常用链接

- [系统架构图](01-SDD/01-Software-Design-Document.md#21-整体架构图)
- [数据库设计](01-SDD/01-Software-Design-Document.md#4-数据库设计)
- [API接口列表](02-API-Spec/01-API-Specification.md)
- [色彩系统](03-UI-UX/01-Design-System.md#2-色彩系统)
- [组件规范](03-UI-UX/01-Design-System.md#4-组件规范)
- [Git工作流](05-Development-Guide/01-Development-Standards.md#3-git工作流)
- [测试配置](06-Testing/01-Testing-Strategy.md)
- [Docker配置](04-Deployment/01-Deployment-Guide.md#3-docker配置)
- [备份策略](07-Maintenance/01-Maintenance-Guide.md#5-数据备份与恢复)

### 技术栈速查

| 层级 | 技术 | 版本 | 文档位置 |
|------|------|------|---------|
| 框架 | Next.js | 14+ | [SDD §7.1](01-SDD/01-Software-Design-Document.md#71-核心技术栈) |
| 语言 | TypeScript | 5+ | [开发规范 §2.1](05-Development-Guide/01-Development-Standards.md#21-typescript规范) |
| 样式 | Tailwind CSS | 3.4+ | [UI/UX §2](03-UI-UX/01-Design-System.md#2-色彩系统) |
| 组件 | shadcn/ui | latest | [UI/UX §4](03-UI-UX/01-Design-System.md#4-组件规范) |
| ORM | Prisma | 5+ | [SDD §4](01-SDD/01-Software-Design-Document.md#4-数据库设计) |
| 数据库 | PostgreSQL | 15+ | [部署指南 §2](04-Deployment/01-Deployment-Guide.md#2-数据库配置) |
| 认证 | NextAuth.js | 5+ | [实现计划 Task 3](08-Plans/01-Implementation-Plan.md#task-3-配置-nextauthjs-认证) |
| 部署 | Docker | latest | [部署指南 §3](04-Deployment/01-Deployment-Guide.md#3-docker配置) |

---

## 文档更新记录

| 版本 | 日期 | 更新内容 | 作者 |
|------|------|---------|------|
| v2.0 | 2026-06-04 | 项目重命名为迷途世界，添加MituWorld系列文档，更新技术栈为MySQL | 系统架构师 |
| v1.0 | 2026-05-14 | 初始版本，创建完整文档索引 | 系统架构师 |

---

> **使用说明**: 本文档为文档体系的入口点，新团队成员应从此文档开始了解项目。根据您的角色选择对应的导航路径，按阶段执行时请参考阶段导航表格。
