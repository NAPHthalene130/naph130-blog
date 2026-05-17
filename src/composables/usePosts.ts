import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PostMeta } from '@/types'
import { getPosts, getCategories, getAllTags, getStats, getPost, getAdjacentPosts } from '@/data/loader'

export function usePosts() {
  const { locale } = useI18n()

  const posts = computed<PostMeta[]>(() =>
    getPosts(locale.value).map((e) => e.meta)
  )

  const pinnedPosts = computed(() =>
    getPosts(locale.value).filter((e) => e.meta.pinned).map((e) => e.meta)
  )

  const categories = computed(() => getCategories(locale.value))
  const allTags = computed(() => getAllTags(locale.value))
  const stats = computed(() => getStats(locale.value))

  function loadPost(slug: string): string {
    const entry = getPost(locale.value, slug)
    if (!entry) throw new Error(`Post not found: ${slug}`)
    return entry.body
  }

  function getAdj(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
    const result = getAdjacentPosts(locale.value, slug)
    return {
      prev: result.prev?.meta || null,
      next: result.next?.meta || null,
    }
  }

  return {
    posts,
    pinnedPosts,
    categories,
    allTags,
    stats,
    loading: ref(false),
    error: ref<string | null>(null),
    loadPost,
    getAdjacentPosts: getAdj,
  }
}
