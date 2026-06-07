import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SplashScreenProps {
  onDone: () => void;
}

function InkCanvas({ onExpanded }: { onExpanded: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const notifiedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    // Pre-generate blob control points
    const BLOBS = Array.from({ length: 4 }, (_, bi) => {
      const pts = 10;
      return Array.from({ length: pts }, (_, i) => {
        const angle = (i / pts) * Math.PI * 2;
        const jitter = (Math.random() * 0.4 + 0.8);
        return { angle, jitter, delay: bi * 0.12 };
      });
    });

    const BLOB_OFFSETS = [
      { ox: 0, oy: 0, colorR: 13, colorG: 5, colorB: 0 },
      { ox: -20, oy: 15, colorR: 20, colorG: 8, colorB: 0 },
      { ox: 25, oy: -10, colorR: 8, colorG: 3, colorB: 0 },
      { ox: -5, oy: -20, colorR: 15, colorG: 7, colorB: 2 },
    ];

    const drawBlob = (
      progress: number,
      delay: number,
      pts: { angle: number; jitter: number }[],
      ox: number,
      oy: number,
      r: number,
      colorR: number,
      colorG: number,
      colorB: number
    ) => {
      const p = Math.max(0, (progress - delay) / (1 - delay));
      if (p <= 0) return;

      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const radius = r * eased * 1.05;

      ctx.beginPath();
      const firstPt = pts[0];
      const fr = radius * firstPt.jitter;
      ctx.moveTo(cx + ox + fr * Math.cos(firstPt.angle), cy + oy + fr * Math.sin(firstPt.angle));

      for (let i = 1; i <= pts.length; i++) {
        const curr = pts[i % pts.length];
        const prev = pts[(i - 1) % pts.length];
        const cr = radius * curr.jitter;
        const pr = radius * prev.jitter;
        const cpx = cx + ox + (pr * 1.2 * Math.cos(prev.angle) + cr * 1.2 * Math.cos(curr.angle)) / 2;
        const cpy = cy + oy + (pr * 1.2 * Math.sin(prev.angle) + cr * 1.2 * Math.sin(curr.angle)) / 2;
        ctx.quadraticCurveTo(cpx, cpy, cx + ox + cr * Math.cos(curr.angle), cy + oy + cr * Math.sin(curr.angle));
      }
      ctx.closePath();

      const grad = ctx.createRadialGradient(cx + ox, cy + oy, 0, cx + ox, cy + oy, radius);
      grad.addColorStop(0, `rgb(${colorR + 10},${colorG + 5},${colorB + 2})`);
      grad.addColorStop(0.6, `rgb(${colorR},${colorG},${colorB})`);
      grad.addColorStop(1, `rgb(${Math.max(0, colorR - 3)},${Math.max(0, colorG - 2)},${colorB})`);

      ctx.fillStyle = grad;
      ctx.fill();
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const DURATION = 2.0;
      const progress = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, W, H);

      // Max radius to cover screen corner
      const maxR = Math.sqrt((W / 2) * (W / 2) + (H / 2) * (H / 2)) * 1.15;

      BLOBS.forEach((pts, i) => {
        const { ox, oy, colorR, colorG, colorB } = BLOB_OFFSETS[i];
        drawBlob(progress, i * 0.06, pts, ox, oy, maxR, colorR, colorG, colorB);
      });

      // Ink drips / tendrils at edges
      if (progress > 0.4) {
        const drips = [
          { x: cx - W * 0.3, y: cy, len: W * 0.25, angle: Math.PI },
          { x: cx + W * 0.3, y: cy, len: W * 0.25, angle: 0 },
          { x: cx, y: cy - H * 0.3, len: H * 0.25, angle: -Math.PI / 2 },
          { x: cx, y: cy + H * 0.3, len: H * 0.25, angle: Math.PI / 2 },
          { x: cx - W * 0.2, y: cy - H * 0.2, len: W * 0.2, angle: (-Math.PI * 3) / 4 },
          { x: cx + W * 0.2, y: cy + H * 0.2, len: W * 0.2, angle: Math.PI / 4 },
        ];

        const dripProgress = Math.min(1, (progress - 0.4) / 0.6);
        drips.forEach((d) => {
          const len = d.len * dripProgress;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + Math.cos(d.angle) * len, d.y + Math.sin(d.angle) * len);
          ctx.strokeStyle = `rgba(13, 5, 0, ${dripProgress * 0.6})`;
          ctx.lineWidth = 4 + Math.random() * 3;
          ctx.lineCap = "round";
          ctx.stroke();
        });
      }

      // Gold shimmer overlay
      if (progress > 0.6) {
        const shimmerAlpha = Math.min(0.08, (progress - 0.6) * 0.2);
        const shimmer = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.5);
        shimmer.addColorStop(0, `rgba(201, 168, 76, ${shimmerAlpha})`);
        shimmer.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = shimmer;
        ctx.fillRect(0, 0, W, H);
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else if (!notifiedRef.current) {
        notifiedRef.current = true;
        onExpanded();
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [onExpanded]);

  return (
    <canvas
      ref={canvasRef}
      width={typeof window !== "undefined" ? window.innerWidth : 400}
      height={typeof window !== "undefined" ? window.innerHeight : 800}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

const SPLASH_RUNES = ["☰", "☷", "☵", "☲", "☳", "☴", "☶", "☱"];

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState<"ink" | "title" | "exit">("ink");
  const [visible, setVisible] = useState(true);

  const handleExpanded = () => {
    setPhase("title");
    const timer = setTimeout(() => {
      setPhase("exit");
      setTimeout(() => {
        setVisible(false);
        onDone();
      }, 800);
    }, 1800);
    return () => clearTimeout(timer);
  };

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      onClick={() => {
        if (phase === "title") {
          setPhase("exit");
          setTimeout(() => { setVisible(false); onDone(); }, 600);
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        cursor: phase === "title" ? "pointer" : "default",
        fontFamily: "'Noto Serif SC', serif",
      }}
    >
      {/* Ink canvas */}
      <InkCanvas onExpanded={handleExpanded} />

      {/* Rotating rune ring */}
      <AnimatePresence>
        {(phase === "title" || phase === "exit") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.25, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{ position: "relative", width: "220px", height: "220px" }}
            >
              {SPLASH_RUNES.map((r, i) => {
                const angle = (i / 8) * 360;
                const rad = (angle * Math.PI) / 180;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%) translate(${95 * Math.sin(rad)}px, ${-95 * Math.cos(rad)}px)`,
                      fontSize: "20px",
                      color: "#c9a84c",
                    }}
                  >
                    {r}
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center title */}
      <AnimatePresence>
        {phase === "title" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {/* Decorative top ornament */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <div style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, #c9a84c)" }} />
              <span style={{ fontSize: "12px", color: "#c9a84c", letterSpacing: "3px" }}>玄</span>
              <div style={{ width: "60px", height: "1px", background: "linear-gradient(to left, transparent, #c9a84c)" }} />
            </motion.div>

            {/* Main title */}
            <motion.div
              animate={{
                textShadow: [
                  "0 0 20px rgba(201,168,76,0.6), 0 0 60px rgba(201,168,76,0.3)",
                  "0 0 40px rgba(201,168,76,1), 0 0 80px rgba(201,168,76,0.5)",
                  "0 0 20px rgba(201,168,76,0.6), 0 0 60px rgba(201,168,76,0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontFamily: "'Ma Shan Zheng', serif",
                fontSize: "48px",
                color: "#f0d080",
                letterSpacing: "10px",
                textShadow: "0 0 20px rgba(201,168,76,0.8)",
                marginBottom: "8px",
              }}
            >
              燎原一叶
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                fontSize: "13px",
                color: "#a08060",
                letterSpacing: "6px",
                marginBottom: "40px",
              }}
            >
              探索命运的轨迹
            </motion.div>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "32px",
                padding: "5px 14px",
                border: "1px solid rgba(201,168,76,0.25)",
                borderRadius: "20px",
                background: "rgba(13,5,0,0.5)",
              }}
            >
              <span style={{ fontSize: "10px", color: "#6a5040", letterSpacing: "1px" }}>作者</span>
              <span style={{ width: "1px", height: "10px", background: "rgba(201,168,76,0.3)" }} />
              <span style={{ fontSize: "12px", color: "#c9a84c", fontFamily: "'Ma Shan Zheng', serif", letterSpacing: "3px" }}>燎原一叶</span>
            </motion.div>

            {/* Yin-Yang */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ opacity: 0.5 }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="#1a0800" stroke="#c9a84c" strokeWidth="1" />
                <path d="M 20 2 A 18 18 0 0 1 20 38 A 9 9 0 0 1 20 20 A 9 9 0 0 0 20 2" fill="#e8d5a3" />
                <circle cx="20" cy="11" r="4.5" fill="#1a0800" />
                <circle cx="20" cy="29" r="4.5" fill="#e8d5a3" />
                <circle cx="20" cy="11" r="1.5" fill="#e8d5a3" />
                <circle cx="20" cy="29" r="1.5" fill="#1a0800" />
                <circle cx="20" cy="20" r="18" fill="none" stroke="#c9a84c" strokeWidth="1" />
              </svg>
            </motion.div>

            {/* Tap hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
              style={{
                position: "absolute",
                bottom: "60px",
                fontSize: "11px",
                color: "#6a5040",
                letterSpacing: "4px",
              }}
            >
              点击进入
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
