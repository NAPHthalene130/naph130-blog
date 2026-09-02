import { getCollection } from 'astro:content';
import { languages } from '@/i18n';

export interface PostItem {
  id: string;
  slug: string;
  locale: string;
  project: string;
  title: string;
  description: string;
  date: string;
  coverSrc: string | null;
  tags: string[];
}

// 动态解析 <post_project> 目录下的同级图片资源文件
const postImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/posts/**/*.{png,jpg,jpeg,webp,svg}',
  { eager: true }
);

/**
 * 依据 <post_project> 目录解析封面图片
 */
export function resolvePostCover(postId: string, coverFilename?: string): string | null {
  if (!coverFilename) return null;
  if (coverFilename.startsWith('http') || coverFilename.startsWith('/assets/')) {
    return coverFilename;
  }
  // postId 格式为 "<locale>/<post_project>/<post>"
  const dir = postId.replace(/\/[^/]+$/, '');
  const key = `/src/content/posts/${dir}/${coverFilename}`;
  return postImages[key]?.default?.src || null;
}

/**
 * 分语言获取对应 locale 子目录下的所有文章工程
 * 一个子目录对应一个文章的工程文件，正文元数据均以 .md 字段内容为准
 *
 * @param locale i18n 注册的 locale 标识代码（例如 'zh_cn'、'en_us'）
 */
export async function getPostsByLocale(locale: string): Promise<PostItem[]> {
  const allEntries = await getCollection('posts');

  // 仅获取指定语言子目录下的文章
  const filtered = allEntries.filter((entry) => {
    const segments = entry.id.split('/');
    return segments[0] === locale;
  });

  const posts: PostItem[] = filtered.map((entry) => {
    const segments = entry.id.split('/');
    const project = segments[1] || '';
    const dateVal = entry.data.date || entry.data.pubDate || new Date();
    const dateStr =
      dateVal instanceof Date
        ? dateVal.toISOString().split('T')[0]
        : String(dateVal);

    return {
      id: entry.id,
      slug: entry.id.replace(/\/post(\.md)?$/, ''),
      locale: segments[0],
      project,
      // 严格以 .md 中的字段内容为准
      title: entry.data.title,
      description: entry.data.description || '',
      date: dateStr,
      coverSrc: resolvePostCover(entry.id, entry.data.cover),
      tags: entry.data.tags || [],
    };
  });

  // 按日期降序排列（最新发布的文章排在前面）
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * 获取每种已注册语言的文章映射表
 */
export async function getAllLocalePosts(): Promise<Record<string, PostItem[]>> {
  const map: Record<string, PostItem[]> = {};
  for (const lang of languages) {
    map[lang.locale] = await getPostsByLocale(lang.locale);
  }
  return map;
}
