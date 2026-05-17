<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{
  content: string
}>()

const html = computed(() => renderMarkdown(props.content))

function openLightbox(src: string, alt: string) {
  const event = new CustomEvent('lightbox-open', { detail: { src, alt } })
  window.dispatchEvent(event)
}

;(window as any).__openLightbox = openLightbox
</script>

<template>
  <article class="prose max-w-none" v-html="html"></article>
</template>
