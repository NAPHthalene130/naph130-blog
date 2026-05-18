<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { usePosts } from '@/composables/usePosts'
import { useCategoryFilter } from '@/composables/useCategoryFilter'
import type { PostMeta } from '@/types'

const { t } = useI18n()
const route = useRoute()
const { posts, pinnedPosts } = usePosts()
const { activeCategory } = useCategoryFilter()
const BASE = import.meta.env.BASE_URL
const avatarLoaded = ref(false)
const avatarSrc = `${BASE}assets/avatar.jpg`
const localeParam = computed(() => (route.params.locale as string) || 'zh_cn')

const avatarStyle = computed<Record<string, string>>(() => ({
  background: avatarLoaded.value ? 'transparent' : 'linear-gradient(135deg, #2d8a4e, #4caf50)',
}))

const filtered = computed<PostMeta[]>(() => {
  if (activeCategory.value === 'all') return posts.value
  return posts.value.filter(
    (p) => p.category === activeCategory.value || p.tags.includes(activeCategory.value)
  )
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 自我介绍 -->
    <div class="glass-card flex gap-8 items-center p-8 md:p-10">
      <div class="w-28 h-28 md:w-32 md:h-32 rounded-2xl shrink-0 flex items-center justify-center text-white text-5xl overflow-hidden shadow-lg" :style="avatarStyle">
        <img
          :src="avatarSrc"
          class="w-full h-full object-cover"
          :class="{ hidden: !avatarLoaded }"
          @load="avatarLoaded = true"
          @error="avatarLoaded = false"
          alt=""
        />
        <span :class="{ hidden: avatarLoaded }">N</span>
      </div>
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl md:text-3xl font-bold mb-1 tracking-tight" style="color: var(--color-text);">
          {{ t('home.greeting') }} NAPH130
        </h1>
        <div class="text-sm font-medium mb-2" style="color: var(--color-accent);">@naph130</div>
        <p class="text-sm leading-relaxed" style="color: var(--color-text-secondary);">{{ t('home.smile') }}</p>
        <div class="flex gap-2.5 mt-4 flex-wrap">
          <a href="https://github.com/NAPHthalene130/" target="_blank" rel="noopener" class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors hover:opacity-80" style="background: var(--color-accent-soft); color: var(--color-accent); text-decoration: none;">🐙 GitHub</a>
          <a href="mailto:naphthalene130@gmail.com" class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors hover:opacity-80" style="background: var(--color-accent-soft); color: var(--color-accent); text-decoration: none;">📧 Email</a>
        </div>
      </div>
    </div>

    <!-- 置顶横幅 -->
    <div v-if="pinnedPosts.length > 0" class="rounded-2xl overflow-hidden flex min-h-48" style="background: var(--glass-bg); backdrop-filter: blur(24px) saturate(1.5); -webkit-backdrop-filter: blur(24px) saturate(1.5); border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow);">
      <div class="w-56 shrink-0 flex items-center justify-center text-white/30 text-4xl" style="background: linear-gradient(135deg, #2d8a4e, #4caf50);">📌</div>
      <div class="p-8 flex flex-col justify-center">
        <div class="text-xs font-bold uppercase tracking-wider mb-1.5" style="color: var(--color-accent);">📌 {{ t('home.pinned') }}</div>
        <RouterLink :to="{ name: 'post', params: { locale: localeParam, slug: pinnedPosts[0].slug } }" class="text-xl font-bold mb-2 hover:underline" style="color: var(--color-text);">
          {{ pinnedPosts[0].title }}
        </RouterLink>
        <p class="text-sm leading-relaxed" style="color: var(--color-text-secondary);">{{ pinnedPosts[0].description }}</p>
        <div class="text-xs mt-3 mb-3" style="color: var(--color-text-muted);">{{ pinnedPosts[0].date }} · {{ t('posts.readingTime', { minutes: pinnedPosts[0].readingTime }) }}</div>
        <div class="flex gap-1.5 flex-wrap">
          <span v-if="pinnedPosts[0].category" class="badge-cat">{{ pinnedPosts[0].category }}</span>
          <span v-for="tag in pinnedPosts[0].tags" :key="tag" class="badge-tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <!-- 时间线 -->
    <div v-if="filtered.length > 0">
      <div class="text-xs font-bold uppercase tracking-wider mb-5" style="color: var(--color-text-muted);">📡 {{ t('home.timeline') }}</div>
      <div style="position: relative; padding-left: 36px;">
        <div style="position: absolute; left: 9px; top: 6px; bottom: 6px; width: 2px; background: var(--color-timeline);"></div>
        <div v-for="post in filtered" :key="post.slug" style="position: relative; margin-bottom: 32px;">
          <div style="position: absolute; left: -33px; top: 6px; width: 18px; height: 18px; border-radius: 5px; background: var(--color-accent); display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; background: #fff; border-radius: 2px;"></div>
          </div>
          <div class="text-xs font-medium tracking-wider mb-1.5" style="color: var(--color-text-muted);">{{ post.date }}</div>
          <RouterLink :to="{ name: 'post', params: { locale: localeParam, slug: post.slug } }" class="block rounded-2xl p-5 transition-all duration-200 hover:translate-x-2" style="background: var(--glass-bg); backdrop-filter: blur(20px) saturate(1.3); -webkit-backdrop-filter: blur(20px) saturate(1.3); border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow);">
            <div class="text-base font-semibold mb-1.5" style="color: var(--color-text);">{{ post.title }}</div>
            <div class="text-sm leading-relaxed mb-2.5" style="color: var(--color-text-secondary);">{{ post.description }}</div>
            <div class="flex gap-1.5 flex-wrap">
              <span v-if="post.category" class="badge-cat">{{ post.category }}</span>
              <span v-for="tag in post.tags" :key="tag" class="badge-tag">{{ tag }}</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>

    <div v-if="filtered.length === 0 && posts.length > 0" class="glass-card p-16 text-center">
      <p class="text-lg" style="color: var(--color-text-muted);">{{ t('posts.noResults') }}</p>
    </div>
  </div>
</template>
