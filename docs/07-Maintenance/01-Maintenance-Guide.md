# 维护指南文档

> **文档版本**: v2.0
> **创建日期**: 2026-05-14
> **更新日期**: 2026-06-04
> **关联文档**: [SDD](../01-SDD/01-Software-Design-Document.md)

---

## 1. 日常维护

### 1.1 每日检查清单

- [ ] 检查应用状态
- [ ] 查看错误日志
- [ ] 检查磁盘空间
- [ ] 检查内存使用
- [ ] 检查数据库连接

### 1.2 每周检查清单

- [ ] 分析访问日志
- [ ] 检查安全日志
- [ ] 更新依赖包
- [ ] 备份数据验证
- [ ] 性能指标检查

### 1.3 每月检查清单

- [ ] 安全漏洞扫描
- [ ] 数据库优化
- [ ] SSL证书检查
- [ ] 资源使用趋势分析
- [ ] 文档更新

---

## 2. 日志管理

### 2.1 日志级别

| 级别 | 用途 | 示例 |
|------|------|------|
| ERROR | 错误 | 数据库连接失败 |
| WARN | 警告 | API响应慢 |
| INFO | 信息 | 用户登录 |
| DEBUG | 调试 | 请求参数 |

### 2.2 日志查看

```bash
# 查看应用日志
docker compose logs -f app --tail=100

# 查看错误日志
docker compose logs app 2>&1 | grep ERROR

# 查看Nginx访问日志
docker compose exec nginx tail -f /var/log/nginx/access.log

# 查看Nginx错误日志
docker compose exec nginx tail -f /var/log/nginx/error.log
```

### 2.3 日志轮转

```bash
# 手动轮转日志
docker compose exec nginx nginx -s reopen

# 查看日志大小
du -sh /var/lib/docker/containers/*/
```

---

## 3. 性能监控

### 3.1 监控指标

| 指标 | 正常范围 | 告警阈值 |
|------|---------|---------|
| CPU使用率 | < 70% | > 80% |
| 内存使用率 | < 80% | > 90% |
| 磁盘使用率 | < 80% | > 90% |
| 响应时间 | < 500ms | > 1000ms |
| 错误率 | < 1% | > 5% |

### 3.2 性能检查

```bash
# 查看系统资源
top
htop

# 查看Docker资源
docker stats

# 查看数据库性能
docker compose exec db psql -U postgres -c "SELECT * FROM pg_stat_activity;"

# 查看表大小
docker compose exec db psql -U postgres -d personal_website -c "
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
WHERE schemaname='public' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

---

## 4. 安全维护

### 4.1 安全更新

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 更新Docker镜像
docker compose pull
docker compose up -d

# 扫描镜像漏洞
docker scan personal-website-app
```

### 4.2 访问控制

```bash
# 查看登录记录
last

# 查看失败登录
sudo grep "Failed password" /var/log/auth.log

# 查看当前连接
ss -tuln
```

### 4.3 SSL证书

```bash
# 检查证书过期时间
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# 手动续期
docker compose run --rm certbot renew

# 强制续期
docker compose run --rm certbot renew --force-renew
```

---

## 5. 数据维护

### 5.1 数据库维护

```bash
# 数据库备份
docker compose exec db pg_dump -U postgres personal_website > backup.sql

# 数据库恢复
docker compose exec -T db psql -U postgres -d personal_website < backup.sql

# 清理旧数据
docker compose exec db psql -U postgres -d personal_website -c "
DELETE FROM comments WHERE created_at < NOW() - INTERVAL '1 year';
"

# 优化表
docker compose exec db psql -U postgres -d personal_website -c "VACUUM ANALYZE;"
```

### 5.2 文件清理

```bash
# 清理上传文件
find /opt/personal-website/uploads -type f -mtime +365 -delete

# 清理日志
find /var/log -name "*.log" -type f -mtime +30 -delete

# 清理Docker
 docker system prune -a
```

---

## 6. 故障处理

### 6.1 常见故障

#### 服务无法启动

```bash
# 检查容器状态
docker compose ps

# 查看日志
docker compose logs app

# 重启服务
docker compose restart app
```

#### 数据库连接失败

```bash
# 检查数据库状态
docker compose ps db

# 重启数据库
docker compose restart db

# 检查连接
docker compose exec db pg_isready -U postgres
```

#### 内存不足

```bash
# 查看内存使用
free -h

# 重启服务释放内存
docker compose restart

# 增加交换空间
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 6.2 紧急回滚

```bash
# 回滚到上一个版本
cd /opt/personal-website
git log --oneline -5
git reset --hard HEAD~1

# 重新构建
docker compose build app
docker compose up -d app

# 数据库回滚
docker compose exec -T db psql -U postgres -d personal_website < backup.sql
```

---

## 7. 扩展维护

### 7.1 扩容

```bash
# 垂直扩容 (增加资源)
docker update --memory=4g personal-website-app

# 水平扩容 (需要负载均衡)
# 配置多个实例 + 负载均衡器
```

### 7.2 功能扩展

1. 在开发环境实现功能
2. 编写测试
3. 代码审查
4. 部署到测试环境
5. 验证功能
6. 部署到生产环境

---

## 8. 新模块维护指南

### 8.1 网易云音乐模块维护

#### 日常检查
- 检查网易云音乐API服务可用性
- 监控音乐同步任务执行状态
- 验证播放链接有效性

#### 数据维护
```bash
# 清理过期播放缓存
docker compose exec web node -e "
const { prisma } = require('./lib/prisma');
prisma.musicTrack.updateMany({
  where: { playUrl: { not: null } },
  data: { playUrl: null }
}).then(console.log).catch(console.error);
"

# 手动触发歌单同步
docker compose exec web curl -X POST http://localhost:3000/api/music/sync
```

#### 故障排查
- 检查网易云音乐API密钥配置
- 验证歌单ID设置
- 查看音乐同步日志

### 8.2 好站分享模块维护

#### 日常检查
- 监控好站链接有效性
- 检查访问统计数据
- 验证分类完整性

#### 数据维护
```bash
# 清理无效链接
docker compose exec db mysql -u root -prootpassword myapp_db -e "
UPDATE site_shares 
SET is_active = FALSE 
WHERE last_checked < DATE_SUB(NOW(), INTERVAL 30 DAY);
"
```

### 8.3 每日日报模块维护

#### 日常检查
- 确认日报生成任务执行
- 检查日报内容完整性
- 验证归档状态

#### 数据维护
```bash
# 清理过期日报归档
docker compose exec db mysql -u root -prootpassword myapp_db -e "
DELETE FROM daily_reports 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
"
```

### 8.4 双主题系统维护

#### 日常检查
- 验证主题切换功能
- 检查主题样式一致性
- 确认主题状态持久化

#### 问题排查
- 检查localStorage主题状态
- 验证CSS变量正确应用
- 确认动画过渡效果

---

## 文档更新记录

| 版本 | 日期 | 更新内容 | 作者 |
|------|------|----------|------|
| v2.0 | 2026-06-04 | 从PostgreSQL迁移到MySQL，添加网易云音乐、好站分享、每日日报和双主题系统维护指南 | 系统架构师 |
| v1.0 | 2026-05-14 | 初始版本，建立完整维护指南 | 系统架构师 |

---

> **文档结束**