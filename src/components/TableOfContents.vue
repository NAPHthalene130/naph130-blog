<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { TocItem } from '@/types'

defineProps<{ items: TocItem[]; activeId: string }>()
const { t } = useI18n()
</script>

<template>
  <nav v-if="items.length > 0" class="article-toc">
    <div class="glass-card sticky top-24 p-5">
      <h3 class="text-xs font-bold uppercase tracking-wider mb-3" style="color: var(--color-text-muted);">
        {{ t('post.toc') }}
      </h3>
      <ul class="space-y-0.5 text-sm border-l border-black/8 dark:border-white/8">
        <template v-for="item in items" :key="item.id">
          <li>
            <a
              :href="`#${item.id}`"
              class="block py-1.5 pl-3 border-l-2 -ml-px transition-colors"
              :class="activeId === item.id
                ? 'font-medium'
                : 'border-transparent hover:text-current'"
              :style="activeId === item.id
                ? `border-color: var(--color-accent); color: var(--color-accent);`
                : `color: var(--color-text-muted); border-color: transparent;`"
            >
              {{ item.text }}
            </a>
            <ul v-if="item.children.length > 0" class="ml-2">
              <li v-for="child in item.children" :key="child.id">
                <a
                  :href="`#${child.id}`"
                  class="block py-1.5 pl-3 border-l-2 -ml-px text-xs transition-colors"
                  :class="activeId === child.id ? 'font-medium' : ''"
                  :style="activeId === child.id
                    ? `border-color: var(--color-accent); color: var(--color-accent);`
                    : `color: var(--color-text-muted); border-color: transparent;`"
                >
                  {{ child.text }}
                </a>
              </li>
            </ul>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>
