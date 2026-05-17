import { ref, onMounted, onUnmounted } from 'vue'

export function useClock() {
  const time = ref('')
  let timer: ReturnType<typeof setInterval> | null = null

  function update() {
    const now = new Date()
    // UTC+8
    const beijing = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }))
    const hh = String(beijing.getHours()).padStart(2, '0')
    const mm = String(beijing.getMinutes()).padStart(2, '0')
    time.value = `${hh}:${mm}`
  }

  onMounted(() => {
    update()
    timer = setInterval(update, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { time }
}
