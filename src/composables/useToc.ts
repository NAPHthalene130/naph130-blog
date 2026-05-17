import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { TocItem } from '@/types'
import { extractToc } from '@/utils/markdown'

export function useToc(html: () => string) {
  const tocItems = ref<TocItem[]>([])
  const activeId = ref<string>('')

  watch(
    html,
    (val) => {
      tocItems.value = extractToc(val)
    },
    { immediate: true }
  )

  let observer: IntersectionObserver | null = null

  function setupObserver() {
    if (observer) observer.disconnect()
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    tocItems.value.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer!.observe(el)
    })
    // also observe child items
    tocItems.value.forEach((item) => {
      item.children.forEach((child) => {
        const el = document.getElementById(child.id)
        if (el) observer!.observe(el)
      })
    })
  }

  onMounted(() => {
    setTimeout(setupObserver, 100)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  const flatIds = ref<string[]>([])
  watch(tocItems, (items) => {
    const ids: string[] = []
    function walk(nodes: TocItem[]) {
      for (const n of nodes) {
        ids.push(n.id)
        if (n.children.length) walk(n.children)
      }
    }
    walk(items)
    flatIds.value = ids
    setTimeout(setupObserver, 100)
  })

  return { tocItems, activeId }
}
