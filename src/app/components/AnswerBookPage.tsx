import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { saveToHistory, getHistory, type HistoryEntry } from "../utils/history";

interface AnswerBookPageProps {
  onBack: () => void;
}

const ANSWERS = [
  { text: "是的，时机已至，放心去做吧。", type: "yes", poem: "春风得意马蹄疾，一日看尽长安花。" },
  { text: "不，此时非彼时，再等等。", type: "no", poem: "山重水复疑无路，柳暗花明又一村。" },
  { text: "顺其自然，莫强求。", type: "neutral", poem: "无为而无不为，静水深流。" },
  { text: "相信自己，你有能力做到。", type: "yes", poem: "千磨万击还坚劲，任尔东西南北风。" },
  { text: "放下执念，方见真相。", type: "neutral", poem: "本来无一物，何处惹尘埃。" },
  { text: "此路不通，另辟蹊径。", type: "no", poem: "踏破铁鞋无觅处，得来全不费工夫。" },
  { text: "大吉大利，诸事皆宜。", type: "yes", poem: "天生我材必有用，千金散尽还复来。" },
  { text: "静候时机，不必焦虑。", type: "neutral", poem: "潮平两岸阔，风正一帆悬。" },
  { text: "谨慎行事，小心为上。", type: "caution", poem: "欲速则不达，见小利则大事不成。" },
  { text: "贵人将至，好运相随。", type: "yes", poem: "海内存知己，天涯若比邻。" },
  { text: "转机就在眼前，坚持下去。", type: "yes", poem: "不经一番寒彻骨，怎得梅花扑鼻香。" },
  { text: "内心已有答案，相信直觉。", type: "neutral", poem: "知者不惑，仁者不忧，勇者不惧。" },
  { text: "此事需从长计议，切勿急躁。", type: "caution", poem: "谋定而后动，知止而有得。" },
  { text: "缘分天定，强求无益。", type: "no", poem: "有缘千里来相会，无缘对面不相识。" },
  { text: "万事开头难，迈出第一步就好。", type: "yes", poem: "千里之行，始于足下。" },
  { text: "看似困境，实乃转机。", type: "neutral", poem: "祸兮福之所倚，福兮祸之所伏。" },
  { text: "内外兼修，方可圆满。", type: "neutral", poem: "修身、齐家、治国、平天下。" },
  { text: "放宽心，船到桥头自然直。", type: "yes", poem: "天下本无事，庸人自扰之。" },
  { text: "此刻沉默胜于雄辩。", type: "caution", poem: "知之为知之，不知为不知，是知也。" },
  { text: "善缘已至，好好珍惜。", type: "yes", poem: "相逢何必曾相识，同是天涯沦落人。" },
];

const typeColors: Record<string, string> = {
  yes: "#60c080",
  no: "#e06060",
  neutral: "#c9a84c",
  caution: "#e09040",
};

const typeLabels: Record<string, string> = {
  yes: "顺遂",
  no: "缓行",
  neutral: "随缘",
  caution: "谨慎",
};

