<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center">
    <h1 class="text-8xl font-bold text-accent-400 mb-4">{{ t('notFound.title') }}</h1>
    <p class="text-xl text-base-500 dark:text-base-400 mb-8">{{ t('notFound.message') }}</p>
    <RouterLink to="/zh_cn/intro" class="px-6 py-3 rounded-glass bg-accent-500 text-white font-medium hover:bg-accent-600 transition-colors">
      {{ t('notFound.backHome') }}
    </RouterLink>
  </div>
</template>
