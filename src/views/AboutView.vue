<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { renderMarkdown } from '@/utils/markdown'
import { fetchAboutContent } from '@/utils/api'
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
const loading = ref(true)

function parseFriendTable(raw: string): FriendEntry[] {
  const lines = raw.split('\n')
  const result: FriendEntry[] = []
  let inTable = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    // 跳过分隔行和表头
    if (trimmed.startsWith('|--') || trimmed.startsWith('|--')) { inTable = true; continue }
    if (trimmed.startsWith('| ID') || trimmed.startsWith('|ID')) { inTable = true; continue }
    if (!inTable) continue

    const cells = trimmed
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim())

    if (cells.length >= 4) {
      result.push({
        id: cells[0],
        url: cells[1],
        intro: cells[2],
        picUrl: cells[3],
      })
    }
  }
  return result
}

async function load() {
  loading.value = true
  try {
    const [aboutRaw, friendsRaw] = await Promise.all([
      fetchAboutContent(locale.value, 'aboutMe'),
      fetchAboutContent(locale.value, 'friendsLink'),
    ])
    aboutHtml.value = renderMarkdown(aboutRaw)
    friends.value = parseFriendTable(friendsRaw)
  } catch {
    aboutHtml.value = ''
    friends.value = []
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

    <!-- 关于我 -->
    <div v-if="aboutHtml" class="glass-card p-8 md:p-10">
      <div class="prose-content" v-html="aboutHtml" />
    </div>

    <!-- 友链卡片 -->
    <div v-if="friends.length > 0" class="glass-card p-8">
      <h2 class="text-lg font-bold mb-5">🔗 {{ t('about.friends') }}</h2>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
        <a
          v-for="friend in friends"
          :key="friend.url"
          :href="friend.url"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-4 p-4.5 rounded-2xl transition-all duration-200 hover:-translate-y-1"
          style="background: var(--glass-bg); backdrop-filter: blur(20px) saturate(1.3); -webkit-backdrop-filter: blur(20px) saturate(1.3); border: 1px solid var(--glass-border);"
        >
          <div
            v-if="friend.picUrl"
            class="w-11 h-11 rounded-full shrink-0 bg-cover bg-center"
            :style="{ backgroundImage: `url(${friend.picUrl})` }"
          />
          <div
            v-else
            class="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
            style="background: var(--color-accent-soft); color: var(--color-accent);"
          >
            {{ friend.id.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-sm" style="color: var(--color-text);">{{ friend.id }}</div>
            <div class="text-xs truncate mt-0.5" style="color: var(--color-text-muted);">{{ friend.url }}</div>
            <div v-if="friend.intro" class="text-xs mt-1" style="color: var(--color-text-secondary);">{{ friend.intro }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
