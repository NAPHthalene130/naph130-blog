<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useI18n } from 'vue-i18n'

const { isDark, toggle } = useTheme()
const { t } = useI18n()
</script>

<template>
  <button
    @click="toggle()"
    class="w-8.5 h-8.5 rounded-full border border-black/6 dark:border-white/8 flex items-center justify-center transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
    :title="isDark ? t('theme.light') : t('theme.dark')"
  >
    <span v-if="!isDark" class="text-sm">🌙</span>
    <span v-else class="text-sm">☀️</span>
  </button>
</template>
