<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()
const BASE = import.meta.env.BASE_URL
</script>

<template>
  <!-- 动态渐变背景 -->
  <div class="dynamic-bg" />
  <!-- 网格纹理 -->
  <div class="grid-texture" />
  <!-- 背景图叠加（通过 JS 动态加载） -->
</template>
