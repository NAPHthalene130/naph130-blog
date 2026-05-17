<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { TocItem } from '@/types'

defineProps<{
  items: TocItem[]
  activeId: string
}>()

const { t } = useI18n()
</script>

<template>
  <nav v-if="items.length > 0" class="hidden xl:block sticky top-28 w-56 shrink-0">
    <h3 class="text-sm font-semibold text-base-500 dark:text-base-400 mb-3 uppercase tracking-wide">{{ t('post.toc') }}</h3>
    <ul class="space-y-1 text-sm border-l border-base-200 dark:border-base-700">
      <template v-for="item in items" :key="item.id">
        <li>
          <a
            :href="`#${item.id}`"
            class="block py-1 pl-3 border-l-2 -ml-px transition-colors"
            :class="activeId === item.id
              ? 'border-accent-500 text-accent-600 dark:text-accent-400 font-medium'
              : 'border-transparent text-base-400 dark:text-base-500 hover:text-base-600 dark:hover:text-base-300'"
          >
            {{ item.text }}
          </a>
          <ul v-if="item.children.length > 0" class="ml-3">
            <li v-for="child in item.children" :key="child.id">
              <a
                :href="`#${child.id}`"
                class="block py-1 pl-3 border-l-2 -ml-px transition-colors"
                :class="activeId === child.id
                  ? 'border-accent-500 text-accent-600 dark:text-accent-400 font-medium'
                  : 'border-transparent text-base-400 dark:text-base-500 hover:text-base-600 dark:hover:text-base-300'"
              >
                {{ child.text }}
              </a>
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </nav>
</template>
