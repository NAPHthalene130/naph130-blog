<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animId = 0
let w = 0, h = 0

// 鼠标轨迹
interface TrailPoint { x: number; y: number; t: number }
const trail: TrailPoint[] = []
let mx = -1000, my = -1000
let elapsed = 0

function isDarkMode(): boolean {
  return document.documentElement.classList.contains('dark')
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')!

  function resize() { w = canvas!.width = window.innerWidth; h = canvas!.height = window.innerHeight }
  resize()
  window.addEventListener('resize', resize)

  window.addEventListener('mousemove', (e) => {
    if (mx === -1000) { mx = e.clientX; my = e.clientY; return }
    const dx = e.clientX - mx, dy = e.clientY - my
    if (dx * dx + dy * dy < 9) return
    mx = e.clientX; my = e.clientY
    trail.push({ x: mx, y: my, t: elapsed })
    if (trail.length > 80) trail.shift()
  })
  window.addEventListener('mouseleave', () => { mx = -1000; trail.length = 0 })

  // 监听主题变化
  const observer = new MutationObserver(() => {})
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  function draw(ts: number) {
    elapsed = ts / 1000
    const c = ctx!
    const dark = isDarkMode()

    // ── 动态渐变色：用 sin/cos 让颜色随时间流动 ──
    // 色相在森林绿系缓慢循环
    const hueBase = (Math.sin(elapsed * 0.15) * 0.5 + 0.5) * 40 + 80  // 80~120 绿色区间

    if (dark) {
      // 暗色：深绿底
      c.fillStyle = `rgb(${10 + Math.sin(elapsed*0.3)*3},${18 + Math.cos(elapsed*0.25)*4},${16 + Math.sin(elapsed*0.4)*4})`
      c.fillRect(0, 0, w, h)

      const orbs = [
        { cx: w * 0.25 + Math.sin(elapsed * 0.3) * 80, cy: h * 0.2 + Math.cos(elapsed * 0.25) * 60, r: Math.min(w, h) * 0.38,
          h: hueBase + Math.sin(elapsed * 0.4) * 15, s: 55, l: 22 },
        { cx: w * 0.75 + Math.cos(elapsed * 0.35) * 70, cy: h * 0.15 + Math.sin(elapsed * 0.4) * 50, r: Math.min(w, h) * 0.35,
          h: hueBase + 20 + Math.cos(elapsed * 0.5) * 10, s: 50, l: 20 },
        { cx: w * 0.55 + Math.sin(elapsed * 0.25) * 90, cy: h * 0.7 + Math.cos(elapsed * 0.35) * 65, r: Math.min(w, h) * 0.36,
          h: hueBase + 40 + Math.sin(elapsed * 0.35) * 12, s: 45, l: 24 },
        { cx: w * 0.4 + Math.cos(elapsed * 0.2) * 60, cy: h * 0.55 + Math.sin(elapsed * 0.3) * 45, r: Math.min(w, h) * 0.3,
          h: hueBase - 10 + Math.cos(elapsed * 0.45) * 18, s: 50, l: 18 },
      ]

      for (const o of orbs) {
        const g = c.createRadialGradient(o.cx, o.cy, 0, o.cx, o.cy, o.r)
        g.addColorStop(0, `hsla(${o.h},${o.s}%,${o.l + 18}%,0.25)`)
        g.addColorStop(0.5, `hsla(${o.h},${o.s}%,${o.l}%,0.1)`)
        g.addColorStop(1, 'transparent')
        c.fillStyle = g; c.fillRect(0, 0, w, h)
      }
    } else {
      // 浅色：淡绿白底
      c.fillStyle = `rgb(${238 + Math.sin(elapsed*0.2)*8},${245 + Math.cos(elapsed*0.2)*6},${240 + Math.sin(elapsed*0.3)*8})`
      c.fillRect(0, 0, w, h)

      const orbs = [
        { cx: w * 0.22 + Math.sin(elapsed * 0.3) * 70, cy: h * 0.25 + Math.cos(elapsed * 0.25) * 50, r: Math.min(w, h) * 0.38,
          h: hueBase + Math.sin(elapsed * 0.4) * 12, s: 35, l: 82 },
        { cx: w * 0.78 + Math.cos(elapsed * 0.35) * 60, cy: h * 0.12 + Math.sin(elapsed * 0.4) * 45, r: Math.min(w, h) * 0.35,
          h: hueBase + 25 + Math.cos(elapsed * 0.5) * 8, s: 30, l: 80 },
        { cx: w * 0.5 + Math.sin(elapsed * 0.25) * 85, cy: h * 0.72 + Math.cos(elapsed * 0.35) * 60, r: Math.min(w, h) * 0.36,
          h: hueBase + 45 + Math.sin(elapsed * 0.35) * 10, s: 32, l: 78 },
        { cx: w * 0.35 + Math.cos(elapsed * 0.2) * 55, cy: h * 0.55 + Math.sin(elapsed * 0.3) * 40, r: Math.min(w, h) * 0.3,
          h: hueBase - 5 + Math.cos(elapsed * 0.45) * 15, s: 30, l: 84 },
      ]

      for (const o of orbs) {
        const g = c.createRadialGradient(o.cx, o.cy, 0, o.cx, o.cy, o.r)
        g.addColorStop(0, `hsla(${o.h},${o.s}%,${o.l - 12}%,0.22)`)
        g.addColorStop(0.5, `hsla(${o.h},${o.s}%,${o.l}%,0.08)`)
        g.addColorStop(1, 'transparent')
        c.fillStyle = g; c.fillRect(0, 0, w, h)
      }
    }

    // ── 船波尾迹 ──
    for (let i = 1; i < trail.length; i++) {
      const p0 = trail[i - 1], p1 = trail[i]
      const age = elapsed - p1.t
      if (age > 4) continue

      const dx = p1.x - p0.x, dy = p1.y - p0.y
      const len = Math.sqrt(dx * dx + dy * dy)
      if (len < 1) continue
      const nx = -dy / len, ny = dx / len

      for (let side = -1; side <= 1; side += 2) {
        const spread = age * 55 + 6
        const alpha = Math.max(0, 0.12 * (1 - age / 4))
        if (alpha <= 0) continue

        for (let w2 = -1; w2 <= 1; w2 += 2) {
          const cx = p1.x + nx * side * (spread + w2 * 18)
          const cy = p1.y + ny * side * (spread + w2 * 18)
          const g = c.createRadialGradient(cx, cy, 0, cx, cy, spread * 0.35 + 10)
          const col = dark ? 'hsla(120,40%,55%,' : 'hsla(120,30%,40%,'
          g.addColorStop(0, 'transparent')
          g.addColorStop(0.7, col + alpha + ')')
          g.addColorStop(1, 'transparent')
          c.fillStyle = g; c.fillRect(0, 0, w, h)
        }
      }
    }

    animId = requestAnimationFrame(draw)
  }
  requestAnimationFrame(draw)
})

onUnmounted(() => { cancelAnimationFrame(animId) })
</script>

<template>
  <canvas ref="canvasRef" class="fixed inset-0 z-0 pointer-events-none" />
</template>
