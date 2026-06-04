# 测试策略文档

> **文档版本**: v2.0
> **创建日期**: 2026-05-14
> **更新日期**: 2026-06-04
> **关联文档**: [SDD](../01-SDD/01-Software-Design-Document.md)

---

## 1. 测试概述

### 1.1 测试目标

- 确保系统功能符合需求规格
- 保证代码质量和可维护性
- 预防回归错误
- 提供快速反馈机制
- 核心功能测试覆盖率 ≥ 80%

### 1.2 测试金字塔

```
        /\
       /  \     E2E测试 (10%)
      /----\    Playwright
     /      \
    /--------\  集成测试 (30%)
   /   API    \  Jest + Supertest
  /------------\
 /              \
/----------------\ 单元测试 (60%)
/    组件/函数    \  Jest + React Testing Library
/------------------\
```

### 1.3 测试工具

| 类型 | 工具 | 版本 | 用途 |
|------|------|------|------|
| 单元测试 | Jest | 29+ | 测试框架 |
| 组件测试 | React Testing Library | 14+ | React组件测试 |
| E2E测试 | Playwright | 1.40+ | 端到端测试 |
| 覆盖率 | Istanbul | 内置 | 代码覆盖率 |
| Mock | MSW | 2+ | API Mock |

---

## 2. 单元测试

### 2.1 测试范围

- 工具函数
- 自定义Hooks
- 纯组件 (无外部依赖)
- 数据转换函数
- 验证函数

### 2.2 测试文件组织

```
tests/
├── unit/
│   ├── utils/
│   │   ├── formatDate.test.ts
│   │   ├── slugify.test.ts
│   │   └── validators.test.ts
│   ├── hooks/
│   │   ├── useAuth.test.ts
│   │   ├── useFetch.test.ts
│   │   └── useLocalStorage.test.ts
│   └── components/
│       ├── Button.test.tsx
│       ├── Input.test.tsx
│       └── Card.test.tsx
```

### 2.3 测试示例

#### 工具函数测试

```typescript
// tests/unit/utils/formatDate.test.ts
import { formatDate, formatRelativeTime } from '@/lib/utils';

describe('formatDate', () => {
  it('应该正确格式化日期', () => {
    const date = new Date('2026-05-14T12:00:00Z');
    expect(formatDate(date)).toBe('2026年5月14日');
  });

  it('应该支持自定义格式', () => {
    const date = new Date('2026-05-14T12:00:00Z');
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2026-05-14');
  });

  it('应该处理无效日期', () => {
    expect(formatDate(null)).toBe('-');
    expect(formatDate(undefined)).toBe('-');
  });
});

describe('formatRelativeTime', () => {
  it('应该返回相对时间', () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);
    expect(formatRelativeTime(oneHourAgo)).toBe('1小时前');
  });
});
```

#### 自定义Hook测试

```typescript
// tests/unit/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { SessionProvider } from 'next-auth/react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={null}>{children}</SessionProvider>
);

describe('useAuth', () => {
  it('应该返回未登录状态', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('应该处理登录', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login('admin@example.com', 'password');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

#### 组件测试

```typescript
// tests/unit/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('应该渲染按钮文本', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });

  it('应该处理点击事件', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>点击我</Button>);
    
    fireEvent.click(screen.getByText('点击我'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('应该在加载时禁用', () => {
    render(<Button isLoading>加载中</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('应该支持不同变体', () => {
    const { rerender } = render(<Button variant="primary">主要</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-500');
    
    rerender(<Button variant="secondary">次要</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-slate-700');
  });
});
```

---

## 3. 集成测试

### 3.1 测试范围

- API路由
- 数据库操作
- 外部服务集成
- 认证流程

### 3.2 测试文件组织

```
tests/
├── integration/
│   ├── api/
│   │   ├── profile.test.ts
│   │   ├── projects.test.ts
│   │   ├── music.test.ts
│   │   └── diaries.test.ts
│   └── db/
│       ├── user.test.ts
│       └── project.test.ts
```

### 3.3 测试示例

#### API路由测试

```typescript
// tests/integration/api/profile.test.ts
import { createMocks } from 'node-mocks-http';
import { GET, PUT } from '@/app/api/profile/route';
import { prisma } from '@/lib/prisma';

describe('Profile API', () => {
  beforeEach(async () => {
    await prisma.profile.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/profile', () => {
    it('应该返回用户档案', async () => {
      // 创建测试数据
      await prisma.profile.create({
        data: {
          fullName: '测试用户',
          title: '测试职位',
          bio: '测试简介',
        },
      });

      const { req, res } = createMocks({
        method: 'GET',
      });

      await GET(req);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.data.fullName).toBe('测试用户');
    });

    it('应该处理不存在的档案', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await GET(req);

      expect(res._getStatusCode()).toBe(404);
    });
  });

  describe('PUT /api/profile', () => {
    it('应该更新用户档案', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        body: {
          fullName: '更新名称',
          title: '更新职位',
          bio: '更新简介',
        },
      });

      await PUT(req);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.data.fullName).toBe('更新名称');
    });

    it('应该验证必填字段', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        body: {
          fullName: '',
        },
      });

      await PUT(req);

      expect(res._getStatusCode()).toBe(422);
    });
  });
});
```

#### 数据库操作测试

```typescript
// tests/integration/db/user.test.ts
import { prisma } from '@/lib/prisma';

