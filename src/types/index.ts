export interface PostMeta {
  slug: string
  title: string
  date: string
  updated?: string
  description: string
  tags: string[]
  pinned: boolean
  cover?: string
  wordCount: number
  readingTime: number
}

export interface PostIndex {
  generated: string
  posts: PostMeta[]
}

export interface TocItem {
  id: string
  text: string
  level: number
  children: TocItem[]
}

export type ThemeMode = 'light' | 'dark'
