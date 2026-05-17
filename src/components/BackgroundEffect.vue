<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animId = 0
let w = 0, h = 0
let elapsed = 0

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')!

  function resize() { w = canvas!.width = window.innerWidth; h = canvas!.height = window.innerHeight }
  resize()
  window.addEventListener('resize', resize)

  function draw(ts: number) {
    elapsed = ts / 1000
    const c = ctx!
    const dark = document.documentElement.classList.contains('dark')

    if (dark) {
      c.fillStyle = `hsl(${145 + Math.sin(elapsed*0.8)*20}, 35%, ${8 + Math.sin(elapsed*0.5)*4}%)`
      c.fillRect(0, 0, w, h)

      const orbs = [
        { x: w*0.25 + Math.sin(elapsed*0.55)*180, y: h*0.25 + Math.cos(elapsed*0.45)*140,  r: Math.min(w,h)*0.50, h: 140 + Math.sin(elapsed*0.6)*25,  s: 50, l: 22 },
        { x: w*0.75 + Math.cos(elapsed*0.6)*160,  y: h*0.15 + Math.sin(elapsed*0.65)*120, r: Math.min(w,h)*0.45, h: 115 + Math.cos(elapsed*0.55)*22, s: 45, l: 20 },
        { x: w*0.50 + Math.sin(elapsed*0.45)*200, y: h*0.70 + Math.cos(elapsed*0.55)*150, r: Math.min(w,h)*0.48, h: 165 + Math.sin(elapsed*0.5)*20,  s: 48, l: 24 },
        { x: w*0.35 + Math.cos(elapsed*0.5)*170,  y: h*0.50 + Math.sin(elapsed*0.5)*130,  r: Math.min(w,h)*0.40, h: 130 + Math.cos(elapsed*0.7)*28,  s: 42, l: 18 },
      ]
      for (const o of orbs) {
        const g = c.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        g.addColorStop(0, `hsla(${o.h},${o.s}%,${o.l+18}%,0.35)`)
        g.addColorStop(0.4, `hsla(${o.h},${o.s}%,${o.l}%,0.18)`)
        g.addColorStop(1, 'transparent')
        c.fillStyle = g; c.fillRect(0, 0, w, h)
      }
    } else {
      // 浅色：大范围 浅淡白↔嫩绿↔翠绿
      const baseHue = 70 + Math.sin(elapsed * 0.5) * 50  // 20°~120°: 黄→草绿
      c.fillStyle = `hsl(${baseHue + 15}, 40%, ${90 + Math.sin(elapsed*0.4)*5}%)`
      c.fillRect(0, 0, w, h)

      const orbs = [
        { x: w*0.18 + Math.sin(elapsed*0.5)*180,  y: h*0.22 + Math.cos(elapsed*0.45)*150,  r: Math.min(w,h)*0.55, h: baseHue + Math.sin(elapsed*0.55)*30,  s: 55, l: 82 },
        { x: w*0.80 + Math.cos(elapsed*0.55)*160, y: h*0.12 + Math.sin(elapsed*0.6)*130,   r: Math.min(w,h)*0.48, h: baseHue + 25 + Math.cos(elapsed*0.5)*25,  s: 50, l: 78 },
        { x: w*0.50 + Math.sin(elapsed*0.4)*210,  y: h*0.72 + Math.cos(elapsed*0.55)*170,  r: Math.min(w,h)*0.52, h: baseHue + 50 + Math.sin(elapsed*0.45)*28, s: 55, l: 76 },
        { x: w*0.32 + Math.cos(elapsed*0.5)*170,  y: h*0.48 + Math.sin(elapsed*0.5)*140,   r: Math.min(w,h)*0.44, h: baseHue - 10 + Math.cos(elapsed*0.65)*35, s: 58, l: 84 },
        { x: w*0.65 + Math.sin(elapsed*0.6)*140,  y: h*0.40 + Math.cos(elapsed*0.7)*110,   r: Math.min(w,h)*0.38, h: baseHue + 35 + Math.sin(elapsed*0.7)*20,  s: 48, l: 80 },
      ]
      for (const o of orbs) {
        const g = c.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        g.addColorStop(0, `hsla(${o.h},${o.s}%,${o.l - 18}%,0.35)`)
        g.addColorStop(0.4, `hsla(${o.h},${o.s}%,${o.l}%,0.18)`)
        g.addColorStop(1, 'transparent')
        c.fillStyle = g; c.fillRect(0, 0, w, h)
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
