# 迷途世界 - API接口规范文档

> **文档版本**: v2.0  
> **创建日期**: 2026-05-14  
> **最后更新**: 2026-06-04  
> **关联文档**: [SDD](../01-SDD/01-Software-Design-Document.md)

---

## 1. 接口设计规范

### 1.1 基础规范

- **Base URL**: `https://mituworld.com/api`
- **协议**: HTTPS only
- **字符编码**: UTF-8
- **请求格式**: JSON
- **响应格式**: JSON

### 1.2 HTTP方法语义

| 方法 | 用途 | 幂等性 |
|------|------|--------|
| GET | 获取资源 | 是 |
| POST | 创建资源 | 否 |
| PUT | 全量更新资源 | 是 |
| PATCH | 部分更新资源 | 是 |
| DELETE | 删除资源 | 是 |

### 1.3 状态码规范

| 状态码 | 含义 | 使用场景 |
|--------|------|---------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 删除成功，无返回内容 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突 |
| 422 | Unprocessable Entity | 验证失败 |
| 429 | Too Many Requests | 请求频率限制 |
| 500 | Internal Server Error | 服务器内部错误 |
| 503 | Service Unavailable | 第三方服务不可用（如网易云API） |

### 1.4 响应格式

**成功响应**:
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2026-06-04T12:00:00Z"
}
```

**错误响应**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": []
  },
  "timestamp": "2026-06-04T12:00:00Z"
}
```

**分页响应**:
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "获取成功",
  "timestamp": "2026-06-04T12:00:00Z"
}
```

### 1.5 认证方式

使用 NextAuth.js Session Cookie 认证。

**请求头**:
```
Cookie: next-auth.session-token=xxx
```

---

## 2. 认证接口

### 2.1 管理员登录

**POST** `/api/auth/callback/credentials`

**请求体**:
```json
{
  "email": "admin@example.com",
  "password": "your_password",
  "csrfToken": "xxx"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "管理员",
      "email": "admin@example.com",
      "image": null
    }
  },
  "message": "登录成功",
  "timestamp": "2026-06-04T12:00:00Z"
}
```

### 2.2 登出

**POST** `/api/auth/signout`

**响应**:
```json
{
  "success": true,
  "data": null,
  "message": "登出成功",
  "timestamp": "2026-06-04T12:00:00Z"
}
```

### 2.3 获取会话

**GET** `/api/auth/session`

---

## 3. 系统接口

### 3.1 健康检查

**GET** `/api/health`

**响应**:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "services": {
      "database": "ok",
      "neteaseApi": "ok"
    }
  },
  "timestamp": "2026-06-04T12:00:00Z"
}
```

### 3.2 首页统计数据

**GET** `/api/stats`

**响应**:
```json
{
  "success": true,
  "data": {
    "projects": 12,
    "diaries": 28,
    "tracks": 156,
    "sites": 42
  },
  "message": "获取成功",
  "timestamp": "2026-06-04T12:00:00Z"
}
```

---

## 4. 个人介绍接口（保持不变）

略，请参考 v1.0 文档。

---

## 5. 项目展示接口（保持不变）

略，请参考 v1.0 文档。

---

## 6. GitHub集成接口（保持不变）

略，请参考 v1.0 文档。

---

## 7. 网易云音乐接口 ⭐

### 7.1 歌单管理

#### 获取歌单列表
**GET** `/api/music/playlists`

#### 获取歌单详情
**GET** `/api/music/playlists/:id`

#### 同步歌单数据
**POST** `/api/music/sync`（需认证）

**响应**:
```json
{
  "success": true,
  "data": {
    "syncedCount": 156,
    "message": "同步成功"
  },
  "timestamp": "2026-06-04T12:00:00Z"
}
```

### 7.2 歌曲管理

#### 获取歌曲列表
**GET** `/api/music/tracks`

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |
| search | string | 否 | 搜索关键词 |

#### 获取歌曲详情
**GET** `/api/music/tracks/:id`

#### 获取播放链接（实时）
**GET** `/api/music/tracks/:id/url`

**响应**:
```json
{
  "success": true,
  "data": {
    "url": "https://m801.music.126.net/...",
    "expiresAt": "2026-06-04T12:10:00Z"
  },
  "message": "获取成功",
  "timestamp": "2026-06-04T12:00:00Z"
}
```

### 7.3 网易云API代理

**GET** `/api/music/netease/*`（内部使用）

代理请求到网易云API服务，支持网易云API的所有接口。

---

## 8. 日记分享接口（保持不变）

略，请参考 v1.0 文档。

---

## 9. 好站分享接口 ⭐

### 9.1 网站列表与详情

#### 获取网站列表
**GET** `/api/sites`

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |
| category | string | 否 | 分类 (DEV_TOOLS/DESIGN/LEARNING/MUSIC/GAME/PRODUCTIVITY/OTHER) |
| search | string | 否 | 搜索关键词 |
| featured | boolean | 否 | 是否精选 |
| sortBy | string | 否 | 排序字段 (clickCount/createdAt) |

#### 获取网站详情
**GET** `/api/sites/:id`

#### 记录点击
**POST** `/api/sites/:id/click`

### 9.2 网站管理（需认证）

#### 添加网站
**POST** `/api/sites`（需认证）

**请求体**:
```json
{
  "title": "网站名称",
  "url": "https://example.com",
  "description": "网站描述（最多500字）",
  "iconUrl": "https://example.com/icon.png",
  "category": "DEV_TOOLS",
  "tags": ["开发", "工具"],
  "rating": 5,
  "featured": true
}
```

#### 更新网站
**PUT** `/api/sites/:id`（需认证）

#### 删除网站
**DELETE** `/api/sites/:id`（需认证）

### 9.3 分类管理

#### 获取分类列表
**GET** `/api/site-categories`

---

## 10. 每日日报接口 ⭐

### 10.1 日报查询

#### 获取今日日报
**GET** `/api/daily/today`

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "date": "2026-06-04",
    "title": "迷途日报 · 6月4日",
    "status": "PUBLISHED",
    "quote": "代码是写给人看的，顺便给机器运行。",
    "quoteAuthor": "Harold Abelson",
    "track": { "id": "uuid", "name": "推荐歌曲", "artist": "歌手" },
    "site": { "id": "uuid", "title": "推荐网站" },
    "diary": { "id": "uuid", "title": "推荐日记" },
    "customText": "自定义内容（Markdown格式）"
  },
  "message": "获取成功",
  "timestamp": "2026-06-04T12:00:00Z"
}
```

#### 获取历史日报列表
**GET** `/api/daily/history`

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

#### 获取日报详情
**GET** `/api/daily/:id`

### 10.2 日报管理（需认证）

#### 手动生成日报
**POST** `/api/daily/generate`（需认证）

#### 更新日报
**PUT** `/api/daily/:id`（需认证）

#### 删除日报
**DELETE** `/api/daily/:id`（需认证）

#### 变更日报状态
**PATCH** `/api/daily/:id/status`（需认证）

**请求体**:
```json
{
  "status": "PUBLISHED" // DRAFT/PUBLISHED/HIDDEN
}
```

---

## 11. 文件上传接口（保持不变）

略，请参考 v1.0 文档。

---

## 12. 接口变更记录

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-06-04 | 新增好站分享接口、每日日报接口，更新网易云音乐接口为代理模式 |
| v1.0 | 2026-05-14 | 初始版本 |

---

> **文档结束**  
> 如有疑问，请联系项目技术负责人。
