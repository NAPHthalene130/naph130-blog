<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t } = useI18n()
const route = useRoute()

const navItems = [
  { name: 'home', label: computed(() => t('nav.home')) },
  { name: 'posts', label: computed(() => t('nav.posts')) },
  { name: 'about', label: computed(() => t('nav.about')) },
]

const activeNav = computed(() => {
  const name = route.name as string
  if (name === 'intro') return 'home'
  if (name === 'post') return 'posts'
  return name || 'home'
})

const localeParam = computed(() => (route.params.locale as string) || 'zh_cn')
</script>

<template>
  <header class="fixed top-4 left-1/2 -translate-x-1/2 z-50">
    <nav class="nav-notch">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name === 'home' ? 'intro' : item.name, params: { locale: localeParam } }"
        class="nav-link"
        :class="{ active: activeNav === item.name }"
      >
        {{ item.label.value }}
      </RouterLink>
      <span class="nav-sep"></span>
      <ThemeToggle />
      <LanguageSwitcher />
    </nav>
  </header>
</template>

<style scoped>
.nav-notch {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 5px 8px;
  background: rgba(255, 255, 255, 0.52);
  backdrop-filter: blur(24px) saturate(1.5);
  -webkit-backdrop-filter: blur(24px) saturate(1.5);
  border: 1px solid var(--glass-border);
  border-radius: 30px;
  box-shadow: var(--glass-shadow);
  flex-shrink: 0;
}
html.dark .nav-notch {
  background: rgba(17, 28, 21, 0.58);
}

.nav-link {
  padding: 8px 16px;
  border-radius: 22px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  line-height: 1;
}
.nav-link:hover {
  color: var(--color-text);
  background: var(--color-accent-soft);
}
.nav-link.active {
  background: var(--color-accent);
  color: #fff;
}

.nav-sep {
  width: 1px;
  height: 20px;
  background: rgba(40, 80, 50, 0.12);
  margin: 0 6px;
  flex-shrink: 0;
}
html.dark .nav-sep {
  background: rgba(100, 160, 120, 0.12);
}
</style>
