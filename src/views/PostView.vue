<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { PostMeta } from '@/types'
import { usePosts } from '@/composables/usePosts'
import { useToc } from '@/composables/useToc'
import { useReadingTime } from '@/composables/useReadingTime'
import { renderMarkdown } from '@/utils/markdown'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import TableOfContents from '@/components/TableOfContents.vue'
import PostNav from '@/components/PostNav.vue'
import ImageLightbox from '@/components/ImageLightbox.vue'
import ReadingProgress from '@/components/ReadingProgress.vue'
import BackToTop from '@/components/BackToTop.vue'

const route = useRoute()
const { t } = useI18n()

const slug = ref('')
const rawContent = ref('')
const bodyContent = ref('')
const renderedHtml = ref('')
const loading = ref(true)
const error = ref<string | null>(null)
const meta = ref<PostMeta | null>(null)

const { loadPost, getAdjacentPosts } = usePosts()
const { tocItems, activeId } = useToc(() => renderedHtml.value)
const { getReadingStats } = useReadingTime()

async function load() {
  const s = route.params.slug as string
  if (!s) return
  slug.value = s
  loading.value = true
  error.value = null
  try {
    rawContent.value = await loadPost(s)
    const parsed = parseFrontmatter(rawContent.value)
    meta.value = parsed.meta
    bodyContent.value = parsed.body
    renderedHtml.value = renderMarkdown(parsed.body)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
    // setup TOC observer after DOM update
    setTimeout(() => {
      useToc(() => renderedHtml.value)
    }, 200)
  }
}

function parseFrontmatter(raw: string): { meta: PostMeta; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) {
    return {
      meta: { slug: slug.value, title: slug.value, date: '', category: '', description: '', tags: [], pinned: false, wordCount: 0, readingTime: 0 },
      body: raw,
    }
  }
  const yaml = match[1]
  const body = match[2]
  const fm: Record<string, any> = {}
  let currentArrayKey: string | null = null
  for (const line of yaml.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('- ') && currentArrayKey) {
      if (!Array.isArray(fm[currentArrayKey])) fm[currentArrayKey] = []
      fm[currentArrayKey].push(trimmed.slice(2).trim())
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
    fm[key] = value
  }
  const stats = getReadingStats(body)
  return {
    meta: {
      slug: slug.value,
      title: fm.title || slug.value,
      date: fm.date || '',
      updated: fm.updated || undefined,
      category: fm.category || '',
      description: fm.description || '',
      tags: fm.tags || [],
      pinned: fm.pinned || false,
      cover: fm.cover || undefined,
      wordCount: stats.wordCount,
      readingTime: stats.readingTime,
    },
    body,
  }
}

watch(() => route.params.slug, load)
onMounted(load)

const adjacent = computed(() => getAdjacentPosts(slug.value))
</script>

<template>
  <div>
    <ReadingProgress />

    <div v-if="error" class="glass-card p-12 text-center">
      <p class="text-red-500 text-lg">{{ error }}</p>
      <RouterLink :to="{ name: 'posts' }" class="inline-block mt-4 text-sm font-medium" style="color: var(--color-accent);">
        {{ t('post.back') }}
      </RouterLink>
    </div>

    <div v-if="loading && !error" class="glass-card p-8 animate-pulse">
      <div class="h-8 bg-black/5 dark:bg-white/5 rounded w-2/3 mb-4" />
      <div class="h-4 bg-black/5 dark:bg-white/5 rounded w-1/3 mb-8" />
      <div class="space-y-3">
        <div class="h-4 bg-black/5 dark:bg-white/5 rounded w-full" />
        <div class="h-4 bg-black/5 dark:bg-white/5 rounded w-5/6" />
        <div class="h-4 bg-black/5 dark:bg-white/5 rounded w-4/6" />
      </div>
    </div>

    <template v-if="!loading && !error && meta">
      <div class="flex gap-8 items-start">
        <!-- 正文区 -->
        <div class="flex-1 min-w-0">
          <div class="glass-card p-8 md:p-10">
            <h1 class="text-3xl font-bold mb-4 tracking-tight" style="color: var(--color-text);">{{ meta.title }}</h1>
            <div class="flex items-center gap-4 text-sm mb-4 flex-wrap" style="color: var(--color-text-muted);">
              <time :datetime="meta.date">{{ meta.date }}</time>
              <span v-if="meta.updated">更新于 {{ meta.updated }}</span>
              <span>{{ t('posts.readingTime', { minutes: meta.readingTime }) }}</span>
              <span>{{ t('posts.wordCount', { count: meta.wordCount }) }}</span>
            </div>
            <div class="flex gap-1.5 mb-6 flex-wrap">
              <span v-if="meta.category" class="badge-cat">{{ meta.category }}</span>
              <span v-for="tag in meta.tags" :key="tag" class="badge-tag">{{ tag }}</span>
            </div>
            <img v-if="meta.cover" :src="meta.cover" :alt="meta.title" class="w-full rounded-2xl mb-8 object-cover max-h-96" />
            <MarkdownRenderer :content="bodyContent" />
          </div>
          <PostNav :prev="adjacent.prev" :next="adjacent.next" />
        </div>

        <!-- 右侧 TOC 导航 -->
        <TableOfContents :items="tocItems" :activeId="activeId" />
      </div>
    </template>

    <ImageLightbox />
    <BackToTop />
  </div>
</template>