describe('User Database Operations', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('应该创建用户', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: '测试用户',
        password: 'hashed_password',
      },
    });

    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('测试用户');
  });

  it('应该阻止重复邮箱', async () => {
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: '用户1',
        password: 'password1',
      },
    });

    await expect(
      prisma.user.create({
        data: {
          email: 'test@example.com',
          name: '用户2',
          password: 'password2',
        },
      })
    ).rejects.toThrow();
  });
});
```

---

## 4. E2E测试

### 4.1 测试范围

- 完整用户流程
- 关键业务场景
- 跨页面交互
- 响应式布局

### 4.2 测试文件组织

```
tests/
└── e2e/
    ├── auth.spec.ts
    ├── profile.spec.ts
    ├── projects.spec.ts
    ├── music.spec.ts
    ├── diary.spec.ts
    └── github.spec.ts
```

### 4.3 测试示例

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('认证流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('用户应该能登录', async ({ page }) => {
    // 访问登录页
    await page.click('text=登录');
    
    // 填写表单
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'password');
    
    // 提交
    await page.click('button[type="submit"]');
    
    // 验证登录成功
    await expect(page.locator('text=欢迎回来')).toBeVisible();
    await expect(page.locator('text=admin@example.com')).toBeVisible();
  });

  test('应该显示登录错误', async ({ page }) => {
    await page.click('text=登录');
    
    await page.fill('[name="email"]', 'wrong@example.com');
    await page.fill('[name="password"]', 'wrong');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=邮箱或密码错误')).toBeVisible();
  });

  test('用户应该能登出', async ({ page }) => {
    // 先登录
    await page.click('text=登录');
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // 登出
    await page.click('text=退出');
    
    // 验证登出
    await expect(page.locator('text=登录')).toBeVisible();
  });
});

// tests/e2e/projects.spec.ts
import { test, expect } from '@playwright/test';

test.describe('项目展示', () => {
  test('应该显示项目列表', async ({ page }) => {
    await page.goto('/projects');
    
    // 验证页面标题
    await expect(page.locator('h1')).toContainText('项目展示');
    
    // 验证项目卡片存在
    const cards = page.locator('[data-testid="project-card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('应该能搜索项目', async ({ page }) => {
    await page.goto('/projects');
    
    // 搜索
    await page.fill('[placeholder="搜索项目..."]', 'React');
    await page.press('[placeholder="搜索项目..."]', 'Enter');
    
    // 验证搜索结果
    await expect(page.locator('text=React')).toBeVisible();
  });

  test('应该能筛选项目', async ({ page }) => {
    await page.goto('/projects');
    
    // 选择分类
    await page.selectOption('select[name="category"]', 'fullstack');
    
    // 验证筛选结果
    const cards = page.locator('[data-testid="project-card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('应该能查看项目详情', async ({ page }) => {
    await page.goto('/projects');
    
    // 点击第一个项目
    await page.click('[data-testid="project-card"]:first-child');
    
    // 验证详情页
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="project-description"]')).toBeVisible();
  });
});

// tests/e2e/music.spec.ts
import { test, expect } from '@playwright/test';

test.describe('音乐播放器', () => {
  test('应该能播放音乐', async ({ page }) => {
    await page.goto('/music');
    
    // 点击播放按钮
    await page.click('[data-testid="play-button"]:first-child');
    
    // 验证播放器显示
    await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
    
    // 验证播放状态
    await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();
  });

  test('播放器应该在页面切换时保持', async ({ page }) => {
    await page.goto('/music');
    
    // 播放音乐
    await page.click('[data-testid="play-button"]:first-child');
    
    // 切换到其他页面
    await page.click('text=项目');
    
    // 验证播放器仍然存在
    await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
  });
});
```

---

## 5. 测试配置

### 5.1 Jest配置

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.ts',
    '<rootDir>/tests/unit/**/*.test.tsx',
    '<rootDir>/tests/integration/**/*.test.ts',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### 5.2 Playwright配置

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 5.3 测试脚本

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

---

## 6. 测试数据管理

### 6.1 测试数据库

