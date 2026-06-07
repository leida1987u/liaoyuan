import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  calculateBazi,
  SHICHEN,
  WUXING_COLORS,
  WUXING_BG,
  type BaziResult,
  type Pillar,
} from "../utils/bazi";
import { saveToHistory, getBaziProfile, saveBaziProfile } from "../utils/history";

interface BaziPageProps {
  onBack: () => void;
}

function PillarCard({ pillar, delay }: { pillar: Pillar; delay: number }) {
  const ganColor = WUXING_COLORS[pillar.ganWuxing];
  const zhiColor = WUXING_COLORS[pillar.zhiWuxing];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0",
      }}
    >
      <div style={{ fontSize: "10px", color: "#6a5040", marginBottom: "8px", letterSpacing: "1px" }}>
        {pillar.label}
      </div>

      {/* Heavenly stem */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "6px 6px 0 0",
          background: `linear-gradient(145deg, ${WUXING_BG[pillar.ganWuxing]}, rgba(30,16,4,0.9))`,
          border: `1px solid ${ganColor}50`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <span style={{ fontSize: "22px", color: ganColor, fontFamily: "'Ma Shan Zheng', serif", lineHeight: 1 }}>
          {pillar.gan}
        </span>
        <span style={{ fontSize: "9px", color: ganColor, opacity: 0.7 }}>{pillar.ganWuxing}</span>
        <div style={{
          position: "absolute",
          top: "2px",
          right: "3px",
          fontSize: "7px",
          color: ganColor,
          opacity: 0.5,
        }}>
          {pillar.ganYinYang}
        </div>
      </motion.div>

      {/* Divider */}
      <div style={{ width: "52px", height: "2px", background: `linear-gradient(to right, ${ganColor}40, ${zhiColor}40)` }} />

      {/* Earthly branch */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "0 0 6px 6px",
          background: `linear-gradient(145deg, rgba(30,16,4,0.9), ${WUXING_BG[pillar.zhiWuxing]})`,
          border: `1px solid ${zhiColor}50`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <span style={{ fontSize: "22px", color: zhiColor, fontFamily: "'Ma Shan Zheng', serif", lineHeight: 1 }}>
          {pillar.zhi}
        </span>
        <span style={{ fontSize: "9px", color: zhiColor, opacity: 0.7 }}>{pillar.zhiWuxing}</span>
        <div style={{
          position: "absolute",
          bottom: "2px",
          right: "3px",
          fontSize: "7px",
          color: zhiColor,
          opacity: 0.5,
        }}>
          {pillar.zhiYinYang}
        </div>
      </motion.div>

      {/* Ganzhi combined label */}
      <div style={{ fontSize: "10px", color: "#a08060", marginTop: "6px" }}>
        {pillar.gan}{pillar.zhi}
      </div>
    </motion.div>
  );
}

