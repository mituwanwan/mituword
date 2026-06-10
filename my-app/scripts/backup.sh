#!/bin/bash
set -e

# 迷途世界 (MituWorld) 数据库备份脚本
# 用法: ./scripts/backup.sh

BACKUP_DIR="/backups/mituworld"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

echo "💾 开始备份数据库..."

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 执行 MySQL 备份
docker-compose exec -T db mysqldump -u myapp_user -pmyapp_password123 myapp_db > "$BACKUP_FILE"

# 压缩备份
gzip "$BACKUP_FILE"

# 保留最近 30 天的备份
find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +30 -delete

echo "✅ 备份完成: $BACKUP_FILE.gz"
