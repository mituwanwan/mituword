# 部署指南文档

> **文档版本**: v2.0  
> **创建日期**: 2026-05-14  
> **最后更新**: 2026-06-02  
> **关联文档**: [SDD](../01-SDD/01-Software-Design-Document.md)

---

## 1. 部署架构

### 1.1 服务器架构

```
云服务器 (Ubuntu 22.04+)
├── Docker Engine
│   └── Docker Compose
│       ├── web (Next.js)
│       │   ├── 端口: 3000
│       │   └── 环境: production
│       ├── db (MySQL 8.0)
│       │   ├── 端口: 3306 (内部)
│       │   └── 数据卷: mysql_data
│       └── nginx (可选，用于生产环境)
│           ├── 端口: 80 → 443
│           └── SSL: Let's Encrypt (可选)
└── 数据卷
    ├── mysql_data
    └── app_uploads
```

### 1.2 网络架构

```
Internet
    │
    ▼
┌─────────────┐
│   Nginx     │  ← 反向代理, SSL终止 (可选)
│  (80/443)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Next.js   │  ← 应用服务
│   (3000)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   MySQL     │  ← 数据库
│   (3306)    │
└─────────────┘
```

---

## 2. 环境准备

### 2.1 服务器要求

| 资源 | 最低配置 | 推荐配置 |
|------|---------|---------|
| CPU | 2核 | 4核 |
| 内存 | 4GB | 8GB |
| 磁盘 | 50GB SSD | 100GB SSD |
| 带宽 | 3Mbps | 5Mbps |
| 系统 | Ubuntu 22.04+ | Ubuntu 22.04 LTS |

### 2.2 域名与SSL (可选)

- 域名已解析到服务器IP (生产环境建议)
- 准备 Let's Encrypt SSL 证书 (自动申请)

### 2.3 安全组配置

| 端口 | 协议 | 来源 | 用途 |
|------|------|------|------|
| 22 | TCP | 本地IP | SSH |
| 80 | TCP | 0.0.0.0/0 | HTTP |
| 443 | TCP | 0.0.0.0/0 | HTTPS |
| 3000 | TCP | 0.0.0.0/0 | Next.js (开发或无Nginx模式) |

---

## 3. 环境安装

### 3.1 安装 Docker

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装依赖
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# 添加Docker GPG密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 添加Docker仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
docker compose version
```

### 3.2 安装 Git

```bash
sudo apt install -y git
```

### 3.3 配置防火墙 (可选)

```bash
# 安装ufw
sudo apt install -y ufw

# 配置规则
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp

# 启用防火墙
sudo ufw enable
```

---

## 4. 项目部署

### 4.1 克隆或上传项目

```bash
# 创建项目目录
mkdir -p /opt/mitu-world
cd /opt/mitu-world

# 克隆代码 (替换为实际仓库地址)
git clone https://github.com/yourusername/mitu-world.git .

# 或使用本地上传
# 上传项目文件到 /opt/mitu-world
cd /opt/mitu-world/my-app
```

### 4.2 环境配置

创建环境变量文件：

```bash
cd /opt/mitu-world/my-app

cat > .env << 'EOF'
# 应用配置
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com  # 或 http://your-server-ip:3000
NEXTAUTH_SECRET=your-secret-key-here

# 数据库配置
DATABASE_URL=mysql://myapp_user:myapp_password123@db:3306/myapp_db

# GitHub配置 (可选)
GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=your-github-token

# 网易云音乐API配置 (可选)
NETEASE_MUSIC_API_URL=https://your-netease-api.com

# 其他配置
SITE_URL=https://yourdomain.com
SITE_NAME=迷途世界
EOF
```

**重要**: 替换以下值：
- `yourdomain.com` → 你的域名或服务器IP
- `your-secret-key-here` → 随机密钥 (可用 `openssl rand -base64 32` 生成)
- `myapp_password123` → MySQL密码 (与docker-compose.yml中一致)
- `your-github-username` → GitHub用户名 (可选)
- `your-github-token` → GitHub Personal Access Token (可选)

### 4.3 Docker Compose配置

项目已包含 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  db:
    image: docker.m.daocloud.io/library/mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: myapp_db
      MYSQL_USER: myapp_user
      MYSQL_PASSWORD: myapp_password123
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-prootpassword"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "mysql://myapp_user:myapp_password123@db:3306/myapp_db"
      NEXTAUTH_URL: "http://localhost:3000"
      NEXTAUTH_SECRET: "your-production-secret-key"
    depends_on:
      db:
        condition: service_healthy
    command: sh -c "npx prisma migrate deploy && node server.js"

volumes:
  mysql_data:
```

### 4.4 Dockerfile

项目已包含 `Dockerfile`。

### 4.5 Nginx配置 (生产环境可选)

如需添加 Nginx 作为反向代理，在 `docker-compose.yml` 中添加 nginx 服务。

### 4.6 构建与启动

```bash
cd /opt/mitu-world/my-app

# 构建Docker镜像
docker compose build

# 启动服务
docker compose up -d

# 查看日志
docker compose logs -f

# 查看状态
docker compose ps
```

### 4.7 数据库迁移

数据库迁移已包含在启动命令中 (`npx prisma migrate deploy`)，但也可以手动运行：

```bash
# 运行数据库迁移
docker compose exec web npx prisma migrate deploy

# 生成Prisma客户端
docker compose exec web npx prisma generate

# 种子数据 (可选，如项目有seed脚本)
# docker compose exec web npx prisma db seed
```