function BookSVG({ isOpen, glowing }: { isOpen: boolean; glowing: boolean }) {
  return (
    <motion.div
      animate={glowing ? { filter: ["drop-shadow(0 0 10px #c9a84c)", "drop-shadow(0 0 25px #f0d080)", "drop-shadow(0 0 10px #c9a84c)"] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <svg width="160" height="120" viewBox="0 0 160 120">
        {/* Book spine */}
        <rect x="74" y="10" width="12" height="100" rx="2" fill="#4a2a0a" stroke="#c9a84c" strokeWidth="0.5" />

        {/* Left page */}
        <motion.g animate={isOpen ? { rotateY: 0 } : {}}>
          <path d="M 74 12 Q 40 20 20 30 L 20 108 Q 40 100 74 108 Z" fill="#2a1800" stroke="#c9a84c" strokeWidth="0.5" />
          <path d="M 68 25 Q 45 32 30 38" stroke="#8b6914" strokeWidth="0.5" strokeOpacity="0.5" />
          <path d="M 68 35 Q 45 42 30 48" stroke="#8b6914" strokeWidth="0.5" strokeOpacity="0.5" />
          <path d="M 68 45 Q 45 52 30 58" stroke="#8b6914" strokeWidth="0.5" strokeOpacity="0.5" />
          <path d="M 68 55 Q 45 62 30 68" stroke="#8b6914" strokeWidth="0.5" strokeOpacity="0.5" />
          <path d="M 68 65 Q 45 72 30 78" stroke="#8b6914" strokeWidth="0.5" strokeOpacity="0.5" />
          <text x="47" y="95" textAnchor="middle" fill="#8b6914" style={{ fontSize: "10px", fontFamily: "'Ma Shan Zheng', serif" }} opacity="0.6">
            ☯
          </text>
        </motion.g>

        {/* Right page */}
        <motion.g animate={isOpen ? { rotateY: 0 } : {}}>
          <path d="M 86 12 Q 120 20 140 30 L 140 108 Q 120 100 86 108 Z" fill="#2a1800" stroke="#c9a84c" strokeWidth="0.5" />
          <path d="M 92 25 Q 115 32 130 38" stroke="#8b6914" strokeWidth="0.5" strokeOpacity="0.5" />
          <path d="M 92 35 Q 115 42 130 48" stroke="#8b6914" strokeWidth="0.5" strokeOpacity="0.5" />
          <path d="M 92 45 Q 115 52 130 58" stroke="#8b6914" strokeWidth="0.5" strokeOpacity="0.5" />
          <path d="M 92 55 Q 115 62 130 68" stroke="#8b6914" strokeWidth="0.5" strokeOpacity="0.5" />
          <path d="M 92 65 Q 115 72 130 78" stroke="#8b6914" strokeWidth="0.5" strokeOpacity="0.5" />
          {isOpen && (
            <text x="113" y="62" textAnchor="middle" fill="#c9a84c" style={{ fontSize: "9px", fontFamily: "'Ma Shan Zheng', serif" }} opacity="0.8">
              天机
            </text>
          )}
        </motion.g>

        {/* Gold binding lines */}
        <line x1="80" y1="10" x2="80" y2="110" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.6" />

        {/* Top/bottom decorative */}
        <path d="M 74 10 Q 80 6 86 10" fill="none" stroke="#c9a84c" strokeWidth="1" />
        <path d="M 74 110 Q 80 114 86 110" fill="none" stroke="#c9a84c" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}

export function AnswerBookPage({ onBack }: AnswerBookPageProps) {
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<"idle" | "shaking" | "revealing" | "shown">("idle");
  const [answer, setAnswer] = useState<typeof ANSWERS[0] | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [localHistory, setLocalHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setLocalHistory(getHistory().filter((e) => e.type === "answer"));
  }, []);

  const shake = async () => {
    if (phase !== "idle" && phase !== "shown") return;
    setPhase("shaking");
    setAnswer(null);

    await new Promise((r) => setTimeout(r, 1500));
    setPhase("revealing");

    const picked = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    setAnswer(picked);

    await new Promise((r) => setTimeout(r, 600));
    setPhase("shown");

    saveToHistory({
      type: "answer",
      title: `答案之书`,
      summary: picked.text,
      detail: question.trim() || undefined,
      icon: "📖",
    });
    setLocalHistory(getHistory().filter((e) => e.type === "answer"));
  };

  const reset = () => {
    setPhase("idle");
    setAnswer(null);
    setQuestion("");
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #120500 0%, #1a0a00 50%, #0d0500 100%)", minHeight: "100%", fontFamily: "'Noto Serif SC', serif", color: "#e8d5a3" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px 16px 0", gap: "12px" }}>
        <motion.button onClick={onBack} whileTap={{ scale: 0.9 }} style={{ background: "none", border: "none", color: "#c9a84c", fontSize: "20px", cursor: "pointer", padding: "4px" }}>
          ‹
        </motion.button>
        <div>
          <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "20px", color: "#f0d080" }}>答案之书</div>
          <div style={{ fontSize: "10px", color: "#a08060" }}>内心之问 · 智慧解答</div>
        </div>
        <motion.button
          onClick={() => setShowHistory(!showHistory)}
          style={{ marginLeft: "auto", background: "none", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "16px", color: "#a08060", fontSize: "11px", cursor: "pointer", padding: "4px 10px" }}
        >
          历史
        </motion.button>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #c9a84c40, transparent)", margin: "12px 0" }} />
      </div>

      <AnimatePresence mode="wait">
        {!showHistory ? (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: "0 24px" }}>
            {/* Intro text */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <p style={{ fontSize: "12px", color: "#a08060", lineHeight: 2 }}>
                心存一问，静心翻开此书<br />
                书中自有天地答案
              </p>
            </div>

            {/* Question input */}
            <div style={{ marginBottom: "20px" }}>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={phase === "shaking" || phase === "revealing"}
                placeholder="在此写下你的疑问... （可不写，心存即可）"
                style={{
                  width: "100%",
                  height: "70px",
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

            {/* Book */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
              <motion.div
                onClick={phase === "idle" || phase === "shown" ? shake : undefined}
                animate={
                  phase === "shaking"
                    ? { rotate: [-5, 5, -8, 8, -5, 5, -3, 3, 0], scale: [1, 1.05, 0.98, 1.05, 1] }
                    : phase === "shown"
                    ? { scale: [1, 1.05, 1] }
                    : {}
                }
                transition={phase === "shaking" ? { duration: 1.5, ease: "easeOut" } : { duration: 0.5 }}
                style={{ cursor: phase === "idle" || phase === "shown" ? "pointer" : "default", marginBottom: "8px" }}
              >
                <BookSVG isOpen={phase === "shown" || phase === "revealing"} glowing={phase === "shaking"} />
              </motion.div>

              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: "12px", color: "#a08060" }}
              >
                {phase === "idle" && "点击书本，获取答案"}
                {phase === "shaking" && "天机涌动，请稍候..."}
                {phase === "revealing" && "答案浮现..."}
                {phase === "shown" && "点击书本，再问一次"}
              </motion.div>
            </div>

            {/* Answer reveal */}
            <AnimatePresence>
              {phase === "shown" && answer && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", damping: 20 }}
                  style={{
                    background: "linear-gradient(145deg, rgba(30,16,4,0.95), rgba(45,25,8,0.95))",
                    border: `1px solid ${typeColors[answer.type]}50`,
                    borderRadius: "16px",
                    padding: "24px 20px",
                    marginBottom: "16px",
                    boxShadow: `0 0 30px ${typeColors[answer.type]}15`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Decorative corner */}
                  <div style={{ position: "absolute", top: "8px", left: "8px", fontSize: "20px", color: typeColors[answer.type], opacity: 0.3, fontFamily: "'Ma Shan Zheng', serif" }}>
                    ☯
                  </div>
                  <div style={{ position: "absolute", bottom: "8px", right: "8px", fontSize: "20px", color: typeColors[answer.type], opacity: 0.3, fontFamily: "'Ma Shan Zheng', serif" }}>
                    ☯
                  </div>

                  {/* Type badge */}
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <span style={{
                      padding: "4px 16px",
                      background: `${typeColors[answer.type]}20`,
                      border: `1px solid ${typeColors[answer.type]}`,
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: typeColors[answer.type],
                      letterSpacing: "2px",
                    }}>
                      {typeLabels[answer.type]}
                    </span>
                  </div>

                  {/* Main answer */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ height: "1px", background: `linear-gradient(to right, transparent, ${typeColors[answer.type]}40, transparent)`, marginBottom: "16px" }} />
                    <p style={{ fontSize: "18px", color: "#f0d080", lineHeight: 1.8, margin: "0 0 16px", fontFamily: "'Ma Shan Zheng', serif", letterSpacing: "2px" }}>
                      {answer.text}
                    </p>
                    <div style={{ height: "1px", background: `linear-gradient(to right, transparent, ${typeColors[answer.type]}40, transparent)`, marginBottom: "16px" }} />
                    <p style={{ fontSize: "13px", color: "#a08060", lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>
                      「{answer.poem}」
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {phase === "shown" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={reset}
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
                  marginBottom: "24px",
                }}
              >
                清空，重新提问
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ padding: "0 16px 24px" }}>
            <button
              onClick={() => setShowHistory(false)}
              style={{ background: "none", border: "none", color: "#a08060", fontSize: "12px", cursor: "pointer", padding: "0 0 16px", display: "flex", alignItems: "center", gap: "4px" }}
            >
              ‹ 返回
            </button>
            {localHistory.length === 0 ? (
              <div style={{ textAlign: "center", color: "#6a5040", padding: "40px 0", fontSize: "13px" }}>
                暂无历史记录
              </div>
            ) : (
              localHistory.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    background: "rgba(30,16,4,0.8)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: "10px",
                    padding: "14px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ fontSize: "10px", color: "#6a5040", marginBottom: "4px" }}>{item.date}</div>
                  {item.detail && <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "6px" }}>问：{item.detail}</div>}
                  <div style={{ fontSize: "13px", color: "#f0d080" }}>{item.summary}</div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
