<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { PostMeta } from '@/types'

const { t } = useI18n()

const props = defineProps<{
  categories: { name: string; count: number }[]
  tags: { name: string; count: number }[]
  activeCategory: string
  totalPosts: number
}>()

const emit = defineEmits<{ 'select-category': [name: string] }>()
</script>

<template>
  <aside class="app-sidebar">
    <div class="flex flex-col gap-4">
      <!-- 个人卡片 -->
      <div class="glass-card text-center p-5">
        <div
          class="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl"
          style="background: linear-gradient(135deg, #2d8a4e, #4caf50); box-shadow: 0 4px 16px rgba(45,138,78,0.25);"
        >👤</div>
        <div class="font-bold text-base truncate" style="color: var(--color-text);">NAPHthalene</div>
        <div class="text-xs mt-0.5 truncate" style="color: var(--color-text-muted);">@naph130</div>
        <div class="text-xs mt-2.5 leading-relaxed px-1 break-words" style="color: var(--color-text-secondary);">前端开发者 · Vue · TS · Node.js</div>
        <div class="flex justify-center gap-2 mt-3">
          <a href="#" class="text-xs px-2 py-1.5 rounded-lg font-medium" style="background: var(--color-accent-soft); color: var(--color-accent);">🐙 GitHub</a>
          <a href="#" class="text-xs px-2 py-1.5 rounded-lg font-medium" style="background: var(--color-accent-soft); color: var(--color-accent);">📧 Email</a>
        </div>
      </div>

      <!-- 类别 -->
      <div class="glass-card">
        <div class="side-title">📂 {{ t('sidebar.categories') }}</div>
        <div class="cat-list">
          <button :class="{ active: activeCategory === 'all' }" @click="emit('select-category', 'all')">
            {{ t('sidebar.all') }} <span class="ct">{{ totalPosts }}</span>
          </button>
          <button
            v-for="cat in categories"
            :key="cat.name"
            :class="{ active: activeCategory === cat.name }"
            @click="emit('select-category', cat.name)"
          >
            {{ cat.name }} <span class="ct">{{ cat.count }}</span>
          </button>
        </div>
      </div>

      <!-- 标签 -->
      <div class="glass-card">
        <div class="side-title">🏷️ {{ t('sidebar.tags') }}</div>
        <div class="tag-cloud-side">
          <button v-for="tag in tags" :key="tag.name" @click="emit('select-category', tag.name)">{{ tag.name }}</button>
        </div>
      </div>

      <!-- 统计 -->
      <div class="glass-card">
        <div class="side-title">📊 {{ t('sidebar.stats') }}</div>
        <div class="text-sm leading-9" style="color: var(--color-text-secondary);">
          <div>📄 {{ t('sidebar.posts') }} <span style="color: var(--color-accent); font-weight: 600;">{{ totalPosts }}</span></div>
        </div>
      </div>
    </div>
  </aside>
</template>