```typescript
// tests/setup.ts
import { prisma } from '@/lib/prisma';

beforeAll(async () => {
  // 连接测试数据库
  await prisma.$connect();
});

beforeEach(async () => {
  // 清理数据
  await prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.diary.deleteMany(),
    prisma.project.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

### 6.2 测试工厂

```typescript
// tests/factories/user.ts
import { prisma } from '@/lib/prisma';

export function createUser(overrides = {}) {
  return prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      name: '测试用户',
      password: 'hashed_password',
      ...overrides,
    },
  });
}

export function createProfile(userId: string, overrides = {}) {
  return prisma.profile.create({
    data: {
      userId,
      fullName: '测试用户',
      title: '测试职位',
      bio: '测试简介',
      ...overrides,
    },
  });
}
```

---

## 7. 覆盖率要求

### 7.1 覆盖率目标

| 模块 | 语句覆盖率 | 分支覆盖率 | 函数覆盖率 |
|------|-----------|-----------|-----------|
| 认证模块 | ≥90% | ≥85% | ≥90% |
| 个人介绍 | ≥85% | ≥80% | ≥85% |
| 项目展示 | ≥85% | ≥80% | ≥85% |
| GitHub集成 | ≥80% | ≥75% | ≥80% |
| 音乐收藏 | ≥80% | ≥75% | ≥80% |
| 日记分享 | ≥85% | ≥80% | ≥85% |
| **整体** | **≥80%** | **≥75%** | **≥80%** |

### 7.2 覆盖率报告

```bash
# 生成覆盖率报告
npm run test:coverage

# 查看HTML报告
open coverage/lcov-report/index.html
```

---

## 8. CI/CD集成

### 8.1 GitHub Actions配置

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup database
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Run unit tests
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 9. 测试最佳实践

### 9.1 命名规范

```typescript
// ✅ 正确：描述性的测试名
describe('UserService', () => {
  describe('createUser', () => {
    it('应该创建新用户并返回用户对象', () => {});
    it('应该阻止使用已存在的邮箱', () => {});
    it('应该对密码进行哈希处理', () => {});
  });
});

// ❌ 错误：模糊的测试名
describe('UserService', () => {
  it('works', () => {});
  it('test1', () => {});
});
```

### 9.2 测试结构

```typescript
describe('功能模块', () => {
  // 共享的setup
  beforeAll(() => {});
  
  beforeEach(() => {});
  
  afterEach(() => {});
  
  afterAll(() => {});
  
  describe('具体功能', () => {
    it('应该...', () => {});
    it('应该...', () => {});
  });
});
```

### 9.3 测试原则

1. **独立性**: 每个测试应该独立运行
2. **可重复性**: 测试结果应该一致
3. **快速性**: 测试应该快速执行
4. **可读性**: 测试应该易于理解
5. **维护性**: 测试应该易于维护

---

## 10. 新模块测试策略

### 10.1 网易云音乐模块测试

#### 单元测试
- 音乐播放状态管理
- 歌曲列表组件渲染
- 音乐播放器组件
- 歌单同步逻辑

#### 集成测试
- 网易云音乐API调用
- 音乐数据同步
- 歌单与歌曲关联操作
- 播放URL获取与验证

#### E2E测试
- 音乐播放流程
- 歌单切换功能
- 播放器控制（播放/暂停/上一首/下一首）
- 音量调节功能

### 10.2 好站分享模块测试

#### 单元测试
- 好站卡片组件
- 分类筛选组件
- 搜索功能组件
- 后台管理表单验证

#### 集成测试
- 好站CRUD操作
- 分类管理API
- 搜索与筛选API
- 用户浏览统计

#### E2E测试
- 好站浏览与分类切换
- 搜索功能验证
- 后台管理操作（需认证）

### 10.3 每日日报模块测试

#### 单元测试
- 日报卡片组件
- 日报详情展示
- 自动生成逻辑测试

#### 集成测试
- 日报生成API
- 日报发布管理
- 历史日报归档查询

#### E2E测试
- 日报查看功能
- 日报切换
- 后台管理发布功能

### 10.4 双主题系统测试

#### 单元测试
- 主题状态管理
- 主题切换Hook
- 主题色值常量测试

#### 集成测试
- 主题持久化（localStorage）
- 主题切换DOM响应
- 响应式布局适配

#### E2E测试
- 主题切换功能
- 主题状态记忆
- 不同主题下页面渲染

---

## 文档更新记录

| 版本 | 日期 | 更新内容 | 作者 |
|------|------|----------|------|
| v2.0 | 2026-06-04 | 从PostgreSQL迁移到MySQL，添加网易云音乐、好站分享、每日日报和双主题系统测试策略 | 系统架构师 |
| v1.0 | 2026-05-14 | 初始版本，建立完整测试策略 | 系统架构师 |

---

> **文档结束**