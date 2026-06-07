import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { saveToHistory } from "../utils/history";

interface HoroscopePageProps {
  onBack: () => void;
}

const ZODIACS = [
  { name: "白羊座", symbol: "♈", dates: "3.21-4.19", element: "火", planet: "火星", color: "#e05050" },
  { name: "金牛座", symbol: "♉", dates: "4.20-5.20", element: "土", planet: "金星", color: "#80c060" },
  { name: "双子座", symbol: "♊", dates: "5.21-6.21", element: "风", planet: "水星", color: "#c0c040" },
  { name: "巨蟹座", symbol: "♋", dates: "6.22-7.22", element: "水", planet: "月亮", color: "#60a0c0" },
  { name: "狮子座", symbol: "♌", dates: "7.23-8.22", element: "火", planet: "太阳", color: "#e09030" },
  { name: "处女座", symbol: "♍", dates: "8.23-9.22", element: "土", planet: "水星", color: "#80a060" },
  { name: "天秤座", symbol: "♎", dates: "9.23-10.23", element: "风", planet: "金星", color: "#c08080" },
  { name: "天蝎座", symbol: "♏", dates: "10.24-11.22", element: "水", planet: "冥王星", color: "#8040a0" },
  { name: "射手座", symbol: "♐", dates: "11.23-12.21", element: "火", planet: "木星", color: "#c07040" },
  { name: "摩羯座", symbol: "♑", dates: "12.22-1.19", element: "土", planet: "土星", color: "#608080" },
  { name: "水瓶座", symbol: "♒", dates: "1.20-2.18", element: "风", planet: "天王星", color: "#4080c0" },
  { name: "双鱼座", symbol: "♓", dates: "2.19-3.20", element: "水", planet: "海王星", color: "#8060c0" },
];

const FORTUNES = [
  {
    zodiac: "白羊座",
    overall: 88,
    love: 75,
    career: 92,
    wealth: 70,
    health: 85,
    daily: "今日火星能量爆棚，行动力极强。工作上有突破性进展，适合推进重要项目。感情上需注意冲动，冷静表达更显魅力。",
    lucky_color: "红色",
    lucky_number: "7",
    lucky_direction: "南方",
  },
  {
    zodiac: "金牛座",
    overall: 72,
    love: 85,
    career: 65,
    wealth: 80,
    health: 70,
    daily: "金星护佑，感情运势极佳，适合增进与伴侣的关系。财运稳健，投资需谨慎守成，不宜冒进。",
    lucky_color: "绿色",
    lucky_number: "6",
    lucky_direction: "东方",
  },
  {
    zodiac: "双子座",
    overall: 80,
    love: 70,
    career: 85,
    wealth: 75,
    health: 78,
    daily: "思维活跃，沟通顺畅，适合谈判与协商。多方信息涌入，善加利用可获意外收获。",
    lucky_color: "黄色",
    lucky_number: "3",
    lucky_direction: "西方",
  },
  {
    zodiac: "巨蟹座",
    overall: 76,
    love: 90,
    career: 68,
    wealth: 72,
    health: 82,
    daily: "月亮能量滋养情感，家庭关系和谐，亲情缘分浓厚。内心敏感，需注意情绪波动。",
    lucky_color: "银白",
    lucky_number: "2",
    lucky_direction: "北方",
  },
  {
    zodiac: "狮子座",
    overall: 90,
    love: 80,
    career: 95,
    wealth: 85,
    health: 88,
    daily: "太阳神威，光芒四射！今日是展示自我的最佳时机，众星捧月，贵人扶持，诸事皆宜。",
    lucky_color: "金色",
    lucky_number: "1",
    lucky_direction: "南方",
  },
  {
    zodiac: "处女座",
    overall: 78,
    love: 72,
    career: 82,
    wealth: 76,
    health: 90,
    daily: "细心分析带来工作上的精进，完美主义助力品质提升。注意过度苛求自己，适当放松。",
    lucky_color: "米色",
    lucky_number: "5",
    lucky_direction: "东北",
  },
  {
    zodiac: "天秤座",
    overall: 82,
    love: 88,
    career: 78,
    wealth: 80,
    health: 75,
    daily: "金星加持，社交魅力倍增，人际关系顺畅。今日适合维系重要关系，化解纷争。",
    lucky_color: "粉色",
    lucky_number: "8",
    lucky_direction: "西南",
  },
  {
    zodiac: "天蝎座",
    overall: 85,
    love: 78,
    career: 88,
    wealth: 82,
    health: 80,
    daily: "冥王星力量涌动，洞察力超强。隐秘之事将浮出水面，把握时机可获重要信息。",
    lucky_color: "深红",
    lucky_number: "9",
    lucky_direction: "北方",
  },
  {
    zodiac: "射手座",
    overall: 86,
    love: 75,
    career: 88,
    wealth: 84,
    health: 86,
    daily: "木星护佑，运势上扬！冒险精神带来意外惊喜，远行或异地联系可带来好消息。",
    lucky_color: "紫色",
    lucky_number: "4",
    lucky_direction: "西方",
  },
  {
    zodiac: "摩羯座",
    overall: 74,
    love: 68,
    career: 80,
    wealth: 78,
    health: 72,
    daily: "土星稳健之力，脚踏实地方见成效。今日适合处理长期规划，避免急功近利。",
    lucky_color: "墨绿",
    lucky_number: "8",
    lucky_direction: "东方",
  },
  {
    zodiac: "水瓶座",
    overall: 83,
    love: 76,
    career: 86,
    wealth: 79,
    health: 82,
    daily: "天王星带来创新灵感，今日思维跳跃，适合脑暴与创意工作。社群中地位提升。",
    lucky_color: "蓝色",
    lucky_number: "11",
    lucky_direction: "西北",
  },
  {
    zodiac: "双鱼座",
    overall: 79,
    love: 86,
    career: 72,
    wealth: 74,
    health: 84,
    daily: "海王星神秘力量，直觉异常准确。梦境可能带来重要启示，感情上缘分奇妙相遇。",
    lucky_color: "海蓝",
    lucky_number: "7",
    lucky_direction: "西方",
  },
];

