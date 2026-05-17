# naph130-blog

基于 Vue 3 的纯客户端渲染静态博客，使用 Markdown 作为数据载体，部署于 GitHub Pages。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Vue 3 (Composition API + `<script setup>`) |
| 构建 | Vite 6 |
| 语言 | TypeScript |
| 路由 | Vue Router 4 (hash 模式) |
| 国际化 | vue-i18n |
| 样式 | Tailwind CSS 3 (毛玻璃现代风) |
| Markdown | markdown-it + highlight.js |
| 搜索 | Fuse.js (客户端模糊搜索) |
| 工具库 | @vueuse/core |
| 部署 | GitHub Pages + GitHub Actions |

## 项目结构

```
naph130-blog/
├── .github/workflows/    # CI/CD
├── public/
│   ├── backgrounds/      # 背景图片 (light/dark)
│   ├── posts/            # Markdown 文章 (zh_cn/en_us)
│   └── favicon.svg
├── src/
│   ├── components/       # 通用组件
│   ├── composables/      # 组合式函数
│   ├── i18n/             # 国际化
│   ├── router/           # 路由
│   ├── styles/           # 样式
│   ├── utils/            # 工具函数
│   └── views/            # 页面
├── scripts/              # 构建脚本
├── docs/                 # 文档
└── tailwind.config.ts
```

## 快速开始

```bash
pnpm install
pnpm dev          # 开发服务器
pnpm build        # 生产构建
pnpm preview      # 预览构建结果
```

## 特性

- 浅色/暗色模式
- 中/英双语 (URL 路径前缀)
- 毛玻璃现代风 UI
- 客户端 Markdown 渲染
- 文章 TOC 导航
- 客户端搜索
- 代码块复制
- 图片 Lightbox
- 阅读进度条
- 页面过渡动画
