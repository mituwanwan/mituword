#!/bin/bash
# ============================================
# 销毁开发环境脚本 - 运维学习第5步
# 警告：这将删除所有数据！
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${RED}"
echo "=========================================="
echo "⚠️  警告：这将销毁所有数据！"
echo "=========================================="
echo -e "${NC}"
echo "此操作会："
echo "  - 停止并删除所有容器"
echo "  - 删除MySQL数据Volume"
echo "  - 清除所有数据库内容"
echo ""
read -p "确定要继续吗？输入 'YES' 确认: " confirm

if [ "$confirm" != "YES" ]; then
    echo "操作已取消"
    exit 0
fi

echo ""
echo -e "${YELLOW}正在销毁环境...${NC}"

docker compose down -v
docker volume rm -f my-app-mysql-data 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ 已销毁！${NC}"
echo ""
echo "重新开始：./scripts/start.sh"
