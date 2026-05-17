<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const model = defineModel<string>({ required: true })
const { t } = useI18n()
</script>

<template>
  <input
    v-model="model"
    type="text"
    :placeholder="t('posts.search')"
    class="search-box"
  />
</template>
