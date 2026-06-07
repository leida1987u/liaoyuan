import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { saveToHistory } from "../utils/history";

interface MBTIPageProps {
  onBack: () => void;
}

const questions = [
  { id: 1, text: "在社交场合中，你更倾向于？", a: "积极主动与人交流，从中获得能量", b: "安静观察，独处时更能恢复精力", dim: "EI" },
  { id: 2, text: "处理信息时，你更喜欢？", a: "关注具体细节和实际经验", b: "探索抽象概念和未来可能性", dim: "SN" },
  { id: 3, text: "做决定时，你更倾向于？", a: "基于逻辑分析和客观标准", b: "考虑人的感受和价值观", dim: "TF" },
  { id: 4, text: "面对生活，你更偏好？", a: "有计划、有条理，提前安排", b: "随机应变，保持弹性", dim: "JP" },
  { id: 5, text: "在派对中，你通常会？", a: "与许多人交谈，享受热闹", b: "只与几个熟悉的人深聊", dim: "EI" },
  { id: 6, text: "你更信任？", a: "亲身经历和已知事实", b: "直觉和预感", dim: "SN" },
  { id: 7, text: "当朋友倾诉烦恼时，你更倾向于？", a: "提供实际的解决方案", b: "给予情感支持和共情", dim: "TF" },
  { id: 8, text: "出行旅游时，你更喜欢？", a: "提前详细规划行程", b: "边走边看，随意探索", dim: "JP" },
  { id: 9, text: "你更享受？", a: "团队合作，共同完成任务", b: "独立工作，自主安排", dim: "EI" },
  { id: 10, text: "学习新知识时，你更关注？", a: "实用性和可操作性", b: "理论背景和深层原理", dim: "SN" },
  { id: 11, text: "发生争吵时，你更容易？", a: "坚持自己的原则和逻辑", b: "顾及对方感受，寻求和谐", dim: "TF" },
  { id: 12, text: "面对截止日期，你通常？", a: "提前完成，避免最后时刻紧张", b: "在压力下发挥最好，习惯临时抱佛脚", dim: "JP" },
];

