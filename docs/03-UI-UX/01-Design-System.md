# UI/UX 设计系统文档

> **文档版本**: v2.0  
> **创建日期**: 2026-05-14  
> **最后更新**: 2026-06-02  
> **关联文档**: [SDD](../01-SDD/01-Software-Design-Document.md)

---

## 1. 设计哲学

### 1.1 设计愿景
打造一个专业、现代、沉浸式的个人网站，通过**双主题系统**展示个人品牌和技术实力，提供丰富的视觉体验。

### 1.2 主题系统

| 主题 | 名称 | 氛围 |
|------|------|------|
| **Cosmic（宇宙） | 星空探险 | 深邃神秘的宇宙星空背景，包含星空、黑洞、流星、飞碟等元素，营造探索与未知的氛围 |
| **Solar（太阳） | 阳光花园 | 明亮活力的白天花园背景，包含太阳、云朵、蝴蝶、纸飞机等元素，营造轻松愉悦的氛围 |

### 1.3 核心原则

| 原则 | 说明 |
|------|------|
| **内容优先** | 设计服务于内容，避免过度装饰 |
| **一致性** | 统一的视觉语言和交互模式 |
| **双主题切换** | 平滑的主题切换动画，保持用户体验一致性 |
| **响应式** | 所有设备上的一致体验 |
| **可访问性** | 支持键盘导航和屏幕阅读器 |
| **性能** | 流畅的动画，快速的加载 |

---

## 2. 色彩系统

### 2.1 Cosmic（宇宙）主题色彩

```css
/* 宇宙主题 */
:root.dark {
  /* 背景色 */
  --bg-primary: #0a0e27;      /* 深邃宇宙背景 */
  --bg-secondary: #1a1f4e;    /* 次级背景 */
  --bg-tertiary: rgba(10, 14, 39, 0.6);     /* 卡片背景 */
  
  /* 文字色 */
  --text-primary: #e0e0ff;    /* 宇宙前景色 */
  --text-secondary: #c0c0c0;  /* 星尘色 */
  --text-tertiary: #94a3b8;   /* 辅助文字 */

  /* 主题色彩 */
  --cosmic-purple: #8b5cf6;
  --cosmic-pink: #ec4899;
  --cosmic-cyan: #06b6d4;
  --cosmic-sun: #f59e0b;
  --cosmic-earth: #3b82f6;

  /* 功能色 */
  --success: #22c55e;
  --warning: #eab308;
  --error: #ef4444;
  --info: #06b6d4;
}
```

### 2.2 Solar（太阳）主题色彩

```css
/* 太阳主题 */
:root.light {
  /* 背景色 */
  --bg-primary: #fef7ed;      /* 阳光花园背景 */
  --bg-secondary: #fffaf0;    /* 次级背景 */
  --bg-tertiary: rgba(255, 255, 255, 0.7);     /* 卡片背景 */
  
  /* 文字色 */
  --text-primary: #1f2937;    /* 深灰前景色 */
  --text-secondary: #374151;  /* 辅助色 */
  --text-tertiary: #6b7280;   /* 薄雾色 */

  /* 主题色彩 */
  --solar-sun: #f59e0b;
  --solar-sunset: #ff6b35;
  --solar-sky: #87ceeb;
  --solar-ocean: #1e90ff;
  --solar-gold: #ffd700;

  /* 功能色 */
  --success: #22c55e;
  --warning: #eab308;
  --error: #ef4444;
  --info: #06b6d4;
}
```

### 2.3 Cosmic 主题色彩使用规范

| 场景 | 颜色 | Tailwind类 |
|------|------|-----------|
| 页面背景 | #0a0e27 | bg-cosmic-dark |
| 卡片背景 | rgba(10, 14, 39, 0.6) | glass |
| 主标题 | #e0e0ff | text-cosmic-foreground |
| 主按钮 | #8b5cf6 | bg-cosmic-purple |
| 按钮悬停 | #a78bfa | hover:bg-cosmic-purple/80 |
| 链接 | #06b6d4 | text-cosmic-cyan |
| 分割线 | rgba(139, 92, 246, 0.2) | border-cosmic-purple/20 |

### 2.4 Solar 主题色彩使用规范

