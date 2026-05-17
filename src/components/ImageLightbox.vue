<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const src = ref('')
const alt = ref('')

function open(e: CustomEvent) {
  src.value = e.detail.src
  alt.value = e.detail.alt
  visible.value = true
  document.body.style.overflow = 'hidden'
}

function close() {
  visible.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  window.addEventListener('lightbox-open', open as EventListener)
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('lightbox-open', open as EventListener)
  window.removeEventListener('keydown', onKey)
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-8" @click.self="close">
        <button class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-colors z-10" @click="close">
          ✕
        </button>
        <img :src="src" :alt="alt" class="max-w-full max-h-[85vh] rounded-lg object-contain" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
