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
      // 暗色：深绿底自由流动
      c.fillStyle = `hsl(${140 + Math.sin(elapsed*0.6)*12}, 30%, ${10 + Math.sin(elapsed*0.4)*3}%)`
      c.fillRect(0, 0, w, h)

      const orbs = [
        { x: w*0.25 + Math.sin(elapsed*0.5)*100, y: h*0.2 + Math.cos(elapsed*0.4)*75,  r: Math.min(w,h)*0.40, h: 140 + Math.sin(elapsed*0.6)*18, s: 35, l: 18 },
        { x: w*0.75 + Math.cos(elapsed*0.55)*90, y: h*0.15 + Math.sin(elapsed*0.6)*65, r: Math.min(w,h)*0.36, h: 120 + Math.cos(elapsed*0.5)*15,  s: 30, l: 16 },
        { x: w*0.55 + Math.sin(elapsed*0.4)*110, y: h*0.72 + Math.cos(elapsed*0.5)*80, r: Math.min(w,h)*0.38, h: 160 + Math.sin(elapsed*0.55)*14, s: 32, l: 20 },
        { x: w*0.35 + Math.cos(elapsed*0.45)*80, y: h*0.55 + Math.sin(elapsed*0.5)*60, r: Math.min(w,h)*0.32, h: 135 + Math.cos(elapsed*0.65)*20, s: 28, l: 15 },
      ]
      for (const o of orbs) {
        const g = c.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        g.addColorStop(0, `hsla(${o.h},${o.s}%,${o.l+12}%,0.22)`)
        g.addColorStop(0.5, `hsla(${o.h},${o.s}%,${o.l}%,0.1)`)
        g.addColorStop(1, 'transparent')
        c.fillStyle = g; c.fillRect(0, 0, w, h)
      }
    } else {
      // 浅色：浅淡 → 浅绿 大范围流动
      const baseHue = 90 + Math.sin(elapsed * 0.5) * 40 // 50° ~ 130° : 黄绿 → 翠绿
      c.fillStyle = `hsl(${baseHue + 10}, 35%, ${92 + Math.sin(elapsed*0.35)*5}%)`
      c.fillRect(0, 0, w, h)

      const orbs = [
        { x: w*0.2  + Math.sin(elapsed*0.5)*120, y: h*0.2 + Math.cos(elapsed*0.4)*90,  r: Math.min(w,h)*0.42, h: baseHue + Math.sin(elapsed*0.6)*20,  s: 40, l: 80 },
        { x: w*0.78 + Math.cos(elapsed*0.55)*100, y: h*0.12 + Math.sin(elapsed*0.6)*80, r: Math.min(w,h)*0.38, h: baseHue + 20 + Math.cos(elapsed*0.55)*18, s: 35, l: 78 },
        { x: w*0.52 + Math.sin(elapsed*0.45)*130, y: h*0.7 + Math.cos(elapsed*0.5)*95,  r: Math.min(w,h)*0.40, h: baseHue + 40 + Math.sin(elapsed*0.5)*15,  s: 38, l: 76 },
        { x: w*0.35 + Math.cos(elapsed*0.5)*90,  y: h*0.5 + Math.sin(elapsed*0.55)*70, r: Math.min(w,h)*0.34, h: baseHue - 5 + Math.cos(elapsed*0.7)*25,  s: 42, l: 82 },
      ]
      for (const o of orbs) {
        const g = c.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        g.addColorStop(0, `hsla(${o.h},${o.s}%,${o.l - 12}%,0.28)`)
        g.addColorStop(0.5, `hsla(${o.h},${o.s}%,${o.l}%,0.12)`)
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