| 场景 | 颜色 | Tailwind类 |
|------|------|-----------|
| 页面背景 | #fef7ed | bg-solar-light |
| 卡片背景 | rgba(255, 255, 255, 0.7) | glass-solar |
| 主标题 | #1f2937 | text-solar-foreground |
| 主按钮 | #f59e0b | bg-solar-sun |
| 按钮悬停 | #fbbf24 | hover:bg-solar-sun/80 |
| 链接 | #1e90ff | text-solar-ocean |
| 分割线 | rgba(245, 158, 11, 0.2) | border-solar-sun/20 |

### 2.5 渐变定义

#### Cosmic 主题渐变
```css
/* 主渐变 */
--gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
/* 星云渐变 */
--gradient-nebula: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
/* 地球渐变 */
--gradient-earth: radial-gradient(circle at 30% 30%, #3b82f6, #1e40af, #0a0e27);
/* 卡片渐变 */
--gradient-card: linear-gradient(180deg, rgba(26, 31, 78, 0.6) 0%, rgba(10, 14, 39, 0.8) 100%);
```

#### Solar 主题渐变
```css
/* 日出渐变 */
--gradient-sunrise: linear-gradient(135deg, #ff6b35 0%, #f59e0b 50%, #ffd700 100%);
/* 天空渐变 */
--gradient-sky: linear-gradient(180deg, #87ceeb 0%, #fef7ed 50%, #fffaf0 100%);
/* 海洋渐变 */
--gradient-ocean: linear-gradient(180deg, #87ceeb 0%, #1e90ff 50%, #1a5f9c 100%);
```

---

## 3. 字体系统

### 3.1 字体栈

```css
--font-sans: var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
--font-display: var(--font-inter), sans-serif;
```

### 3.2 字体规格

| 样式 | 大小 | 字重 | 行高 | 字距 | 用途 |
|------|------|------|------|------|------|
| Display | 48px | 700 | 1.1 | -0.02em | 首页大标题 |
| H1 | 36px | 700 | 1.2 | -0.01em | 页面标题 |
| H2 | 30px | 600 | 1.3 | 0 | 区块标题 |
| H3 | 24px | 600 | 1.4 | 0 | 卡片标题 |
| H4 | 20px | 600 | 1.4 | 0 | 小标题 |
| H5 | 18px | 500 | 1.5 | 0 | 列表标题 |
| Body Large | 18px | 400 | 1.6 | 0 | 大段正文 |
| Body | 16px | 400 | 1.6 | 0 | 标准正文 |
| Body Small | 14px | 400 | 1.5 | 0 | 辅助文字 |
| Caption | 12px | 400 | 1.5 | 0.01em | 标签、时间 |
| Overline | 11px | 500 | 1.4 | 0.05em | 分类标签 |

### 3.3 响应式字体

| 样式 | 桌面端 | 平板端 | 移动端 |
|------|--------|--------|--------|
| Display | 48px | 40px | 32px |
| H1 | 36px | 30px | 26px |
| H2 | 30px | 26px | 22px |
| H3 | 24px | 22px | 20px |
| H4 | 20px | 18px | 16px |

---

## 4. 间距系统

### 4.1 基础间距

| Token | 值 | 用途 |
|-------|-----|------|
| space-0 | 0px | 无间距 |
| space-1 | 4px | 图标内边距 |
| space-2 | 8px | 紧凑间距 |
| space-3 | 12px | 小间距 |
| space-4 | 16px | 标准间距 |
| space-5 | 20px | 中等间距 |
| space-6 | 24px | 组件间距 |
| space-8 | 32px | 区块间距 |
| space-10 | 40px | 大间距 |
| space-12 | 48px | 区块内边距 |
| space-16 | 64px | 页面间距 |
| space-20 | 80px | 大区块间距 |
| space-24 | 96px | 超大间距 |

### 4.2 布局规范

| 元素 | 桌面端 | 平板端 | 移动端 |
|------|--------|--------|--------|
| 容器最大宽度 | 1280px | 100% | 100% |
| 容器内边距 | 24px | 20px | 16px |
| 卡片内边距 | 24px | 20px | 16px |
| 卡片间距 | 24px | 20px | 16px |
| 区块间距 | 80px | 60px | 40px |

---

