export const TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export const DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

export const TIAN_GAN_WUXING = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
export const DI_ZHI_WUXING = ["水", "土", "木", "木", "土", "火", "火", "土", "金", "金", "土", "水"];

export const TIAN_GAN_YINYANG = ["阳", "阴", "阳", "阴", "阳", "阴", "阳", "阴", "阳", "阴"];
export const DI_ZHI_YINYANG = ["阳", "阴", "阳", "阴", "阳", "阴", "阳", "阴", "阳", "阴", "阳", "阴"];

export const WUXING_COLORS: Record<string, string> = {
  木: "#60a860",
  火: "#e05040",
  土: "#c89050",
  金: "#c0c060",
  水: "#4080c0",
};

export const WUXING_BG: Record<string, string> = {
  木: "rgba(96,168,96,0.15)",
  火: "rgba(224,80,64,0.15)",
  土: "rgba(200,144,80,0.15)",
  金: "rgba(192,192,96,0.15)",
  水: "rgba(64,128,192,0.15)",
};

export const SHICHEN = [
  "子时 (23:00-01:00)",
  "丑时 (01:00-03:00)",
  "寅时 (03:00-05:00)",
  "卯时 (05:00-07:00)",
  "辰时 (07:00-09:00)",
  "巳时 (09:00-11:00)",
  "午时 (11:00-13:00)",
  "未时 (13:00-15:00)",
  "申时 (15:00-17:00)",
  "酉时 (17:00-19:00)",
  "戌时 (19:00-21:00)",
  "亥时 (21:00-23:00)",
];

export interface Pillar {
  gan: string;
  zhi: string;
  ganIdx: number;
  zhiIdx: number;
  ganWuxing: string;
  zhiWuxing: string;
  ganYinYang: string;
  zhiYinYang: string;
  label: string;
}

