import { ref } from 'vue'

const activeCategory = ref('all')

export function useCategoryFilter() {
  return { activeCategory }
}