## 5. 圆角系统

| Token | 值 | 用途 |
|-------|-----|------|
| radius-none | 0px | 无圆角 |
| radius-sm | 4px | 小标签 |
| radius-md | 8px | 按钮、输入框 |
| radius-lg | 12px | 卡片 |
| radius-xl | 16px | 大卡片、弹窗 |
| radius-2xl | 20px | 特殊卡片 |
| radius-full | 9999px | 头像、标签 |

---

## 6. 阴影系统

### 6.1 Cosmic 主题阴影

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4);
--shadow-glow: 0 0 30px rgba(139, 92, 246, 0.3);
--shadow-glow-lg: 0 0 50px rgba(139, 92, 246, 0.4);
--shadow-sun: 0 0 40px rgba(245, 158, 11, 0.5);
--shadow-earth: 0 0 30px rgba(59, 130, 246, 0.4);
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.3);
```

### 6.2 Solar 主题阴影

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -4px rgba(0, 0, 0, 0.15);
--shadow-sunny: 0 0 30px rgba(245, 158, 11, 0.3);
--shadow-sky: 0 0 30px rgba(135, 206, 235, 0.4);
--shadow-ocean: 0 0 30px rgba(30, 144, 255, 0.3);
```

---

## 7. 组件规范

### 7.1 按钮

#### Cosmic 主题按钮
```
主按钮 (Primary)
  背景: #8b5cf6
  文字: #ffffff
  圆角: 8px
  内边距: 10px 20px
  字体: 14px, 500
  悬停: 背景 #a78bfa, 上移 1px
  点击: 缩放 0.98
  过渡: all 200ms ease

次按钮 (Secondary)
  背景: transparent
  边框: 1px solid rgba(139, 92, 246, 0.3)
  文字: #e0e0ff
  圆角: 8px
  内边距: 10px 20px
  悬停: 背景 rgba(139, 92, 246, 0.1), 边框 rgba(139, 92, 246, 0.5)
```

#### Solar 主题按钮
```
主按钮 (Primary)
  背景: #f59e0b
  文字: #ffffff
  圆角: 8px
  内边距: 10px 20px
  字体: 14px, 500
  悬停: 背景 #fbbf24, 上移 1px
  点击: 缩放 0.98
  过渡: all 200ms ease

次按钮 (Secondary)
  背景: transparent
  边框: 1px solid rgba(245, 158, 11, 0.3)
  文字: #1f2937
  圆角: 8px
  内边距: 10px 20px
  悬停: 背景 rgba(245, 158, 11, 0.1), 边框 rgba(245, 158, 11, 0.5)
```

### 7.2 卡片

#### Cosmic 主题卡片
```
标准卡片
  背景: rgba(10, 14, 39, 0.6)
  边框: 1px solid rgba(139, 92, 246, 0.2)
  圆角: 12px
  内边距: 24px
  阴影: none
  悬停: 边框 rgba(139, 92, 246, 0.4), 阴影 shadow-glow, 上移 4px
  过渡: all 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

#### Solar 主题卡片
```
标准卡片
  背景: rgba(255, 255, 255, 0.7)
  边框: 1px solid rgba(245, 158, 11, 0.2)
  圆角: 12px
  内边距: 24px
  阴影: none
  悬停: 边框 rgba(245, 158, 11, 0.4), 阴影 shadow-sunny, 上移 4px
  过渡: all 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### 7.3 毛玻璃效果

```css
/* Cosmic 主题毛玻璃 */
.glass {
  background: rgba(10, 14, 39, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(139, 92, 246, 0.2);
}

/* Solar 主题毛玻璃 */
.glass-solar {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(245, 158, 11, 0.2);
}
```

### 7.4 导航栏

#### Cosmic 主题导航
```
高度: 64px
背景: rgba(10, 14, 39, 0.7)
背景滤镜: blur(16px)
边框底部: 1px solid rgba(139, 92, 246, 0.15)
阴影: 0 4px 30px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(139, 92, 246, 0.1)
位置: fixed
z-index: 50
```

#### Solar 主题导航
```
高度: 64px
背景: rgba(255, 255, 255, 0.75)
背景滤镜: blur(16px)
边框底部: 1px solid rgba(245, 158, 11, 0.15)
阴影: 0 4px 30px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(245, 158, 11, 0.1)
位置: fixed
z-index: 50
```