---

## 5. 备份策略

### 5.1 数据库备份脚本

创建备份脚本 `backup.sh`：

```bash
#!/bin/bash

# 配置
BACKUP_DIR="/opt/backups"
DB_CONTAINER="my-app-db-1"
DB_NAME="myapp_db"
DB_USER="myapp_user"
DB_PASSWORD="myapp_password123"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${DATE}.sql"

# 创建备份目录
mkdir -p ${BACKUP_DIR}

# 执行备份
docker exec ${DB_CONTAINER} mysqldump -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${BACKUP_FILE}

# 压缩备份
gzip ${BACKUP_FILE}

# 删除旧备份
find ${BACKUP_DIR} -name "backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

# 输出结果
echo "备份完成: ${BACKUP_FILE}.gz"
```

### 5.2 设置定时备份

```bash
# 添加执行权限
chmod +x /opt/mitu-world/backup.sh

# 编辑crontab
crontab -e

# 添加定时任务 (每天凌晨2点备份)
0 2 * * * /opt/mitu-world/backup.sh >> /var/log/backup.log 2>&1
```

### 5.3 上传文件备份 (如适用)

```bash
# 备份上传文件
rsync -avz /opt/mitu-world/my-app/uploads/ /opt/backups/uploads/
```

---

## 6. 监控与日志

### 6.1 查看日志

```bash
# 查看应用日志
docker compose logs -f web

# 查看数据库日志
docker compose logs -f db

# 查看所有日志
docker compose logs -f
```

### 6.2 日志轮转

创建日志轮转配置 `/etc/logrotate.d/mitu-world`：

```
/opt/mitu-world/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 root root
}
```

### 6.3 健康检查

```bash
# 检查应用健康 (如有健康检查API)
# curl -f http://localhost:3000/api/health

# 检查数据库
docker compose exec db mysqladmin ping -h localhost -u myapp_user -pmyapp_password123
```

---

## 7. 更新与维护

### 7.1 更新应用

```bash
cd /opt/mitu-world/my-app

# 拉取最新代码 (如有Git仓库)
git pull origin main

# 重新构建
docker compose build web

# 重启服务
docker compose up -d web

# 清理旧镜像
docker image prune -f
```

### 7.2 数据库迁移

```bash
# 创建迁移 (开发环境)
docker compose exec web npx prisma migrate dev --name migration_name

# 部署迁移 (生产环境)
docker compose exec web npx prisma migrate deploy
```

### 7.3 重启服务

```bash
# 重启所有服务
docker compose restart

# 重启单个服务
docker compose restart web
```

### 7.4 停止服务

```bash
# 停止所有服务
docker compose down

# 停止并删除数据卷 (谨慎使用)
docker compose down -v
```

---

## 8. 故障排查

### 8.1 常见问题

#### 应用无法启动

```bash
# 检查日志
docker compose logs web

# 检查端口占用
netstat -tlnp | grep 3000

# 检查环境变量
docker compose exec web env
```

#### 数据库连接失败

```bash
# 检查数据库状态
docker compose ps db

# 检查数据库日志
docker compose logs db

# 测试连接
docker compose exec db mysql -u myapp_user -pmyapp_password123 -e "SELECT 1;" myapp_db
```

#### 容器无法启动

```bash
# 检查容器状态
docker compose ps

# 查看详细日志
docker compose logs --tail 100 web
```

### 8.2 性能优化

#### 数据库优化

```bash
# 进入MySQL
docker compose exec db mysql -u myapp_user -pmyapp_password123 myapp_db

# 分析表 (在MySQL shell中运行)
ANALYZE TABLE;
```

#### 清理Docker

```bash
# 清理未使用的镜像
docker image prune -a

# 清理未使用的卷
docker volume prune

# 清理构建缓存
docker builder prune
```

---

## 9. 安全配置

### 9.1 服务器安全

```bash
# 禁用root登录
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# 修改SSH端口 (可选)
# sudo sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config

# 重启SSH
sudo systemctl restart sshd

# 安装fail2ban
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
```

### 9.2 Docker安全

```bash
# 限制容器资源
docker update --memory=2g --memory-swap=2g my-app-web-1

# 启用Docker内容信任
export DOCKER_CONTENT_TRUST=1
```

---

## 10. 回滚策略

### 10.1 应用回滚

```bash
cd /opt/mitu-world/my-app

# 回滚到上一个版本 (如有Git仓库)
git log --oneline -10
git reset --hard <commit-hash>

# 重新构建部署
docker compose build web
docker compose up -d web
```

### 10.2 数据库回滚

```bash
# 恢复备份
BACKUP_FILE="/opt/backups/backup_20260514_020000.sql.gz"

# 解压并导入
gunzip -c ${BACKUP_FILE} | docker compose exec -T db mysql -u myapp_user -pmyapp_password123 myapp_db
```

---

## 11. 本地开发部署

对于本地开发，可以直接使用以下命令：

```bash
# 进入项目目录
cd /home/wanwan/桌面/网站初版/my-app

# 复制环境变量示例
cp .env.example .env
# 编辑 .env 文件，配置必要的环境变量

# 安装依赖
npm install

# 生成Prisma客户端
npx prisma generate

# 启动Docker服务 (数据库)
docker compose up -d db

# 等待数据库启动后，运行迁移
npx prisma migrate dev

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 查看应用。

---

> **文档结束**
