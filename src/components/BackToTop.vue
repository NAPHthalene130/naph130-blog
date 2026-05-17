<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
function onScroll() { visible.value = window.scrollY > 400 }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="fade">
    <button
      v-if="visible"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
      style="background: var(--glass-bg); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid var(--glass-border); color: var(--color-text-secondary);"
      aria-label="返回顶部"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
