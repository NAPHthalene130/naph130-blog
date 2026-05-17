import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PostMeta, PostIndex } from '@/types'
import { fetchPostIndex, fetchPostContent } from '@/utils/api'

export function usePosts() {
  const { locale } = useI18n()
  const index = ref<PostIndex | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const posts = computed<PostMeta[]>(() => {
    if (!index.value) return []
    const list = [...index.value.posts]
    list.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    return list
  })

  const pinnedPosts = computed(() => posts.value.filter((p) => p.pinned))

  const categories = computed(() => {
    const map = new Map<string, number>()
    for (const p of posts.value) {
      if (p.category) map.set(p.category, (map.get(p.category) || 0) + 1)
    }
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
  })

  async function loadIndex() {
    loading.value = true
    error.value = null
    try {
      index.value = await fetchPostIndex(locale.value)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function loadPost(slug: string): Promise<string> {
    try {
      return await fetchPostContent(locale.value, slug)
    } catch (e) {
      throw new Error(`Failed to load post "${slug}": ${(e as Error).message}`)
    }
  }

  function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
    const list = posts.value
    const idx = list.findIndex((p) => p.slug === slug)
    if (idx === -1) return { prev: null, next: null }
    return {
      prev: idx > 0 ? list[idx - 1] : null,
      next: idx < list.length - 1 ? list[idx + 1] : null,
    }
  }

  watch(locale, () => { loadIndex() }, { immediate: true })

  return { index, posts, pinnedPosts, categories, loading, error, loadIndex, loadPost, getAdjacentPosts }
}
