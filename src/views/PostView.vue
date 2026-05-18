<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getPost, getAdjacentPosts } from '@/data/loader'
import type { PostMeta } from '@/types'
import { useToc } from '@/composables/useToc'
import { renderMarkdown } from '@/utils/markdown'
import { getCoverStyle } from '@/utils/cover'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import TableOfContents from '@/components/TableOfContents.vue'
import PostNav from '@/components/PostNav.vue'
import ImageLightbox from '@/components/ImageLightbox.vue'
import ReadingProgress from '@/components/ReadingProgress.vue'
import BackToTop from '@/components/BackToTop.vue'

const route = useRoute()
const { t, locale } = useI18n()

const bodyContent = ref('')
const renderedHtml = ref('')
const meta = ref<PostMeta | null>(null)
const adjacent = ref<{ prev: PostMeta | null; next: PostMeta | null }>({ prev: null, next: null })

const { tocItems, activeId } = useToc(() => renderedHtml.value)

function load() {
  const slug = route.params.slug as string
  if (!slug) return
  const entry = getPost(locale.value, slug)
  if (!entry) {
    meta.value = null
    bodyContent.value = ''
    return
  }
  meta.value = entry.meta
  bodyContent.value = entry.body
  renderedHtml.value = renderMarkdown(entry.body)
  const adj = getAdjacentPosts(locale.value, slug)
  adjacent.value = { prev: adj.prev?.meta ?? null, next: adj.next?.meta ?? null }
}

watch([() => route.params.slug, locale], load)
onMounted(load)
</script>

<template>
  <div>
    <ReadingProgress />

    <div v-if="!meta" class="glass-card p-12 text-center">
      <p class="text-red-500 text-lg">文章未找到：{{ route.params.slug }}</p>
      <RouterLink :to="{ name: 'posts', params: { locale: (route.params.locale as string) || 'zh_cn' } }" class="inline-block mt-4 text-sm font-medium" style="color: var(--color-accent);">
        {{ t('post.back') }}
      </RouterLink>
    </div>

    <template v-if="meta">
      <div class="flex gap-8 items-start">
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
        <TableOfContents :items="tocItems" :activeId="activeId" />
      </div>
    </template>

    <ImageLightbox />
    <BackToTop />
  </div>
</template>
