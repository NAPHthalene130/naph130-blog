<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePosts } from '../composables/usePosts'
import AppHeader from '../components/AppHeader.vue'
import AppSidebar from '../components/AppSidebar.vue'
import BackgroundEffect from '../components/BackgroundEffect.vue'

const { t, locale } = useI18n()
const route = useRoute()
const { posts, categories, allTags, stats } = usePosts()

const activeCategory = ref('all')

const showSidebar = computed(() => route.name !== 'post')

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
