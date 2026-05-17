<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { renderMarkdown } from '@/utils/markdown'
import { fetchAboutContent } from '@/utils/api'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const { t, locale } = useI18n()
const aboutHtml = ref('')
const friendsHtml = ref('')
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const [aboutRaw, friendsRaw] = await Promise.all([
      fetchAboutContent(locale.value, 'aboutMe'),
      fetchAboutContent(locale.value, 'friendsLink'),
    ])
    aboutHtml.value = renderMarkdown(aboutRaw)
    friendsHtml.value = renderMarkdown(friendsRaw)
  } catch {
    aboutHtml.value = ''
    friendsHtml.value = ''
  } finally {
    loading.value = false
  }
}

watch(locale, load)
onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-8">
    <div v-if="loading" class="glass-card p-8 animate-pulse">
      <div class="h-6 bg-black/5 dark:bg-white/5 rounded w-1/3 mb-4" />
      <div class="h-4 bg-black/5 dark:bg-white/5 rounded w-full mb-2" />
      <div class="h-4 bg-black/5 dark:bg-white/5 rounded w-3/4" />
    </div>

    <div v-if="aboutHtml" class="glass-card p-8 md:p-10">
      <div class="prose-content" v-html="aboutHtml" />
    </div>

    <div v-if="friendsHtml" class="glass-card p-8 md:p-10">
      <div class="prose-content" v-html="friendsHtml" />
    </div>
  </div>
</template>
