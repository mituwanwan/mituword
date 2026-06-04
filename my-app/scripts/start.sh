#!/bin/bash
# ============================================
# 启动开发环境脚本 - 运维学习第2步
# 功能：启动MySQL、phpMyAdmin
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "=========================================="
echo "🚀 启动开发环境"
echo "=========================================="
echo -e "${NC}"

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker未安装！请先运行 ./scripts/setup.sh${NC}"
    exit 1
fi

# 检查.env.local
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}警告: .env.local 文件不存在${NC}"
    if [ -f .env.example ]; then
        echo -e "${YELLOW}从 .env.example 复制...${NC}"
        cp .env.example .env.local
    fi
fi

echo -e "${BLUE}正在启动MySQL数据库...${NC}"

# 只启动db和phpmyadmin（开发环境，不启动app）
docker compose up -d db phpmyadmin

echo ""
echo -e "${GREEN}=========================================="
echo "✅ 服务已启动！"
echo "=========================================="
echo ""
echo "📊 数据库信息："
echo "   - MySQL地址: localhost:3306"
echo "   - phpMyAdmin: http://localhost:8080"
echo ""
echo "🌐 应用相关："
echo "   - 接下来运行: npm install"
echo "   - 然后运行: npx prisma generate"
echo "   - 然后运行: npx prisma db push"
echo "   - 最后运行: npm run dev"
echo ""
echo "🔧 其他命令："
echo "   - 查看日志: ./scripts/logs.sh"
echo "   - 停止服务: ./scripts/stop.sh"
echo "=========================================="
echo -e "${NC}"
