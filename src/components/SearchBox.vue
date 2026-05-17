<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const model = defineModel<string>({ required: true })

const { t } = useI18n()
</script>

<template>
  <div class="relative mb-8">
    <input
      v-model="model"
      type="text"
      :placeholder="t('posts.search')"
      class="w-full px-5 py-3 rounded-glass bg-glass-light dark:bg-glass-dark border border-base-200 dark:border-base-700 text-base-800 dark:text-base-200 placeholder-base-400 focus:outline-none focus:ring-2 focus:ring-accent-400 transition-shadow text-sm"
    />
    <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
</template>
