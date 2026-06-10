import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StarCanvas } from "./StarCanvas";

type PageName = "divination" | "xiaoliuren" | "mbti" | "horoscope" | "answer" | "bazi";

interface HomePageProps {
  onNavigate: (page: PageName) => void;
}

const features = [
  {
    id: "divination" as PageName,
    title: "占卜",
    icon: "☯",
    desc: "洞悉当下，探见未来",
    action: "开始占卜",
    color: "#8b4513",
    glow: "rgba(139,69,19,0.4)",
    symbol: "䷀",
  },
  {
    id: "xiaoliuren" as PageName,
    title: "小六壬",
    icon: "⬡",
    desc: "掌中乾坤，测断吉凶",
    action: "开始推算",
    color: "#5c4a1e",
    glow: "rgba(92,74,30,0.4)",
    symbol: "六",
  },
  {
    id: "mbti" as PageName,
    title: "人格MBTI",
    icon: "◈",
    desc: "看懂自我，理解他人",
    action: "进入测试",
    color: "#2c4a3e",
    glow: "rgba(44,74,62,0.4)",
    symbol: "心",
  },
  {
    id: "horoscope" as PageName,
    title: "星座运势",
    icon: "★",
    desc: "星辰指引，运势解析",
    action: "查看运势",
    color: "#1a2a4a",
    glow: "rgba(26,42,74,0.4)",
    symbol: "♈",
  },
  {
    id: "answer" as PageName,
    title: "答案之书",
    icon: "卷",
    desc: "内心之问，智慧解答",
    action: "翻开一页",
    color: "#3a1c1c",
    glow: "rgba(58,28,28,0.4)",
    symbol: "📖",
  },
  {
    id: "bazi" as PageName,
    title: "八字排盘",
    icon: "命",
    desc: "四柱推命，五行解析",
    action: "推算命盘",
    color: "#2a1a3a",
    glow: "rgba(42,26,58,0.4)",
    symbol: "卦",
  },
];

const BAGUA = ["☰", "☷", "☵", "☲", "☳", "☴", "☶", "☱"];
const BAGUA_LABELS = ["乾", "坤", "坎", "离", "震", "巽", "艮", "兑"];

function YinYangSymbol({ size = 160 }: { size?: number }) {
  const r = size / 2;
  const smallR = r / 4;
  const tinyR = smallR / 3;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d080" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Outer glow */}
      <circle cx={r} cy={r} r={r} fill="url(#goldGlow)" />
      {/* Main circle - black half */}
      <circle cx={r} cy={r} r={r - 2} fill="#1a0a00" stroke="#c9a84c" strokeWidth="1.5" />
      {/* White half arc */}
      <path
        d={`M ${r} ${2} A ${r - 2} ${r - 2} 0 0 1 ${r} ${size - 2} A ${r / 2 - 1} ${r / 2 - 1} 0 0 1 ${r} ${r} A ${r / 2 - 1} ${r / 2 - 1} 0 0 0 ${r} ${2}`}
        fill="#e8d5a3"
      />
      {/* Upper small circle (black in white) */}
      <circle cx={r} cy={r / 2} r={smallR} fill="#1a0a00" />
      {/* Lower small circle (white in black) */}
      <circle cx={r} cy={r + r / 2} r={smallR} fill="#e8d5a3" />
      {/* Tiny dots */}
      <circle cx={r} cy={r / 2} r={tinyR} fill="#e8d5a3" />
      <circle cx={r} cy={r + r / 2} r={tinyR} fill="#1a0a00" />
      {/* Dividing line */}
      <circle cx={r} cy={r} r={r - 2} fill="none" stroke="#c9a84c" strokeWidth="1.5" />
    </svg>
  );
}

