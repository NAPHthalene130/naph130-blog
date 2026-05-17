# 开发规范

## 分支策略

```
main      ← 生产分支，仅通过 PR 合并
develop   ← 开发主分支
feat/*    ← 功能分支 (feat/article-system)
fix/*     ← 修复分支 (fix/theme-flicker)
```

### 工作流

1. 从 `develop` 创建功能分支
2. 在功能分支开发并测试
3. 提交 PR 合并到 `develop`
4. `develop` 稳定后合并到 `main` 触发部署

## Git 提交规范

### 格式

```
<type>(<scope>): <subject>
```

### Type 类型

| 类型 | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复 Bug |
| docs | 文档更新 |
| style | 代码格式 (不影响功能) |
| refactor | 重构 |
| perf | 性能优化 |
| test | 测试 |
| chore | 构建/工具变更 |

### 示例

```
feat(文章): 实现 Markdown 渲染和 TOC 导航
feat(主题): 添加毛玻璃导航栏和暗色模式切换
fix(路由): 修复语言切换后 404 页面不显示的问题
docs(设计): 添加设计语言规范文档
chore(依赖): 更新 vue-i18n 到 v11
```

### 规则

- 使用中文撰写提交信息
- 每个提交应该是原子性的（一个逻辑变更）
- 不要在一个提交中混入无关变更
- 提交前确保代码已通过 lint 检查

## 代码风格

### 通用

- 使用 TypeScript 严格模式
- 使用 `<script setup lang="ts">` 语法
- 优先使用 Composition API
- 使用 `const` 优先，需要重新赋值才用 `let`
- 不使用 `var`

### Vue 组件

- 组件命名：PascalCase (`AppHeader.vue`, `PostCard.vue`)
- Props 使用 `defineProps<>()` 泛型
- Emits 使用 `defineEmits<>()` 泛型
- 组合式函数放在 `composables/` 目录

### 文件命名

| 类型 | 命名 | 示例 |
|------|------|------|
| 组件 | PascalCase | `PostCard.vue` |
| 视图 | PascalCase + View 后缀 | `IntroView.vue` |
| 组合式函数 | camelCase + use 前缀 | `usePosts.ts` |
| 工具函数 | camelCase | `markdown.ts` |
| 样式 | kebab-case | `main.css` |

### 目录约定

```
src/
├── components/    # 可复用组件
├── composables/   # 组合式函数 (useXxx)
├── i18n/          # 国际化
├── router/        # 路由配置
├── styles/        # 样式文件
├── utils/         # 纯工具函数
└── views/         # 页面级组件
```

### 导入顺序

1. Vue 核心 (`vue`, `vue-router`, `vue-i18n`)
2. 第三方库 (`@vueuse/core`, `markdown-it`, etc.)
3. 项目内部模块 (`@/composables/...`, `@/utils/...`)
4. 局部组件/相对路径导入

### Lint 与格式化

```bash
pnpm lint      # ESLint 检查
pnpm format    # Prettier 格式化
```

## 文章撰写规范

详见 [docs/MARKDOWN.md](./MARKDOWN.md)

## 环境要求

- Node.js >= 18
- pnpm >= 8
- Git
