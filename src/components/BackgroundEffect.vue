<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animId = 0
let mx = -1000
let my = -1000
let time = 0

const isDark = ref(false)

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  if (!ctx) return

  function resize() {
    canvas!.width = window.innerWidth
    canvas!.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  // 跟踪鼠标
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX
    my = e.clientY
  })

  // 观测暗色模式
  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  isDark.value = document.documentElement.classList.contains('dark')

  function draw() {
    const c = ctx!
    const w = canvas!.width
    const h = canvas!.height
    time += 0.005

    // 基础色
    const bgR = isDark.value ? 17 : 242
    const bgG = isDark.value ? 28 : 247
    const bgB = isDark.value ? 21 : 244

    c.fillStyle = `rgb(${bgR},${bgG},${bgB})`
    c.fillRect(0, 0, w, h)

    // 多个渐变光斑，位置随时间缓慢移动
    const orbs = [
      { cx: w * 0.2 + Math.sin(time * 0.7) * 60, cy: h * 0.25 + Math.cos(time * 0.5) * 40, r: Math.min(w, h) * 0.45, color: isDark.value ? [10, 40, 20] : [200, 230, 201] },
      { cx: w * 0.8 + Math.cos(time * 0.6) * 50, cy: h * 0.1 + Math.sin(time * 0.8) * 30, r: Math.min(w, h) * 0.4, color: isDark.value ? [13, 51, 20] : [165, 213, 167] },
      { cx: w * 0.55 + Math.sin(time * 0.4) * 70, cy: h * 0.75 + Math.cos(time * 0.6) * 45, r: Math.min(w, h) * 0.42, color: isDark.value ? [8, 46, 42] : [178, 223, 219] },
      { cx: w * 0.35 + Math.cos(time * 0.55) * 55, cy: h * 0.6 + Math.sin(time * 0.45) * 35, r: Math.min(w, h) * 0.38, color: isDark.value ? [10, 42, 16] : [220, 237, 200] },
    ]

    // 鼠标水波效果：在鼠标周围产生额外的光斑
    if (mx > 0 && my > 0) {
      orbs.push({
        cx: mx,
        cy: my,
        r: 200 + Math.sin(time * 3) * 30,
        color: isDark.value ? [60, 140, 70] : [130, 200, 140],
      })
      // 水波扩散圈
      for (let i = 0; i < 3; i++) {
        const rippleR = ((time * 120 + i * 80) % 300)
        const alpha = Math.max(0, 0.08 - rippleR / 4000)
        if (alpha > 0) {
          const grad = c.createRadialGradient(mx, my, rippleR * 0.5, mx, my, rippleR)
          grad.addColorStop(0, `rgba(${isDark.value ? '76,175,80' : '45,138,78'},0)`)
          grad.addColorStop(0.5, `rgba(${isDark.value ? '76,175,80' : '45,138,78'},${alpha})`)
          grad.addColorStop(1, `rgba(${isDark.value ? '76,175,80' : '45,138,78'},0)`)
          c.fillStyle = grad
          c.fillRect(0, 0, w, h)
        }
      }
    }

    for (const orb of orbs) {
      const grad = c.createRadialGradient(orb.cx, orb.cy, 0, orb.cx, orb.cy, orb.r)
      grad.addColorStop(0, `rgba(${orb.color.join(',')},0.35)`)
      grad.addColorStop(0.5, `rgba(${orb.color.join(',')},0.15)`)
      grad.addColorStop(1, `rgba(${orb.color.join(',')},0)`)
      c.fillStyle = grad
      c.fillRect(0, 0, w, h)
    }

    animId = requestAnimationFrame(draw)
  }

  draw()
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
})
</script>

<template>
  <canvas ref="canvasRef" class="fixed inset-0 z-0 pointer-events-none" />
</template>
