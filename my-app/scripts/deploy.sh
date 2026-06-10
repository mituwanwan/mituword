#!/bin/bash
set -e

# 迷途世界 (MituWorld) 部署脚本
# 用法: ./scripts/deploy.sh

echo "🚀 开始部署 MituWorld..."

# 1. 拉取最新代码
echo "📦 拉取最新代码..."
git pull origin main

# 2. 构建 Docker 镜像
echo "🐳 构建 Docker 镜像..."
docker-compose build --no-cache

# 3. 执行数据库迁移
echo "🗄️ 执行数据库迁移..."
docker-compose run --rm app npx prisma migrate deploy

# 4. 启动服务
echo "▶️ 启动服务..."
docker-compose up -d

# 5. 健康检查
echo "🏥 健康检查..."
sleep 5
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ 部署成功！服务运行正常"
else
    echo "❌ 部署失败，健康检查未通过"
    exit 1
fi

echo "🎉 部署完成！"
