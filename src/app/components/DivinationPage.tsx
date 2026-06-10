import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { saveToHistory } from "../utils/history";

interface DivinationPageProps {
  onBack: () => void;
}

const hexagrams = [
  { name: "乾", symbol: "䷀", meaning: "天行健，君子以自强不息。刚健中正，万物资始。", luck: "大吉", advice: "此卦主刚健进取，当前形势一片光明，宜大胆行事，把握机遇。" },
  { name: "坤", symbol: "䷁", meaning: "地势坤，君子以厚德载物。柔顺承天，万物资生。", luck: "吉", advice: "此卦主柔顺包容，宜以退为进，广结善缘，厚积薄发。" },
  { name: "屯", symbol: "䷂", meaning: "云雷屯，君子以经纶。初生之难，万物始生。", luck: "平", advice: "万事开头难，需耐心等待，积累力量，时机到来自然水到渠成。" },
  { name: "蒙", symbol: "䷃", meaning: "山下出泉，蒙；君子以果行育德。启蒙教化，知识为先。", luck: "平", advice: "当前蒙昧未开，需虚心求教，广学博识，方能明辨是非。" },
  { name: "需", symbol: "䷄", meaning: "云上于天，需；君子以饮食宴乐。等待时机，以不变应万变。", luck: "吉", advice: "此时需要等待，不可操之过急，保持心境平和，静候良机。" },
  { name: "讼", symbol: "䷅", meaning: "天与水违行，讼；君子以作事谋始。慎重行事，化解纷争。", luck: "凶", advice: "此卦主争讼，凡事需谨慎，避免与人争执，以和为贵。" },
  { name: "师", symbol: "䷆", meaning: "地中有水，师；君子以容民畜众。众志成城，团结力量。", luck: "吉", advice: "此卦主领导统帅，宜广纳贤才，团结众人，方可成就大事。" },
  { name: "比", symbol: "䷇", meaning: "地上有水，比；先王以建万国，亲诸侯。亲比相辅，互助共赢。", luck: "大吉", advice: "此卦主亲密合作，宜与志同道合者携手，互相扶持，共创辉煌。" },
];

const lineTypes = [6, 7, 8, 9]; // 6=老阴, 7=少阳, 8=少阴, 9=老阳

function Coin({ isFlipping, result }: { isFlipping: boolean; result: "heads" | "tails" | null }) {
  return (
    <motion.div
      animate={isFlipping ? { rotateY: [0, 360, 720, 1080] } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: result === "heads"
          ? "radial-gradient(circle at 35% 35%, #f0d080, #c9a84c, #8b6914)"
          : "radial-gradient(circle at 35% 35%, #d4c080, #a89040, #6b5010)",
        border: "2px solid #c9a84c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.2)",
        cursor: "pointer",
      }}
    >
      {result === "heads" ? "正" : result === "tails" ? "反" : "?"}
    </motion.div>
  );
}

function HexagramLine({ lineValue, delay }: { lineValue: number | null; delay: number }) {
  if (lineValue === null) {
    return (
      <div style={{ display: "flex", gap: "4px", alignItems: "center", height: "16px" }}>
        <div style={{ width: "60px", height: "6px", background: "rgba(201,168,76,0.2)", borderRadius: "3px" }} />
      </div>
    );
  }

  const isBroken = lineValue === 6 || lineValue === 8;
  const isChanging = lineValue === 6 || lineValue === 9;

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay, duration: 0.4 }}
      style={{ display: "flex", gap: "4px", alignItems: "center", height: "16px" }}
    >
      {isBroken ? (
        <>
          <div style={{ width: "26px", height: "6px", background: isChanging ? "#e06060" : "#c9a84c", borderRadius: "3px" }} />
          <div style={{ width: "8px" }} />
          <div style={{ width: "26px", height: "6px", background: isChanging ? "#e06060" : "#c9a84c", borderRadius: "3px" }} />
        </>
      ) : (
        <div style={{ width: "60px", height: "6px", background: isChanging ? "#e06060" : "#c9a84c", borderRadius: "3px" }} />
      )}
      {isChanging && (
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ fontSize: "10px", color: "#e06060", marginLeft: "4px" }}
        >
          变
        </motion.span>
      )}
    </motion.div>
  );
}

