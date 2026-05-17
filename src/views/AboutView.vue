<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">{{ t('about.title') }}</h1>
    <div class="glass p-8">
      <p class="text-base-500">关于页面内容建设中...</p>
    </div>
  </div>
</template>
