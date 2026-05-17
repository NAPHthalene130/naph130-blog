import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import type { PostMeta } from '@/types'

export function useSearch(posts: () => PostMeta[]) {
  const query = ref('')
  const focused = ref(false)

  const fuse = computed(() =>
    new Fuse(posts(), {
      keys: ['title', 'description', 'tags'],
      threshold: 0.3,
      includeScore: true,
    })
  )

  const results = computed(() => {
    const q = query.value.trim()
    if (!q) return posts()
    return fuse.value.search(q).map((r) => r.item)
  })

  return { query, focused, results }
}
