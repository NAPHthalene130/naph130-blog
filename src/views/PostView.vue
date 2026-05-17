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
const renderedHtml = ref('')
const loading = ref(true)
const error = ref<string | null>(null)
const meta = ref<PostMeta | null>(null)

const { loadPost, getAdjacentPosts, index } = usePosts()
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
    renderedHtml.value = renderMarkdown(parsed.body)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

function parseFrontmatter(raw: string): { meta: PostMeta; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) {
    return {
      meta: { slug: slug.value, title: slug.value, date: '', description: '', tags: [], pinned: false, wordCount: 0, readingTime: 0 },
      body: raw,
    }
  }
  const yaml = match[1]
  const body = match[2]
  const frontmatter: Record<string, any> = {}
  for (const line of yaml.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    let value: any = line.slice(colonIdx + 1).trim()
    if (value === 'true') value = true
    else if (value === 'false') value = false
    frontmatter[key] = value
  }
  // handle tags (array in YAML)
  if (frontmatter.tags && typeof frontmatter.tags === 'string') {
    // tags might be following lines with - prefix handled in meta.json, skip here
  }
  const stats = getReadingStats(body)
  return {
    meta: {
      slug: slug.value,
      title: frontmatter.title || slug.value,
      date: frontmatter.date || '',
      updated: frontmatter.updated || undefined,
      description: frontmatter.description || '',
      tags: [],
      pinned: frontmatter.pinned || false,
      cover: frontmatter.cover || undefined,
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

    <!-- Error state -->
    <div v-if="error" class="glass p-12 text-center">
      <p class="text-red-500 text-lg">{{ error }}</p>
      <RouterLink :to="{ name: 'posts' }" class="inline-block mt-4 text-accent-500 hover:underline">
        {{ t('post.back') }}
      </RouterLink>
    </div>

    <!-- Loading state -->
    <div v-if="loading && !error" class="glass p-8 animate-pulse">
      <div class="h-8 bg-base-200 dark:bg-base-700 rounded w-2/3 mb-4"></div>
      <div class="h-4 bg-base-100 dark:bg-base-800 rounded w-1/3 mb-8"></div>
      <div class="space-y-3">
        <div class="h-4 bg-base-100 dark:bg-base-800 rounded w-full"></div>
        <div class="h-4 bg-base-100 dark:bg-base-800 rounded w-5/6"></div>
        <div class="h-4 bg-base-100 dark:bg-base-800 rounded w-4/6"></div>
      </div>
    </div>

    <!-- Article -->
    <template v-if="!loading && !error && meta">
      <div class="flex gap-8">
        <div class="flex-1 min-w-0">
          <div class="glass p-8 mb-8">
            <h1 class="text-3xl font-bold text-base-900 dark:text-base-100 mb-4">{{ meta.title }}</h1>
            <div class="flex items-center gap-4 text-sm text-base-400 dark:text-base-500 mb-6">
              <time :datetime="meta.date">{{ meta.date }}</time>
              <span v-if="meta.updated">更新于 {{ meta.updated }}</span>
              <span>{{ t('posts.readingTime', { minutes: meta.readingTime }) }}</span>
              <span>{{ t('posts.wordCount', { count: meta.wordCount }) }}</span>
            </div>
            <img v-if="meta.cover" :src="meta.cover" :alt="meta.title" class="w-full rounded-glass mb-8 object-cover max-h-96" />
            <MarkdownRenderer :content="rawContent" />
          </div>
          <PostNav :prev="adjacent.prev" :next="adjacent.next" />
        </div>
        <TableOfContents :items="tocItems" :activeId="activeId" />
      </div>
    </template>

    <ImageLightbox />
    <BackToTop />
  </div>
</template>
