<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { PostMeta } from '@/types'

defineProps<{
  prev: PostMeta | null
  next: PostMeta | null
}>()

const { t } = useI18n()
</script>

<template>
  <nav v-if="prev || next" class="flex justify-between gap-4 mt-12 pt-8 border-t border-base-200 dark:border-base-700">
    <div class="flex-1 min-w-0">
      <RouterLink
        v-if="prev"
        :to="{ name: 'post', params: { slug: prev.slug } }"
        class="glass block p-4 hover:shadow-md transition-shadow h-full"
      >
        <span class="text-xs text-base-400 mb-1 block">{{ t('post.prev') }}</span>
        <span class="text-sm font-medium text-base-700 dark:text-base-300 truncate block">{{ prev.title }}</span>
      </RouterLink>
    </div>
    <div class="flex-1 min-w-0 text-right">
      <RouterLink
        v-if="next"
        :to="{ name: 'post', params: { slug: next.slug } }"
        class="glass block p-4 hover:shadow-md transition-shadow h-full"
      >
        <span class="text-xs text-base-400 mb-1 block">{{ t('post.next') }}</span>
        <span class="text-sm font-medium text-base-700 dark:text-base-300 truncate block">{{ next.title }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
