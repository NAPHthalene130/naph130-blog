<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useI18n } from 'vue-i18n'

const { isDark, toggle } = useTheme()
const { t } = useI18n()
</script>

<template>
  <button
    @click="toggle()"
    class="theme-btn"
    :title="isDark ? t('theme.light') : t('theme.dark')"
  >
    <span class="text-sm leading-none">{{ isDark ? '☀️' : '🌙' }}</span>
  </button>
</template>

<style scoped>
.theme-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(40, 80, 50, 0.12);
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
}
html.dark .theme-btn {
  border-color: rgba(100, 160, 120, 0.12);
}
.theme-btn:hover {
  background: var(--color-accent-soft);
}
</style>
