import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  phase: number;
  twinkleSpeed: number;
  driftX: number;
  driftY: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  life: number;
  maxLife: number;
  opacity: number;
}

interface GoldenDust {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  life: number;
  maxLife: number;
}

const STAR_COLORS = ["#ffffff", "#f0e8d0", "#c9a84c", "#e8d5a3", "#ffe8a0", "#d4c080"];

export function StarCanvas({ style }: { style?: React.CSSProperties }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const dustRef = useRef<GoldenDust[]>([]);
  const frameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const lastShootRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    // Initialize stars
    starsRef.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.2,
      baseOpacity: Math.random() * 0.6 + 0.15,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.8 + 0.2,
      driftX: (Math.random() - 0.5) * 0.15,
      driftY: (Math.random() - 0.5) * 0.08,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    }));

    const spawnDust = (w: number, h: number) => ({
      x: Math.random() * w,
      y: h + 10,
      r: Math.random() * 1.5 + 0.5,
      vy: -(Math.random() * 0.4 + 0.15),
      vx: (Math.random() - 0.5) * 0.3,
      life: 0,
      maxLife: Math.random() * 180 + 120,
    });

    dustRef.current = Array.from({ length: 25 }, () => ({
      ...spawnDust(width, height),
      y: Math.random() * height,
      life: Math.random() * 150,
    }));

    const animate = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      timeRef.current += 0.012;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Draw nebula glow in center
      const nebula = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, w * 0.4);
      nebula.addColorStop(0, "rgba(139, 70, 20, 0.06)");
      nebula.addColorStop(0.5, "rgba(100, 50, 10, 0.03)");
      nebula.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);

      // Draw stars
      for (const star of starsRef.current) {
        const twinkle = Math.sin(star.phase + t * star.twinkleSpeed) * 0.4 + 0.6;
        const sx = star.x + Math.sin(t * 0.05 + star.phase) * 3;
        const sy = star.y + Math.cos(t * 0.04 + star.phase) * 2;

        // Large stars get a glow
        if (star.r > 1.1) {
          const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.r * 4);
          grd.addColorStop(0, `rgba(240, 224, 160, ${star.baseOpacity * twinkle * 0.4})`);
          grd.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath();
          ctx.arc(sx, sy, star.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(sx, sy, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.baseOpacity * twinkle;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Spawn shooting stars
      if (t - lastShootRef.current > 4 + Math.random() * 6) {
        lastShootRef.current = t;
        shootingStarsRef.current.push({
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.4,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
          speed: 8 + Math.random() * 6,
          length: 80 + Math.random() * 60,
          life: 0,
          maxLife: 30 + Math.random() * 20,
          opacity: 0.9,
        });
      }

      // Draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((s) => {
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        const alpha = Math.max(0, 1 - s.life / s.maxLife);

        const tailX = s.x - Math.cos(s.angle) * s.length * alpha;
        const tailY = s.y - Math.sin(s.angle) * s.length * alpha;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "rgba(240, 220, 140, 0)");
        grad.addColorStop(1, `rgba(255, 240, 180, ${alpha * s.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        return s.life < s.maxLife;
      });

      // Draw golden dust particles
      for (let i = 0; i < dustRef.current.length; i++) {
        const d = dustRef.current[i];
        d.life++;
        d.x += d.vx + Math.sin(t * 0.5 + i) * 0.15;
        d.y += d.vy;

        if (d.life > d.maxLife || d.y < -10) {
          dustRef.current[i] = spawnDust(w, h);
          continue;
        }

        const lifeRatio = d.life / d.maxLife;
        const dustAlpha = lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.8 ? (1 - lifeRatio) * 5 : 1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${dustAlpha * 0.5})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
