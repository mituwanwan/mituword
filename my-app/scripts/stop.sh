#!/bin/bash
# ============================================
# 停止开发环境脚本 - 运维学习第3步
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${BLUE}"
echo "=========================================="
echo "⏹️  停止开发环境"
echo "=========================================="
echo -e "${NC}"

# 停止但不删除数据
docker compose stop

echo ""
echo -e "${GREEN}✅ 服务已停止！${NC}"
echo ""
echo "📝 说明：数据保留在Docker Volume中"
echo "要完全删除（包括数据）：./scripts/destroy.sh"
