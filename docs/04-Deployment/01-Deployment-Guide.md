# 迷途世界 (MituWorld) 部署指南

> **版本**: v1.0
> **更新日期**: 2026-06-05

---

## 系统要求

| 组件 | 最低要求 |
|------|---------|
| Docker | 24.0+ |
| Docker Compose | 2.20+ |
| CPU | 2 核 |
| 内存 | 4 GB |
| 磁盘 | 40 GB SSD |

## 快速部署

### 1. 克隆代码

```bash
git clone <repository-url> mituworld
cd mituworld
```

### 2. 配置环境变量

```bash
cp .env.production .env
# 编辑 .env，设置正确的 NEXTAUTH_SECRET 和域名
```

### 3. 启动服务

```bash
./scripts/deploy.sh
```

或手动执行：

```bash
docker-compose up -d
```

### 4. 执行数据库迁移

```bash
docker-compose exec app npx prisma migrate deploy
```

### 5. 验证部署

```bash
curl http://localhost/api/health
```

## 服务架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │────▶│  Next.js    │────▶│   MySQL     │
│  (80/443)   │     │   (3000)    │     │   (3306)    │
└─────────────┘     └─────────────┘     └─────────────┘
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `docker-compose up -d` | 启动所有服务 |
| `docker-compose down` | 停止所有服务 |
| `docker-compose logs -f app` | 查看应用日志 |
| `docker-compose logs -f nginx` | 查看 Nginx 日志 |
| `./scripts/backup.sh` | 备份数据库 |
| `./scripts/deploy.sh` | 完整部署流程 |

## SSL 配置

使用 Let's Encrypt 获取免费 SSL 证书：

```bash
# 安装 certbot
docker run -it --rm \
  -v ./nginx/ssl:/etc/letsencrypt \
  -v ./logs/nginx:/var/log/nginx \
  certbot/certbot certonly --standalone \
  -d your-domain.com
```

然后在 `nginx/nginx.conf` 中启用 HTTPS 配置。

## 故障排查

### 健康检查失败

```bash
# 检查应用状态
docker-compose ps

# 查看应用日志
docker-compose logs app

# 重启应用
docker-compose restart app
```

### 数据库连接失败

```bash
# 检查数据库状态
docker-compose logs db

# 手动连接数据库
docker-compose exec db mysql -u myapp_user -p myapp_db
```
