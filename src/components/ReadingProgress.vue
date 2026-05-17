<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
function onScroll() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-60 h-1 pointer-events-none" style="background: transparent;">
    <div
      class="h-full transition-all duration-150 ease-out"
      style="background: var(--color-accent);"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>
