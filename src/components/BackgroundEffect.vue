<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animId = 0
let isDark = false

// 鼠标轨迹（船波尾迹）
interface TrailPoint { x: number; y: number; time: number }
const trail: TrailPoint[] = []
const MAX_TRAIL = 80
let mx = -1000; let my = -1000
let time = 0

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')!
  if (!ctx) return

  function resize() {
    canvas!.width = window.innerWidth
    canvas!.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  window.addEventListener('mousemove', (e) => {
    if (mx === -1000) { mx = e.clientX; my = e.clientY; return }
    const dx = e.clientX - mx, dy = e.clientY - my
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 3) return // 移动太短，忽略
    mx = e.clientX; my = e.clientY
    trail.push({ x: mx, y: my, time })
    if (trail.length > MAX_TRAIL) trail.shift()
  })

  window.addEventListener('mouseleave', () => { mx = -1000; trail.length = 0 })

  const observer = new MutationObserver(() => {
    isDark = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  isDark = document.documentElement.classList.contains('dark')

  function draw() {
    const c = ctx!
    const w = canvas!.width, h = canvas!.height
    time += 0.016

    // 基础填充
    c.fillStyle = isDark ? 'rgb(17,28,21)' : 'rgb(242,247,244)'
    c.fillRect(0, 0, w, h)

    // 背景光斑（缓慢游走）
    const orbs = [
      { cx: w * 0.22 + Math.sin(time * 0.4) * 70, cy: h * 0.25 + Math.cos(time * 0.35) * 50, r: Math.min(w, h) * 0.42, c: isDark ? [15, 45, 22] : [200, 230, 201] },
      { cx: w * 0.78 + Math.cos(time * 0.35) * 60, cy: h * 0.15 + Math.sin(time * 0.5) * 40, r: Math.min(w, h) * 0.38, c: isDark ? [14, 48, 22] : [165, 213, 167] },
      { cx: w * 0.5 + Math.sin(time * 0.3) * 80, cy: h * 0.72 + Math.cos(time * 0.4) * 55, r: Math.min(w, h) * 0.4, c: isDark ? [10, 40, 38] : [178, 223, 219] },
    ]
    for (const o of orbs) {
      const g = c.createRadialGradient(o.cx, o.cy, 0, o.cx, o.cy, o.r)
      g.addColorStop(0, `rgba(${o.c.join(',')},0.30)`)
      g.addColorStop(0.5, `rgba(${o.c.join(',')},0.12)`)
      g.addColorStop(1, `rgba(${o.c.join(',')},0)`)
      c.fillStyle = g
      c.fillRect(0, 0, w, h)
    }

    // ═══ 船波尾迹 ═══
    const now = performance.now() / 1000
    // 每对相邻轨迹点之间产生波纹
    for (let i = 1; i < trail.length; i++) {
      const p0 = trail[i - 1], p1 = trail[i]
      const age = now - p1.time
      if (age > 4) continue // 4 秒后消失

      // 运动方向
      const dx = p1.x - p0.x, dy = p1.y - p0.y
      const len = Math.sqrt(dx * dx + dy * dy)
      if (len < 1) continue
      const nx = -dy / len, ny = dx / len // 垂直方向

      // 在该点两侧生成波纹
      for (let side = -1; side <= 1; side += 2) {
        const spread = age * 60 + 8 // 波纹扩散距离
        const alpha = Math.max(0, 0.15 * (1 - age / 4))
        if (alpha <= 0) continue

        for (let w = -1; w <= 1; w += 2) {
          const cx = p1.x + nx * side * (spread + w * 20)
          const cy = p1.y + ny * side * (spread + w * 20)
          const g = c.createRadialGradient(cx, cy, 0, cx, cy, spread * 0.4 + 12)
          const col = isDark ? '76,175,80' : '45,138,78'
          g.addColorStop(0, `rgba(${col},0)`)
          g.addColorStop(0.7, `rgba(${col},${alpha})`)
          g.addColorStop(1, `rgba(${col},0)`)
          c.fillStyle = g
          c.fillRect(0, 0, w, h)
        }
      }
    }

    animId = requestAnimationFrame(draw)
  }
  draw()
})

onUnmounted(() => { cancelAnimationFrame(animId) })
</script>

<template>
  <canvas ref="canvasRef" class="fixed inset-0 z-0 pointer-events-none" />
</template>
