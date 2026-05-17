# Markdown 文章规范

## 文件命名

```
YYYY-MM-DD-{slug}.md
```

- 日期使用 ISO 格式 `YYYY-MM-DD`
- slug 用于 URL 路由，使用小写英文 + 连字符
- 示例：`2024-01-01-hello-world.md` → URL: `/post/hello-world`

## 目录结构

```
public/posts/
├── zh_cn/
│   ├── images/                              # 文章配图
│   │   └── 2024-01-01-hello-world/          # 按文章 slug 分组
│   │       ├── cover.webp
│   │       └── diagram-01.png
│   ├── 2024-01-01-hello-world.md
│   └── meta.json                            # 自动生成
└── en_us/
    └── ...
```

## Frontmatter

每篇文章开头必须包含 YAML Frontmatter，用 `---` 包裹：

```yaml
---
title: string           # 文章标题 (必填)
date: YYYY-MM-DD        # 发布日期 (必填)
updated: YYYY-MM-DD     # 更新日期 (可选)
description: string     # 摘要描述 (必填)
tags:                   # 标签数组 (可选)
  - Vue
  - TypeScript
pinned: boolean         # 是否置顶 (可选, 默认 false)
cover: string           # 封面图相对路径 (可选)
draft: boolean          # 草稿 (可选, 默认 false, 草稿不显示)
---
```

### 完整示例

```yaml
---
title: 使用 Vue 3 构建静态博客
date: 2024-06-15
updated: 2024-08-20
description: 从零搭建一个纯客户端渲染的静态博客，使用 Markdown 管理内容
tags:
  - Vue
  - Vite
  - 静态博客
pinned: true
cover: ./images/2024-06-15-vue3-blog/cover.webp
draft: false
---
```

## 正文规范

### 标题层级

```markdown
# 一级标题 ← 不在 TOC 中出现，文章主标题已由 Frontmatter 定义
## 二级标题 ← TOC 主要层级
### 三级标题 ← TOC 最深层级
#### 四级标题 ← 纯排版用，不出现在 TOC
```

### 图片

```markdown
![描述文字](./images/2024-01-01-hello-world/diagram.png)
```

- 图片放在 `public/posts/{locale}/images/{slug}/` 目录下
- 相对路径从 `.md` 文件所在目录起算
- 支持的格式：`.webp` (推荐), `.png`, `.jpg`, `.gif`

### 代码块

````markdown
```typescript
const msg = ref('Hello')
```
````

- 必须指定语言标识（用于语法高亮）
- 支持的语言由 highlight.js 决定
- 代码块右上角自动显示复制按钮

### 支持的语法

| 语法 | 示例 |
|------|------|
| 粗体 | `**粗体文字**` |
| 斜体 | `*斜体文字*` |
| 行内代码 | `` `const x = 1` `` |
| 删除线 | `~~删除文字~~` |
| 引用 | `> 引用内容` |
| 无序列表 | `- 项目` |
| 有序列表 | `1. 项目` |
| 链接 | `[文字](https://...)` |
| 表格 | `\| 列1 \| 列2 \|` |
| 分割线 | `---` |

## meta.json 生成

运行 `pnpm generate-meta` 自动扫描所有 `.md` 文件，解析 Frontmatter 并生成：

```json
{
  "generated": "2024-08-20T12:00:00Z",
  "posts": [
    {
      "slug": "vue3-blog",
      "title": "使用 Vue 3 构建静态博客",
      "date": "2024-06-15",
      "updated": "2024-08-20",
      "description": "从零搭建...",
      "tags": ["Vue", "Vite"],
      "pinned": true,
      "cover": "./images/2024-06-15-vue3-blog/cover.webp",
      "wordCount": 3200,
      "readingTime": 16
    }
  ]
}
```

### 排序规则

1. `pinned: true` 的文章在最前
2. 同层级按 `date` 降序排列
3. `draft: true` 的文章不包含在内

## 最佳实践

- **封面图**：推荐使用 WebP 格式，宽高比 16:9 或 2:1
- **摘要**：description 控制在 80-160 字
- **标题**：使用清晰的层级结构，便于 TOC 导航
- **代码**：确保代码块有语言标识，方便语法高亮
- **图片**：大图建议压缩后用 WebP，减少加载时间
