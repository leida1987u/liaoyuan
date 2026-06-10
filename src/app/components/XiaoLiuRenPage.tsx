import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { saveToHistory } from "../utils/history";

interface XiaoLiuRenPageProps {
  onBack: () => void;
}

type Category = "综合" | "感情" | "事业" | "财运" | "健康" | "出行";

const CATEGORIES: Category[] = ["综合", "感情", "事业", "财运", "健康", "出行"];

const SIX_GODS = [
  {
    name: "大安",
    symbol: "安",
    nature: "大吉",
    color: "#60c080",
    jue: "大安值日事皆吉，求谋大吉百无失。\n行人在途出未至，病者安康庭无疾。",
    general: "大安者，吉星高照，万事顺遂。此神主静、主稳，凡遇此神，心神安定，诸事皆有善缘相助。无论求财问事，皆可放心前行，贵人自然相随。",
    categories: {
      综合: "今日运势极佳，诸事顺遂，心想事成。大安神降临，犹如春风化雨，万物滋生。宜主动出击，把握机缘，所谋之事皆可成就。",
      感情: "感情和顺，如意美满。已有伴侣者双方关系稳固，心意相通，相处和谐；单身者近期桃花缘旺，良缘将至，宜主动把握。切忌犹豫不决，错失良机。",
      事业: "事业稳定发展，所谋皆顺，上司赏识，同事协力，贵人相助。可放心推进重要计划，合同谈判、晋升申请皆宜，正是大展宏图之时。",
      财运: "财运平稳中带旺，收入正常，有意外小财入账。投资方面宜稳健为主，长期持有胜过短期投机。合作项目有利可图，账款可顺利回收。",
      健康: "身体康健，精力充沛，气色佳，精神旺。原有旧疾有所缓解，手术或就医者预后良好。注意作息规律，保持积极心态，健康状态持续向好。",
      出行: "行程顺利，所到之处平安无事，旅途愉快无阻碍。远行者有贵人相助，顺风顺水。适合商务出行、旅游观光，均有好收获。",
    },
    advice: "宜：主动行事、签约谈判、拜访贵人、开业动土。忌：无",
  },
  {
    name: "留连",
    symbol: "留",
    nature: "凶",
    color: "#e06060",
    jue: "留连事难明，凡谋未必成。\n行人迟迟至，病患更缠身。",
    general: "留连者，事多拖延，进退两难，心中郁闷。此神主迟滞，所谋之事难以速成，宜守不宜攻，静待时机转变。耐心是此时最大的美德，强行则多生枝节。",
    categories: {
      综合: "今日运势迟滞，凡事难以顺利推进，心中郁闷难解。宜守不宜攻，暂缓重要决策，静待时机转机。放慢脚步，内省自我，方能厚积薄发。",
      感情: "感情拖延不定，关系进展迟缓，心意难以传达。已有伴侣者可能出现冷战或沟通不畅；单身者缘分未至，切勿强求，强扭的瓜不甜。",
      事业: "事业推进迟缓，计划受阻，工作事项拖延难决。宜耐心等待，暂缓重要决策，此时轻举妄动反生变故。整理已有工作成果，蓄力待发。",
      财运: "财运低迷，资金周转不畅，收入不稳定。债款难以催收，投资暂时被套，不宜此时新增投资。守财为上，控制不必要开支，静待财运好转。",
      健康: "身体易感疲乏倦怠，慢性疾病可能反复。注意休养生息，减少不必要的消耗，避免剧烈运动。旧病患者需按时复诊，不可掉以轻心。",
      出行: "出行不顺，交通易遭延误，途中多有不便。如非紧急要事，建议暂缓出行计划。若必须出行，做好充分准备，预留充裕时间。",
    },
    advice: "宜：静守、内省、休养。忌：签约、大额投资、冒进行事、远行",
  },
  {
    name: "速喜",
    symbol: "喜",
    nature: "吉",
    color: "#c9a84c",
    jue: "速喜喜来临，求谋事事成。\n行人立便至，病者无危险。",
    general: "速喜者，好消息将至，喜事临门，时机稍纵即逝。此神主速，宜迅速行动，把握机缘。凡所谋之事宜速不宜迟，犹豫拖延则错失良机，行动果断方见喜报。",
    categories: {
      综合: "今日喜气盈门，好事将临！遇速喜神，凡事宜速决速行，机不可失，时不再来。积极主动迎接各种可能，喜讯将在不经意间降临。",
      感情: "喜讯将至，桃花运旺！单身者极有可能迎来心仪对象，且对方会主动示好；已有伴侣者感情升温，有求婚、订婚或喜事临近。把握时机，勇敢表达。",
      事业: "职场好消息快至，升迁、加薪、合同签订均有望近期落实。把握时机主动出击，上司欣赏，机会难得。洽谈中的项目可望尽快敲定，宜速决。",
      财运: "意外之财将至，可能来自意想不到的渠道。投资有较快回报，生意谈判顺利收场，财运上扬。此时适合推进财务相关事宜，速战速决。",
      健康: "精神振奋，活力充足，状态良好。久病者有望近期出现好转，术后恢复顺利。心情愉悦，免疫力增强，积极向好的变化正在发生。",
      出行: "出行顺畅平安，途中带来好消息，适合商旅出行、探亲访友。行程顺利，且有意外惊喜等待。宜速行，拖延则喜事减损。",
    },
    advice: "宜：速战速决、表白示好、签约推进、商务出行。忌：犹豫观望",
  },
  {
    name: "赤口",
    symbol: "口",
    nature: "凶",
    color: "#e08040",
    jue: "赤口主口舌，官非切要防。\n失物急寻觅，病者实堪忧。",
    general: "赤口者，口舌是非之神，争讼纠纷多发。此神降临，言多必失，是非纷扰。凡事宜沉默低调，三思而后言，避免与人争执，远离是非之地，以和为贵。",
    categories: {
      综合: "今日是非口舌之气较重，凡事需谨言慎行。遭遇赤口，情绪易激动，人际摩擦多。保持低调，避免主动挑起争执，冷静处理各类纠纷。",
      感情: "感情易起口角是非，言语不当引发争执。已有伴侣者需控制情绪，避免语言伤害；暧昧期者慎防误解，宜以书面沟通代替言语争辩。",
      事业: "小人之气旺，防同事背后议论，谨防合同纠纷。此时不宜签订重要协议，避免在公开场合发表争议性意见。低调行事，静待是非平息。",
      财运: "谨防财务纠纷与欺诈，不宜借贷担保。投机冒险必亏，合同条款细看再签，防止对方钻空子。债务纠纷宜协商解决，避免对簿公堂。",
      健康: "注意口腔、咽喉及肠胃健康，避免暴饮暴食辛辣刺激。情绪激动易引发血压波动，保持平和心态最为重要。慢性炎症需及时就医。",
      出行: "出行途中言行需谨慎，防口舌是非，避免与司机或陌生人起争执。证件证照备齐，防止因细节引发麻烦。",
    },
    advice: "宜：沉默低调、书面沟通、和平处事。忌：签约、争论、借贷、口头承诺",
  },
  {
    name: "小吉",
    symbol: "吉",
    nature: "中吉",
    color: "#80c0a0",
    jue: "小吉祥最好，学问来相报。\n行人音信至，病者无大危。",
    general: "小吉者，小有所得，渐入佳境，虽非大吉但胜在平稳。此神主渐进，细水长流，积少成多。凡事稳扎稳打，不求一步登天，脚踏实地方得长久之利。",
    categories: {
      综合: "今日运势平稳向好，小有收获，渐入佳境。小吉当前，虽无大喜临门，却有细水长流之吉。稳步前行，积累实力，好运正在路上。",
      感情: "感情渐入佳境，双方了解加深，感情升温中。虽无轰轰烈烈，但细水长流更见真情。宜主动表达心意，对方感受得到你的诚意，缘分日益深厚。",
      事业: "工作有小成，稳步推进，虽无大突破但积累渐丰。坚持即是胜利，现阶段的付出会在未来开花结果。适合学习提升、积累经验，为大发展做准备。",
      财运: "有小财入账，虽不丰厚但稳定可期。积少成多，理财有道，细水长流胜过一蹴而就。适合定期储蓄或稳健理财产品，避免急功近利。",
      健康: "健康状况良好，有小病小痛也无大碍，注意保养身体。规律作息，适量运动，细心调理，健康持续向好。细小毛病及时处理，防患于未然。",
      出行: "出行有小惊喜，途中遇贵人或得到有用信息。旅程顺利，适合近郊出行或探访友人，有小收获在等待。",
    },
    advice: "宜：稳步推进、学习积累、小额投资。忌：急功近利、冒险投机",
  },
  {
    name: "空亡",
    symbol: "空",
    nature: "大凶",
    color: "#8080a0",
    jue: "空亡事不成，运气不来临。\n行人音信少，病者真堪忧。",
    general: "空亡者，天机落空，诸事难成，运气低迷。此神主虚，所谋皆空，强行则费力不讨好。此时宜退守自省，厚积薄发，等待时机转机。逆境正是修炼内心之时。",
    categories: {
      综合: "今日运势低迷，遇空亡之神，凡事难以如愿，所谋皆落空。宜全面收缩，暂停一切重要行动，转而反思自省、整理思路，蓄力待时机来临。",
      感情: "感情空有期望，缘分未到难强求。追求中的对方无回应，已有感情出现空虚感。此时勿强行推进，转而提升自我，静待有缘之人主动出现。",
      事业: "谋事难成，计划落空，努力付出可能得不到应有回报。宜暂停重大决策，专注梳理已有工作，厚积薄发。此时积累的内功，日后终将有用。",
      财运: "财运极低迷，投资有亏损风险，债款难以回收。守财为上，避免大额支出和新的投资行为。以守代攻，等待财运好转的时机。",
      健康: "精神状态欠佳，易感虚弱疲惫，免疫力下降。注意心理健康，避免钻牛角尖。充足休息，清淡饮食，坚持适量运动提振精气神。",
      出行: "出行无益，外出易扑空，人不在或目的落空。建议暂缓出行，处理好手头积累的事务，时机到来再出发事半功倍。",
    },
    advice: "宜：静守、反省、休养生息、读书学习。忌：签约、出行、借贷、一切重要行动",
  },
];

