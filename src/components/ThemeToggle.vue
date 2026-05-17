<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useI18n } from 'vue-i18n'

const { isDark, toggle } = useTheme()
const { t } = useI18n()
</script>

<template>
  <button
    @click="toggle()"
    class="p-2 rounded-full hover:bg-base-100 dark:hover:bg-base-800 transition-colors"
    :title="isDark ? t('theme.light') : t('theme.dark')"
  >
    <svg v-if="!isDark" class="w-5 h-5 text-base-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
    <svg v-else class="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5" />
      <path stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  </button>
</template>
