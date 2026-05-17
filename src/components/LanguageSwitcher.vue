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
  const params: Record<string, string> = {}
  if (route.params.slug) params.slug = route.params.slug as string
  router.push({ name: routeName, params })
}
</script>

<template>
  <button
    @click="switchLang"
    class="w-8.5 h-8.5 rounded-full border border-black/6 dark:border-white/8 flex items-center justify-center transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold"
    :style="{ color: 'var(--color-text-secondary)' }"
  >
    {{ locale === 'zh_cn' ? 'EN' : '中' }}
  </button>
</template>