const MONTHS = ["正月","二月","三月","四月","五月","六月","七月","八月","九月","十月","冬月","腊月"];
const DAYS = ["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"];
const HOURS = ["子时(23-1)","丑时(1-3)","寅时(3-5)","卯时(5-7)","辰时(7-9)","巳时(9-11)","午时(11-13)","未时(13-15)","申时(15-17)","酉时(17-19)","戌时(19-21)","亥时(21-23)"];

function WheelPicker({ items, selectedIndex, onSelect, label }: { items: string[]; selectedIndex: number; onSelect: (i: number) => void; label: string }) {
  const itemHeight = 36;
  const visibleCount = 5;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ textAlign: "center", fontSize: "11px", color: "#a08060", marginBottom: "6px" }}>{label}</div>
      <div style={{ height: `${visibleCount * itemHeight}px`, overflow: "hidden", position: "relative", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "8px", background: "rgba(13,5,0,0.8)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to bottom, rgba(13,5,0,0.9), transparent)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to top, rgba(13,5,0,0.9), transparent)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: `${Math.floor(visibleCount / 2) * itemHeight}px`, left: 0, right: 0, height: `${itemHeight}px`, border: "1px solid rgba(201,168,76,0.4)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ transform: `translateY(${(Math.floor(visibleCount / 2) - selectedIndex) * itemHeight}px)`, transition: "transform 0.3s cubic-bezier(0.2, 1, 0.3, 1)" }}>
          {items.map((item, i) => (
            <div key={i} onClick={() => onSelect(i)} style={{ height: `${itemHeight}px`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: i === selectedIndex ? "13px" : "11px", color: i === selectedIndex ? "#f0d080" : "#6a5040", cursor: "pointer", transition: "all 0.2s", padding: "0 2px", textAlign: "center" }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SixGodWheel({ activeIndex, spinning }: { activeIndex: number | null; spinning: boolean }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r + 18} fill="rgba(30,16,4,0.8)" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r - 12} fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
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
        const lx = cx + r * 0.65 * Math.cos(midAngle);
        const ly = cy + r * 0.65 * Math.sin(midAngle);
        return (
          <g key={i}>
            <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`} fill={isActive ? `${god.color}35` : "transparent"} stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
            <text x={lx} y={ly + 5} textAnchor="middle" fill={isActive ? god.color : "#a08060"} style={{ fontSize: "14px", fontFamily: "'Ma Shan Zheng', serif" }}>{god.symbol}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={24} fill="rgba(13,5,0,0.95)" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill="#c9a84c" style={{ fontSize: "13px", fontFamily: "'Ma Shan Zheng', serif" }}>
        {spinning ? "卜" : activeIndex !== null ? SIX_GODS[activeIndex].name[0] : "六"}
      </text>
    </svg>
  );
}

export function XiaoLiuRenPage({ onBack }: XiaoLiuRenPageProps) {
  const [monthIdx, setMonthIdx] = useState(new Date().getMonth());
  const [dayIdx, setDayIdx] = useState(new Date().getDate() - 1);
  const [hourIdx, setHourIdx] = useState(() => {
    const h = new Date().getHours();
    if (h >= 23 || h < 1) return 0;
    return Math.floor((h - 1) / 2) + 1;
  });
  const [result, setResult] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("综合");
  const [showJue, setShowJue] = useState(false);

  const calculate = () => {
    setSpinning(true);
    setResult(null);
    setShowJue(false);
    setTimeout(() => {
      const val = ((monthIdx + 1) + (dayIdx + 1) + (hourIdx + 1)) % 6;
      setResult(val);
      setSpinning(false);
      const god = SIX_GODS[val];
      saveToHistory({
        type: "xiaoliuren",
        title: `小六壬 · ${god.name}`,
        summary: `${god.nature} — ${god.general.slice(0, 25)}…`,
        icon: god.symbol,
      });
    }, 1400);
  };

  const god = result !== null ? SIX_GODS[result] : null;

  return (
    <div style={{ background: "linear-gradient(180deg, #0d0500 0%, #1a0a00 100%)", minHeight: "100%", fontFamily: "'Noto Serif SC', serif", color: "#e8d5a3" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "16px 16px 0", gap: "12px" }}>
        <motion.button onClick={onBack} whileTap={{ scale: 0.9 }} style={{ background: "none", border: "none", color: "#c9a84c", fontSize: "20px", cursor: "pointer", padding: "4px" }}>‹</motion.button>
        <div>
          <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "20px", color: "#f0d080" }}>小六壬</div>
          <div style={{ fontSize: "10px", color: "#a08060" }}>掌中乾坤 · 古法断吉凶</div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #c9a84c40, transparent)", margin: "12px 0" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
        <motion.div animate={spinning ? { rotate: [0, 30, -30, 20, -20, 0] } : {}} transition={{ duration: 1.4, ease: "easeOut" }}>
          <SixGodWheel activeIndex={result} spinning={spinning} />
        </motion.div>
      </div>

      {/* Category selector */}
      <div style={{ padding: "0 16px", marginBottom: "14px" }}>
        <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "8px", textAlign: "center" }}>选择占问类型</div>
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
          {CATEGORIES.map((cat) => (
            <motion.button key={cat} onClick={() => setActiveCategory(cat)} whileTap={{ scale: 0.95 }} style={{
              flexShrink: 0, padding: "6px 14px",
              background: activeCategory === cat ? "rgba(201,168,76,0.2)" : "rgba(30,16,4,0.6)",
              border: `1px solid ${activeCategory === cat ? "#c9a84c" : "rgba(201,168,76,0.2)"}`,
              borderRadius: "20px", color: activeCategory === cat ? "#f0d080" : "#a08060",
              fontSize: "12px", cursor: "pointer", fontFamily: "'Noto Serif SC', serif",
            }}>
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Time Pickers */}
      <div style={{ padding: "0 16px", marginBottom: "14px" }}>
        <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "8px", textAlign: "center" }}>以占卜时的月、日、时起卦</div>
        <div style={{ display: "flex", gap: "6px" }}>
          <WheelPicker items={MONTHS} selectedIndex={monthIdx} onSelect={setMonthIdx} label="月" />
          <WheelPicker items={DAYS} selectedIndex={dayIdx} onSelect={setDayIdx} label="日" />
          <WheelPicker items={HOURS} selectedIndex={hourIdx} onSelect={setHourIdx} label="时" />
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <motion.button onClick={calculate} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={spinning} style={{
          width: "100%", padding: "14px",
          background: spinning ? "rgba(92,45,10,0.5)" : "linear-gradient(135deg, #5c2d0a, #8b4513)",
          border: "1px solid rgba(201,168,76,0.5)", borderRadius: "10px", color: "#f0d080",
          fontSize: "16px", cursor: spinning ? "not-allowed" : "pointer",
          fontFamily: "'Noto Serif SC', serif", letterSpacing: "4px", marginBottom: "16px",
        }}>
          {spinning ? "推算中…" : "起卦推断"}
        </motion.button>
      </div>

      <AnimatePresence>
        {god && !spinning && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "0 16px 32px" }}>
            {/* God header card */}
            <div style={{
              background: "linear-gradient(145deg, rgba(30,16,4,0.95), rgba(45,25,8,0.95))",
              border: `1px solid ${god.color}60`, borderRadius: "14px", padding: "20px",
              marginBottom: "12px", boxShadow: `0 0 30px ${god.color}15`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "14px" }}>
                <motion.div
                  animate={{ boxShadow: [`0 0 10px ${god.color}40`, `0 0 25px ${god.color}80`, `0 0 10px ${god.color}40`] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: "58px", height: "58px", borderRadius: "50%",
                    background: `${god.color}20`, border: `2px solid ${god.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "26px", fontFamily: "'Ma Shan Zheng', serif", color: god.color, flexShrink: 0,
                  }}
                >
                  {god.symbol}
                </motion.div>
                <div>
                  <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "24px", color: god.color }}>{god.name}</div>
                  <span style={{
                    display: "inline-block", marginTop: "4px", padding: "2px 10px",
                    background: `${god.color}20`, border: `1px solid ${god.color}`,
                    borderRadius: "12px", fontSize: "11px", color: god.color,
                  }}>
                    {god.nature === "大吉" ? "✦ 大吉" : god.nature === "吉" ? "✦ 吉神" : god.nature === "中吉" ? "◈ 中吉" : god.nature === "大凶" ? "✧ 大凶" : "✧ 凶神"}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#e8d5a3", lineHeight: 1.9, margin: 0 }}>{god.general}</p>
            </div>

            {/* Category reading */}
            <div style={{
              background: "rgba(30,16,4,0.85)", border: `1px solid ${god.color}40`,
              borderRadius: "12px", padding: "16px", marginBottom: "12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "11px", color: "#a08060" }}>{activeCategory === "综合" ? "综合解读" : `${activeCategory}运势`}</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(201,168,76,0.2)" }} />
              </div>
              <p style={{ fontSize: "13px", color: "#e8d5a3", lineHeight: 2, margin: 0 }}>{god.categories[activeCategory]}</p>
            </div>

            {/* Action advice */}
            <div style={{ background: "rgba(30,16,4,0.7)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "6px" }}>趋吉避凶</div>
              <p style={{ fontSize: "12px", color: "#c9a84c", lineHeight: 1.8, margin: 0 }}>{god.advice}</p>
            </div>

            {/* Classical verse */}
            <div style={{ background: "rgba(30,16,4,0.7)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
              <motion.button onClick={() => setShowJue(!showJue)} style={{ background: "none", border: "none", color: "#c9a84c", fontSize: "12px", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <span>古诀原文</span>
                <motion.span animate={{ rotate: showJue ? 180 : 0 }} style={{ display: "inline-block", fontSize: "10px" }}>▾</motion.span>
              </motion.button>
              <AnimatePresence>
                {showJue && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                    <div style={{ marginTop: "10px", padding: "10px", background: "rgba(201,168,76,0.05)", borderRadius: "8px", borderLeft: `2px solid ${god.color}` }}>
                      {god.jue.split("\n").map((line, i) => (
                        <p key={i} style={{ fontSize: "13px", color: "#c9a84c", fontFamily: "'Ma Shan Zheng', serif", letterSpacing: "2px", lineHeight: 2, margin: 0 }}>{line}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Six gods overview */}
            <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "8px", textAlign: "center" }}>六神总览</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "7px" }}>
              {SIX_GODS.map((g, i) => (
                <div key={i} style={{
                  background: i === result ? `${g.color}20` : "rgba(30,16,4,0.6)",
                  border: `1px solid ${i === result ? g.color : "rgba(201,168,76,0.12)"}`,
                  borderRadius: "8px", padding: "8px 6px", textAlign: "center",
                }}>
                  <div style={{ fontSize: "18px", color: g.color, fontFamily: "'Ma Shan Zheng', serif" }}>{g.symbol}</div>
                  <div style={{ fontSize: "11px", color: i === result ? g.color : "#a08060" }}>{g.name}</div>
                  <div style={{ fontSize: "9px", color: i === result ? `${g.color}cc` : "#6a5040", marginTop: "2px" }}>{g.nature}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
