<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { FriendLink } from '@/types'

const { t } = useI18n()

const friends: FriendLink[] = [
  { name: "Alice's Blog", url: 'https://alice.dev', avatar: '', description: '热爱开源的前端工程师，专注 Vue 生态' },
  { name: 'Bob 的技术笔记', url: 'https://bob.tech/blog', avatar: '', description: '专注后端架构与系统设计' },
  { name: 'Carol 的设计小站', url: 'https://carol.design', avatar: '', description: 'UI/UX 设计与创意编程' },
  { name: 'David 的全栈之路', url: 'https://david.io', avatar: '', description: '全栈开发 · 技术写作' },
]
</script>

<template>
  <div>
    <!-- 关于我 -->
    <div class="glass-card p-7">
      <h2 class="text-xl font-bold mb-3">{{ t('about.title') }}</h2>
      <p class="text-sm leading-relaxed" style="color: var(--color-text-secondary);">
        一个热爱技术与设计的全栈开发者。工作涉及 Vue、TypeScript、Node.js 等技术栈。<br/><br/>
        这个博客使用纯客户端渲染架构，所有内容以 Markdown 形式存储，通过 GitHub Pages 自动部署。背景支持自定义图片，无图片时呈现柔和的森林色动态渐变。
      </p>
    </div>

    <!-- 友链 -->
    <div class="glass-card p-7 mt-4">
      <h2 class="text-lg font-bold mb-4">🔗 {{ t('about.friends') }}</h2>
      <div class="grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
        <a
          v-for="friend in friends"
          :key="friend.url"
          :href="friend.url"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          style="background: var(--glass-bg); backdrop-filter: blur(18px) saturate(1.3); -webkit-backdrop-filter: blur(18px) saturate(1.3); border: 1px solid var(--glass-border);"
        >
          <div
            class="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-bold"
            style="background: var(--color-accent-soft);"
          >
            {{ friend.name.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-sm" style="color: var(--color-text);">{{ friend.name }}</div>
            <div class="text-xs truncate mt-0.5" style="color: var(--color-text-muted);">{{ friend.url }}</div>
            <div class="text-xs mt-0.5" style="color: var(--color-text-secondary);">{{ friend.description }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
