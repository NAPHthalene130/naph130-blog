<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { renderMarkdown } from '@/utils/markdown'
import { getAboutContent } from '@/data/loader'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

interface FriendEntry {
  id: string
  url: string
  intro: string
  picUrl: string
}

const { t, locale } = useI18n()
const aboutHtml = ref('')
const friends = ref<FriendEntry[]>([])

function parseFriendTable(raw: string): FriendEntry[] {
  const lines = raw.split('\n')
  const result: FriendEntry[] = []
  let inTable = false
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('|--')) { inTable = true; continue }
    if (trimmed.startsWith('| ID') || trimmed.startsWith('|ID')) { inTable = true; continue }
    if (!inTable) continue
    const cells = trimmed.replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
    if (cells.length >= 4) {
      result.push({ id: cells[0], url: cells[1], intro: cells[2], picUrl: cells[3] })
    }
  }
  return result
}

function load() {
  const aboutRaw = getAboutContent(locale.value, 'aboutMe')
  const friendsRaw = getAboutContent(locale.value, 'friendsLink')
  aboutHtml.value = renderMarkdown(aboutRaw || '')
  friends.value = friendsRaw ? parseFriendTable(friendsRaw) : []
}

watch(locale, load)
onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-8">
    <div v-if="aboutHtml" class="glass-card p-8 md:p-10">
      <div class="prose-content" v-html="aboutHtml" />
    </div>
    <div v-if="friends.length > 0" class="glass-card p-8">
      <h2 class="text-lg font-bold mb-5">🔗 {{ t('about.friends') }}</h2>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
        <a v-for="f in friends" :key="f.url" :href="f.url" target="_blank" rel="noopener" class="flex items-center gap-4 p-4.5 rounded-2xl transition-all duration-200 hover:-translate-y-1" style="background: var(--glass-bg); backdrop-filter: blur(20px) saturate(1.3); -webkit-backdrop-filter: blur(20px) saturate(1.3); border: 1px solid var(--glass-border);">
          <div v-if="f.picUrl" class="w-11 h-11 rounded-full shrink-0 bg-cover bg-center" :style="{ backgroundImage: `url(${f.picUrl})` }" />
          <div v-else class="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-sm font-bold" style="background: var(--color-accent-soft); color: var(--color-accent);">{{ f.id.charAt(0) }}</div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-sm" style="color: var(--color-text);">{{ f.id }}</div>
            <div class="text-xs truncate mt-0.5" style="color: var(--color-text-muted);">{{ f.url }}</div>
            <div v-if="f.intro" class="text-xs mt-1" style="color: var(--color-text-secondary);">{{ f.intro }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
