import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface XiaoLiuRenPageProps {
  onBack: () => void;
}

const SIX_GODS = [
  {
    name: "大安",
    symbol: "安",
    nature: "吉",
    color: "#60c080",
    meaning: "大安者，吉星高照，万事顺遂。凡事皆宜，贵人相助，诸事大吉。",
    detail: "事业：顺利推进，不必担忧；感情：稳定和谐，宜共谋发展；财运：财源广进，适合投资；健康：身体康泰，精力充沛。",
    icon: "☮",
  },
  {
    name: "留连",
    symbol: "留",
    nature: "凶",
    color: "#e06060",
    meaning: "留连者，事多拖延，不进则退。宜守不宜攻，静待时机，避免冒进。",
    detail: "事业：进展迟缓，需耐心等待；感情：关系纠缠，需慎重处理；财运：资金周转困难；健康：注意慢性疾病。",
    icon: "⏳",
  },
  {
    name: "速喜",
    symbol: "喜",
    nature: "吉",
    color: "#c9a84c",
    meaning: "速喜者，好消息将至，喜事临门。行事宜快，机不可失，宜速决断。",
    detail: "事业：佳音快至，把握时机；感情：喜事将近，缘分降临；财运：意外之财；健康：精神振奋，活力十足。",
    icon: "✨",
  },
  {
    name: "赤口",
    symbol: "口",
    nature: "凶",
    color: "#e08040",
    meaning: "赤口者，口舌是非，争讼在即。慎言慎行，避免与人口角，低调处事。",
    detail: "事业：小人谗言，需谨慎；感情：争执口角，冷静处理；财运：谨防欺诈；健康：注意口腔与肠胃。",
    icon: "⚠",
  },
  {
    name: "小吉",
    symbol: "吉",
    nature: "吉",
    color: "#80c0a0",
    meaning: "小吉者，小有所得，渐入佳境。事虽不大，却有小利，积少成多。",
    detail: "事业：稳步推进，细水长流；感情：感情升温，宜主动表达；财运：小有进账；健康：注意休息调养。",
    icon: "🌱",
  },
  {
    name: "空亡",
    symbol: "空",
    nature: "凶",
    color: "#8080a0",
    meaning: "空亡者，诸事落空，谋事不成。宜反思自省，厚积薄发，等待时机。",
    detail: "事业：计划受阻，重新谋划；感情：缘分未到，不宜强求；财运：财运低迷；健康：注意精神状态。",
    icon: "○",
  },
];

const MONTHS = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
const DAYS = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];
const HOURS = ["子时", "丑时", "寅时", "卯时", "辰时", "巳时", "午时", "未时", "申时", "酉时", "戌时", "亥时"];

