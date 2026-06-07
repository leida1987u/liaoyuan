import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HomePage } from "./components/HomePage";
import { DivinationPage } from "./components/DivinationPage";
import { XiaoLiuRenPage } from "./components/XiaoLiuRenPage";
import { MBTIPage } from "./components/MBTIPage";
import { HoroscopePage } from "./components/HoroscopePage";
import { AnswerBookPage } from "./components/AnswerBookPage";
import { BaziPage } from "./components/BaziPage";
import { SplashScreen } from "./components/SplashScreen";
import { getHistory, clearHistory, type HistoryEntry } from "./utils/history";

type FeaturePage = "divination" | "xiaoliuren" | "mbti" | "horoscope" | "answer" | "bazi";
type BottomTab = "home" | "discover" | "wentian" | "diary" | "profile";

const navItems: { id: BottomTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "home",
    label: "首页",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "discover",
    label: "发现",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    id: "wentian",
    label: "问天",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    id: "diary",
    label: "日记",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "我",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const DISCOVER_ITEMS = [
  { title: "玄学入门", desc: "从零了解东方玄学体系", icon: "📚", tag: "入门" },
  { title: "八字基础", desc: "天干地支与五行之道", icon: "🔮", tag: "进阶" },
  { title: "风水常识", desc: "家居布局与气场调节", icon: "🏠", tag: "实用" },
  { title: "紫微斗数", desc: "命盘解析与运势推算", icon: "⭐", tag: "高阶" },
  { title: "梦境解析", desc: "解读梦境背后的玄机", icon: "🌙", tag: "神秘" },
  { title: "手相面相", desc: "观相知命的古老智慧", icon: "✋", tag: "传统" },
];

function DiscoverPage() {
  return (
    <div style={{ background: "linear-gradient(180deg, #0d0500 0%, #1a0a00 100%)", minHeight: "100%", fontFamily: "'Noto Serif SC', serif", color: "#e8d5a3", padding: "20px 16px" }}>
      <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "22px", color: "#f0d080", marginBottom: "4px" }}>发现</div>
      <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "16px" }}>探索玄学的无限可能</div>
      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #c9a84c40, transparent)", marginBottom: "20px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {DISCOVER_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{ background: "rgba(30,16,4,0.8)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "12px", padding: "16px", cursor: "pointer" }}
          >
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{item.icon}</div>
            <div style={{ fontSize: "14px", color: "#f0d080", marginBottom: "4px" }}>{item.title}</div>
            <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "10px", lineHeight: 1.5 }}>{item.desc}</div>
            <span style={{ padding: "2px 8px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "10px", fontSize: "10px", color: "#c9a84c" }}>
              {item.tag}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WentianPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "天机难测，有何疑问，尽可一问。吾将以玄学之理，为尔指点迷津。" }
  ]);
  const [thinking, setThinking] = useState(false);

  const wisdomReplies = [
    "此事天机已动，顺势而为即可，无须过度担忧。",
    "缘分天定，强求无益。放下执念，方见真章。",
    "木旺逢水，方成大器。你现在正处蓄势阶段，静待时机。",
    "五行相生相克，万事皆有因果。此事宜沉稳应对，切勿急进。",
    "紫气东来，好运将至。保持积极心态，贵人自会出现。",
    "坎离相交，水火既济。你的问题根源在于内心矛盾，需先理清自己的想法。",
    "乾坤大道，刚柔相济。以柔克刚，方为上策。",
    "道可道，非常道。万物皆有其时，顺天应人方为智者之举。",
    "山重水复疑无路，柳暗花明又一村。当下困境是转机的前兆，坚持即可。",
  ];

  const sendMessage = () => {
    if (!input.trim() || thinking) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setThinking(true);
    setTimeout(() => {
      const reply = wisdomReplies[Math.floor(Math.random() * wisdomReplies.length)];
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setThinking(false);
    }, 1000 + Math.random() * 800);
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #0d0500 0%, #1a0a00 100%)", height: "100%", fontFamily: "'Noto Serif SC', serif", color: "#e8d5a3", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "22px", color: "#f0d080", marginBottom: "4px" }}>问天</div>
        <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "12px" }}>向天地问道，寻求智慧指引</div>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #c9a84c40, transparent)" }} />
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: "12px" }}
          >
            {msg.role === "ai" && (
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", marginRight: "8px", flexShrink: 0, fontFamily: "'Ma Shan Zheng', serif", color: "#c9a84c" }}>
                天
              </div>
            )}
            <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px", background: msg.role === "user" ? "linear-gradient(135deg, #5c2d0a, #8b4513)" : "rgba(30,16,4,0.9)", border: `1px solid ${msg.role === "user" ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.15)"}`, fontSize: "13px", lineHeight: 1.7, color: "#e8d5a3" }}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {thinking && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontFamily: "'Ma Shan Zheng', serif", color: "#c9a84c" }}>天</div>
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ fontSize: "20px", color: "#c9a84c" }}>···</motion.div>
          </div>
        )}
      </div>

      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(201,168,76,0.2)", display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="向天地问道..."
          style={{ flex: 1, background: "rgba(30,16,4,0.8)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "20px", color: "#e8d5a3", padding: "10px 16px", fontSize: "13px", fontFamily: "'Noto Serif SC', serif", outline: "none" }}
        />
        <motion.button onClick={sendMessage} whileTap={{ scale: 0.9 }} style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #5c2d0a, #8b4513)", border: "1px solid rgba(201,168,76,0.4)", color: "#f0d080", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          ›
        </motion.button>
      </div>
    </div>
  );
}

