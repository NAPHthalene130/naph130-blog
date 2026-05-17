export interface PostMeta {
  slug: string
  title: string
  date: string
  updated?: string
  category: string
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

export interface FriendLink {
  name: string
  url: string
  avatar?: string
  description?: string
}

export type ThemeMode = 'light' | 'dark'