function WheelPicker({
  items,
  selectedIndex,
  onSelect,
  label,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  label: string;
}) {
  const visibleCount = 5;
  const itemHeight = 36;

  return (
    <div style={{ flex: 1 }}>
      <div style={{ textAlign: "center", fontSize: "11px", color: "#a08060", marginBottom: "6px" }}>{label}</div>
      <div
        style={{
          height: `${visibleCount * itemHeight}px`,
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: "8px",
          background: "rgba(13,5,0,0.8)",
        }}
      >
        {/* Gradient masks */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to bottom, rgba(13,5,0,0.9), transparent)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to top, rgba(13,5,0,0.9), transparent)", zIndex: 1, pointerEvents: "none" }} />
        {/* Selection highlight */}
        <div style={{ position: "absolute", top: `${Math.floor(visibleCount / 2) * itemHeight}px`, left: 0, right: 0, height: `${itemHeight}px`, border: "1px solid rgba(201,168,76,0.4)", zIndex: 1, pointerEvents: "none" }} />

        <div
          style={{
            transform: `translateY(${(Math.floor(visibleCount / 2) - selectedIndex) * itemHeight}px)`,
            transition: "transform 0.3s cubic-bezier(0.2, 1, 0.3, 1)",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              onClick={() => onSelect(i)}
              style={{
                height: `${itemHeight}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: i === selectedIndex ? "14px" : "12px",
                color: i === selectedIndex ? "#f0d080" : "#6a5040",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SixGodWheel({ activeIndex, spinning }: { activeIndex: number | null; spinning: boolean }) {
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = 85;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={r + 20} fill="rgba(30,16,4,0.8)" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r - 10} fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />

      {/* Segments */}
      {SIX_GODS.map((god, i) => {
        const angle = (i * 360) / 6 - 90;
        const nextAngle = ((i + 1) * 360) / 6 - 90;
        const rad1 = (angle * Math.PI) / 180;
        const rad2 = (nextAngle * Math.PI) / 180;
        const x1 = cx + r * Math.cos(rad1);
        const y1 = cy + r * Math.sin(rad1);
        const x2 = cx + r * Math.cos(rad2);
        const y2 = cy + r * Math.sin(rad2);
        const isActive = activeIndex === i;

        const midAngle = ((angle + nextAngle) / 2) * (Math.PI / 180);
        const labelR = r * 0.65;
        const lx = cx + labelR * Math.cos(midAngle);
        const ly = cy + labelR * Math.sin(midAngle);

        return (
          <g key={i}>
            <path
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
              fill={isActive ? `${god.color}30` : "transparent"}
              stroke="rgba(201,168,76,0.3)"
              strokeWidth="1"
            />
            <text
              x={lx}
              y={ly + 4}
              textAnchor="middle"
              fill={isActive ? god.color : "#a08060"}
              style={{ fontSize: "13px", fontFamily: "'Ma Shan Zheng', serif" }}
            >
              {god.symbol}
            </text>
          </g>
        );
      })}

      {/* Center */}
      <circle cx={cx} cy={cy} r={25} fill="rgba(13,5,0,0.9)" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill="#c9a84c" style={{ fontSize: "14px", fontFamily: "'Ma Shan Zheng', serif" }}>
        {spinning ? "..." : activeIndex !== null ? SIX_GODS[activeIndex].name[0] : "六"}
      </text>
    </svg>
  );
}

export function XiaoLiuRenPage({ onBack }: XiaoLiuRenPageProps) {
  const [monthIdx, setMonthIdx] = useState(new Date().getMonth());
  const [dayIdx, setDayIdx] = useState(14);
  const [hourIdx, setHourIdx] = useState(6);
  const [result, setResult] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const calculate = () => {
    setSpinning(true);
    setResult(null);
    setShowDetail(false);

    setTimeout(() => {
      // 小六壬算法: (月 + 日 + 时) mod 6
      const val = ((monthIdx + 1) + (dayIdx + 1) + (hourIdx + 1)) % 6;
      setResult(val);
      setSpinning(false);
    }, 1200);
  };

  const god = result !== null ? SIX_GODS[result] : null;

  return (
    <div style={{ background: "linear-gradient(180deg, #0d0500 0%, #1a0a00 100%)", minHeight: "100%", fontFamily: "'Noto Serif SC', serif", color: "#e8d5a3" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px 16px 0", gap: "12px" }}>
        <motion.button onClick={onBack} whileTap={{ scale: 0.9 }} style={{ background: "none", border: "none", color: "#c9a84c", fontSize: "20px", cursor: "pointer", padding: "4px" }}>
          ‹
        </motion.button>
        <div>
          <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "20px", color: "#f0d080" }}>小六壬</div>
          <div style={{ fontSize: "10px", color: "#a08060" }}>掌中乾坤 · 测断吉凶</div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #c9a84c40, transparent)", margin: "12px 0" }} />
      </div>

      {/* Six God Wheel */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <motion.div animate={spinning ? { rotate: [0, 30, -30, 20, -20, 0] } : {}} transition={{ duration: 1.2, ease: "easeOut" }}>
          <SixGodWheel activeIndex={result} spinning={spinning} />
        </motion.div>
      </div>

      {/* Time Pickers */}
      <div style={{ padding: "0 16px", marginBottom: "16px" }}>
        <div style={{ fontSize: "12px", color: "#a08060", marginBottom: "10px", textAlign: "center" }}>选择占卜时间</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <WheelPicker items={MONTHS} selectedIndex={monthIdx} onSelect={setMonthIdx} label="月" />
          <WheelPicker items={DAYS} selectedIndex={dayIdx} onSelect={setDayIdx} label="日" />
          <WheelPicker items={HOURS} selectedIndex={hourIdx} onSelect={setHourIdx} label="时" />
        </div>
      </div>

      {/* Calculate button */}
      <div style={{ padding: "0 16px" }}>
        <motion.button
          onClick={calculate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={spinning}
          style={{
            width: "100%",
            padding: "14px",
            background: spinning ? "rgba(92,45,10,0.5)" : "linear-gradient(135deg, #5c2d0a, #8b4513)",
            border: "1px solid rgba(201,168,76,0.5)",
            borderRadius: "10px",
            color: "#f0d080",
            fontSize: "16px",
            cursor: spinning ? "not-allowed" : "pointer",
            fontFamily: "'Noto Serif SC', serif",
            letterSpacing: "4px",
            marginBottom: "16px",
          }}
        >
          {spinning ? "推算中..." : "推算吉凶"}
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {god && !spinning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: "0 16px 24px" }}
          >
            <div style={{
              background: "linear-gradient(145deg, rgba(30,16,4,0.95), rgba(45,25,8,0.95))",
              border: `1px solid ${god.color}60`,
              borderRadius: "14px",
              padding: "20px",
              boxShadow: `0 0 30px ${god.color}20`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: `${god.color}20`,
                  border: `2px solid ${god.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontFamily: "'Ma Shan Zheng', serif",
                  color: god.color,
                }}>
                  {god.symbol}
                </div>
                <div>
                  <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "22px", color: god.color }}>{god.name}</div>
                  <div style={{
                    display: "inline-block",
                    padding: "2px 12px",
                    background: `${god.color}20`,
                    border: `1px solid ${god.color}`,
                    borderRadius: "12px",
                    fontSize: "11px",
                    color: god.color,
                    marginTop: "4px",
                  }}>
                    {god.nature === "吉" ? "✦ 吉神" : "✧ 凶神"}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "13px", color: "#e8d5a3", lineHeight: 2, marginBottom: "12px" }}>
                {god.meaning}
              </p>

              <div style={{ height: "1px", background: "rgba(201,168,76,0.2)", marginBottom: "12px" }} />

              <motion.button
                onClick={() => setShowDetail(!showDetail)}
                style={{ background: "none", border: "none", color: "#c9a84c", fontSize: "12px", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "4px" }}
              >
                {showDetail ? "收起详情" : "查看各方位运势"}
                <motion.span animate={{ rotate: showDetail ? 180 : 0 }} style={{ display: "inline-block" }}>▾</motion.span>
              </motion.button>

              <AnimatePresence>
                {showDetail && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p style={{ fontSize: "12px", color: "#a08060", lineHeight: 2, marginTop: "12px" }}>
                      {god.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Six positions reference */}
            <div style={{ marginTop: "16px" }}>
              <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "8px", textAlign: "center" }}>六神总览</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {SIX_GODS.map((g, i) => (
                  <div
                    key={i}
                    style={{
                      background: i === result ? `${g.color}20` : "rgba(30,16,4,0.6)",
                      border: `1px solid ${i === result ? g.color : "rgba(201,168,76,0.15)"}`,
                      borderRadius: "8px",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "16px", color: g.color, fontFamily: "'Ma Shan Zheng', serif" }}>{g.symbol}</div>
                    <div style={{ fontSize: "11px", color: i === result ? g.color : "#a08060" }}>{g.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
