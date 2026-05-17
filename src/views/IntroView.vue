<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePosts } from '@/composables/usePosts'
import { useCategoryFilter } from '@/composables/useCategoryFilter'
import type { PostMeta } from '@/types'

const { t } = useI18n()
const { posts, pinnedPosts } = usePosts()
const { activeCategory } = useCategoryFilter()

const filtered = computed<PostMeta[]>(() => {
  if (activeCategory.value === 'all') return posts.value
  return posts.value.filter(
    (p) => p.category === activeCategory.value || p.tags.includes(activeCategory.value)
  )
})
</script>

<template>
  <div>
    <!-- 自我介绍 -->
    <div class="glass-card flex gap-6 items-center p-8">
      <div
        class="w-30 h-30 rounded-2xl shrink-0 flex items-center justify-center text-white text-5xl shadow-lg"
        style="background: linear-gradient(135deg, #2d8a4e, #4caf50); box-shadow: 0 8px 28px rgba(45,138,78,0.2);"
      >
        👤
      </div>
      <div class="flex-1">
        <h1 class="text-2xl font-bold mb-1 tracking-tight">{{ t('home.greeting') }} NAPHthalene</h1>
        <div class="text-sm font-medium mb-3" style="color: var(--color-accent);">@naph130 · {{ t('home.subtitle') }}</div>
        <p class="text-sm leading-relaxed" style="color: var(--color-text-secondary);">
          热爱探索前端技术的前沿边界。记录 Vue、TypeScript、CSS 等技术的学习与实践。像植物一样安静生长，用代码构建数字世界的生态。
        </p>
        <div class="flex gap-2 mt-4 flex-wrap">
          <a href="#" class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors" style="background: var(--color-accent-soft); color: var(--color-accent);">🐙 GitHub</a>
          <a href="#" class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors" style="background: var(--color-accent-soft); color: var(--color-accent);">📧 Email</a>
          <a href="#" class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors" style="background: var(--color-accent-soft); color: var(--color-accent);">📡 RSS</a>
        </div>
      </div>
    </div>

    <!-- 置顶横幅 -->
    <div v-if="pinnedPosts.length > 0" class="my-6 rounded-2xl overflow-hidden flex min-h-44" style="background: var(--glass-bg); backdrop-filter: blur(22px) saturate(1.4); -webkit-backdrop-filter: blur(22px) saturate(1.4); border: 1px solid var(--glass-border);">
      <div class="w-60 shrink-0 flex items-center justify-center text-white/30 text-4xl" style="background: linear-gradient(135deg, #2d8a4e, #4caf50);">
        📌
      </div>
      <div class="p-7 flex flex-col justify-center">
        <div class="text-xs font-bold uppercase tracking-wider mb-1" style="color: var(--color-accent);">📌 {{ t('home.pinned') }}</div>
        <h3 class="text-xl font-bold mb-2" style="color: var(--color-text);">{{ pinnedPosts[0].title }}</h3>
        <p class="text-sm leading-relaxed" style="color: var(--color-text-secondary);">{{ pinnedPosts[0].description }}</p>
        <div class="text-xs mt-3" style="color: var(--color-text-muted);">{{ pinnedPosts[0].date }} · {{ t('posts.readingTime', { minutes: pinnedPosts[0].readingTime }) }}</div>
      </div>
    </div>

    <!-- 时间线 -->
    <div v-if="filtered.length > 0" class="mt-8">
      <div class="text-xs font-bold uppercase tracking-wider mb-4" style="color: var(--color-text-muted);">📡 {{ t('home.timeline') }}</div>
      <div class="relative pl-9">
        <div class="absolute left-2.5 top-2 bottom-2 w-0.5" style="background: var(--color-timeline);" />
        <div
          v-for="post in filtered"
          :key="post.slug"
          class="relative mb-7"
        >
          <div
            class="absolute -left-8 top-1.5 w-5 h-5 rounded-md flex items-center justify-center"
            style="background: var(--color-accent);"
          >
            <div class="w-2 h-2 bg-white rounded-sm" />
          </div>
          <div class="text-xs font-medium tracking-wider mb-1" style="color: var(--color-text-muted);">{{ post.date }}</div>
          <RouterLink
            :to="{ name: 'post', params: { slug: post.slug } }"
            class="block rounded-2xl p-4.5 transition-all duration-200 hover:translate-x-1.5"
            style="background: var(--glass-bg); backdrop-filter: blur(18px) saturate(1.3); -webkit-backdrop-filter: blur(18px) saturate(1.3); border: 1px solid var(--glass-border);"
          >
            <div class="text-base font-semibold mb-1" style="color: var(--color-text);">{{ post.title }}</div>
            <div class="text-xs leading-relaxed" style="color: var(--color-text-secondary);">{{ post.description }}</div>
          </RouterLink>
        </div>
      </div>
    </div>

    <div v-if="filtered.length === 0 && posts.length > 0" class="glass-card p-12 text-center">
      <p class="text-lg" style="color: var(--color-text-muted);">{{ t('posts.noResults') }}</p>
    </div>
  </div>
</template>
