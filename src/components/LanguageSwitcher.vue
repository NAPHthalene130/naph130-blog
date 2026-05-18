<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

const { locale } = useI18n()
const router = useRouter()
const route = useRoute()

function switchLang() {
  const newLocale = locale.value === 'zh_cn' ? 'en_us' : 'zh_cn'
  locale.value = newLocale
  localStorage.setItem('blog-locale', newLocale)
  const routeName = (route.name as string) || 'intro'
  const params: Record<string, string> = { locale: newLocale }
  if (route.params.slug) params.slug = route.params.slug as string
  router.push({ name: routeName, params })
}
</script>

<template>
  <button @click="switchLang" class="lang-btn">
    <span class="text-2xs font-semibold leading-none">{{ locale === 'zh_cn' ? 'EN' : '中' }}</span>
  </button>
</template>

<style scoped>
.lang-btn {
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
  color: var(--color-text-secondary);
  padding: 0;
}
html.dark .lang-btn {
  border-color: rgba(100, 160, 120, 0.12);
}
.lang-btn:hover {
  background: var(--color-accent-soft);
  color: var(--color-text);
}
</style>