function BaguaRing({ rotation }: { rotation: number }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 120;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", top: 0, left: 0 }}>
      {BAGUA.map((gua, i) => {
        const angle = (i * 360) / 8 + rotation;
        const rad = (angle * Math.PI) / 180;
        const x = cx + radius * Math.sin(rad);
        const y = cy - radius * Math.cos(rad);
        return (
          <g key={i}>
            <text
              x={x}
              y={y + 5}
              textAnchor="middle"
              fill="#c9a84c"
              style={{ fontSize: "16px", opacity: 0.9 }}
            >
              {gua}
            </text>
            <text
              x={cx + (radius + 22) * Math.sin(rad)}
              y={cy - (radius + 22) * Math.cos(rad) + 5}
              textAnchor="middle"
              fill="#a08060"
              style={{ fontSize: "9px" }}
            >
              {BAGUA_LABELS[i]}
            </text>
          </g>
        );
      })}
      {/* Decorative rings */}
      <circle cx={cx} cy={cy} r={radius - 18} fill="none" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.3" />
      <circle cx={cx} cy={cy} r={radius + 16} fill="none" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.3" />
      {/* Tick marks */}
      {Array.from({ length: 64 }).map((_, i) => {
        const a = (i * 360) / 64;
        const r1 = radius - 15;
        const r2 = radius - (i % 8 === 0 ? 25 : 18);
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={cx + r1 * Math.sin(rad)}
            y1={cy - r1 * Math.cos(rad)}
            x2={cx + r2 * Math.sin(rad)}
            y2={cy - r2 * Math.cos(rad)}
            stroke="#c9a84c"
            strokeWidth={i % 8 === 0 ? 1.5 : 0.5}
            strokeOpacity={0.4}
          />
        );
      })}
    </svg>
  );
}

const todayQuotes = [
  "木旺得水，方成栋梁；木旺得火，方化灰烬",
  "顺势而为，乘风而起，谋定而后动",
  "天下皆知美之为美，斯恶已；皆知善之为善，斯不善已",
  "道可道，非常道；名可名，非常名",
];

