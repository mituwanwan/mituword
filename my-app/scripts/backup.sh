#!/bin/bash
# ============================================
# 数据库备份脚本 - 运维学习第6步
# 功能：定时或手动备份MySQL数据库
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# 配置
BACKUP_DIR="${PROJECT_ROOT}/backups"
DATE=$(date +%Y%m%d_%H%M%S)
MYSQL_USER="${MYSQL_USER:-myapp_user}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-myapp_password123}"
MYSQL_DATABASE="${MYSQL_DATABASE:-myapp_db}"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${BLUE}"
echo "=========================================="
echo "💾 数据库备份"
echo "=========================================="
echo -e "${NC}"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 从.env.local加载环境变量
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

# 使用Docker执行mysqldump
echo "正在备份数据库 ${MYSQL_DATABASE}..."

docker compose exec -T db mysqldump \
  -u"${MYSQL_USER}" \
  -p"${MYSQL_PASSWORD}" \
  --single-transaction \
  --routines \
  --triggers \
  "${MYSQL_DATABASE}" | gzip > "${BACKUP_DIR}/backup_${DATE}.sql.gz"

if [ $? -eq 0 ]; then
    BACKUP_FILE="${BACKUP_DIR}/backup_${DATE}.sql.gz"
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | awk '{print $1}')

    echo ""
    echo -e "${GREEN}✅ 备份成功！${NC}"
    echo "文件: ${BACKUP_FILE}"
    echo "大小: ${BACKUP_SIZE}"

    # 删除7天前的旧备份
    echo ""
    echo "清理7天前的旧备份..."
    find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +7 -delete

    echo ""
    echo "当前备份列表:"
    ls -lh "$BACKUP_DIR"
else
    echo "备份失败！"
    exit 1
fi
