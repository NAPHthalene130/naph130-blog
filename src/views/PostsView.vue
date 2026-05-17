<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePosts } from '@/composables/usePosts'
import { useSearch } from '@/composables/useSearch'
import SearchBox from '@/components/SearchBox.vue'
import PostCard from '@/components/PostCard.vue'
import PostCardSkeleton from '@/components/PostCardSkeleton.vue'

const { t } = useI18n()
const { posts, pinnedPosts, loading, error } = usePosts()
const { query, results } = useSearch(() => posts.value)
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">{{ t('posts.title') }}</h1>

    <SearchBox v-model="query" />

    <div v-if="error" class="glass p-8 text-center text-red-500">
      {{ error }}
    </div>

    <!-- Skeleton loading -->
    <div v-if="loading" class="space-y-4">
      <PostCardSkeleton v-for="i in 3" :key="i" />
    </div>

    <!-- Pinned posts -->
    <div v-if="pinnedPosts.length > 0 && !loading" class="mb-8">
      <h2 class="text-sm font-semibold text-base-400 uppercase tracking-wide mb-3">{{ t('posts.pinned') }}</h2>
      <div class="space-y-4">
        <PostCard v-for="post in pinnedPosts" :key="post.slug" :post="post" />
      </div>
    </div>

    <!-- Search results or all posts -->
    <div v-if="!loading && results.length > 0" class="space-y-4">
      <PostCard v-for="post in results" :key="post.slug" :post="post" />
    </div>

    <div v-if="!loading && results.length === 0 && !error" class="glass p-12 text-center">
      <p class="text-base-400 text-lg">{{ t('posts.noResults') }}</p>
    </div>
  </div>
</template>