export function HomePage({ onNavigate }: HomePageProps) {
  const [rotation, setRotation] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showLuck, setShowLuck] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; opacity: number }[]>([]);
  const animRef = useRef<number>(0);
  const rotRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      rotRef.current += 0.05;
      setRotation(rotRef.current);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % todayQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ps = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
    }));
    setParticles(ps);
  }, []);

  const today = new Date();
  const todayStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #0d0500 0%, #1a0a00 40%, #0d0800 100%)",
        minHeight: "100%",
        fontFamily: "'Noto Serif SC', serif",
        color: "#e8d5a3",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Star canvas background */}
      <StarCanvas style={{ zIndex: 0 }} />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#c9a84c",
            opacity: p.opacity,
            pointerEvents: "none",
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [p.opacity, p.opacity * 0.5, p.opacity],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Ink wash background effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "350px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(139,90,43,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ textAlign: "center", paddingTop: "20px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <div style={{ height: "1px", width: "40px", background: "linear-gradient(to right, transparent, #c9a84c)" }} />
          <motion.h1
            style={{
              fontFamily: "'Ma Shan Zheng', serif",
              fontSize: "26px",
              color: "#f0d080",
              textShadow: "0 0 20px rgba(201,168,76,0.8), 0 0 40px rgba(201,168,76,0.4)",
              margin: 0,
              letterSpacing: "5px",
            }}
            animate={{ textShadow: ["0 0 20px rgba(201,168,76,0.8)", "0 0 30px rgba(201,168,76,1)", "0 0 20px rgba(201,168,76,0.8)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            燎原一叶
          </motion.h1>
          <div style={{ height: "1px", width: "40px", background: "linear-gradient(to left, transparent, #c9a84c)" }} />
        </div>
        <p style={{ color: "#a08060", fontSize: "11px", letterSpacing: "4px", marginTop: "4px" }}>
          探索命运的轨迹
        </p>
        <p style={{ color: "#6a5040", fontSize: "10px", letterSpacing: "2px", marginTop: "2px" }}>
          by 燎原一叶
        </p>
      </div>

      {/* Hero - Bagua + YinYang */}
      <div style={{ position: "relative", width: "280px", height: "280px", margin: "10px auto 0" }}>
        <BaguaRing rotation={rotation} />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <motion.div
            animate={{ rotate: -rotation }}
            style={{ display: "flex" }}
          >
            <YinYangSymbol size={90} />
          </motion.div>
        </div>

        {/* Corner direction labels */}
        {[
          { label: "天", x: "50%", y: "2px" },
          { label: "地", x: "50%", y: "calc(100% - 18px)" },
          { label: "乾", x: "2px", y: "50%" },
          { label: "坤", x: "calc(100% - 14px)", y: "50%" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              transform: "translate(-50%, -50%)",
              color: "#c9a84c",
              fontSize: "11px",
              opacity: 0.6,
              fontFamily: "'Ma Shan Zheng', serif",
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Today's wisdom banner */}
      <motion.div
        style={{
          margin: "8px 16px",
          padding: "12px 16px",
          background: "linear-gradient(135deg, rgba(30,16,4,0.9), rgba(45,25,8,0.9))",
          border: "1px solid rgba(201,168,76,0.3)",
          borderRadius: "8px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "3px",
            background: "linear-gradient(to bottom, #c9a84c, #8b4513)",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "4px" }}>燎原一叶出品 · 探知天机</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                style={{ fontSize: "12px", color: "#e8d5a3", lineHeight: 1.5 }}
              >
                {todayQuotes[quoteIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
          <motion.button
            onClick={() => setShowLuck(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              marginLeft: "12px",
              padding: "6px 12px",
              background: "linear-gradient(135deg, #8b4513, #c9a84c)",
              border: "none",
              borderRadius: "20px",
              color: "#0d0500",
              fontSize: "11px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "'Noto Serif SC', serif",
            }}
          >
            今日运势
          </motion.button>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <div style={{ padding: "0 16px", marginTop: "12px" }}>
        {/* Top 3 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
          {features.slice(0, 3).map((f) => (
            <FeatureCard key={f.id} feature={f} onNavigate={onNavigate} hovered={hoveredCard === f.id} onHover={setHoveredCard} />
          ))}
        </div>
        {/* Bottom 3 — includes 八字 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {features.slice(3).map((f) => (
            <FeatureCard key={f.id} feature={f} onNavigate={onNavigate} hovered={hoveredCard === f.id} onHover={setHoveredCard} />
          ))}
        </div>
      </div>

      {/* Bottom quote */}
      <div style={{ textAlign: "center", padding: "20px 24px 10px", color: "#6a5040", fontSize: "11px", lineHeight: 2 }}>
        <div>凡所有相，皆是虚妄</div>
        <div>若见诸相非相，则见如来</div>
      </div>

      {/* Author signature */}
      <div style={{ textAlign: "center", padding: "0 24px 30px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "20px", background: "rgba(13,5,0,0.6)" }}>
          <span style={{ fontSize: "10px", color: "#6a5040" }}>作者</span>
          <span style={{ width: "1px", height: "10px", background: "rgba(201,168,76,0.3)" }} />
          <span style={{ fontSize: "11px", color: "#c9a84c", fontFamily: "'Ma Shan Zheng', serif", letterSpacing: "2px" }}>燎原一叶</span>
        </div>
      </div>

      {/* Today's Luck Modal */}
      <AnimatePresence>
        {showLuck && <TodayLuckModal onClose={() => setShowLuck(false)} todayStr={todayStr} />}
      </AnimatePresence>
    </div>
  );
}

function FeatureCard({
  feature,
  onNavigate,
  hovered,
  onHover,
}: {
  feature: typeof features[0];
  onNavigate: (page: PageName) => void;
  hovered: boolean;
  onHover: (id: string | null) => void;
}) {
  return (
    <motion.div
      onHoverStart={() => onHover(feature.id)}
      onHoverEnd={() => onHover(null)}
      onClick={() => onNavigate(feature.id)}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      style={{
        background: `linear-gradient(145deg, ${feature.color}cc, rgba(13,5,0,0.95))`,
        border: `1px solid ${hovered ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.2)"}`,
        borderRadius: "10px",
        padding: "14px 12px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: hovered ? `0 0 20px ${feature.glow}` : "none",
        transition: "box-shadow 0.3s",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-20%",
          width: "80%",
          height: "80%",
          background: `radial-gradient(circle, ${feature.glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      {/* Symbol watermark */}
      <div
        style={{
          position: "absolute",
          bottom: "4px",
          right: "8px",
          fontSize: "36px",
          opacity: 0.08,
          color: "#c9a84c",
          fontFamily: "'Ma Shan Zheng', serif",
          pointerEvents: "none",
        }}
      >
        {feature.symbol}
      </div>

      <div style={{ fontSize: "20px", marginBottom: "6px" }}>{feature.icon}</div>
      <div style={{ fontSize: "14px", color: "#f0d080", marginBottom: "2px", fontFamily: "'Ma Shan Zheng', serif" }}>
        {feature.title}
      </div>
      <div style={{ fontSize: "10px", color: "#a08060", lineHeight: 1.4, marginBottom: "8px" }}>{feature.desc}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <span style={{ fontSize: "10px", color: "#c9a84c" }}>{feature.action}</span>
        <span style={{ fontSize: "10px", color: "#c9a84c" }}>›</span>
      </div>
    </motion.div>
  );
}

const luckItems = [
  { label: "事业", value: 85, color: "#c9a84c" },
  { label: "感情", value: 72, color: "#e06060" },
  { label: "财运", value: 68, color: "#60c090" },
  { label: "健康", value: 90, color: "#6090e0" },
];

const luckTexts = [
  "今日木星与太阳形成吉相，事业上有贵人相助，把握机遇，可大展拳脚。",
  "感情方面需多关注伴侣心声，沟通为主，切勿独断。",
  "财运平稳，不宜大额投资，守成为上。",
  "身体状态良好，宜户外活动，舒展筋骨。",
];

function TodayLuckModal({ onClose, todayStr }: { onClose: () => void; todayStr: string }) {
  const [shown, setShown] = useState<number[]>([]);

  useEffect(() => {
    const timers = luckItems.map((_, i) =>
      setTimeout(() => setShown((prev) => [...prev, i]), i * 300 + 200)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "linear-gradient(180deg, #1a0a00, #0d0500)",
          border: "1px solid rgba(201,168,76,0.4)",
          borderBottom: "none",
          borderRadius: "20px 20px 0 0",
          padding: "24px 20px 40px",
          fontFamily: "'Noto Serif SC', serif",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "4px" }}>{todayStr}</div>
          <div style={{ fontSize: "20px", color: "#f0d080", fontFamily: "'Ma Shan Zheng', serif", letterSpacing: "4px" }}>今日运势</div>
          <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #c9a84c, transparent)", marginTop: "12px" }} />
        </div>

        {luckItems.map((item, i) => (
          <div key={i} style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "#e8d5a3" }}>{item.label}</span>
              <span style={{ fontSize: "12px", color: item.color }}>{shown.includes(i) ? item.value : 0}%</span>
            </div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: shown.includes(i) ? `${item.value}%` : "0%" }}
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{ height: "100%", background: `linear-gradient(to right, ${item.color}80, ${item.color})`, borderRadius: "2px" }}
              />
            </div>
            {shown.includes(i) && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ fontSize: "11px", color: "#a08060", marginTop: "6px", lineHeight: 1.6 }}
              >
                {luckTexts[i]}
              </motion.p>
            )}
          </div>
        ))}

        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: "100%",
            padding: "12px",
            background: "linear-gradient(135deg, #5c2d0a, #8b4513)",
            border: "1px solid rgba(201,168,76,0.4)",
            borderRadius: "8px",
            color: "#f0d080",
            fontSize: "14px",
            cursor: "pointer",
            fontFamily: "'Noto Serif SC', serif",
            marginTop: "8px",
          }}
        >
          收起
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
