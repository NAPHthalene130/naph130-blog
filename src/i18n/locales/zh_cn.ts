import type { TranslationSchema } from '../i18nKeys';

export const zh_cn: TranslationSchema = {
  nav: {
    home: '首页',
    posts: '文章',
    categories: '分类',
    tags: '标签',
    about: '关于',
  },
  common: {
    search: '搜索',
    themeToggle: '切换主题',
    language: '语言',
    backToTop: '返回顶部',
    readingTime: '阅读时间',
    wordCount: '字数',
    minute: '分钟',
    words: '字',
    all: '全部',
    none: '暂无',
  },
  post: {
    publishedAt: '发布时间',
    updatedAt: '更新时间',
    tableOfContents: '目录',
    prevPost: '上一篇',
    nextPost: '下一篇',
    relatedPosts: '相关文章',
  },
  footer: {
    poweredBy: '基于 Astro 构建',
    copyright: '保留所有权利',
  },
};

export default zh_cn;
