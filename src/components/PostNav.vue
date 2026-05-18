<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import type { PostMeta } from '@/types'

defineProps<{ prev: PostMeta | null; next: PostMeta | null }>()
const { t } = useI18n()
const route = useRoute()
const localeParam = computed(() => (route.params.locale as string) || 'zh_cn')
</script>

<template>
  <nav v-if="prev || next" class="flex justify-between gap-4 mt-12 pt-8 border-t" style="border-color: var(--color-divider);">
    <div class="flex-1 min-w-0">
      <RouterLink
        v-if="prev"
        :to="{ name: 'post', params: { locale: localeParam, slug: prev.slug } }"
        class="glass-card p-5 block"
      >
        <span class="text-xs block mb-1.5" style="color: var(--color-text-muted);">{{ t('post.prev') }}</span>
        <span class="text-sm font-medium truncate block" style="color: var(--color-text);">{{ prev.title }}</span>
      </RouterLink>
    </div>
    <div class="flex-1 min-w-0 text-right">
      <RouterLink
        v-if="next"
        :to="{ name: 'post', params: { locale: localeParam, slug: next.slug } }"
        class="glass-card p-5 block"
      >
        <span class="text-xs block mb-1.5" style="color: var(--color-text-muted);">{{ t('post.next') }}</span>
        <span class="text-sm font-medium truncate block" style="color: var(--color-text);">{{ next.title }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
