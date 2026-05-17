<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useClock } from '@/composables/useClock'

const { t } = useI18n()
const { time } = useClock()
const BASE = import.meta.env.BASE_URL

const avatarLoaded = ref(false)
const avatarUrl = `${BASE}assets/avatar.jpg`

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
      <div class="glass-card text-center p-6">
      <div class="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl overflow-hidden shadow-lg" :style="{ background: avatarLoaded ? 'transparent' : 'linear-gradient(135deg, #2d8a4e, #4caf50)', boxShadow: '0 4px 16px rgba(45,138,78,0.25)' }">
        <img
          :src="avatarUrl"
          class="w-full h-full object-cover"
          :class="{ hidden: !avatarLoaded }"
          @load="avatarLoaded = true"
          @error="avatarLoaded = false"
          alt=""
        />
        <span :class="{ hidden: avatarLoaded }">N</span>
      </div>
        <div class="font-bold text-base truncate px-1" style="color: var(--color-text);">{{ t('sidebar.name') }}</div>
        <div class="text-xs mt-0.5 truncate px-1" style="color: var(--color-text-muted);">{{ t('sidebar.handle') }}</div>
        <div class="text-xs mt-2.5 leading-relaxed px-1" style="color: var(--color-text-secondary);">
          {{ t('sidebar.location') }} <span class="font-mono font-medium" style="color: var(--color-accent);">{{ time }}</span>
        </div>
        <div class="text-xs leading-relaxed px-1" style="color: var(--color-text-secondary);">{{ t('sidebar.education') }}</div>
        <div class="flex justify-center gap-2 mt-3 px-2">
          <a href="https://github.com/NAPHthalene130/" target="_blank" rel="noopener" class="text-xs px-2 py-1.5 rounded-lg font-medium hover:opacity-80" style="background: var(--color-accent-soft); color: var(--color-accent); text-decoration: none;">🐙 GitHub</a>
          <a href="mailto:naphthalene130@gmail.com" class="text-xs px-2 py-1.5 rounded-lg font-medium hover:opacity-80" style="background: var(--color-accent-soft); color: var(--color-accent); text-decoration: none;">📧 Email</a>
        </div>
      </div>

      <!-- 类别 -->
      <div class="glass-card p-5">
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
      <div class="glass-card p-5">
        <div class="side-title">🏷️ {{ t('sidebar.tags') }}</div>
        <div class="tag-cloud-side">
          <button v-for="tag in tags" :key="tag.name" @click="emit('select-category', tag.name)">{{ tag.name }}</button>
        </div>
      </div>

      <!-- 统计 -->
      <div class="glass-card p-5">
        <div class="side-title">📊 {{ t('sidebar.stats') }}</div>
        <div class="text-sm leading-9 px-1" style="color: var(--color-text-secondary);">
          <div>📄 {{ t('sidebar.posts') }} <span style="color: var(--color-accent); font-weight: 600;">{{ totalPosts }}</span></div>
        </div>
      </div>
    </div>
  </aside>
</template>
