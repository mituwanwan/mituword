# 迷途世界 (MituWorld) — API 接口文档

> 版本：v1.0  
> 日期：2026-06-04  
> Base URL: `https://mituworld.com/api`

---

## 1. 通用规范

### 1.1 响应格式
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

### 1.2 错误格式
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "资源不存在"
  }
}
```

### 1.3 HTTP 状态码
| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 2. 业务 API

### 2.1 项目

#### GET `/api/projects`
获取项目列表

**Query Parameters:**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 否 | 分类筛选 |
| tag | string | 否 | 标签筛选 |
| status | string | 否 | 状态筛选 |
| featured | boolean | 否 | 是否精选 |
| search | string | 否 | 搜索关键词 |
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认12 |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 24,
    "page": 1,
    "limit": 12
  }
}
```

#### GET `/api/projects/[slug]`
获取项目详情

---

### 2.2 日记

#### GET `/api/diaries`
获取日记列表

**Query Parameters:**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| tag | string | 否 | 标签筛选 |
| year | number | 否 | 年份筛选 |
| page | number | 否 | 页码 |
| limit | number | 否 | 每页数量 |

#### GET `/api/diaries/[slug]`
获取日记详情

---

### 2.3 好站分享 ⭐

#### GET `/api/sites`
获取网站列表

**Query Parameters:**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 否 | 分类 |
| search | string | 否 | 搜索 |
| featured | boolean | 否 | 是否精选 |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Dribbble",
      "url": "https://dribbble.com",
      "description": "设计师灵感社区",
      "category": "DESIGN",
      "iconUrl": "https://...",
      "rating": 5,
      "tags": ["设计", "灵感"]
    }
  ]
}
```

#### POST `/api/sites` (管理员)
添加网站

**Body:**
```json
{
  "title": "网站名称",
  "url": "https://example.com",
  "description": "描述",
  "category": "DEV_TOOLS",
  "tags": ["工具", "开发"]
}
```

#### PUT `/api/sites/[id]` (管理员)
更新网站

#### DELETE `/api/sites/[id]` (管理员)
删除网站

---

### 2.4 每日日报 ⭐

#### GET `/api/daily`
获取当日日报

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "date": "2026-06-04",
    "title": "迷途日报 · 6月4日",
    "quote": "代码是写给人看的，顺便给机器运行。",
    "quoteAuthor": "Harold Abelson",
    "track": { /* 音乐对象 */ },
    "site": { /* 好站对象 */ },
    "customText": "今天发现了一个很棒的工具..."
  }
}
```

#### GET `/api/daily?history=true`
获取历史日报列表

#### POST `/api/daily/generate` (管理员)
手动触发生成日报

#### PUT `/api/daily/[id]` (管理员)
编辑日报

---

### 2.5 统计数据

#### GET `/api/stats`
获取首页统计数据

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": 12,
    "diaries": 28,
    "tracks": 156,
    "sites": 42
  }
}
```

---

## 3. 网易云音乐代理 API

> 这些接口由独立的 `netease-api` 服务提供，Next.js 通过内部网络转发或代理。

### 3.1 用户歌单

#### GET `http://netease-api:3001/user/playlist?uid=17585834212`

**Response:**
```json
{
  "playlist": [
    {
      "id": 123456,
      "name": "我喜欢的音乐",
      "trackCount": 156,
      "coverImgUrl": "https://..."
    }
  ]
}
```

### 3.2 歌单详情

#### GET `http://netease-api:3001/playlist/detail?id={playlistId}`

**Response:**
```json
{
  "playlist": {
    "tracks": [
      {
        "id": 789012,
        "name": "歌曲名",
        "artists": [{ "name": "歌手" }],
        "album": { "name": "专辑", "picUrl": "https://..." }
      }
    ]
  }
}
```

### 3.3 歌曲 URL

#### GET `http://netease-api:3001/song/url?id={trackId}`

**Response:**
```json
{
  "data": [
    {
      "id": 789012,
      "url": "https://m801.music.126.net/...",
      "br": 320000,
      "size": 9876543
    }
  ]
}
```

⚠️ **注意**: URL 有效期约 5-10 分钟，不可缓存。

### 3.4 歌词

#### GET `http://netease-api:3001/lyric?id={trackId}`

---

## 4. Next.js 代理转发

在 `app/api/music/[...path]/route.ts` 中：

```typescript
import { NextRequest, NextResponse } from 'next/server';

const NETEASE_API = process.env.NETEASE_API_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const searchParams = request.nextUrl.searchParams;
  
  const url = `${NETEASE_API}/${path}?${searchParams.toString()}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || '',
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '音乐服务暂时不可用' },
      { status: 503 }
    );
  }
}
```

前端调用：`/api/music/user/playlist?uid=17585834212`

---

## 5. 认证相关

### POST `/api/auth/[...nextauth]`
NextAuth.js 标准接口

### GET `/api/auth/session`
获取当前会话

---

## 6. Rate Limiting 建议

| 接口 | 限制 | 说明 |
|------|------|------|
| 网易云代理 | 60次/分钟 | 防止触发风控 |
| 登录 | 5次/分钟 | 防暴力破解 |
| 通用 API | 120次/分钟 | 正常浏览足够 |
