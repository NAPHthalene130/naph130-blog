/**
 * 全局多语言词条键（Key）常量集合
 * 用于统一管理和快速检索所有多语言键名，避免拼写错误
 */
export const I18N_KEYS = {
  // 导航栏 (Navigation)
  NAV_HOME: 'nav.home',
  NAV_INTRO: 'nav.intro',
  NAV_POSTS: 'nav.posts',
  NAV_MOMENTS: 'nav.moments',
  NAV_FRIENDS: 'nav.friends',

  // 通用界面 (Common UI)
  COMMON_SEARCH: 'common.search',
  COMMON_THEME_TOGGLE: 'common.themeToggle',
  COMMON_LANGUAGE: 'common.language',
  COMMON_BACK_TO_TOP: 'common.backToTop',
  COMMON_READING_TIME: 'common.readingTime',
  COMMON_WORD_COUNT: 'common.wordCount',
  COMMON_MINUTE: 'common.minute',
  COMMON_WORDS: 'common.words',
  COMMON_ALL: 'common.all',
  COMMON_NONE: 'common.none',

  // 文章相关 (Post & Article)
  POST_PUBLISHED_AT: 'post.publishedAt',
  POST_UPDATED_AT: 'post.updatedAt',
  POST_TABLE_OF_CONTENTS: 'post.tableOfContents',
  POST_PREV_POST: 'post.prevPost',
  POST_NEXT_POST: 'post.nextPost',
  POST_RELATED_POSTS: 'post.relatedPosts',

  // 页脚 (Footer)
  FOOTER_POWERED_BY: 'footer.poweredBy',
  FOOTER_COPYRIGHT: 'footer.copyright',
} as const;

/** 所有有效词条 Key 的联合类型 (例如: "nav.home" | "post.publishedAt" | ...) */
export type I18nKey = (typeof I18N_KEYS)[keyof typeof I18N_KEYS];

/** 词条字典的数据结构类型定义 */
export interface TranslationSchema {
  nav: {
    home: string;
    intro: string;
    posts: string;
    moments: string;
    friends: string;
  };
  common: {
    search: string;
    themeToggle: string;
    language: string;
    backToTop: string;
    readingTime: string;
    wordCount: string;
    minute: string;
    words: string;
    all: string;
    none: string;
  };
  post: {
    publishedAt: string;
    updatedAt: string;
    tableOfContents: string;
    prevPost: string;
    nextPost: string;
    relatedPosts: string;
  };
  footer: {
    poweredBy: string;
    copyright: string;
  };
}
