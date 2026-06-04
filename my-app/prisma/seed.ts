import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("开始填充数据库...");

  // 清除现有数据
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.diaryTagRelation.deleteMany();
  await prisma.diaryTag.deleteMany();
  await prisma.diaryCategory.deleteMany();
  await prisma.diary.deleteMany();
  await prisma.playlistTrack.deleteMany();
  await prisma.musicPlaylist.deleteMany();
  await prisma.musicTrack.deleteMany();
  await prisma.projectImage.deleteMany();
  await prisma.projectTagRelation.deleteMany();
  await prisma.projectTag.deleteMany();
  await prisma.projectCategory.deleteMany();
  await prisma.project.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.gitHubSyncLog.deleteMany();
  await prisma.gitHubRepo.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("已清除现有数据");

  // 1. 创建用户
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "管理员",
      role: "ADMIN",
      password: "$2a$10$dummy", // 占位密码
    },
  });
  console.log("✓ 创建用户");

  // 2. 创建个人资料
  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      fullName: "张三",
      title: "全栈开发工程师",
      bio: "热爱编程，专注于 Web 开发、云原生技术和开源项目。拥有 5 年前端开发经验，擅长 React、Vue、Next.js 等现代前端框架，同时熟悉 Node.js、Python 后端开发。",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      location: "中国·上海",
      email: "zhangsan@example.com",
      website: "https://zhangsan.dev",
    },
  });
  console.log("✓ 创建个人资料");

  // 3. 教育经历
  await prisma.education.createMany({
    data: [
      {
        profileId: profile.id,
        school: "上海交通大学",
        major: "计算机科学与技术",
        degree: "本科",
        startDate: new Date("2015-09-01"),
        endDate: new Date("2019-06-30"),
        description: "主修课程：数据结构、算法、操作系统、计算机网络",
        order: 1,
      },
      {
        profileId: profile.id,
        school: "浙江大学",
        major: "软件工程",
        degree: "硕士",
        startDate: new Date("2019-09-01"),
        endDate: new Date("2022-06-30"),
        description: "研究方向：分布式系统、微服务架构",
        order: 2,
      },
    ],
  });
  console.log("✓ 创建教育经历");

  // 4. 工作经历
  await prisma.workExperience.createMany({
    data: [
      {
        profileId: profile.id,
        company: "阿里巴巴集团",
        position: "前端开发工程师",
        startDate: new Date("2022-07-01"),
        isCurrent: true,
        description: "负责核心业务系统的前端架构设计与开发，主导多个重要项目的技术选型和性能优化。",
        order: 1,
      },
      {
        profileId: profile.id,
        company: "字节跳动",
        position: "前端开发实习生",
        startDate: new Date("2021-06-01"),
        endDate: new Date("2021-12-31"),
        description: "参与抖音 Web 版的功能开发，优化用户体验和页面性能。",
        order: 2,
      },
    ],
  });
  console.log("✓ 创建工作经历");

  // 5. 技能
  await prisma.skill.createMany({
    data: [
      { profileId: profile.id, name: "React/Next.js", category: "前端", proficiency: 95, order: 1 },
      { profileId: profile.id, name: "TypeScript", category: "前端", proficiency: 90, order: 2 },
      { profileId: profile.id, name: "Vue.js", category: "前端", proficiency: 85, order: 3 },
      { profileId: profile.id, name: "Node.js", category: "后端", proficiency: 80, order: 4 },
      { profileId: profile.id, name: "Python", category: "后端", proficiency: 75, order: 5 },
      { profileId: profile.id, name: "PostgreSQL", category: "数据库", proficiency: 80, order: 6 },
      { profileId: profile.id, name: "Docker/K8s", category: "DevOps", proficiency: 70, order: 7 },
      { profileId: profile.id, name: "AWS", category: "云服务", proficiency: 65, order: 8 },
    ],
  });
  console.log("✓ 创建技能");

  // 6. 社交链接
  await prisma.socialLink.createMany({
    data: [
      { profileId: profile.id, platform: "GitHub", url: "https://github.com/zhangsan", order: 1 },
      { profileId: profile.id, platform: "Twitter", url: "https://twitter.com/zhangsan", order: 2 },
      { profileId: profile.id, platform: "LinkedIn", url: "https://linkedin.com/in/zhangsan", order: 3 },
      { profileId: profile.id, platform: "掘金", url: "https://juejin.cn/user/zhangsan", order: 4 },
    ],
  });
  console.log("✓ 创建社交链接");

  // 7. 项目分类
  const webAppCategory = await prisma.projectCategory.create({
    data: {
      name: "Web 应用",
      slug: "web-apps",
      description: "各类 Web 应用程序",
      color: "#3B82F6",
      order: 1,
    },
  });

  const toolCategory = await prisma.projectCategory.create({
    data: {
      name: "工具库",
      slug: "tools",
      description: "开发工具和库",
      color: "#10B981",
      order: 2,
    },
  });

  const experimentCategory = await prisma.projectCategory.create({
    data: {
      name: "创意实验",
      slug: "experiments",
      description: "创意项目和实验",
      color: "#F59E0B",
      order: 3,
    },
  });
  console.log("✓ 创建项目分类");

  // 8. 项目标签
  const reactTag = await prisma.projectTag.create({ data: { name: "React", color: "#61DAFB" } });
  const nextjsTag = await prisma.projectTag.create({ data: { name: "Next.js", color: "#000000" } });
  const typescriptTag = await prisma.projectTag.create({ data: { name: "TypeScript", color: "#3178C6" } });
  const nodejsTag = await prisma.projectTag.create({ data: { name: "Node.js", color: "#339933" } });
  const prismaTag = await prisma.projectTag.create({ data: { name: "Prisma", color: "#2D3748" } });
  const tailwindTag = await prisma.projectTag.create({ data: { name: "TailwindCSS", color: "#06B6D4" } });
  console.log("✓ 创建项目标签");

  // 9. 项目
  const project1 = await prisma.project.create({
    data: {
      title: "个人网站",
      slug: "personal-website",
      description: "基于 Next.js 14 构建的个人网站，包含项目展示、日记博客、音乐播放器等功能模块。采用 App Router 架构，支持 SSR/SSG，集成 Prisma ORM 和 SQLite 数据库。",
      categoryId: webAppCategory.id,
      demoUrl: "https://zhangsan.dev",
      repoUrl: "https://github.com/zhangsan/personal-website",
      status: "COMPLETED",
      featured: true,
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-03-15"),
      tags: {
        create: [
          { tagId: nextjsTag.id },
          { tagId: typescriptTag.id },
          { tagId: tailwindTag.id },
          { tagId: prismaTag.id },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: "任务管理系统",
      slug: "task-manager",
      description: "全栈任务管理系统，支持多用户协作、任务分配、进度跟踪。后端采用 Node.js + Express，前端使用 React + Redux Toolkit，数据库使用 PostgreSQL。",
      categoryId: webAppCategory.id,
      demoUrl: "https://task-manager.demo.com",
      repoUrl: "https://github.com/zhangsan/task-manager",
      status: "COMPLETED",
      featured: true,
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      startDate: new Date("2023-06-01"),
      endDate: new Date("2023-09-30"),
      tags: {
        create: [
          { tagId: reactTag.id },
          { tagId: nodejsTag.id },
          { tagId: typescriptTag.id },
        ],
      },
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: "React 工具库",
      slug: "react-utils",
      description: "常用的 React Hooks 和工具函数集合，包含 useFetch、useLocalStorage、useDebounce 等实用 Hook。支持 TypeScript，完善的单元测试覆盖。",
      categoryId: toolCategory.id,
      repoUrl: "https://github.com/zhangsan/react-utils",
      status: "COMPLETED",
      featured: true,
      startDate: new Date("2023-03-01"),
      endDate: new Date("2023-05-15"),
      tags: {
        create: [
          { tagId: reactTag.id },
          { tagId: typescriptTag.id },
        ],
      },
    },
  });

  const project4 = await prisma.project.create({
    data: {
      title: "粒子动画效果",
      slug: "particle-animation",
      description: "使用 Canvas API 实现的粒子动画效果，支持多种交互模式和自定义参数配置。可用于网站背景、加载动画等场景。",
      categoryId: experimentCategory.id,
      demoUrl: "https://particle-animation.demo.com",
      repoUrl: "https://github.com/zhangsan/particle-animation",
      status: "COMPLETED",
      featured: false,
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-02-28"),
      tags: {
        create: [
          { tagId: typescriptTag.id },
        ],
      },
    },
  });
  console.log("✓ 创建项目");

  // 10. 日记分类
  const techCategory = await prisma.diaryCategory.create({
    data: {
      name: "技术笔记",
      slug: "tech",
      description: "技术学习和总结",
      color: "#3B82F6",
      order: 1,
    },
  });

  const lifeCategory = await prisma.diaryCategory.create({
    data: {
      name: "生活随笔",
      slug: "life",
      description: "生活感悟和记录",
      color: "#10B981",
      order: 2,
    },
  });

  const reviewCategory = await prisma.diaryCategory.create({
    data: {
      name: "项目复盘",
      slug: "review",
      description: "项目总结和复盘",
      color: "#F59E0B",
      order: 3,
    },
  });
  console.log("✓ 创建日记分类");

  // 11. 日记标签
  const reactDiaryTag = await prisma.diaryTag.create({ data: { name: "React", color: "#61DAFB" } });
  const nextjsDiaryTag = await prisma.diaryTag.create({ data: { name: "Next.js", color: "#000000" } });
  const performanceTag = await prisma.diaryTag.create({ data: { name: "性能优化", color: "#10B981" } });
  const cssTag = await prisma.diaryTag.create({ data: { name: "CSS", color: "#F59E0B" } });
  console.log("✓ 创建日记标签");

  // 12. 日记
  await prisma.diary.create({
    data: {
      title: "Next.js 14 App Router 完全指南",
      slug: "nextjs-14-app-router-guide",
      content: `Next.js 14 带来了全新的 App Router 架构，相比传统的 Pages Router，它提供了更多强大的功能。

## 主要特性

### 1. Server Components
默认使用服务端组件，减少客户端 JavaScript 体积。

### 2. Streaming
支持流式渲染，可以逐步显示内容，提升用户体验。

### 3. 嵌套布局
支持多层嵌套的布局结构，方便组织复杂页面。

### 4. 数据获取
直接在组件中使用 async/await 获取数据，无需 getServerSideProps。

## 使用建议

- 优先使用 Server Components
- 合理使用 Streaming 优化加载体验
- 利用嵌套布局减少重复代码
- 注意客户端组件和服务端组件的边界`,
      excerpt: "详细介绍 Next.js 14 App Router 的核心特性和最佳实践",
      status: "PUBLISHED",
      categoryId: techCategory.id,
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
      isPinned: true,
      publishedAt: new Date("2024-03-10"),
      views: 1250,
      likes: 89,
      tags: {
        create: [
          { tagId: nextjsDiaryTag.id },
          { tagId: performanceTag.id },
        ],
      },
    },
  });

  await prisma.diary.create({
    data: {
      title: "CSS Grid 布局实战技巧",
      slug: "css-grid-layout-tips",
      content: `CSS Grid 是现代 Web 布局的强大工具。本文分享一些实用的 Grid 布局技巧。

## 基础网格

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
\`\`\`

## 响应式布局

使用 auto-fit 和 minmax 实现自适应：

\`\`\`css
.container {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
\`\`\`

## 常用场景

- 卡片网格
- 圣杯布局
- 图片画廊
- 仪表盘布局`,
      excerpt: "CSS Grid 布局的实用技巧和常见场景解决方案",
      status: "PUBLISHED",
      categoryId: techCategory.id,
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      isPinned: false,
      publishedAt: new Date("2024-03-05"),
      views: 856,
      likes: 45,
      tags: {
        create: [
          { tagId: cssTag.id },
        ],
      },
    },
  });

  await prisma.diary.create({
    data: {
      title: "2024年第一季度总结",
      slug: "2024-q1-review",
      content: `转眼间 2024 年已经过去四分之一，回顾这个季度，收获颇丰。

## 工作方面

- 完成了个人网站的重构和上线
- 主导了团队的核心项目迁移到 Next.js 14
- 分享了 3 次技术分享，主题涵盖 React Server Components

## 学习成长

- 深入学习了 Rust 编程语言
- 完成了 AWS Solutions Architect 认证
- 阅读了 5 本技术书籍

## 生活感悟

工作之余，也要注重生活质量。保持运动、陪伴家人、培养兴趣爱好，这些都是不可或缺的。

## 下一季度目标

- 深入学习 Kubernetes
- 开源 2 个个人项目
- 坚持每周写一篇技术博客`,
      excerpt: "2024年第一季度的工作总结和生活感悟",
      status: "PUBLISHED",
      categoryId: lifeCategory.id,
      isPinned: false,
      publishedAt: new Date("2024-04-01"),
      views: 523,
      likes: 32,
    },
  });

  await prisma.diary.create({
    data: {
      title: "React 性能优化实践",
      slug: "react-performance-optimization",
      content: `在大型 React 应用中，性能优化是一个持续的过程。本文分享一些实用的优化技巧。

## 1. 使用 React.memo

避免不必要的重新渲染：

\`\`\`jsx
const MyComponent = React.memo(({ data }) => {
  return <div>{data.name}</div>;
});
\`\`\`

## 2. useMemo 和 useCallback

缓存计算结果和函数引用。

## 3. 代码分割

使用 React.lazy 和 Suspense 实现按需加载。

## 4. 虚拟列表

对于长列表，使用 react-window 或 react-virtualized。

## 5. 性能分析工具

- React DevTools Profiler
- Chrome Performance 面板
- Lighthouse`,
      excerpt: "React 应用性能优化的最佳实践和工具推荐",
      status: "PUBLISHED",
      categoryId: techCategory.id,
      isPinned: false,
      publishedAt: new Date("2024-02-20"),
      views: 1089,
      likes: 67,
      tags: {
        create: [
          { tagId: reactDiaryTag.id },
          { tagId: performanceTag.id },
        ],
      },
    },
  });

  await prisma.diary.create({
    data: {
      title: "个人网站项目复盘",
      slug: "personal-website-retrospective",
      content: `个人网站从构思到上线，历时两个多月。现在来做个全面复盘。

## 技术选型

- 框架：Next.js 14 (App Router)
- 样式：TailwindCSS
- 数据库：SQLite (开发) / PostgreSQL (生产)
- ORM：Prisma
- 部署：Vercel

## 遇到的挑战

### 1. SWC 兼容性问题
在 Linux 环境下，原生 SWC 二进制文件存在兼容性问题，最终通过安装正确的平台包解决。

### 2. 数据库设计
需要平衡灵活性和查询性能，最终选择了关系型数据库 + Prisma ORM 的方案。

### 3. 音乐播放器实现
Web Audio API 的兼容性处理，以及播放状态的持久化。

## 收获与成长

- 深入理解了 Next.js App Router 的工作原理
- 掌握了 Prisma ORM 的最佳实践
- 提升了全栈开发能力

## 未来规划

- 添加管理后台
- 实现评论系统
- 增加更多交互功能`,
      excerpt: "个人网站从构思到上线的完整复盘总结",
      status: "PUBLISHED",
      categoryId: reviewCategory.id,
      coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
      isPinned: false,
      publishedAt: new Date("2024-03-20"),
      views: 678,
      likes: 41,
    },
  });
  console.log("✓ 创建日记");

  // 13. 音乐曲目
  const track1 = await prisma.musicTrack.create({
    data: {
      title: "晴天",
      artist: "周杰伦",
      album: "叶惠美",
      releaseDate: new Date("2003-07-31"),
      genre: "流行",
      duration: 269,
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
      order: 1,
    },
  });

  const track2 = await prisma.musicTrack.create({
    data: {
      title: "稻香",
      artist: "周杰伦",
      album: "魔杰座",
      releaseDate: new Date("2008-10-15"),
      genre: "流行",
      duration: 223,
      coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      order: 2,
    },
  });

  const track3 = await prisma.musicTrack.create({
    data: {
      title: "夜曲",
      artist: "周杰伦",
      album: "十一月的萧邦",
      releaseDate: new Date("2005-11-01"),
      genre: "流行",
      duration: 226,
      coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
      order: 3,
    },
  });

  const track4 = await prisma.musicTrack.create({
    data: {
      title: "起风了",
      artist: "买辣椒也用券",
      releaseDate: new Date("2018-03-01"),
      genre: "流行",
      duration: 321,
      coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop",
      order: 4,
    },
  });

  const track5 = await prisma.musicTrack.create({
    data: {
      title: "平凡之路",
      artist: "朴树",
      album: "猎户星座",
      releaseDate: new Date("2017-04-30"),
      genre: "民谣",
      duration: 295,
      coverUrl: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=300&h=300&fit=crop",
      order: 5,
    },
  });
  console.log("✓ 创建音乐曲目");

  // 14. 播放列表
  const playlist1 = await prisma.musicPlaylist.create({
    data: {
      name: "我的最爱",
      description: "最喜欢的一些歌曲",
      coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
      order: 1,
      tracks: {
        create: [
          { trackId: track1.id, order: 1 },
          { trackId: track2.id, order: 2 },
          { trackId: track3.id, order: 3 },
        ],
      },
    },
  });

  const playlist2 = await prisma.musicPlaylist.create({
    data: {
      name: "工作学习",
      description: "适合专注时听的轻音乐",
      order: 2,
      tracks: {
        create: [
          { trackId: track4.id, order: 1 },
          { trackId: track5.id, order: 2 },
        ],
      },
    },
  });
  console.log("✓ 创建播放列表");

  // 15. GitHub 仓库
  await prisma.gitHubRepo.createMany({
    data: [
      {
        repoId: 123456,
        name: "personal-website",
        fullName: "zhangsan/personal-website",
        description: "基于 Next.js 14 构建的个人网站",
        htmlUrl: "https://github.com/zhangsan/personal-website",
        stars: 128,
        forks: 23,
        watchers: 45,
        language: "TypeScript",
        topics: JSON.stringify(["nextjs", "react", "typescript", "tailwindcss"]),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-03-15"),
        pushedAt: new Date("2024-03-15"),
      },
      {
        repoId: 123457,
        name: "task-manager",
        fullName: "zhangsan/task-manager",
        description: "全栈任务管理系统",
        htmlUrl: "https://github.com/zhangsan/task-manager",
        stars: 89,
        forks: 15,
        watchers: 32,
        language: "TypeScript",
        topics: JSON.stringify(["react", "nodejs", "postgresql"]),
        createdAt: new Date("2023-06-01"),
        updatedAt: new Date("2023-09-30"),
        pushedAt: new Date("2023-09-30"),
      },
      {
        repoId: 123458,
        name: "react-utils",
        fullName: "zhangsan/react-utils",
        description: "React Hooks 和工具函数集合",
        htmlUrl: "https://github.com/zhangsan/react-utils",
        stars: 256,
        forks: 42,
        watchers: 78,
        language: "TypeScript",
        topics: JSON.stringify(["react", "hooks", "typescript"]),
        createdAt: new Date("2023-03-01"),
        updatedAt: new Date("2024-02-20"),
        pushedAt: new Date("2024-02-20"),
      },
      {
        repoId: 123459,
        name: "particle-animation",
        fullName: "zhangsan/particle-animation",
        description: "Canvas 粒子动画效果",
        htmlUrl: "https://github.com/zhangsan/particle-animation",
        stars: 67,
        forks: 12,
        watchers: 25,
        language: "JavaScript",
        topics: JSON.stringify(["canvas", "animation", "javascript"]),
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-28"),
        pushedAt: new Date("2024-02-28"),
      },
    ],
  });
  console.log("✓ 创建 GitHub 仓库");

  // 16. 同步日志
  await prisma.gitHubSyncLog.create({
    data: {
      status: "SUCCESS",
      reposCount: 4,
      syncTime: new Date(),
    },
  });
  console.log("✓ 创建同步日志");

  console.log("\n✅ 数据库填充完成！");
  console.log("\n示例数据概览：");
  console.log("- 用户: 1 (admin@example.com)");
  console.log("- 个人资料: 1 (张三)");
  console.log("- 教育经历: 2");
  console.log("- 工作经历: 2");
  console.log("- 技能: 8");
  console.log("- 社交链接: 4");
  console.log("- 项目: 4 (3个精选)");
  console.log("- 日记: 5 (1篇置顶)");
  console.log("- 音乐曲目: 5");
  console.log("- 播放列表: 2");
  console.log("- GitHub 仓库: 4");
}

main()
  .catch((e) => {
    console.error("填充失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
