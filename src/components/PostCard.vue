<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { PostMeta } from '@/types'

defineProps<{
  post: PostMeta
}>()

const { t } = useI18n()
</script>

<template>
  <RouterLink :to="{ name: 'post', params: { slug: post.slug } }" class="glass block p-6 hover:shadow-lg transition-shadow duration-200 group">
    <div class="flex items-start gap-2 mb-3">
      <span v-if="post.pinned" class="text-sm" title="置顶">📌</span>
      <h3 class="text-lg font-semibold text-base-800 dark:text-base-100 group-hover:text-accent-500 dark:group-hover:text-accent-400 transition-colors flex-1">
        {{ post.title }}
      </h3>
    </div>
    <p class="text-sm text-base-500 dark:text-base-400 mb-4 line-clamp-2">{{ post.description }}</p>
    <div class="flex items-center gap-3 text-xs text-base-400 dark:text-base-500">
      <time :datetime="post.date">{{ post.date }}</time>
      <span v-if="post.updated" class="text-accent-500">更新于 {{ post.updated }}</span>
      <span class="ml-auto">{{ t('posts.readingTime', { minutes: post.readingTime }) }}</span>
    </div>
    <div v-if="post.tags.length > 0" class="flex flex-wrap gap-1.5 mt-3">
      <span
        v-for="tag in post.tags"
        :key="tag"
        class="px-2 py-0.5 text-xs rounded-full bg-base-100 dark:bg-base-800 text-base-500 dark:text-base-400"
      >
        {{ tag }}
      </span>
    </div>
  </RouterLink>
</template>
