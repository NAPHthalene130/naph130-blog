<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">{{ t('posts.title') }}</h1>
    <p class="text-base-500">{{ t('posts.noResults') }}</p>
  </div>
</template>