export interface BaziResult {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  wuxingCount: Record<string, number>;
  dayMaster: string;
  dayMasterWuxing: string;
  personality: string;
  advice: string;
  strong: string[];
  weak: string[];
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function getJulianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function makePillar(ganIdx: number, zhiIdx: number, label: string): Pillar {
  return {
    gan: TIAN_GAN[ganIdx],
    zhi: DI_ZHI[zhiIdx],
    ganIdx,
    zhiIdx,
    ganWuxing: TIAN_GAN_WUXING[ganIdx],
    zhiWuxing: DI_ZHI_WUXING[zhiIdx],
    ganYinYang: TIAN_GAN_YINYANG[ganIdx],
    zhiYinYang: DI_ZHI_YINYANG[zhiIdx],
    label,
  };
}

const DAY_MASTER_DESC: Record<string, { personality: string; advice: string }> = {
  甲: { personality: "甲木日主，性格正直刚强，富有进取精神，如参天古木，挺拔向上。做事有原则，有领导力，但有时固执己见。", advice: "宜培养灵活变通之心，与水相生，遇火则发光发热，事业可大展宏图。" },
  乙: { personality: "乙木日主，性格柔和细腻，适应能力强，如藤蔓依附而生。善于交际，有艺术天赋，重感情，但有时优柔寡断。", advice: "宜借助贵人之力，以柔克刚，在稳定的环境中方能茁壮成长。" },
  丙: { personality: "丙火日主，性格热情开朗，光明磊落，如骄阳普照万物。做事积极主动，有感染力，但有时过于张扬。", advice: "宜收敛锋芒，以木养火，以土藏火，保持热情的同时注重内敛。" },
  丁: { personality: "丁火日主，性格温和细腻，内敛含蓄，如烛火给人温暖。有艺术气质，重情义，思维敏锐，但有时情绪波动较大。", advice: "宜保持内心平静，借木生火，以金制约，在细节中展现价值。" },
  戊: { personality: "戊土日主，性格稳重踏实，包容大度，如厚土承载万物。做事可靠，有责任感，值得信赖，但有时思维保守。", advice: "宜开拓眼界，借火生土，以木疏土，在稳健中寻求突破。" },
  己: { personality: "己土日主，性格温和谦逊，细致入微，如田土滋养生命。善于照顾他人，有亲和力，但有时缺乏主见。", advice: "宜建立自信，以火温土，以金收敛，在服务他人的同时不忘自我成长。" },
  庚: { personality: "庚金日主，性格刚毅果断，雷厉风行，如宝剑锋利。有执行力，重义气，直来直去，但有时过于强势。", advice: "宜磨砺心性，以土生金，以水润金，刚中带柔方能大成。" },
  辛: { personality: "辛金日主，性格精致敏锐，有审美品位，如美玉温润。善于观察，追求完美，有才华，但有时过于计较细节。", advice: "宜放宽心态，以土培金，以水流通，在精致中保持大局观。" },
  壬: { personality: "壬水日主，性格聪慧机敏，随机应变，如江河奔流不息。有智谋，视野开阔，思维活跃，但有时变化无常。", advice: "宜沉淀积累，以金生水，以木疏导，将聪明才智用于正途。" },
  癸: { personality: "癸水日主，性格深沉内敛，直觉敏锐，如雨露滋润万物。有神秘气质，感情细腻，有哲学思维，但有时多愁善感。", advice: "宜勇敢表达，以金养水，以木引流，将内在智慧展现于世。" },
};

export function calculateBazi(
  year: number,
  month: number,
  day: number,
  shichenIdx: number
): BaziResult {
  // Year pillar
  const yearGanIdx = mod(year - 4, 10);
  const yearZhiIdx = mod(year - 4, 12);

  // Month pillar
  // Branch: 1月=丑(1), 2月=寅(2), ... 12月=子(0)
  const monthZhiIdx = mod(month, 12);
  // Stem: depends on year stem group (甲己, 乙庚, 丙辛, 丁壬, 戊癸)
  const yearGanGroup = mod(yearGanIdx, 5);
  const monthGanBases = [2, 4, 6, 8, 0]; // 丙,戊,庚,壬,甲
  const monthGanIdx = mod(monthGanBases[yearGanGroup] + (month - 1), 10);

  // Day pillar
  const jd = getJulianDay(year, month, day);
  // Reference: JD 2451545 = 2000/1/1 = 甲申 (stem=0, branch=8)
  const dayGanIdx = mod(jd - 5, 10);   // verified: (2451545-5)%10 = 0 = 甲
  const dayZhiIdx = mod(jd + 3, 12);   // verified: (2451545+3)%12 = 8 = 申

  // Hour pillar
  const hourZhiIdx = shichenIdx; // 0=子,1=丑,...,11=亥 directly
  const dayGanGroup = mod(dayGanIdx, 5);
  const hourGanBases = [0, 2, 4, 6, 8]; // 甲,丙,戊,庚,壬
  const hourGanIdx = mod(hourGanBases[dayGanGroup] + shichenIdx, 10);

  const yearPillar = makePillar(yearGanIdx, yearZhiIdx, "年柱");
  const monthPillar = makePillar(monthGanIdx, monthZhiIdx, "月柱");
  const dayPillar = makePillar(dayGanIdx, dayZhiIdx, "日柱");
  const hourPillar = makePillar(hourGanIdx, hourZhiIdx, "时柱");

  // Five elements count
  const wuxingCount: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach((p) => {
    wuxingCount[p.ganWuxing]++;
    wuxingCount[p.zhiWuxing]++;
  });

  const sortedWuxing = Object.entries(wuxingCount).sort((a, b) => b[1] - a[1]);
  const strong = sortedWuxing.filter(([, v]) => v >= 2).map(([k]) => k);
  const weak = sortedWuxing.filter(([, v]) => v === 0).map(([k]) => k);

  const dayMaster = dayPillar.gan;
  const dayMasterWuxing = dayPillar.ganWuxing;
  const desc = DAY_MASTER_DESC[dayMaster] ?? {
    personality: "日主性格独特，具有深厚的内涵与潜力。",
    advice: "顺应五行之道，找寻生命的平衡与和谐。",
  };

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    wuxingCount,
    dayMaster,
    dayMasterWuxing,
    personality: desc.personality,
    advice: desc.advice,
    strong,
    weak,
  };
}