function WuxingChart({ counts, delay }: { counts: Record<string, number>; delay: number }) {
  const wuxingOrder = ["木", "火", "土", "金", "水"];
  const max = Math.max(...Object.values(counts), 1);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      style={{
        background: "rgba(30,16,4,0.8)",
        border: "1px solid rgba(201,168,76,0.2)",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "14px",
      }}
    >
      <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "14px" }}>五行分布</div>

      {/* Radar-like display using bars */}
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: "80px", marginBottom: "8px" }}>
        {wuxingOrder.map((wx) => {
          const count = counts[wx] || 0;
          const pct = total > 0 ? count / total : 0;
          const color = WUXING_COLORS[wx];
          return (
            <div key={wx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}>
              <div style={{ fontSize: "11px", color, fontWeight: "bold" }}>{count}</div>
              <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(pct * 60, count > 0 ? 8 : 0)}px` }}
                  transition={{ delay: delay + 0.2, duration: 0.7, ease: "easeOut" }}
                  style={{
                    background: `linear-gradient(to top, ${color}, ${color}60)`,
                    borderRadius: "3px 3px 0 0",
                    minHeight: count > 0 ? "8px" : "0",
                    boxShadow: count > 0 ? `0 0 8px ${color}40` : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {wuxingOrder.map((wx) => (
          <div key={wx} style={{ flex: 1, textAlign: "center", fontSize: "12px", color: WUXING_COLORS[wx], fontFamily: "'Ma Shan Zheng', serif" }}>
            {wx}
          </div>
        ))}
      </div>

      {/* Pentagon visualization */}
      <div style={{ marginTop: "14px", position: "relative", height: "100px" }}>
        <svg width="100%" height="100" viewBox="0 0 200 100">
          {(() => {
            const cx = 100, cy = 50, r = 38;
            const pts = wuxingOrder.map((wx, i) => {
              const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
              const count = counts[wx] || 0;
              const ratio = total > 0 ? count / max : 0;
              return {
                wx,
                ox: cx + r * Math.cos(angle),
                oy: cy + r * Math.sin(angle),
                ix: cx + r * ratio * Math.cos(angle),
                iy: cy + r * ratio * Math.sin(angle),
                lx: cx + (r + 14) * Math.cos(angle),
                ly: cy + (r + 14) * Math.sin(angle),
              };
            });

            const outerPoly = pts.map((p) => `${p.ox},${p.oy}`).join(" ");
            const innerPoly = pts.map((p) => `${p.ix},${p.iy}`).join(" ");

            return (
              <>
                <polygon points={outerPoly} fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
                <motion.polygon
                  points={outerPoly.replace(/[\d.]+,[\d.]+/g, (_, i) => `${cx},${cy}`)}
                  animate={{ points: innerPoly }}
                  transition={{ delay: delay + 0.3, duration: 0.8 }}
                  fill="rgba(201,168,76,0.15)"
                  stroke="#c9a84c"
                  strokeWidth="1.5"
                />
                {pts.map((p) => (
                  <g key={p.wx}>
                    <line x1={cx} y1={cy} x2={p.ox} y2={p.oy} stroke="rgba(201,168,76,0.1)" strokeWidth="0.5" />
                    <text x={p.lx} y={p.ly + 4} textAnchor="middle" fill={WUXING_COLORS[p.wx]} style={{ fontSize: "9px" }}>
                      {p.wx}
                    </text>
                  </g>
                ))}
                <circle cx={cx} cy={cy} r="2" fill="#c9a84c" />
              </>
            );
          })()}
        </svg>
      </div>
    </motion.div>
  );
}

const WUXING_EMOJI: Record<string, string> = { 木: "🌿", 火: "🔥", 土: "⛰", 金: "✨", 水: "💧" };

export function BaziPage({ onBack }: BaziPageProps) {
  const [birthDate, setBirthDate] = useState("1995-06-15");
  const [shichenIdx, setShichenIdx] = useState(6);
  const [result, setResult] = useState<BaziResult | null>(null);
  const [calculated, setCalculated] = useState(false);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  // Load saved profile
  useEffect(() => {
    const profile = getBaziProfile();
    if (profile) {
      setName(profile.name);
      setBirthDate(profile.birthDate);
      setShichenIdx(profile.birthHour);
    }
  }, []);

  const handleCalculate = () => {
    const [y, m, d] = birthDate.split("-").map(Number);
    if (!y || !m || !d) return;
    const res = calculateBazi(y, m, d, shichenIdx);
    setResult(res);
    setCalculated(true);

    if (name) {
      saveBaziProfile({ name, birthDate, birthHour: shichenIdx });
    }

    saveToHistory({
      type: "bazi",
      title: `八字排盘 · ${name || "匿名"}`,
      summary: `${res.year.gan}${res.year.zhi} ${res.month.gan}${res.month.zhi} ${res.day.gan}${res.day.zhi} ${res.hour.gan}${res.hour.zhi}`,
      detail: `日主${res.dayMaster}（${res.dayMasterWuxing}）`,
      icon: "🔮",
    });
    setSaved(false);
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #0d0500 0%, #1a0a00 100%)", minHeight: "100%", fontFamily: "'Noto Serif SC', serif", color: "#e8d5a3" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px 16px 0", gap: "12px" }}>
        <motion.button onClick={onBack} whileTap={{ scale: 0.9 }} style={{ background: "none", border: "none", color: "#c9a84c", fontSize: "20px", cursor: "pointer", padding: "4px" }}>
          ‹
        </motion.button>
        <div>
          <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "20px", color: "#f0d080" }}>八字排盘</div>
          <div style={{ fontSize: "10px", color: "#a08060" }}>四柱推命 · 探知天机</div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #c9a84c40, transparent)", margin: "12px 0" }} />
      </div>

      <div style={{ padding: "0 16px 24px" }}>
        {/* Input section */}
        <div style={{
          background: "rgba(30,16,4,0.8)",
          border: "1px solid rgba(201,168,76,0.25)",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "14px",
        }}>
          <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "14px" }}>填写生辰信息</div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "11px", color: "#a08060", marginBottom: "6px" }}>名字（选填）</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入姓名..."
              style={{
                width: "100%",
                background: "rgba(13,5,0,0.8)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "6px",
                color: "#e8d5a3",
                padding: "8px 12px",
                fontSize: "13px",
                fontFamily: "'Noto Serif SC', serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "11px", color: "#a08060", marginBottom: "6px" }}>出生日期（阳历）</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max="2024-12-31"
              min="1900-01-01"
              style={{
                width: "100%",
                background: "rgba(13,5,0,0.8)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "6px",
                color: "#e8d5a3",
                padding: "8px 12px",
                fontSize: "13px",
                fontFamily: "'Noto Serif SC', serif",
                outline: "none",
                boxSizing: "border-box",
                colorScheme: "dark",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", color: "#a08060", marginBottom: "6px" }}>出生时辰</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {SHICHEN.map((s, i) => (
                <motion.div
                  key={i}
                  onClick={() => setShichenIdx(i)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "7px 10px",
                    background: shichenIdx === i ? "rgba(201,168,76,0.2)" : "rgba(13,5,0,0.6)",
                    border: `1px solid ${shichenIdx === i ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.1)"}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "11px",
                    color: shichenIdx === i ? "#f0d080" : "#a08060",
                    textAlign: "center",
                    transition: "all 0.2s",
                  }}
                >
                  {s}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleCalculate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #5c2d0a, #8b4513)",
            border: "1px solid rgba(201,168,76,0.5)",
            borderRadius: "10px",
            color: "#f0d080",
            fontSize: "16px",
            cursor: "pointer",
            fontFamily: "'Noto Serif SC', serif",
            letterSpacing: "4px",
            marginBottom: "20px",
          }}
        >
          推算八字命盘
        </motion.button>

        <AnimatePresence>
          {calculated && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Four Pillars */}
              <div style={{
                background: "rgba(30,16,4,0.8)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "14px",
              }}>
                <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "16px" }}>
                  四柱 · {name ? `${name}的命盘` : "命盘"}
                </div>

                {/* Pillars row */}
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  {[result.year, result.month, result.day, result.hour].map((p, i) => (
                    <PillarCard key={p.label} pillar={p} delay={i * 0.1} />
                  ))}
                </div>

                {/* Legend */}
                <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "14px", flexWrap: "wrap" }}>
                  {["木", "火", "土", "金", "水"].map((wx) => (
                    <div key={wx} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: WUXING_COLORS[wx] }} />
                      <span style={{ fontSize: "10px", color: "#a08060" }}>{wx}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Master info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  background: `linear-gradient(145deg, ${WUXING_BG[result.dayMasterWuxing]}, rgba(13,5,0,0.9))`,
                  border: `1px solid ${WUXING_COLORS[result.dayMasterWuxing]}40`,
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "14px",
                  boxShadow: `0 0 20px ${WUXING_COLORS[result.dayMasterWuxing]}10`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: `${WUXING_COLORS[result.dayMasterWuxing]}20`,
                    border: `2px solid ${WUXING_COLORS[result.dayMasterWuxing]}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <span style={{ fontSize: "18px", color: WUXING_COLORS[result.dayMasterWuxing], fontFamily: "'Ma Shan Zheng', serif" }}>
                      {result.dayMaster}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: WUXING_COLORS[result.dayMasterWuxing], marginBottom: "2px" }}>
                      日主 · {result.dayMaster}（{result.dayMasterWuxing}）
                    </div>
                    <div style={{ fontSize: "11px", color: "#6a5040" }}>
                      {WUXING_EMOJI[result.dayMasterWuxing]} {result.dayMaster === result.day.gan ? "与日支同宫" : ""}
                      {result.strong.length > 0 ? `五行偏旺：${result.strong.join("、")}` : "五行均衡"}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "12px", color: "#e8d5a3", lineHeight: 2, margin: "0 0 10px" }}>
                  {result.personality}
                </p>
                <div style={{ height: "1px", background: `rgba(201,168,76,0.2)`, margin: "10px 0" }} />
                <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "4px" }}>玄机建议</div>
                <p style={{ fontSize: "12px", color: "#c9a84c", lineHeight: 2, margin: 0 }}>
                  {result.advice}
                </p>
              </motion.div>

              {/* Five elements chart */}
              <WuxingChart counts={result.wuxingCount} delay={0.5} />

              {/* Strong / Weak analysis */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <div style={{
                  background: "rgba(30,16,4,0.8)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: "10px",
                  padding: "14px",
                }}>
                  <div style={{ fontSize: "10px", color: "#a08060", marginBottom: "8px" }}>五行旺神</div>
                  {result.strong.length > 0 ? (
                    result.strong.map((wx) => (
                      <div key={wx} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "14px" }}>{WUXING_EMOJI[wx]}</span>
                        <span style={{ fontSize: "13px", color: WUXING_COLORS[wx] }}>{wx}</span>
                        <span style={{ fontSize: "10px", color: "#6a5040" }}>·旺</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: "12px", color: "#a08060" }}>五行均衡</div>
                  )}
                </div>
                <div style={{
                  background: "rgba(30,16,4,0.8)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: "10px",
                  padding: "14px",
                }}>
                  <div style={{ fontSize: "10px", color: "#a08060", marginBottom: "8px" }}>五行缺失</div>
                  {result.weak.length > 0 ? (
                    result.weak.map((wx) => (
                      <div key={wx} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "14px", opacity: 0.4 }}>{WUXING_EMOJI[wx]}</span>
                        <span style={{ fontSize: "13px", color: WUXING_COLORS[wx], opacity: 0.6 }}>{wx}</span>
                        <span style={{ fontSize: "10px", color: "#6a5040" }}>·缺</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: "12px", color: "#a08060" }}>无明显缺行</div>
                  )}
                </div>
              </motion.div>

              {/* Wuxing supplement advice */}
              {result.weak.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  style={{
                    background: "rgba(30,16,4,0.8)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: "10px",
                    padding: "14px",
                    marginBottom: "14px",
                  }}
                >
                  <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "10px" }}>补行建议</div>
                  {result.weak.map((wx) => {
                    const advice: Record<string, string> = {
                      木: "宜穿绿色服饰，居室添置绿植，方位取东方，数字3与8。",
                      火: "宜穿红色服饰，居室增加暖光照明，方位取南方，数字2与7。",
                      土: "宜穿黄色土色服饰，居室添加陶瓷摆件，方位取中央，数字5与0。",
                      金: "宜穿白色金色服饰，居室摆放金属摆件，方位取西方，数字4与9。",
                      水: "宜穿黑色蓝色服饰，居室添置水缸鱼缸，方位取北方，数字1与6。",
                    };
                    return (
                      <div key={wx} style={{ marginBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "14px" }}>{WUXING_EMOJI[wx]}</span>
                          <span style={{ fontSize: "12px", color: WUXING_COLORS[wx] }}>补{wx}之法</span>
                        </div>
                        <p style={{ fontSize: "11px", color: "#a08060", lineHeight: 1.8, margin: 0, paddingLeft: "20px" }}>
                          {advice[wx]}
                        </p>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              <motion.button
                onClick={() => { setCalculated(false); setResult(null); }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "transparent",
                  border: "1px solid rgba(201,168,76,0.3)",
                  borderRadius: "8px",
                  color: "#a08060",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "'Noto Serif SC', serif",
                  marginBottom: "20px",
                }}
              >
                重新推算
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
