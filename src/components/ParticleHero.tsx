import React, { useEffect, useRef } from 'react';

interface Particle {
  // 当前坐标
  x: number;
  y: number;
  // 初始散落起点
  originX: number;
  originY: number;
  // 文字基准目标坐标
  targetX: number;
  targetY: number;
  // 尺寸与透明度
  size: number;
  alpha: number;
  baseAlpha: number;
  // 围绕字形的细腻微游动参数
  orbitRadiusX: number;
  orbitRadiusY: number;
  orbitSpeedX: number;
  orbitSpeedY: number;
  orbitPhase: number;
  // 呼吸闪烁
  shimmerSpeed: number;
  shimmerPhase: number;
  // 汇聚时差延迟
  delay: number;
}

export const ParticleHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const renderCtx = ctx;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    renderCtx.scale(dpr, dpr);

    const TEXT = "NAPH130's Blog";

    // 1. 离屏 Canvas 采样目标文字点阵
    function sampleTextCoordinates(): Array<{ x: number; y: number }> {
      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return [];

      offscreen.width = width;
      offscreen.height = height;

      const fontSize = Math.max(30, Math.min(width / 10.5, 78));
      offCtx.font = `700 ${fontSize}px "Comfortaa", "Outfit", cursive, sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillStyle = '#ffffff';
      offCtx.fillText(TEXT, width / 2, height / 2);

      const imgData = offCtx.getImageData(0, 0, width, height).data;
      const points: Array<{ x: number; y: number }> = [];
      const density = width < 640 ? 5 : 4;

      for (let y = 0; y < height; y += density) {
        for (let x = 0; x < width; x += density) {
          const index = (y * width + x) * 4;
          if (imgData[index + 3] > 128) {
            points.push({
              x: x + (Math.random() - 0.5) * 1.2,
              y: y + (Math.random() - 0.5) * 1.2,
            });
          }
        }
      }
      return points;
    }

    // 2. 初始化粒子系统（全屏自然星尘起点）
    function initParticles() {
      const textPoints = sampleTextCoordinates();
      const count = textPoints.length;
      if (count === 0) return;

      particles = [];

      for (let i = 0; i < count; i++) {
        const target = textPoints[i];

        // 初始呈散落的星尘分布（全屏随机散射）
        const originX = Math.random() * width;
        const originY = Math.random() * height;

        particles.push({
          x: originX,
          y: originY,
          originX,
          originY,
          targetX: target.x,
          targetY: target.y,
          size: Math.random() * 0.9 + 1.2,
          alpha: 1,
          baseAlpha: Math.random() * 0.35 + 0.65,
          orbitRadiusX: Math.random() * 2.0 + 1.2, // 微游动半径 (1.2px ~ 3.2px)
          orbitRadiusY: Math.random() * 1.6 + 1.0,
          orbitSpeedX: (Math.random() * 0.03 + 0.015) * (Math.random() > 0.5 ? 1 : -1),
          orbitSpeedY: (Math.random() * 0.03 + 0.015) * (Math.random() > 0.5 ? 1 : -1),
          orbitPhase: Math.random() * Math.PI * 2,
          shimmerSpeed: Math.random() * 0.03 + 0.015,
          shimmerPhase: Math.random() * Math.PI * 2,
          delay: Math.random() * 0.35, // 优雅的入场时间差
        });
      }
    }

    if (document.fonts) {
      document.fonts.ready.then(() => {
        initParticles();
      });
    } else {
      initParticles();
    }

    // 鼠标交互
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const startTime = performance.now();

    // 3. 动画主循环（包含入场汇聚拼装过程 + 常驻游动）
    function render(currentTime: number) {
      const elapsed = (currentTime - startTime) / 1000; // 秒

      renderCtx.clearRect(0, 0, width, height);

      // 阶段：
      // 0.0s - 1.8s: 自然星尘平滑向文字汇聚拼装 (Assemble Phase)
      // 1.8s 之后: 围绕文字进行常驻微游动与鼠标排斥 (Living Swarm Phase)
      const isAssemblePhase = elapsed < 1.8;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.orbitPhase += p.orbitSpeedX;
        p.shimmerPhase += p.shimmerSpeed;

        const currentTargetX = p.targetX + Math.sin(p.orbitPhase) * p.orbitRadiusX;
        const currentTargetY = p.targetY + Math.cos(p.orbitPhase * 0.9) * p.orbitRadiusY;

        if (isAssemblePhase) {
          // 入场汇聚拼装过程（平滑三次贝塞尔缓动）
          const rawT = elapsed / 1.6;
          const delayedT = Math.max(0, Math.min(1, (rawT - p.delay) / (1 - p.delay)));
          const easeT =
            delayedT < 0.5
              ? 4 * delayedT * delayedT * delayedT
              : 1 - Math.pow(-2 * delayedT + 2, 3) / 2;

          p.x = p.originX + (currentTargetX - p.originX) * easeT;
          p.y = p.originY + (currentTargetY - p.originY) * easeT;
          p.alpha = Math.min(p.baseAlpha, delayedT * 1.2);
        } else {
          // 拼装完成：围绕字形游动 + 鼠标交互
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 70;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 14;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }

          p.x += (currentTargetX - p.x) * 0.08;
          p.y += (currentTargetY - p.y) * 0.08;
          p.alpha = p.baseAlpha + Math.sin(p.shimmerPhase) * 0.2;
        }

        // 绘制发光粒子
        renderCtx.beginPath();
        renderCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        renderCtx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        renderCtx.shadowColor = 'rgba(255, 255, 255, 0.75)';
        renderCtx.shadowBlur = 2.5;
        renderCtx.fill();
      }

      renderCtx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      renderCtx.scale(dpr, dpr);
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-auto select-none z-20 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
export default ParticleHero;