---

## 8. 动画规范

### 8.1 主题切换过渡

```css
.theme-transition {
  transition: background-color 1000ms cubic-bezier(0.4, 0, 0.2, 1),
              color 1000ms cubic-bezier(0.4, 0, 0.2, 1),
              border-color 1000ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 1000ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 8.2 Cosmic 主题动画

| 动画名称 | 时长 | 缓动 | 用途 |
|---------|------|------|------|
| twinkle | 3s | ease-in-out infinite | 星星闪烁 |
| twinkle-large | 4s | ease-in-out infinite | 大星星闪烁 |
| twinkle-double | 2s | ease-in-out infinite | 双星闪烁 |
| shooting-star | 3s | ease-in-out infinite | 流星划过 |
| black-hole-pulse | 4s | ease-in-out infinite | 黑洞脉冲 |
| disk-spin | 15s | linear infinite | 吸积盘旋转 |
| nebula-float | 60s | ease-in-out infinite | 星云漂浮 |
| rocket-launch | 25s | ease-in-out infinite | 火箭发射 |
| ufo-float | 18s | ease-in-out infinite | 飞碟漂浮 |
| ufo-wobble | 20s | ease-in-out infinite | 飞碟晃动 |

### 8.3 Solar 主题动画

| 动画名称 | 时长 | 缓动 | 用途 |
|---------|------|------|------|
| sun-pulse | 4s | ease-in-out infinite | 太阳脉动 |
| sun-ray | 3s | ease-in-out infinite | 阳光辐射 |
| sun-ring-pulse | 4s | ease-in-out infinite | 日晕脉动 |
| cloud-float | 20s | ease-in-out infinite | 云朵漂浮 |
| leaf-fall | 8s | ease-in-out infinite | 树叶飘落 |
| petal-fall | 10s | ease-in-out infinite | 花瓣飘落 |
| butterfly-fly | 16s | ease-in-out infinite | 蝴蝶飞舞 |
| paper-plane-fly | 20s | linear infinite | 纸飞机飞行 |
| rainbow-fade | 8s | ease-in-out infinite | 彩虹渐隐 |

### 8.4 过渡时间

| 名称 | 时长 | 用途 |
|------|------|------|
| instant | 0ms | 无动画 |
| fast | 150ms | 按钮状态、颜色变化 |
| normal | 200ms | 悬停效果、展开收起 |
| medium | 300ms | 卡片悬停、页面过渡 |
| slow | 500ms | 复杂动画、页面切换 |
| theme | 1000ms | 主题切换 |

### 8.5 缓动函数

| 名称 | 值 | 用途 |
|------|-----|------|
| ease | ease | 通用 |
| ease-out | cubic-bezier(0, 0, 0.2, 1) | 进入动画 |
| ease-in-out | cubic-bezier(0.4, 0, 0.2, 1) | 对称动画 |
| spring | cubic-bezier(0.34, 1.56, 0.64, 1) | 弹性效果 |

---

## 9. 背景装饰元素

### 9.1 Cosmic 主题背景元素

| 元素 | 说明 |
|------|------|
| **星空背景** | 固定的深邃宇宙背景 `#0a0e27` |
| **星星** | 多种大小的白色星星，带有闪烁动画 |
| **星云** | 渐变色的半透明星云，带有漂浮动画 |
| **黑洞** | 中心的黑洞，带吸积盘和脉冲动画 |
| **流星** | 不定期划过的流星 |
| **火箭** | 从底部发射的火箭 |
| **飞碟** | 悬浮的飞碟，带有绑架光线和外星人 |
| **小行星带** | 装饰性小行星 |

### 9.2 Solar 主题背景元素

| 元素 | 说明 |
|------|------|
| **天空背景** | 渐变色的天空背景，从天蓝到米白 |
| **太阳** | 右上角的太阳，带光晕和脉动动画 |
| **云朵** | 多朵漂浮的白色云朵 |
| **彩虹** | 左上角的半透明彩虹 |
| **蝴蝶** | 飞舞的蝴蝶 |
| **纸飞机** | 从左到右飞行的纸飞机 |
| **树叶/花瓣** | 飘落的树叶和花瓣 |

