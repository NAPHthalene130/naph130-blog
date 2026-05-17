<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center">
    <h1 class="text-4xl font-bold mb-4">{{ t('home.greeting') }} NAPHthalene</h1>
    <p class="text-xl text-base-500 dark:text-base-400 mb-8">{{ t('home.subtitle') }}</p>
    <RouterLink :to="{ name: 'posts' }" class="px-6 py-3 rounded-glass bg-accent-500 text-white font-medium hover:bg-accent-600 transition-colors">
      {{ t('home.viewPosts') }}
    </RouterLink>
  </div>
</template>