export function DivinationPage({ onBack }: DivinationPageProps) {
  const [phase, setPhase] = useState<"intro" | "input" | "casting" | "result">("intro");
  const [question, setQuestion] = useState("");
  const [castIndex, setCastIndex] = useState(0);
  const [coinResults, setCoinResults] = useState<("heads" | "tails")[][] >([]);
  const [currentCoins, setCurrentCoins] = useState<("heads" | "tails" | null)[]>([null, null, null]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [lines, setLines] = useState<(number | null)[]>(Array(6).fill(null));
  const [hexagram, setHexagram] = useState<typeof hexagrams[0] | null>(null);
  const [breathPhase, setBreathPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setBreathPhase((p) => (p + 1) % 3), 2000);
    return () => clearInterval(interval);
  }, []);

  const flipCoins = async () => {
    if (isFlipping || castIndex >= 6) return;
    setIsFlipping(true);

    // Animate
    await new Promise((r) => setTimeout(r, 100));

    const results: ("heads" | "tails")[] = [
      Math.random() < 0.5 ? "heads" : "tails",
      Math.random() < 0.5 ? "heads" : "tails",
      Math.random() < 0.5 ? "heads" : "tails",
    ];
    setCurrentCoins(results);

    await new Promise((r) => setTimeout(r, 900));
    setIsFlipping(false);

    const headsCount = results.filter((r) => r === "heads").length;
    // 3 heads = 9 (老阳), 2 heads+1 tails = 8 (少阴), 1 head+2 tails = 7 (少阳), 0 heads = 6 (老阴)
    const lineVal = headsCount === 3 ? 9 : headsCount === 2 ? 8 : headsCount === 1 ? 7 : 6;

    const newLines = [...lines];
    newLines[castIndex] = lineVal;
    setLines(newLines);

    const newCoinResults = [...coinResults, results];
    setCoinResults(newCoinResults);

    const nextIndex = castIndex + 1;
    setCastIndex(nextIndex);

    if (nextIndex >= 6) {
      setTimeout(() => {
        const h = hexagrams[Math.floor(Math.random() * hexagrams.length)];
        setHexagram(h);
        setPhase("result");
        saveToHistory({
          type: "divination",
          title: `占卜 · ${h.name}卦`,
          summary: `${h.symbol} ${h.luck} — ${h.advice.slice(0, 20)}…`,
          detail: h.meaning,
          icon: "☯",
        });
      }, 800);
    }
  };

  const reset = () => {
    setPhase("intro");
    setQuestion("");
    setCastIndex(0);
    setCoinResults([]);
    setCurrentCoins([null, null, null]);
    setLines(Array(6).fill(null));
    setHexagram(null);
    setIsFlipping(false);
  };

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #0d0500 0%, #1a0a00 100%)",
        minHeight: "100%",
        fontFamily: "'Noto Serif SC', serif",
        color: "#e8d5a3",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px 16px 0", gap: "12px" }}>
        <motion.button
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
          style={{ background: "none", border: "none", color: "#c9a84c", fontSize: "20px", cursor: "pointer", padding: "4px" }}
        >
          ‹
        </motion.button>
        <div>
          <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "20px", color: "#f0d080" }}>占卜</div>
          <div style={{ fontSize: "10px", color: "#a08060" }}>三铜钱法 · 周易演卦</div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #c9a84c40, transparent)", margin: "12px 0" }} />
      </div>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: "20px 24px", textAlign: "center" }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ fontSize: "80px", marginBottom: "20px", fontFamily: "'Ma Shan Zheng', serif", color: "#c9a84c" }}
            >
              ䷀
            </motion.div>
            <p style={{ color: "#a08060", fontSize: "13px", lineHeight: 2, marginBottom: "24px" }}>
              三铜钱法乃周易占卜之古法<br />
              静心凝神，心存一问<br />
              掷钱六次，成卦显象
            </p>
            <div
              style={{
                background: "rgba(30,16,4,0.8)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "24px",
                textAlign: "left",
              }}
            >
              {[
                { label: "老阴 (6)", desc: "三反 — 变爻阴", color: "#e06060" },
                { label: "少阳 (7)", desc: "二反一正 — 不变阳", color: "#c9a84c" },
                { label: "少阴 (8)", desc: "二正一反 — 不变阴", color: "#a08060" },
                { label: "老阳 (9)", desc: "三正 — 变爻阳", color: "#e06060" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
                  <span style={{ color: item.color, fontSize: "12px" }}>{item.label}</span>
                  <span style={{ color: "#a08060", fontSize: "11px" }}>{item.desc}</span>
                </div>
              ))}
            </div>
            <motion.button
              onClick={() => setPhase("input")}
              whileHover={{ scale: 1.03 }}
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
              }}
            >
              开始占卜
            </motion.button>
          </motion.div>
        )}

        {phase === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ padding: "20px 24px" }}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "13px", color: "#a08060", marginBottom: "12px" }}>静心冥想，心中存一问题</div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: "40px", color: "#c9a84c", marginBottom: "12px" }}
              >
                ☯
              </motion.div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#a08060", marginBottom: "8px" }}>
                将你的疑问写下（可不写，心存即可）
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="例如：此事是否顺利？或留空心存问题..."
                style={{
                  width: "100%",
                  height: "80px",
                  background: "rgba(30,16,4,0.8)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  borderRadius: "8px",
                  color: "#e8d5a3",
                  padding: "10px",
                  fontSize: "13px",
                  fontFamily: "'Noto Serif SC', serif",
                  resize: "none",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <motion.button
              onClick={() => setPhase("casting")}
              whileHover={{ scale: 1.03 }}
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
                letterSpacing: "2px",
              }}
            >
              心念已定，开始起卦
            </motion.button>
          </motion.div>
        )}

        {phase === "casting" && (
          <motion.div
            key="casting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: "16px 24px" }}
          >
            {question && (
              <div style={{
                background: "rgba(30,16,4,0.8)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "16px",
                fontSize: "12px",
                color: "#a08060",
              }}>
                问：{question}
              </div>
            )}

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", color: "#a08060", marginBottom: "4px" }}>
                第 {Math.min(castIndex + 1, 6)} 爻 / 共 6 爻
              </div>
              <div style={{ fontSize: "11px", color: "#6a5040" }}>
                {castIndex < 6 ? "点击铜钱起卦" : "六爻已成"}
              </div>
            </div>

            {/* Coins */}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "28px" }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  onClick={castIndex < 6 ? flipCoins : undefined}
                  style={{ cursor: castIndex < 6 ? "pointer" : "default" }}
                >
                  <Coin isFlipping={isFlipping} result={currentCoins[i]} />
                </motion.div>
              ))}
            </div>

            {/* Hexagram being built */}
            <div style={{
              background: "rgba(30,16,4,0.8)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "10px",
              padding: "20px",
              display: "flex",
              flexDirection: "column-reverse",
              gap: "10px",
              alignItems: "center",
            }}>
              {lines.map((line, i) => (
                <HexagramLine key={i} lineValue={line} delay={0} />
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "16px", fontSize: "11px", color: "#6a5040" }}>
              由下往上起爻，六爻构成一卦
            </div>

            {castIndex === 0 && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ textAlign: "center", marginTop: "16px", color: "#c9a84c", fontSize: "13px" }}
              >
                ↑ 点击铜钱起第一爻
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === "result" && hexagram && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: "16px 24px" }}
          >
            {question && (
              <div style={{
                background: "rgba(30,16,4,0.8)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "16px",
                fontSize: "12px",
                color: "#a08060",
              }}>
                问：{question}
              </div>
            )}

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              style={{
                textAlign: "center",
                background: "linear-gradient(145deg, rgba(30,16,4,0.95), rgba(45,25,8,0.95))",
                border: "1px solid rgba(201,168,76,0.5)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "16px",
              }}
            >
              <div style={{ fontSize: "60px", color: "#c9a84c", marginBottom: "8px", fontFamily: "'Ma Shan Zheng', serif" }}>
                {hexagram.symbol}
              </div>
              <div style={{ fontSize: "24px", color: "#f0d080", fontFamily: "'Ma Shan Zheng', serif", letterSpacing: "4px", marginBottom: "8px" }}>
                {hexagram.name}卦
              </div>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 16px",
                  background: hexagram.luck === "大吉" ? "rgba(100,180,80,0.2)" : hexagram.luck === "吉" ? "rgba(201,168,76,0.2)" : hexagram.luck === "凶" ? "rgba(200,60,60,0.2)" : "rgba(128,128,128,0.2)",
                  border: `1px solid ${hexagram.luck === "大吉" ? "#60c080" : hexagram.luck === "吉" ? "#c9a84c" : hexagram.luck === "凶" ? "#e06060" : "#808080"}`,
                  borderRadius: "20px",
                  color: hexagram.luck === "大吉" ? "#60c080" : hexagram.luck === "吉" ? "#c9a84c" : hexagram.luck === "凶" ? "#e06060" : "#a0a0a0",
                  fontSize: "14px",
                  letterSpacing: "2px",
                  marginBottom: "16px",
                }}
              >
                {hexagram.luck}
              </div>
            </motion.div>

            {/* Hexagram display */}
            <div style={{
              display: "flex",
              flexDirection: "column-reverse",
              gap: "10px",
              alignItems: "center",
              background: "rgba(30,16,4,0.8)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "16px",
            }}>
              {lines.map((line, i) => (
                <HexagramLine key={i} lineValue={line} delay={i * 0.1} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                background: "rgba(30,16,4,0.8)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "8px" }}>卦辞</div>
              <p style={{ fontSize: "13px", color: "#e8d5a3", lineHeight: 2, margin: 0 }}>{hexagram.meaning}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{
                background: "linear-gradient(135deg, rgba(139,69,19,0.2), rgba(30,16,4,0.9))",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "8px" }}>玄机解析</div>
              <p style={{ fontSize: "13px", color: "#e8d5a3", lineHeight: 2, margin: 0 }}>{hexagram.advice}</p>
            </motion.div>

            <motion.button
              onClick={reset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #5c2d0a, #8b4513)",
                border: "1px solid rgba(201,168,76,0.5)",
                borderRadius: "10px",
                color: "#f0d080",
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "'Noto Serif SC', serif",
                letterSpacing: "2px",
                marginBottom: "20px",
              }}
            >
              重新起卦
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
