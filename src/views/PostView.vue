<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">文章: {{ route.params.slug }}</h1>
    <p class="text-base-500">文章内容加载中...</p>
  </div>
</template>
