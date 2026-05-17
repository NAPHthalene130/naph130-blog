/**
 * 构建时数据加载器
 * 使用 import.meta.glob 在构建时将全部 .md 内容打包进 bundle
 * 无需运行时 fetch，真正静态化
 */

import type { PostMeta } from '@/types'

// ── 帖子 ──
const postRawModules = import.meta.glob<string>(
  '../content/posts/**/*.md',
  { query: '?raw', import: 'default', eager: true }
)

// ── 关于 ──
const aboutRawModules = import.meta.glob<string>(
  '../content/about/**/*.md',
  { query: '?raw', import: 'default', eager: true }
)

/** 解析 frontmatter 和 body */
function parseFrontmatter(raw: string): { meta: Record<string, any>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw }
  const yaml = match[1]
  const body = match[2] || ''
  const meta: Record<string, any> = {}
  let currentArrayKey: string | null = null

  for (const line of yaml.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('- ') && currentArrayKey) {
      if (!Array.isArray(meta[currentArrayKey])) meta[currentArrayKey] = []
      meta[currentArrayKey].push(trimmed.slice(2).trim())
      continue
    }
    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue
    const key = trimmed.slice(0, colonIdx).trim()
    let value: any = trimmed.slice(colonIdx + 1).trim()
    if (value === 'true') value = true
    else if (value === 'false') value = false
    else if (value === '') { currentArrayKey = key; continue }
    currentArrayKey = null
    meta[key] = value
  }
  return { meta, body }
}

/** 字数统计 */
function countWords(text: string): number {
  const stripped = text.replace(/<[^>]+>/g, '').trim()
  if (!stripped) return 0
  const chineseChars = (stripped.match(/[\u4e00-\u9fff]/g) || []).length
  const englishWords = stripped.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).filter(Boolean).length
  return chineseChars + englishWords
}

/** 阅读时长 */
function calcReadingTime(wc: number): number {
  return Math.max(1, Math.ceil(wc / 200))
}

// ═══════════ 帖子数据 ═══════════
export interface PostEntry {
  slug: string
  locale: string
  meta: PostMeta
  body: string
}

export const ALL_POSTS: PostEntry[] = []
const postsByLocale = new Map<string, PostEntry[]>()

for (const [filePath, raw] of Object.entries(postRawModules)) {
  const parts = filePath.split('/')
  const locale = parts[parts.length - 2] // zh_cn or en_us
  const fileName = parts[parts.length - 1] // 2024-01-01-hello.md
  const slug = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '')

  const { meta: fm, body } = parseFrontmatter(raw)
  if (fm.draft === true) continue

  const wc = countWords(body)
  const entry: PostEntry = {
    slug,
    locale,
    meta: {
      slug,
      title: fm.title || slug,
      date: fm.date || '',
      updated: fm.updated || undefined,
      category: fm.category || '',
      description: fm.description || '',
      tags: fm.tags || [],
      pinned: fm.pinned === true,
      cover: fm.cover || undefined,
      coverImg: fm.coverImg || undefined,
      wordCount: wc,
      readingTime: calcReadingTime(wc),
    },
    body,
  }
  ALL_POSTS.push(entry)

  if (!postsByLocale.has(locale)) postsByLocale.set(locale, [])
  postsByLocale.get(locale)!.push(entry)
}

// 排序
for (const [, list] of postsByLocale) {
  list.sort((a, b) => {
    if (a.meta.pinned !== b.meta.pinned) return a.meta.pinned ? -1 : 1
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  })
}

/** 按语言获取帖子 */
export function getPosts(locale: string): PostEntry[] {
  return postsByLocale.get(locale) || []
}

/** 获取单个帖子 */
export function getPost(locale: string, slug: string): PostEntry | undefined {
  return getPosts(locale).find((p) => p.slug === slug)
}

/** 获取相邻帖子 */
export function getAdjacentPosts(locale: string, slug: string): { prev: PostEntry | null; next: PostEntry | null } {
  const list = getPosts(locale)
  const idx = list.findIndex((p) => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? list[idx - 1] : null,
    next: idx < list.length - 1 ? list[idx + 1] : null,
  }
}

/** 获取类别列表 */
export function getCategories(locale: string): { name: string; count: number }[] {
  const map = new Map<string, number>()
  for (const p of getPosts(locale)) {
    if (p.meta.category) map.set(p.meta.category, (map.get(p.meta.category) || 0) + 1)
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
}

/** 获取标签列表 */
export function getAllTags(locale: string): { name: string; count: number }[] {
  const map = new Map<string, number>()
  for (const p of getPosts(locale)) {
    for (const t of p.meta.tags) {
      map.set(t, (map.get(t) || 0) + 1)
    }
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
}

/** 获取统计 */
export function getStats(locale: string) {
  const posts = getPosts(locale)
  let totalWords = 0
  let totalTime = 0
  for (const p of posts) {
    totalWords += p.meta.wordCount
    totalTime += p.meta.readingTime
  }
  return {
    postCount: posts.length,
    totalWords,
    totalTime,
  }
}

// ═══════════ 关于页面 ═══════════
const aboutCache = new Map<string, Record<string, string>>()

for (const [filePath, raw] of Object.entries(aboutRawModules)) {
  const parts = filePath.split('/')
  const locale = parts[parts.length - 2]
  const fileName = parts[parts.length - 1]
  const key = fileName.replace(/\.md$/, '')

  if (!aboutCache.has(locale)) aboutCache.set(locale, {})
  aboutCache.get(locale)![key] = raw
}

/** 获取关于内容 */
export function getAboutContent(locale: string, file: string): string {
  return aboutCache.get(locale)?.[file] || ''
}
