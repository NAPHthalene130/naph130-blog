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
  router.push({ name: routeName, params: { locale: newLocale } })
}
</script>

<template>
  <button
    @click="switchLang"
    class="px-2 py-1 text-xs font-semibold rounded-full hover:bg-base-100 dark:hover:bg-base-800 transition-colors text-base-500 dark:text-base-400"
  >
    {{ locale === 'zh_cn' ? 'EN' : '中' }}
  </button>
</template>
