<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePosts } from '../composables/usePosts'
import AppHeader from '../components/AppHeader.vue'
import AppSidebar from '../components/AppSidebar.vue'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import type { PostMeta } from '@/types'

const { t, locale } = useI18n()
const route = useRoute()
const { posts } = usePosts()

const activeCategory = ref('all')

const categories = computed(() => {
  const map = new Map<string, number>()
  for (const p of posts.value) {
    if (p.category) map.set(p.category, (map.get(p.category) || 0) + 1)
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
})

const allTags = computed(() => {
  const map = new Map<string, number>()
  for (const p of posts.value) {
    for (const t of p.tags) {
      map.set(t, (map.get(t) || 0) + 1)
    }
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
})

// 判断是否显示侧栏（文章详情页不显示）
const showSidebar = computed(() => {
  return route.name !== 'post'
})

function onSelectCategory(cat: string) {
  activeCategory.value = cat
}
</script>

<template>
  <div class="relative min-h-screen">
    <BackgroundEffect />
    <AppHeader />

    <div class="app-layout">
      <AppSidebar
        v-if="showSidebar"
        :categories="categories"
        :tags="allTags"
        :active-category="activeCategory"
        :total-posts="posts.length"
        @select-category="onSelectCategory"
      />
      <div class="app-content">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :active-category="activeCategory" />
          </Transition>
        </RouterView>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
