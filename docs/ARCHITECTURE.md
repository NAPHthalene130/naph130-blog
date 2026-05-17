# 架构设计文档

## 概述

naph130-blog 是一个纯客户端渲染的静态博客，所有数据（Markdown 文章、元数据）在浏览器运行时通过 HTTP 获取并渲染，无需后端服务。

## 数据流

```
GitHub Pages 静态文件服务
    │
    ├── /index.html ──→ Vue SPA 入口
    │
    ├── /posts/{locale}/meta.json ──→ 文章元数据索引
    │       ├── title, date, tags, pinned...
    │       ├── wordCount, readingTime (自动计算)
    │       └── slug (用于路由和文件名映射)
    │
    └── /posts/{locale}/*.md ──→ 文章正文
            └── PostView fetch() → markdown-it 解析 → 渲染
```

## 路由设计

```
# Hash 模式 (兼容 GitHub Pages SPA)

/                                 → 重定向到 /zh_cn/intro
/:locale(intro|posts|about)       → RootLayout > 对应页面
/:locale/post/:slug               → RootLayout > PostView
/*                                → NotFoundView
```

### 路由结构

```
RootLayout (语言包装)
├── /:locale/intro          IntroView
├── /:locale/posts          PostsView
├── /:locale/post/:slug     PostView
├── /:locale/about          AboutView
└── 404                     NotFoundView
```

## 组件树

```
App.vue
└── RootLayout.vue
    ├── BackgroundEffect.vue         # 背景层 (图片/粒子)
    ├── AppHeader.vue                # 顶部导航
    │   ├── ThemeToggle.vue          # 浅色/暗色
    │   └── LanguageSwitcher.vue     # 中/英
    └── <RouterView>
        ├── IntroView.vue
        ├── PostsView.vue
        │   ├── SearchBox.vue
        │   └── PostCard.vue / PostCardSkeleton.vue
        ├── PostView.vue
        │   ├── ReadingProgress.vue
        │   ├── MarkdownRenderer.vue
        │   │   └── ImageLightbox.vue
        │   ├── TableOfContents.vue
        │   └── PostNav.vue
        ├── AboutView.vue
        └── NotFoundView.vue
            └── BackToTop.vue
```

## 国际化策略

- URL 路径前缀区分语言 (`/zh_cn/` vs `/en_us/`)
- `vue-i18n` 管理 UI 字符串
- 语言偏好存储于 `localStorage('blog-locale')`
- 首次访问依据浏览器语言自动检测
- 文章内容按语言分目录存放

```
public/posts/zh_cn/  ← 中文文章 + meta.json
public/posts/en_us/  ← 英文文章 + meta.json
```

## 主题策略

- 使用 `@vueuse/core` 的 `useDark` + `useToggle`
- 在 `<html>` 上切换 `class="dark"`
- Tailwind 的 `dark:` 变体自动生效
- CSS 自定义属性作为补充（用于非 Tailwind 场景）
- 主题偏好持久化到 `localStorage('blog-theme')`
- 首次访问跟随系统 `prefers-color-scheme`

## 文章数据模型

### Meta 索引 (meta.json)

```typescript
interface PostMeta {
  slug: string
  title: string
  date: string          // YYYY-MM-DD
  updated?: string      // YYYY-MM-DD
  description: string
  tags: string[]
  pinned: boolean
  cover?: string        // 相对路径
  wordCount: number
  readingTime: number   // 分钟
}
```

### Frontmatter (Markdown YAML 头部)

```yaml
title: string
date: string
updated?: string
description: string
tags?: string[]
pinned?: boolean        # default: false
cover?: string
draft?: boolean         # default: false
```

## 构建与部署

```
GitHub Actions (push to main)
  → pnpm generate-meta   # 扫描文章生成 meta.json
  → pnpm build           # vite build
  → deploy to gh-pages   # peaceiris/actions-gh-pages
```
