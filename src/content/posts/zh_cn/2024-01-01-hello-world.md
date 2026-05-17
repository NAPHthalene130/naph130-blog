---
title: 你好，世界
date: 2024-01-01
category: 前端
coverImg: hello-cover.png
description: 这是我的第一篇博客文章，记录了这个静态博客项目的诞生。
tags:
  - Vue
  - 博客
  - 项目
pinned: true
draft: false
---

## 缘起

一直想拥有一个完全由自己掌控的博客。不依赖任何后端服务，不依赖任何第三方平台，所有的内容都以 Markdown 文件的形式存在。

这是内联图片示例：[[demo.jpg]]

## 技术选型

这个博客使用了以下技术栈：

- **Vue 3**：渐进式 JavaScript 框架
- **Vite**：下一代前端构建工具
- **TypeScript**：类型安全的 JavaScript 超集
- **Tailwind CSS**：实用优先的 CSS 框架
- **markdown-it**：灵活的 Markdown 解析器

## 设计理念

### 构建时渲染

所有文章在构建时通过 `import.meta.glob` 导入，作为静态字符串打包进 bundle，运行时零网络请求。

### 磨砂玻璃设计

采用了现代毛玻璃风格（Glassmorphism），半透明的卡片、柔和的阴影、精致的圆角。

### 多语言支持

内置中英文双语支持，通过 URL 路径前缀区分语言。

## 功能一览

- 浅色/暗色模式切换
- 文章目录导航 (TOC)
- 客户端模糊搜索
- 代码块语法高亮与一键复制
- 图片灯箱预览
- 阅读进度条
- 鼠标跟随水波动态背景

---

> 种一棵树最好的时间是十年前，其次是现在。
