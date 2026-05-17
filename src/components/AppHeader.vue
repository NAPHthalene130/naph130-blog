<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import ThemeToggle from './ThemeToggle.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()

const navItems = [
  { key: 'intro', label: computed(() => t('nav.intro')) },
  { key: 'posts', label: computed(() => t('nav.posts')) },
  { key: 'about', label: computed(() => t('nav.about')) },
]

const activeNav = computed(() => (route.name as string) || 'intro')
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
    <nav class="glass flex items-center gap-1 px-2 py-2 rounded-full shadow-notch">
      <RouterLink
        v-for="item in navItems"
        :key="item.key"
        :to="{ name: item.key }"
        class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
        :class="activeNav === item.key
          ? 'bg-accent-500 text-white shadow-sm'
          : 'text-base-600 dark:text-base-300 hover:text-base-800 dark:hover:text-base-100'"
      >
        {{ item.label.value }}
      </RouterLink>
      <span class="w-px h-6 bg-base-200 dark:bg-base-700 mx-1" />
      <ThemeToggle />
      <LanguageSwitcher />
    </nav>
  </header>
</template>
