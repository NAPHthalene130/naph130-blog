# 设计语言规范

## 风格定位

毛玻璃现代风 (Glassmorphism Modern)，灵感来源于 macOS / iOS 的视觉语言。

## 色彩系统

### 浅色模式

| 角色 | 色值 | Tailwind |
|------|------|----------|
| 页面背景 | `#FFFFFF` | `white` |
| 次级背景 | `#F8FAFC` | `base-50` |
| 主文字 | `#1E293B` | `base-800` |
| 次级文字 | `#64748B` | `base-500` |
| 强调色 | `#6366F1` | `accent-500` |
| 强调色悬停 | `#4F46E5` | `accent-600` |
| 玻璃背景 | `rgba(255,255,255,0.7)` | — |
| 边框 | `rgba(0,0,0,0.06)` | — |

### 暗色模式

| 角色 | 色值 | Tailwind |
|------|------|----------|
| 页面背景 | `#0F0F1A` | `base-950` 相近 |
| 次级背景 | `#1A1A2E` | — |
| 主文字 | `#E2E8F0` | `base-200` |
| 次级文字 | `#94A3B8` | `base-400` |
| 强调色 | `#818CF8` | `accent-400` |
| 强调色悬停 | `#A5B4FC` | `accent-300` |
| 玻璃背景 | `rgba(30,30,46,0.7)` | — |
| 边框 | `rgba(255,255,255,0.08)` | — |

## 字体

| 角色 | 字体 | 字重 |
|------|------|------|
| 英文正文 | Inter | Regular 400 |
| 英文标题 | Inter | Semibold 600 |
| 中文 | 系统默认 | Regular / Medium |
| 代码 | JetBrains Mono | Regular 400 |

## 形态

### 圆角

| 元素 | 圆角 |
|------|------|
| 卡片 | `14px` (`rounded-glass`) |
| 按钮 | `full` (`rounded-full`) |
| 输入框 | `14px` |
| 导航栏 | `full` (`rounded-full`) |
| 代码块 | `14px` |

### 阴影

```css
/* 浅色模式 */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04),
            0 8px 32px rgba(0, 0, 0, 0.08);

/* 暗色模式 */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2),
            0 8px 32px rgba(0, 0, 0, 0.3);
```

### 毛玻璃效果

```css
background: rgba(255, 255, 255, 0.7);  /* 浅色 */
background: rgba(30, 30, 46, 0.7);     /* 暗色 */
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 14px;
```

### 间距规范

| 层级 | 值 |
|------|-----|
| 页面最大宽度 | `max-w-6xl` (72rem / 1152px) |
| 内容区左右内边距 | `px-4` (16px) |
| 区块垂直间距 | `my-8` ~ `my-16` |
| 卡片内边距 | `p-6` ~ `p-8` (24-32px) |
| 导航栏高度 | `py-2` + 内容 |

## 组件规范

### 导航栏 (刘海屏)

- 固定顶部居中，圆角胶囊形态
- 毛玻璃背景 + 柔和阴影
- 当前页面高亮：`bg-accent-500 text-white rounded-full`
- 未选中：`text-base-600` 悬停加深

### 文章卡片

- 毛玻璃背景
- 含封面图 (可选)、标题、日期、摘要、标签、阅读时长
- 置顶卡片左侧有 📌 标识或特殊边框

### 按钮

- 主按钮：`bg-accent-500 text-white rounded-full px-6 py-3`
- 次要按钮：`glass px-4 py-2 rounded-full`

### 过渡动画

- 页面切换：`opacity + translateY`，250ms ease
- 主题切换：`background-color + color`，300ms ease
- 交互元素：`transition-colors duration-200`