---

## 10. 响应式设计

### 10.1 断点定义

| 名称 | 宽度 | 设备 |
|------|------|------|
| xs | < 640px | 手机 |
| sm | ≥ 640px | 大手机 |
| md | ≥ 768px | 平板 |
| lg | ≥ 1024px | 小桌面 |
| xl | ≥ 1280px | 桌面 |
| 2xl | ≥ 1536px | 大桌面 |

### 10.2 布局适配

#### 导航栏
- 桌面: 水平导航，全部显示
- 平板: 水平导航，可能折叠部分
- 手机: 汉堡菜单，抽屉式导航

#### 内容网格
- 桌面: 3-4列网格
- 平板: 2列网格
- 手机: 单列

#### 侧边栏
- 桌面: 固定侧边栏
- 平板: 可折叠侧边栏
- 手机: 底部标签栏或抽屉

### 10.3 触摸适配

```
最小点击区域: 44px x 44px
按钮高度: ≥ 40px
输入框高度: ≥ 48px
间距增加: 移动端 +4px
字体调整: 移动端 ≥ 16px (防止iOS缩放)
```

---

## 11. 图标规范

### 11.1 图标库
使用 **Lucide React** 图标库

### 11.2 图标尺寸

| 名称 | 尺寸 | 用途 |
|------|------|------|
| xs | 12px | 内联图标 |
| sm | 16px | 按钮图标 |
| md | 20px | 导航图标 |
| lg | 24px | 功能图标 |
| xl | 32px | 特色图标 |
| 2xl | 48px | 大图标 |

### 11.3 图标颜色

#### Cosmic 主题
| 场景 | 颜色 |
|------|------|
| 默认 | #c0c0c0 |
| 悬停 | #e0e0ff |
| 激活 | #8b5cf6 |

#### Solar 主题
| 场景 | 颜色 |
|------|------|
| 默认 | #6b7280 |
| 悬停 | #1f2937 |
| 激活 | #f59e0b |

---

## 12. 无障碍规范

### 12.1 色彩对比度

| 场景 | 对比度 | 等级 |
|------|--------|------|
| 正文文字 | ≥ 4.5:1 | AA |
| 大文字 | ≥ 3:1 | AA |
| 交互元素 | ≥ 3:1 | AA |

### 12.2 焦点状态

```
轮廓: 2px solid 主题强调色
轮廓偏移: 2px
圆角: 继承元素
过渡: outline 150ms ease
```

### 12.3 减少动画

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 12.4 ARIA规范

- 所有交互元素必须有明确的 `aria-label`
- 导航使用 `role="navigation"`
- 按钮使用 `<button>` 或 `role="button"`
- 表单元素必须有关联的 `<label>`
- 动态内容更新使用 `aria-live`

---

## 13. 主题切换

### 13.1 主题持久化

主题选择通过 `localStorage` 持久化存储，键名为 `theme`，可选值：
- `cosmic` - 宇宙主题
- `solar` - 太阳主题

### 13.2 系统偏好检测

如果用户没有选择过主题，会自动检测系统偏好：
```typescript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

### 13.3 切换实现

通过在 `<html>` 元素上添加/移除 `dark` 和 `light` 类实现主题切换：
- Cosmic 主题: `<html class="dark">`
- Solar 主题: `<html class="light">`

---

## 14. 滚动条

### 14.1 Cosmic 主题滚动条

```css
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #0a0e27;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #8b5cf6, #3b82f6);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #a78bfa, #60a5fa);
}
```

### 14.2 Solar 主题滚动条

```css
.light ::-webkit-scrollbar {
  width: 8px;
}
.light ::-webkit-scrollbar-track {
  background: #fef7ed;
}
.light ::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #f59e0b, #ff6b35);
  border-radius: 4px;
}
.light ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ffd700, #ff6b35);
}
```

---

## 15. 选择文字高亮

### 15.1 Cosmic 主题

```css
::selection {
  background: rgba(139, 92, 246, 0.4);
  color: white;
}
```

### 15.2 Solar 主题

```css
.light ::selection {
  background: rgba(245, 158, 11, 0.4);
  color: #1f2937;
}
```

---

> **文档结束**
