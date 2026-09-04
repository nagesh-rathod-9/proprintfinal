/**
 * Lightweight, zero-dependency celebratory confetti generator.
 * Works seamlessly in any browser or environment without external npm packages.
 */
export function triggerConfetti() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.id = 'proprint-celebration-confetti';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const colors = [
    '#e11d48', // rose-600
    '#2563eb', // blue-600
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4'  // cyan-500
  ];

  interface Particle {
    x: number;
    y: number;
    w: number;
    h: number;
    vx: number;
    vy: number;
    rotation: number;
    vRotation: number;
    color: string;
    opacity: number;
  }

  const particles: Particle[] = [];
  const count = 90;

  for (let i = 0; i < count; i++) {
    const speed = 10 + Math.random() * 18;

    particles.push({
      x: width * 0.5 + (Math.random() - 0.5) * 80,
      y: height * 0.65,
      w: 8 + Math.random() * 6,
      h: 4 + Math.random() * 4,
      vx: (Math.random() - 0.5) * 16,
      vy: -speed,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 15,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1
    });
  }

  let startTime: number | null = null;
  const duration = 2400; // ms

  function animate(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = elapsed / duration;

    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38; // gravity
      p.vx *= 0.98; // air drag
      p.rotation += p.vRotation;
      p.opacity = Math.max(0, 1 - Math.pow(progress, 1.5));

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(animate);
}

export const triggerOrderConfetti = triggerConfetti;
