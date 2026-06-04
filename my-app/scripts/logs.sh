#!/bin/bash
# ============================================
# 查看服务日志脚本 - 运维学习第4步
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "=========================================="
echo "📋 服务日志"
echo "=========================================="
echo -e "${NC}"

# 查看参数指定服务的日志，否则所有
if [ "$1" ]; then
    echo "正在查看 $1 服务的日志..."
    echo "按 Ctrl+C 退出"
    echo "------------------------"
    docker compose logs -f "$1"
else
    echo "正在查看所有服务的日志..."
    echo "按 Ctrl+C 退出"
    echo "------------------------"
    docker compose logs -f
fi
