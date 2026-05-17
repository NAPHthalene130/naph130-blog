<script setup lang="ts">
import { ref, onMounted } from 'vue'

const mode = ref<'image' | 'particles'>('particles')

onMounted(() => {
  const img = new Image()
  img.src = '/backgrounds/light/default.webp'
  img.onload = () => { mode.value = 'image' }
})
</script>

<template>
  <div class="fixed inset-0 z-0 pointer-events-none">
    <div v-if="mode === 'image'" class="absolute inset-0 bg-cover bg-center bg-fixed opacity-30 dark:opacity-20" :style="{ backgroundImage: 'url(/backgrounds/light/default.webp)' }" />
    <!-- Particle effect placeholder -->
  </div>
</template>