function StarField() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 3,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff",
          }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: s.delay }}
        />
      ))}
    </div>
  );
}

function LuckBar({ label, value, color }: { label: string; value: number; color: string }) {
  const stars = Math.round(value / 20);
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
        <span style={{ fontSize: "12px", color: "#a08060" }}>{label}</span>
        <div style={{ display: "flex", gap: "2px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              style={{ fontSize: "12px", color: i < stars ? color : "rgba(255,255,255,0.15)" }}
            >
              ★
            </motion.span>
          ))}
        </div>
      </div>
      <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ height: "100%", background: `linear-gradient(to right, ${color}60, ${color})`, borderRadius: "2px" }}
        />
      </div>
    </div>
  );
}

export function HoroscopePage({ onBack }: HoroscopePageProps) {
  const [selectedZodiac, setSelectedZodiac] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const zodiac = selectedZodiac !== null ? ZODIACS[selectedZodiac] : null;
  const fortune = selectedZodiac !== null ? FORTUNES[selectedZodiac] : null;

  return (
    <div style={{ background: "linear-gradient(180deg, #05081a 0%, #0a0d20 50%, #0d0500 100%)", minHeight: "100%", fontFamily: "'Noto Serif SC', serif", color: "#e8d5a3", position: "relative", overflow: "hidden" }}>
      <StarField />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px 16px 0", gap: "12px", position: "relative", zIndex: 1 }}>
        <motion.button onClick={onBack} whileTap={{ scale: 0.9 }} style={{ background: "none", border: "none", color: "#c9a84c", fontSize: "20px", cursor: "pointer", padding: "4px" }}>
          ‹
        </motion.button>
        <div>
          <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "20px", color: "#f0d080" }}>星座运势</div>
          <div style={{ fontSize: "10px", color: "#a08060" }}>星辰指引 · 今日运势</div>
        </div>
      </div>

      <div style={{ padding: "0 16px", position: "relative", zIndex: 1 }}>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #c9a84c40, transparent)", margin: "12px 0" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "0 16px" }}>
        {/* Zodiac Grid */}
        <AnimatePresence mode="wait">
          {!showDetail && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div style={{ fontSize: "12px", color: "#a08060", textAlign: "center", marginBottom: "16px" }}>
                选择你的星座，探知今日运势
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {ZODIACS.map((z, i) => (
                  <motion.div
                    key={z.name}
                    onClick={() => {
              setSelectedZodiac(i);
              setShowDetail(true);
              const f = FORTUNES[i];
              saveToHistory({
                type: "horoscope",
                title: `星座运势 · ${z.name}`,
                summary: `综合运势 ${f.overall}分，${z.dates}`,
                icon: z.symbol,
              });
            }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: selectedZodiac === i ? `${z.color}25` : "rgba(5,8,26,0.8)",
                      border: `1px solid ${selectedZodiac === i ? z.color : "rgba(100,100,180,0.2)"}`,
                      borderRadius: "10px",
                      padding: "12px 8px",
                      textAlign: "center",
                      cursor: "pointer",
                      boxShadow: selectedZodiac === i ? `0 0 15px ${z.color}30` : "none",
                    }}
                  >
                    <div style={{ fontSize: "22px", color: z.color, marginBottom: "4px" }}>{z.symbol}</div>
                    <div style={{ fontSize: "11px", color: "#e8d5a3" }}>{z.name}</div>
                    <div style={{ fontSize: "9px", color: "#6070a0", marginTop: "2px" }}>{z.dates}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {showDetail && zodiac && fortune && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setShowDetail(false)}
                style={{ background: "none", border: "none", color: "#a08060", fontSize: "12px", cursor: "pointer", padding: "0 0 12px", display: "flex", alignItems: "center", gap: "4px" }}
              >
                ‹ 返回星座列表
              </button>

              {/* Hero card */}
              <div style={{
                background: `linear-gradient(145deg, ${zodiac.color}25, rgba(5,8,26,0.95))`,
                border: `1px solid ${zodiac.color}60`,
                borderRadius: "16px",
                padding: "24px",
                textAlign: "center",
                marginBottom: "16px",
                boxShadow: `0 0 40px ${zodiac.color}20`,
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: "-30px", right: "-20px", fontSize: "120px", color: zodiac.color, opacity: 0.06 }}>
                  {zodiac.symbol}
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  style={{ fontSize: "48px", color: zodiac.color, marginBottom: "8px" }}
                >
                  {zodiac.symbol}
                </motion.div>
                <div style={{ fontSize: "22px", color: "#f0d080", fontFamily: "'Ma Shan Zheng', serif", marginBottom: "4px" }}>{zodiac.name}</div>
                <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "12px" }}>
                  {zodiac.dates} · {zodiac.element}象 · {zodiac.planet}守护
                </div>

                {/* Overall score */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#a08060" }}>今日综合运势</span>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.15 }}
                        style={{ fontSize: "16px", color: i < Math.round(fortune.overall / 20) ? zodiac.color : "rgba(255,255,255,0.15)" }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  <span style={{ fontSize: "20px", color: zodiac.color, fontWeight: "bold" }}>{fortune.overall}</span>
                </div>
              </div>

              {/* Luck bars */}
              <div style={{
                background: "rgba(5,8,26,0.8)",
                border: "1px solid rgba(100,100,180,0.2)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
              }}>
                <LuckBar label="爱情运势" value={fortune.love} color="#e06080" />
                <LuckBar label="事业运势" value={fortune.career} color="#c9a84c" />
                <LuckBar label="财富运势" value={fortune.wealth} color="#60c080" />
                <LuckBar label="健康运势" value={fortune.health} color="#6090e0" />
              </div>

              {/* Daily fortune */}
              <div style={{
                background: "rgba(5,8,26,0.8)",
                border: `1px solid ${zodiac.color}30`,
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
              }}>
                <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "8px" }}>今日运势解读</div>
                <p style={{ fontSize: "13px", color: "#e8d5a3", lineHeight: 2, margin: 0 }}>{fortune.daily}</p>
              </div>

              {/* Lucky items */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "8px",
                marginBottom: "16px",
              }}>
                {[
                  { label: "幸运色", value: fortune.lucky_color, icon: "🎨" },
                  { label: "幸运数", value: fortune.lucky_number, icon: "✦" },
                  { label: "吉利方位", value: fortune.lucky_direction, icon: "🧭" },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: "rgba(5,8,26,0.8)",
                    border: "1px solid rgba(100,100,180,0.2)",
                    borderRadius: "10px",
                    padding: "12px 8px",
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: "18px", marginBottom: "4px" }}>{item.icon}</div>
                    <div style={{ fontSize: "10px", color: "#a08060", marginBottom: "3px" }}>{item.label}</div>
                    <div style={{ fontSize: "13px", color: zodiac.color }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