const mbtiTypes: Record<string, { name: string; desc: string; traits: string[]; famous: string; color: string; element: string }> = {
  INTJ: { name: "建筑师", desc: "富有想象力和战略性的思考者，一切皆在计划之中。", traits: ["战略思维", "独立自主", "追求卓越", "远见卓识"], famous: "尼古拉·特斯拉、斯蒂芬·霍金", color: "#4a6080", element: "风" },
  INTP: { name: "逻辑学家", desc: "创新的发明家，对知识有着强烈的渴望。", traits: ["分析能力强", "好奇心旺盛", "逻辑严密", "独立思考"], famous: "爱因斯坦、达芬奇", color: "#4a8060", element: "水" },
  ENTJ: { name: "指挥官", desc: "大胆、富有想象力、意志坚强的领导者。", traits: ["天生领袖", "战略规划", "果断决策", "高效执行"], famous: "拿破仑、史蒂夫·乔布斯", color: "#804040", element: "火" },
  ENTP: { name: "辩论家", desc: "聪明好奇的思想家，不会放过任何智识挑战。", traits: ["创新思维", "辩论能力", "随机应变", "充满活力"], famous: "苏格拉底、本杰明·富兰克林", color: "#806040", element: "雷" },
  INFJ: { name: "提倡者", desc: "安静而神秘，但激励人心，充满理想主义。", traits: ["直觉敏锐", "理想主义", "有远见", "共情能力强"], famous: "甘地、马丁路德金", color: "#604080", element: "木" },
  INFP: { name: "调停者", desc: "诗意、善良、利他主义者，总是寻找善的一面。", traits: ["富有同情心", "创意丰富", "真实纯粹", "理想主义"], famous: "莎士比亚、海明威", color: "#408060", element: "草" },
  ENFJ: { name: "主人公", desc: "有魅力且鼓励人心的领导者，能感染他人。", traits: ["领导魅力", "善于沟通", "有责任感", "激励他人"], famous: "奥巴马、马丁路德金", color: "#804060", element: "阳" },
  ENFP: { name: "竞选者", desc: "热情、有创造力、社交能力强的自由精神。", traits: ["热情洋溢", "创意无限", "社交达人", "充满活力"], famous: "马克吐温、鲁迅", color: "#806020", element: "光" },
  ISTJ: { name: "物流师", desc: "务实、注重事实的个人，可靠性不容置疑。", traits: ["责任心强", "条理分明", "忠诚可靠", "注重细节"], famous: "华盛顿、安格拉·默克尔", color: "#405060", element: "土" },
  ISFJ: { name: "守卫者", desc: "非常专注且温暖的守护者，时刻准备保护所爱之人。", traits: ["体贴细心", "踏实可靠", "乐于助人", "传统稳重"], famous: "特蕾莎修女、比尔·盖茨", color: "#406040", element: "金" },
  ESTJ: { name: "总经理", desc: "出色的管理者，在管理事务或人员方面无与伦比。", traits: ["执行力强", "组织有序", "果断直接", "务实高效"], famous: "唐纳德·特朗普、弗兰克·辛纳特拉", color: "#604020", element: "石" },
  ESFJ: { name: "执政官", desc: "非常有爱心、善于交际、受人欢迎的人。", traits: ["热情友善", "体贴他人", "社交活跃", "有责任感"], famous: "泰勒斯威夫特、詹妮弗·洛佩兹", color: "#805040", element: "花" },
  ISTP: { name: "鉴赏家", desc: "大胆而务实的实验者，擅长使用各种工具。", traits: ["动手能力强", "冷静理性", "善于观察", "独立自主"], famous: "克林特·伊斯特伍德、布鲁斯·李", color: "#506040", element: "铁" },
  ISFP: { name: "探险家", desc: "灵活且迷人的艺术家，时刻准备探索和体验新事物。", traits: ["艺术气质", "随性自由", "感性丰富", "活在当下"], famous: "迈克尔·杰克逊、拉登·麦当娜", color: "#605080", element: "水" },
  ESTP: { name: "企业家", desc: "聪明、精力充沛、善于感知的人，真的很喜欢冒险。", traits: ["行动力强", "善于应变", "魅力十足", "享受冒险"], famous: "唐纳德·川普、欧内斯特·海明威", color: "#804020", element: "风" },
  ESFP: { name: "表演者", desc: "自发性、精力充沛、热情洋溢的表演者。", traits: ["外向活泼", "享受当下", "娱乐精神", "感染力强"], famous: "玛丽莲·梦露、利昂内尔·梅西", color: "#806040", element: "阳" },
};

