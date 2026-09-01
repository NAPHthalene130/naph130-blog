import type { TranslationSchema } from '../i18nKeys';

export const en_us: TranslationSchema = {
  nav: {
    home: 'Home',
    posts: 'Posts',
    categories: 'Categories',
    tags: 'Tags',
    about: 'About',
  },
  common: {
    search: 'Search',
    themeToggle: 'Toggle Theme',
    language: 'Language',
    backToTop: 'Back to Top',
    readingTime: 'Reading Time',
    wordCount: 'Word Count',
    minute: 'min',
    words: 'words',
    all: 'All',
    none: 'None',
  },
  post: {
    publishedAt: 'Published',
    updatedAt: 'Updated',
    tableOfContents: 'Table of Contents',
    prevPost: 'Previous Post',
    nextPost: 'Next Post',
    relatedPosts: 'Related Posts',
  },
  footer: {
    poweredBy: 'Powered by Astro',
    copyright: 'All Rights Reserved',
  },
};

export default en_us;
