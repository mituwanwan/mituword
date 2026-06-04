#!/bin/bash
# ============================================
# 数据库恢复脚本 - 运维学习第7步
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

BACKUP_DIR="${PROJECT_ROOT}/backups"
MYSQL_USER="${MYSQL_USER:-myapp_user}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-myapp_password123}"
MYSQL_DATABASE="${MYSQL_DATABASE:-myapp_db}"

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${YELLOW}"
echo "=========================================="
echo "⚠️  数据库恢复"
echo "=========================================="
echo -e "${NC}"

# 加载环境变量
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

# 列出可用备份
if [ -d "$BACKUP_DIR" ]; then
    echo "可用备份文件:"
    ls -lh "$BACKUP_DIR"
    echo ""
fi

if [ "$1" ]; then
    BACKUP_FILE="$1"
else
    # 使用最新的备份
    BACKUP_FILE=$(ls -t "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null | head -1)
fi

if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}错误：未找到备份文件${NC}"
    exit 1
fi

echo -e "${YELLOW}准备恢复: $BACKUP_FILE${NC}"
echo ""
read -p "这将覆盖当前数据库！确定吗？输入 'YES' 确认: " confirm

if [ "$confirm" != "YES" ]; then
    echo "操作已取消"
    exit 0
fi

echo "正在恢复..."

gunzip < "$BACKUP_FILE" | docker compose exec -T db \
  mysql -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ 数据库恢复成功！${NC}"
else
    echo "恢复失败！"
    exit 1
fi