export function MBTIPage({ onBack }: MBTIPageProps) {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({ EI: 0, SN: 0, TF: 0, JP: 0 });
  const [direction, setDirection] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<"a" | "b" | null>(null);

  const handleAnswer = (choice: "a" | "b") => {
    if (selectedAnswer) return;
    setSelectedAnswer(choice);
    const q = questions[currentQ];
    const dim = q.dim;
    const newAnswers = { ...answers };
    if (choice === "a") {
      newAnswers[dim] = (newAnswers[dim] || 0) + 1;
    } else {
      newAnswers[dim] = (newAnswers[dim] || 0) - 1;
    }
    setAnswers(newAnswers);

    setTimeout(() => {
      setSelectedAnswer(null);
      setDirection(1);
      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1);
      } else {
        setPhase("result");
        const e2 = newAnswers.EI >= 0 ? "E" : "I";
        const s2 = newAnswers.SN >= 0 ? "S" : "N";
        const t2 = newAnswers.TF >= 0 ? "T" : "F";
        const j2 = newAnswers.JP >= 0 ? "J" : "P";
        const mbtiType = `${e2}${s2}${t2}${j2}`;
        saveToHistory({
          type: "mbti",
          title: `人格MBTI · ${mbtiType}`,
          summary: mbtiType,
          icon: "◈",
        });
      }
    }, 600);
  };

  const getMBTI = () => {
    const e = answers.EI >= 0 ? "E" : "I";
    const s = answers.SN >= 0 ? "S" : "N";
    const t = answers.TF >= 0 ? "T" : "F";
    const j = answers.JP >= 0 ? "J" : "P";
    return `${e}${s}${t}${j}`;
  };

  const reset = () => {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers({ EI: 0, SN: 0, TF: 0, JP: 0 });
    setSelectedAnswer(null);
  };

  const mbtiResult = getMBTI();
  const typeInfo = mbtiTypes[mbtiResult];
  const progress = ((currentQ) / questions.length) * 100;

  return (
    <div style={{ background: "linear-gradient(180deg, #0d0500 0%, #1a0a00 100%)", minHeight: "100%", fontFamily: "'Noto Serif SC', serif", color: "#e8d5a3" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px 16px 0", gap: "12px" }}>
        <motion.button onClick={phase === "quiz" ? () => { setPhase("intro"); setCurrentQ(0); setAnswers({ EI: 0, SN: 0, TF: 0, JP: 0 }); } : onBack} whileTap={{ scale: 0.9 }} style={{ background: "none", border: "none", color: "#c9a84c", fontSize: "20px", cursor: "pointer", padding: "4px" }}>
          ‹
        </motion.button>
        <div>
          <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "20px", color: "#f0d080" }}>人格MBTI</div>
          <div style={{ fontSize: "10px", color: "#a08060" }}>看懂自我，理解他人</div>
        </div>
        {phase === "quiz" && (
          <div style={{ marginLeft: "auto", fontSize: "12px", color: "#a08060" }}>
            {currentQ + 1} / {questions.length}
          </div>
        )}
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "24px" }}>
              {[["E", "外向"], ["I", "内向"], ["S", "感觉"], ["N", "直觉"], ["T", "思考"], ["F", "情感"], ["J", "判断"], ["P", "知觉"]].map(([letter, name]) => (
                <div key={letter} style={{
                  background: "rgba(30,16,4,0.8)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: "8px",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(201,168,76,0.15)",
                    border: "1px solid rgba(201,168,76,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    color: "#f0d080",
                    fontFamily: "'Ma Shan Zheng', serif",
                  }}>
                    {letter}
                  </div>
                  <span style={{ fontSize: "12px", color: "#e8d5a3" }}>{name}</span>
                </div>
              ))}
            </div>
            <p style={{ color: "#a08060", fontSize: "12px", lineHeight: 2, marginBottom: "24px" }}>
              共 {questions.length} 道题目，约需 3 分钟<br />
              请根据第一反应作答，无对错之分
            </p>
            <motion.button
              onClick={() => setPhase("quiz")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #2c4a3e, #3a6050)",
                border: "1px solid rgba(96,192,144,0.4)",
                borderRadius: "10px",
                color: "#a0e0c0",
                fontSize: "16px",
                cursor: "pointer",
                fontFamily: "'Noto Serif SC', serif",
                letterSpacing: "4px",
              }}
            >
              开始测试
            </motion.button>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: "0 16px" }}
          >
            {/* Progress */}
            <div style={{ height: "3px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", marginBottom: "24px", overflow: "hidden" }}>
              <motion.div
                animate={{ width: `${((currentQ) / questions.length) * 100}%` }}
                style={{ height: "100%", background: "linear-gradient(to right, #2c4a3e, #60c090)", borderRadius: "2px" }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 30 * direction }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 * direction }}
                transition={{ duration: 0.25 }}
              >
                {/* Dimension indicator */}
                <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                  {["EI", "SN", "TF", "JP"].map((dim) => (
                    <div
                      key={dim}
                      style={{
                        flex: 1,
                        height: "3px",
                        borderRadius: "2px",
                        background: dim === questions[currentQ].dim ? "#60c090" : "rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "16px" }}>
                  {questions[currentQ].dim === "EI" ? "能量维度" : questions[currentQ].dim === "SN" ? "信息维度" : questions[currentQ].dim === "TF" ? "决策维度" : "生活方式"}
                </div>

                <div style={{
                  background: "rgba(30,16,4,0.8)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "20px",
                }}>
                  <p style={{ fontSize: "16px", color: "#f0d080", lineHeight: 1.7, margin: 0 }}>
                    {questions[currentQ].text}
                  </p>
                </div>

                {(["a", "b"] as const).map((choice) => (
                  <motion.button
                    key={choice}
                    onClick={() => handleAnswer(choice)}
                    whileHover={{ scale: selectedAnswer ? 1 : 1.02, x: selectedAnswer ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: selectedAnswer === choice
                        ? "linear-gradient(135deg, #2c4a3e, #3a6050)"
                        : "rgba(30,16,4,0.8)",
                      border: `1px solid ${selectedAnswer === choice ? "rgba(96,192,144,0.6)" : "rgba(201,168,76,0.2)"}`,
                      borderRadius: "10px",
                      color: selectedAnswer === choice ? "#a0e0c0" : "#e8d5a3",
                      fontSize: "13px",
                      cursor: "pointer",
                      fontFamily: "'Noto Serif SC', serif",
                      textAlign: "left",
                      lineHeight: 1.6,
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{
                      minWidth: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      border: `1px solid ${selectedAnswer === choice ? "#60c090" : "rgba(201,168,76,0.4)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      color: selectedAnswer === choice ? "#60c090" : "#a08060",
                      flexShrink: 0,
                    }}>
                      {choice.toUpperCase()}
                    </span>
                    {questions[currentQ][choice]}
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "result" && typeInfo && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: "0 16px 24px" }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              style={{
                textAlign: "center",
                background: `linear-gradient(145deg, ${typeInfo.color}30, rgba(13,5,0,0.95))`,
                border: `1px solid ${typeInfo.color}60`,
                borderRadius: "16px",
                padding: "28px 20px",
                marginBottom: "16px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                fontSize: "100px",
                color: typeInfo.color,
                opacity: 0.05,
                fontFamily: "'Ma Shan Zheng', serif",
              }}>
                {typeInfo.element}
              </div>

              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ fontSize: "11px", color: "#a08060", letterSpacing: "3px", marginBottom: "8px" }}
              >
                你的人格类型
              </motion.div>

              <div style={{
                fontSize: "48px",
                color: "#f0d080",
                fontFamily: "'Ma Shan Zheng', serif",
                letterSpacing: "8px",
                marginBottom: "8px",
                textShadow: `0 0 20px ${typeInfo.color}`,
              }}>
                {mbtiResult}
              </div>

              <div style={{ fontSize: "18px", color: typeInfo.color, marginBottom: "12px" }}>{typeInfo.name}</div>

              <p style={{ fontSize: "13px", color: "#e8d5a3", lineHeight: 1.8, margin: "0 0 16px" }}>{typeInfo.desc}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                {typeInfo.traits.map((t) => (
                  <span key={t} style={{
                    padding: "4px 12px",
                    background: `${typeInfo.color}20`,
                    border: `1px solid ${typeInfo.color}40`,
                    borderRadius: "12px",
                    fontSize: "11px",
                    color: typeInfo.color,
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Dimension bars */}
            <div style={{
              background: "rgba(30,16,4,0.8)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
            }}>
              <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "14px" }}>各维度分析</div>
              {[
                { dim: "EI", left: "外向 E", right: "内向 I", val: answers.EI },
                { dim: "SN", left: "感觉 S", right: "直觉 N", val: answers.SN },
                { dim: "TF", left: "思考 T", right: "情感 F", val: answers.TF },
                { dim: "JP", left: "判断 J", right: "知觉 P", val: answers.JP },
              ].map((item) => {
                const pct = 50 + (item.val / 3) * 50;
                const clamped = Math.max(5, Math.min(95, pct));
                return (
                  <div key={item.dim} style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#a08060", marginBottom: "4px" }}>
                      <span>{item.left}</span>
                      <span>{item.right}</span>
                    </div>
                    <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", position: "relative" }}>
                      <motion.div
                        initial={{ width: "50%" }}
                        animate={{ width: `${clamped}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        style={{
                          height: "100%",
                          background: `linear-gradient(to right, ${typeInfo.color}80, ${typeInfo.color})`,
                          borderRadius: "3px",
                        }}
                      />
                      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translateY(-50%)", width: "1px", height: "10px", background: "rgba(255,255,255,0.3)" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              background: "rgba(30,16,4,0.8)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
            }}>
              <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "8px" }}>同类型名人</div>
              <p style={{ fontSize: "13px", color: "#e8d5a3", lineHeight: 1.8, margin: 0 }}>{typeInfo.famous}</p>
            </div>

            <motion.button
              onClick={reset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #2c4a3e, #3a6050)",
                border: "1px solid rgba(96,192,144,0.4)",
                borderRadius: "10px",
                color: "#a0e0c0",
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "'Noto Serif SC', serif",
                letterSpacing: "2px",
              }}
            >
              重新测试
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
