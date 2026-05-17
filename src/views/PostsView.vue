<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePosts } from '@/composables/usePosts'
import { useSearch } from '@/composables/useSearch'
import { useCategoryFilter } from '@/composables/useCategoryFilter'
import { getCoverStyle } from '@/utils/cover'
import SearchBox from '@/components/SearchBox.vue'
import type { PostMeta } from '@/types'

const { t } = useI18n()
const { posts, loading, error } = usePosts()
const { activeCategory } = useCategoryFilter()

const filtered = computed<PostMeta[]>(() => {
  if (activeCategory.value === 'all') return posts.value
  return posts.value.filter(
    (p) => p.category === activeCategory.value || p.tags.includes(activeCategory.value)
  )
})

const { query, results } = useSearch(() => filtered.value)
</script>

<template>
  <div class="flex flex-col gap-6">
    <SearchBox v-model="query" />

    <div v-if="loading" class="flex flex-col gap-5">
      <div v-for="i in 3" :key="i" class="glass-card p-6 animate-pulse">
        <div class="h-5 bg-black/5 dark:bg-white/5 rounded w-3/4 mb-3" />
        <div class="h-4 bg-black/5 dark:bg-white/5 rounded w-1/3 mb-2" />
        <div class="h-12 bg-black/5 dark:bg-white/5 rounded w-full" />
      </div>
    </div>

    <div v-if="error" class="glass-card p-12 text-center text-red-500">{{ error }}</div>

    <div v-if="!loading && !error && results.length > 0" class="flex flex-col gap-5">
      <article
        v-for="post in results"
        :key="post.slug"
        class="rounded-2xl overflow-hidden flex transition-all duration-200 hover:-translate-y-1"
        style="background: var(--glass-bg); backdrop-filter: blur(24px) saturate(1.5); -webkit-backdrop-filter: blur(24px) saturate(1.5); border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow);"
      >
        <RouterLink
          :to="{ name: 'post', params: { slug: post.slug } }"
          class="w-44 shrink-0 flex items-center justify-center text-white/35 text-2xl"
          :style="{ ...getCoverStyle(post.coverImg, post.title), minHeight: '170px' }"
        ></RouterLink>
        <div class="p-6 flex-1 flex flex-col justify-center min-w-0">
          <RouterLink
            :to="{ name: 'post', params: { slug: post.slug } }"
            class="text-lg font-bold mb-1.5 hover:underline"
            style="color: var(--color-text);"
          >{{ post.title }}</RouterLink>
          <div class="flex gap-4 flex-wrap text-xs mb-2.5" style="color: var(--color-text-muted);">
            <span>📅 {{ post.date }}</span>
            <span>🕐 {{ t('posts.readingTime', { minutes: post.readingTime }) }}</span>
            <span>📝 {{ t('posts.wordCount', { count: post.wordCount }) }}</span>
          </div>
          <p class="text-sm leading-relaxed mb-3" style="color: var(--color-text-secondary);">{{ post.description }}</p>
          <div class="flex gap-1.5 flex-wrap">
            <span v-if="post.category" class="badge-cat">{{ post.category }}</span>
            <span v-for="tag in post.tags" :key="tag" class="badge-tag">{{ tag }}</span>
          </div>
        </div>
      </article>
    </div>

    <div v-if="!loading && !error && results.length === 0" class="glass-card p-16 text-center">
      <p class="text-lg" style="color: var(--color-text-muted);">{{ t('posts.noResults') }}</p>
    </div>
  </div>
</template>
