<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppSidebar from '../components/AppSidebar.vue'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import { usePosts } from '../composables/usePosts'
import { useCategoryFilter } from '../composables/useCategoryFilter'

const { posts, categories, allTags } = usePosts()
const { activeCategory } = useCategoryFilter()

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
        :categories="categories"
        :tags="allTags"
        :active-category="activeCategory"
        :total-posts="posts.length"
        @select-category="onSelectCategory"
      />
      <div class="app-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>
