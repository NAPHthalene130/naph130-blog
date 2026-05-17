<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import BackgroundEffect from '../components/BackgroundEffect.vue'
</script>

<template>
  <div class="relative min-h-screen">
    <BackgroundEffect />
    <AppHeader />
    <main class="relative z-10 pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
