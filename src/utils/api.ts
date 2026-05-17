import type { PostIndex } from '@/types'

const BASE_URL = import.meta.env.BASE_URL

export async function fetchPostIndex(locale: string): Promise<PostIndex> {
  const res = await fetch(`${BASE_URL}posts/${locale}/meta.json`)
  if (!res.ok) throw new Error(`Failed to load post index: ${res.status}`)
  return res.json()
}

export async function fetchPostContent(locale: string, slug: string): Promise<string> {
  const res = await fetch(`${BASE_URL}posts/${locale}/${slug}.md`)
  if (!res.ok) throw new Error(`Post not found: ${slug}`)
  return res.text()
}

export async function fetchAboutContent(locale: string, file: string): Promise<string> {
  const res = await fetch(`${BASE_URL}about/${locale}/${file}.md`)
  if (!res.ok) throw new Error(`About content not found: ${file}`)
  return res.text()
}

export function resolveImagePath(locale: string, relativePath: string): string {
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath
  }
  if (relativePath.startsWith('./')) {
    relativePath = relativePath.slice(2)
  }
  return `${BASE_URL}posts/${locale}/${relativePath}`
}
