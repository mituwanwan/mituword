# 迷途世界 (MituWorld) — 技术架构文档

> 版本：v1.0  
> 日期：2026-06-04  

---

## 1. 技术栈

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 前端框架 | Next.js | 14+ | React SSR/SSG 框架 |
| 语言 | TypeScript | 5+ | 类型安全 |
| 样式 | Tailwind CSS | 3.x | 原子化 CSS |
| UI组件 | 自研组件库 | — | 双主题组件 |
| 数据库 ORM | Prisma | 5.x | 数据库操作 |
| 数据库 | MySQL | 8.0 | 数据持久化 |
| 认证 | NextAuth.js | 4.x | 用户认证 |
| 字体 | Google Fonts | — | ZCOOL KuaiLe / Press Start 2P |
| 部署 | Docker + Nginx | — | 容器化部署 |

---

## 2. 部署架构

```
                              ┌─────────────────┐
                              │   浏览者浏览器   │
                              └────────┬────────┘
                                       │
                              ┌────────▼────────┐
                              │  Cloudflare /   │
                              │  阿里云 DNS      │
                              └────────┬────────┘
                                       │
                              ┌────────▼────────┐
                              │  阿里云 ECS      │
                              │  (2核4G推荐)     │
                              │  Alibaba Linux 3 │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
           ┌────────▼────────┐ ┌──────▼──────┐ ┌────────▼────────┐
           │  Nginx (80/443) │ │  Nginx      │ │  MySQL 8.0      │
           │  反向代理+HTTPS  │ │  (可选      │ │  (Docker)       │
           │  静态文件服务    │ │  RDS)       │ │  port: 3306     │
           └────────┬────────┘ └─────────────┘ └─────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼────────┐
│  mituworld-web │    │  netease-api    │
│  Next.js 3000  │    │  Node.js 3001   │
│  Docker容器    │    │  Docker容器     │
└────────────────┘    └─────────────────┘
```

---

## 3. 服务边界

### 3.1 mituworld-web (Next.js)
- 职责：前端渲染 + API Routes（业务逻辑）
- 端口：3000
- 对外：通过 Nginx 反向代理到 443
- 不直接访问网易云API，通过内部网络调用 netease-api

### 3.2 netease-api (网易云API服务)
- 职责：代理网易云音乐接口
- 端口：3001
- 对外：不暴露，仅内部访问
- 镜像：`binaryify/netease_cloud_music_api`

### 3.3 MySQL
- 职责：业务数据存储
- 端口：3306
- 对外：不暴露，仅内部访问

---

## 4. 环境配置

### 4.1 生产环境环境变量 (.env.production)
```env
# 数据库
DATABASE_URL="mysql://mituworld:PASSWORD@mysql:3306/mituworld?schema=public"

# NextAuth
NEXTAUTH_URL="https://mituworld.com"
NEXTAUTH_SECRET="your-secret-key"

# 网易云API
NETEASE_API_URL="http://netease-api:3001"
NETEASE_UID="17585834212"

# 其他
NODE_ENV="production"
```

### 4.2 Docker Compose
```yaml
version: '3.8'

services:
  web:
    build:
      context: ./my-app
      dockerfile: Dockerfile
    container_name: mituworld-web
    restart: always
    ports:
      - "127.0.0.1:3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NETEASE_API_URL=${NETEASE_API_URL}
      - NETEASE_UID=${NETEASE_UID}
    depends_on:
      - mysql
      - netease-api
    networks:
      - mituworld

  netease-api:
    image: binaryify/netease_cloud_music_api:latest
    container_name: mituworld-music
    restart: always
    ports:
      - "127.0.0.1:3001:3001"
    environment:
      - PORT=3001
    networks:
      - mituworld

  mysql:
    image: mysql:8.0
    container_name: mituworld-mysql
    restart: always
    ports:
      - "127.0.0.1:3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=mituworld
      - MYSQL_USER=mituworld
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - mituworld

  nginx:
    image: nginx:alpine
    container_name: mituworld-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./cert:/etc/nginx/cert
    depends_on:
      - web
    networks:
      - mituworld

volumes:
  mysql_data:

networks:
  mituworld:
    driver: bridge
```

---

## 5. 目录结构

```
my-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (main)/             # 前台页面
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── about/
│   │   │   ├── projects/
│   │   │   ├── diary/
│   │   │   ├── music/
│   │   │   ├── sites/          # ⭐ 好站分享
│   │   │   ├── daily/          # ⭐ 每日日报
│   │   │   └── github/
│   │   ├── admin/              # 管理后台
│   │   ├── api/                # API Routes
│   │   ├── login/
│   │   └── register/
│   ├── components/
│   │   ├── layout/             # 布局组件
│   │   ├── ui/                 # 通用UI组件
│   │   ├── sections/           # 页面区块
│   │   └── home/               # 首页组件
│   ├── lib/
│   │   ├── db/                 # 数据库操作
│   │   ├── auth.ts             # 认证逻辑
│   │   └── utils/              # 工具函数
│   ├── hooks/                  # 自定义Hooks
│   ├── types/                  # 类型定义
│   └── styles/
│       └── globals.css
├── prisma/
│   └── schema.prisma           # 数据库模型
├── public/                     # 静态资源
├── docs/                       # 项目文档
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── package.json
```

---

## 6. 关键设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 网易云API部署 | 独立Docker容器 | 隔离风险，独立更新，避免影响主站 |
| 主题实现 | CSS class 切换 | 性能最好，无闪烁，支持 SSR |
| 音乐播放 | HTML5 Audio API | 无需额外库，控制灵活 |
| 图片存储 | 本地 + 图床 | 小图本地，大图可选阿里云OSS |
| 缓存策略 | Redis（二期） | 一期先不用，直接用内存缓存 |
