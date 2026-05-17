<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{ content: string }>()
const html = computed(() => renderMarkdown(props.content))

function openLightbox(src: string, alt: string) {
  const e = new CustomEvent('lightbox-open', { detail: { src, alt } })
  window.dispatchEvent(e)
}
;(window as any).__openLightbox = openLightbox
</script>

<template>
  <div class="prose-content" v-html="html"></div>
</template>
