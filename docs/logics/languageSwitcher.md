# 语言切换与全站联动逻辑 (Language Switcher)

位于顶部导航栏右侧功能区，在设置齿轮图标左侧提供国际化（i18n）多语言切换入口。采用悬浮微交互、统一配置清单、持久化存储与多组件响应式联动机制。

源码文件：
- `src/i18n/languages.ts`
- `src/i18n/i18nKeys.ts`
- `src/i18n/locales/zh_cn.ts`
- `src/i18n/locales/en_us.ts`
- `src/components/HeaderNav.tsx`
- `src/components/IntroBio.tsx`

---

## 1. 详细实现原理与联动流程

### 1.1 导航栏与全站组件动态切语链路
当用户在语言下拉菜单中选择一种语言时：
1. **内部状态更新**：`handleSelectLang(name)` 触发 `currentLang` 更新。
2. **持久化与事件广播**：
   - 将选中的语言键存储至 `localStorage('naph130_lang')`。
   - 分发 `window.dispatchEvent(new CustomEvent('naph130:lang-change', { detail: name }))`。
3. **导航栏无刷新重绘（HeaderNav）**：
   - 导航项标签动态调用 `t('nav.' + item.key, targetLocale)`。
   - 首页/简介/文章/动态/友链 5 个标签即时由中文切换为英文（`Home`, `Intro`, `Posts`, `Moments`, `Friends`）或切回中文，**零刷新、零页面位移**。
4. **页面级内容联动（IntroBio）**：
   - 简介页正文组件监听 `naph130:lang-change`，同步将简介 4 行内容在 `zh_cn` 与 `en_us` 之间平滑无刷新切替。

### 1.2 5 项导航词条对照表

| 路由路径 | 词条 Key | 中文（`zh_cn`） | 英文（`en_us`） |
| :---: | :--- | :---: | :---: |
| `/` | `nav.home` | 首页 | Home |
| `/intro` | `nav.intro` | 简介 | Intro |
| `/posts` | `nav.posts` | 文章 | Posts |
| `/moments` | `nav.moments` | 动态 | Moments |
| `/friends` | `nav.friends` | 友链 | Friends |

---

## 2. 踩坑点与 Bug 修复记录

### 坑 1：切换语言后导航栏仍为固定中文
- **现象**：在右上角切换至 English 后，简介内容变为了英文，但顶部导航栏仍然显示“首页、简介、文章、动态、友链”。
- **原因**：导航栏选项数组中原先写死了静态字符串 `label: '首页'`。
- **修复**：在 `i18nKeys.ts` 与语言包中补充导航词条，`HeaderNav` 改为通过 `t('nav.' + item.key, targetLocale)` 动态推导标签，实现与语言状态的即时联动。
