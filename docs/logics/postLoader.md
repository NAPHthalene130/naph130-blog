# 文章工程化加载与多语言解析逻辑 (Post Loader)

负责按语言隔离获取各语言子目录下的文章工程目录（`<post_project>`），严格以 `.md` Frontmatter 字段为准解析元数据，并动态解析同目录相对图片资源（包括封面图）。

源码文件：
- `src/content.config.ts`
- `src/utils/posts.ts`
- `src/components/PostList.tsx`
- `src/pages/posts.astro`

---

## 1. 详细实现原理与目录规范

### 1.1 文章工程目录规范
```text
src/content/posts/
├── zh_cn/                                 # 对应 i18n 注册的 locale 标识
│   ├── astro-architecture/                # <post_project> 文章独立工程目录
│   │   ├── post.md                        # 文章 Markdown 正文与 Frontmatter
│   │   ├── cover.png                      # 封面图片（同级相对索引）
│   │   └── diagram.png                    # 配套插图
│   └── react19-compiler/
│       ├── post.md
│       └── cover.png
└── en_us/                                 # 英文语言对应目录
    └── astro-architecture/
        ├── post.md
        └── cover.png
```

### 1.2 分语言隔离加载算法 (`getPostsByLocale`)
1. **获取全部集合**：通过 Astro Content Collections 规范接口 `getCollection('posts')` 读取。
2. **第一段路径切分匹配**：`entry.id` 格式为 `<locale>/<post_project>/<post>`，通过 `entry.id.split('/')[0] === locale` 严格筛选指定语言。
3. **字段严格以 `.md` 为准**：
   - 标题：`entry.data.title`
   - 简介：`entry.data.description`
   - 时间：`entry.data.date` 或 `entry.data.pubDate`
   - 标签：`entry.data.tags`
4. **同级封面图片动态解析**：
   使用 Vite `import.meta.glob` 扫描所有配图，通过文章所在的 `<locale>/<post_project>` 拼接封面文件名，自动获取 Vite 打包并哈希化后的真实静态 URL：
   ```ts
   const dir = postId.replace(/\/[^/]+$/, '');
   const key = `/src/content/posts/${dir}/${coverFilename}`;
   return postImages[key]?.default?.src || null;
   ```

### 1.3 客户端即时切语联动
`PostList` 组件挂载 `naph130:lang-change` 全局事件广播监听。当在导航栏切换语言为 English 时，`currentLocale` 状态立刻更新为 `en_us`，列表无刷新切换展示英文文章工程，**零页面跳转、零白屏抖动**。

---

## 2. 踩坑点与 Bug 修复记录

### 坑 1：同目录相对图片在静态编译时无法生成 URL
- **现象**：Markdown 中的 `cover: "cover.png"` 在浏览器中直接请求导致 404。
- **原因**：Astro 对非 public 目录下的静态图片需要通过 Vite 模块系统编译打包出 `/_astro/*.webp`。
- **修复**：使用 `import.meta.glob('/src/content/posts/**/*.{png,jpg,...}', { eager: true })` 建立资产字典，通过 `postId` 与文件名动态解析出打包后的绝对引用地址。