const TYPE_ICONS: Record<string, string> = {
  divination: "☯",
  mbti: "◈",
  horoscope: "★",
  answer: "📖",
  bazi: "🔮",
  xiaoliuren: "六",
};

const TYPE_LABELS: Record<string, string> = {
  divination: "占卜",
  mbti: "人格MBTI",
  horoscope: "星座运势",
  answer: "答案之书",
  bazi: "八字排盘",
  xiaoliuren: "小六壬",
};

function DiaryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  const typeColorMap: Record<string, string> = {
    divination: "#c9a84c",
    mbti: "#60c090",
    horoscope: "#6090e0",
    answer: "#e06060",
    bazi: "#c09040",
    xiaoliuren: "#80c080",
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #0d0500 0%, #1a0a00 100%)", minHeight: "100%", fontFamily: "'Noto Serif SC', serif", color: "#e8d5a3", padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
        <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "22px", color: "#f0d080" }}>燎原日记</div>
        {history.length > 0 && (
          <motion.button
            onClick={() => setShowClearConfirm(true)}
            whileTap={{ scale: 0.95 }}
            style={{ background: "none", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "12px", color: "#6a5040", fontSize: "11px", cursor: "pointer", padding: "4px 10px" }}
          >
            清空
          </motion.button>
        )}
      </div>
      <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "16px" }}>记录你与玄学的每一次相遇</div>
      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #c9a84c40, transparent)", marginBottom: "20px" }} />

      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#6a5040" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.3 }}>📜</div>
          <div style={{ fontSize: "13px" }}>尚无记录，开始探索吧</div>
        </div>
      ) : (
        history.map((entry, i) => {
          const color = typeColorMap[entry.type] || "#c9a84c";
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ display: "flex", gap: "12px", marginBottom: "14px" }}
            >
              {/* Timeline */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "36px", flexShrink: 0 }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${color}20`, border: `1px solid ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                  {entry.icon || TYPE_ICONS[entry.type]}
                </div>
                {i < history.length - 1 && (
                  <div style={{ flex: 1, width: "1px", background: "rgba(201,168,76,0.1)", marginTop: "4px", marginBottom: "-4px" }} />
                )}
              </div>

              <div style={{ flex: 1, paddingBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color }}>
                    {TYPE_LABELS[entry.type] || entry.type}
                  </span>
                  <span style={{ fontSize: "10px", color: "#6a5040" }}>{entry.date}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#e8d5a3", lineHeight: 1.6, marginBottom: "2px" }}>{entry.title}</div>
                <div style={{ fontSize: "11px", color: "#a08060", lineHeight: 1.5 }}>{entry.summary}</div>
              </div>
            </motion.div>
          );
        })
      )}

      {/* Clear confirm */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowClearConfirm(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#1a0a00", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "14px", padding: "24px", width: "280px", textAlign: "center" }}
            >
              <div style={{ fontSize: "14px", color: "#f0d080", marginBottom: "8px" }}>确认清空日记？</div>
              <div style={{ fontSize: "12px", color: "#a08060", marginBottom: "20px" }}>所有历史记录将被删除，无法恢复</div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setShowClearConfirm(false)} style={{ flex: 1, padding: "10px", background: "transparent", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "8px", color: "#a08060", cursor: "pointer", fontFamily: "'Noto Serif SC', serif", fontSize: "13px" }}>取消</button>
                <button onClick={handleClear} style={{ flex: 1, padding: "10px", background: "rgba(200,60,60,0.2)", border: "1px solid rgba(200,60,60,0.4)", borderRadius: "8px", color: "#e06060", cursor: "pointer", fontFamily: "'Noto Serif SC', serif", fontSize: "13px" }}>清空</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfilePage({ onNavigate }: { onNavigate: (page: FeaturePage) => void }) {
  const history = getHistory();
  const stats = [
    { label: "总记录", value: history.length.toString() },
    { label: "占卜次数", value: history.filter((h) => h.type === "divination").length.toString() },
    { label: "八字次数", value: history.filter((h) => h.type === "bazi").length.toString() },
  ];

  return (
    <div style={{ background: "linear-gradient(180deg, #0d0500 0%, #1a0a00 100%)", minHeight: "100%", fontFamily: "'Noto Serif SC', serif", color: "#e8d5a3", padding: "20px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <motion.div
          animate={{ boxShadow: ["0 0 10px rgba(201,168,76,0.3)", "0 0 25px rgba(201,168,76,0.6)", "0 0 10px rgba(201,168,76,0.3)"] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #5c2d0a, #8b4513)", border: "2px solid rgba(201,168,76,0.5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "32px", fontFamily: "'Ma Shan Zheng', serif", color: "#f0d080" }}
        >
          燎
        </motion.div>
        <div style={{ fontSize: "16px", color: "#f0d080", fontFamily: "'Ma Shan Zheng', serif" }}>燎原旅人</div>
        <div style={{ fontSize: "11px", color: "#a08060", marginTop: "4px" }}>探索命运轨迹中...</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "rgba(30,16,4,0.8)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "10px", padding: "12px 8px", textAlign: "center" }}>
            <div style={{ fontSize: "20px", color: "#f0d080", fontFamily: "'Ma Shan Zheng', serif" }}>{s.value}</div>
            <div style={{ fontSize: "10px", color: "#a08060", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "10px" }}>快速入口</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
        {[
          { label: "八字排盘", page: "bazi" as FeaturePage, icon: "🔮" },
          { label: "今日占卜", page: "divination" as FeaturePage, icon: "☯" },
          { label: "MBTI测试", page: "mbti" as FeaturePage, icon: "◈" },
          { label: "星座运势", page: "horoscope" as FeaturePage, icon: "★" },
        ].map((item) => (
          <motion.div
            key={item.page}
            onClick={() => onNavigate(item.page)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ background: "rgba(30,16,4,0.8)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "10px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            <span style={{ fontSize: "13px", color: "#e8d5a3" }}>{item.label}</span>
          </motion.div>
        ))}
      </div>

      {[
        { icon: "⚙", label: "个人设置" },
        { icon: "🔔", label: "消息通知" },
        { icon: "📖", label: "玄学知识库" },
        { icon: "❓", label: "帮助与反馈" },
      ].map((item, i) => (
        <motion.div key={i} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "rgba(30,16,4,0.6)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: "10px", marginBottom: "8px", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "16px" }}>{item.icon}</span>
            <span style={{ fontSize: "13px", color: "#e8d5a3" }}>{item.label}</span>
          </div>
          <span style={{ color: "#6a5040", fontSize: "14px" }}>›</span>
        </motion.div>
      ))}

      {/* Author card */}
      <div style={{ marginTop: "24px", padding: "16px", background: "linear-gradient(135deg, rgba(92,45,10,0.3), rgba(13,5,0,0.8))", border: "1px solid rgba(201,168,76,0.35)", borderRadius: "14px", textAlign: "center" }}>
        <div style={{ fontSize: "10px", color: "#6a5040", letterSpacing: "3px", marginBottom: "8px" }}>— 作品信息 —</div>
        <motion.div
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "22px", color: "#c9a84c", letterSpacing: "4px", marginBottom: "6px" }}
        >
          燎原一叶
        </motion.div>
        <div style={{ fontSize: "11px", color: "#a08060", lineHeight: 1.8 }}>
          此应用由 <span style={{ color: "#c9a84c" }}>燎原一叶</span> 独立设计开发<br />
          融合东方玄学与现代交互美学
        </div>
        <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "6px" }}>
          {["占卜", "六壬", "MBTI", "星座", "答案", "八字"].map((tag) => (
            <span key={tag} style={{ padding: "2px 8px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "10px", fontSize: "10px", color: "#8b6914" }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [bottomTab, setBottomTab] = useState<BottomTab>("home");
  const [featurePage, setFeaturePage] = useState<FeaturePage | null>(null);

  const handleNavigate = (page: FeaturePage) => setFeaturePage(page);
  const handleBack = () => setFeaturePage(null);

  const renderContent = () => {
    if (featurePage) {
      switch (featurePage) {
        case "divination": return <DivinationPage onBack={handleBack} />;
        case "xiaoliuren": return <XiaoLiuRenPage onBack={handleBack} />;
        case "mbti": return <MBTIPage onBack={handleBack} />;
        case "horoscope": return <HoroscopePage onBack={handleBack} />;
        case "answer": return <AnswerBookPage onBack={handleBack} />;
        case "bazi": return <BaziPage onBack={handleBack} />;
      }
    }
    switch (bottomTab) {
      case "home": return <HomePage onNavigate={handleNavigate} />;
      case "discover": return <DiscoverPage />;
      case "wentian": return <WentianPage />;
      case "diary": return <DiaryPage />;
      case "profile": return <ProfilePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh", background: "#0d0500", display: "flex", flexDirection: "column", fontFamily: "'Noto Serif SC', serif", overflow: "hidden" }}>
      {/* Splash screen */}
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={featurePage ?? bottomTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ minHeight: "100%" }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      {!featurePage && (
        <div style={{ background: "rgba(10,5,0,0.97)", borderTop: "1px solid rgba(201,168,76,0.2)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          {navItems.map((item) => {
            const isActive = bottomTab === item.id;
            const isCenter = item.id === "wentian";
            return (
              <motion.button
                key={item.id}
                onClick={() => setBottomTab(item.id)}
                whileTap={{ scale: 0.9 }}
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isCenter ? "6px 0 8px" : "10px 0 8px", gap: "3px", color: isActive ? "#c9a84c" : "#6a5040", position: "relative" }}
              >
                {isCenter ? (
                  <motion.div
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ width: "44px", height: "44px", borderRadius: "50%", background: isActive ? "linear-gradient(135deg, #8b4513, #c9a84c)" : "linear-gradient(135deg, #3a1a00, #5c2d0a)", border: `2px solid ${isActive ? "#f0d080" : "rgba(201,168,76,0.4)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: isActive ? "#f0d080" : "#8b6914", boxShadow: isActive ? "0 0 15px rgba(201,168,76,0.4)" : "none", marginTop: "-14px" }}
                  >
                    {item.icon}
                  </motion.div>
                ) : (
                  <div style={{ color: isActive ? "#c9a84c" : "#6a5040" }}>{item.icon}</div>
                )}
                <span style={{ fontSize: "10px", fontFamily: "'Noto Serif SC', serif" }}>{item.label}</span>
                {isActive && !isCenter && (
                  <motion.div
                    layoutId="tab-indicator"
                    style={{ position: "absolute", bottom: "2px", width: "4px", height: "4px", borderRadius: "50%", background: "#c9a84c" }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
