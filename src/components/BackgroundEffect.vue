<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()
const mode = ref<'image' | 'particles'>('particles')
const BASE = import.meta.env.BASE_URL

onMounted(() => {
  const img = new Image()
  img.src = `${BASE}backgrounds/light/default.webp`
  img.onload = () => { mode.value = 'image' }
  img.onerror = () => { mode.value = 'particles' }
})
</script>

<template>
  <div class="fixed inset-0 z-0 pointer-events-none">
    <div
      v-if="mode === 'image' && !isDark"
      class="absolute inset-0 bg-cover bg-center bg-fixed opacity-30"
      :style="{ backgroundImage: `url(${BASE}backgrounds/light/default.webp)` }"
    />
    <div
      v-if="mode === 'image' && isDark"
      class="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
      :style="{ backgroundImage: `url(${BASE}backgrounds/dark/default.webp)` }"
    />
    <div v-if="mode === 'particles'" class="particles-bg">
      <div class="particles-star" />
      <div class="particles-star" />
      <div class="particles-star" />
      <div class="particles-star" />
      <div class="particles-star" />
    </div>
  </div>
</template>
