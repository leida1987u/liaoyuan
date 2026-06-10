import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { saveToHistory } from "../utils/history";

interface HoroscopePageProps {
  onBack: () => void;
}

type ViewMode = "today" | "week" | "month";

const ZODIACS = [
  { name: "白羊座", symbol: "♈", dates: "3.21-4.19", element: "火象", planet: "火星", color: "#e05050", trait: "冲劲十足，勇于开拓" },
  { name: "金牛座", symbol: "♉", dates: "4.20-5.20", element: "土象", planet: "金星", color: "#80c060", trait: "踏实稳健，享受生活" },
  { name: "双子座", symbol: "♊", dates: "5.21-6.21", element: "风象", planet: "水星", color: "#c0c040", trait: "思维敏捷，适应力强" },
  { name: "巨蟹座", symbol: "♋", dates: "6.22-7.22", element: "水象", planet: "月亮", color: "#60a0c0", trait: "感性细腻，重视家庭" },
  { name: "狮子座", symbol: "♌", dates: "7.23-8.22", element: "火象", planet: "太阳", color: "#e09030", trait: "热情自信，魅力十足" },
  { name: "处女座", symbol: "♍", dates: "8.23-9.22", element: "土象", planet: "水星", color: "#80a060", trait: "细致完美，勤劳负责" },
  { name: "天秤座", symbol: "♎", dates: "9.23-10.23", element: "风象", planet: "金星", color: "#c08080", trait: "优雅公正，追求和谐" },
  { name: "天蝎座", symbol: "♏", dates: "10.24-11.22", element: "水象", planet: "冥王星", color: "#8040a0", trait: "深邃神秘，洞察力强" },
  { name: "射手座", symbol: "♐", dates: "11.23-12.21", element: "火象", planet: "木星", color: "#c07040", trait: "乐观豁达，追求自由" },
  { name: "摩羯座", symbol: "♑", dates: "12.22-1.19", element: "土象", planet: "土星", color: "#608080", trait: "稳重自律，目标明确" },
  { name: "水瓶座", symbol: "♒", dates: "1.20-2.18", element: "风象", planet: "天王星", color: "#4080c0", trait: "独立创新，前卫思维" },
  { name: "双鱼座", symbol: "♓", dates: "2.19-3.20", element: "水象", planet: "海王星", color: "#8060c0", trait: "浪漫敏感，富有直觉" },
];

// Rich readings per zodiac: [love, career, wealth, health] each with [high, low] variant
const ZODIAC_READINGS = [
  { // 白羊
    love: ["火星能量爆发，感情运势高涨。主动出击大有胜算，你的热情与直接反而最吸引人。已有伴侣者适合策划惊喜，点燃激情。", "感情上容易冲动，言语过激引发摩擦。需要给对方多一点空间，冷静倾听胜过争辩，退一步方见海阔天空。"],
    career: ["行动力爆表，工作上锐不可当！适合推进卡壳已久的项目，上司看到了你的拼劲，晋升机会近在眼前。", "急躁情绪影响工作质量，容易虎头蛇尾。放慢节奏，把细节做到位，稳健推进比冒进更有效。"],
    wealth: ["冲劲带来财运！适合主动争取新业务或投资机会，快进快出型操作有不错回报。", "冲动消费是这时期最大的财务陷阱。购物前多问自己三次是否真的需要，避免大额冲动支出。"],
    health: ["精力旺盛，状态极佳，是运动健身的好时机。挑战自己的极限，身体素质有显著提升。", "过度消耗体力，注意头部和面部的小毛病。适当减速，给身体充分的休息恢复时间。"],
  },
  { // 金牛
    love: ["金星庇佑，感情生活甜蜜稳定。和伴侣共享美食或居家时光，感情在日常细节中悄然升华。单身者在熟悉圈子里有缘分。", "感情上过于保守，不肯迈出第一步。对方其实在等你表态，适当打破固有模式，主动一次又何妨。"],
    career: ["稳扎稳打终见成效，长期耕耘的项目开始结出果实。财务和资源管理方面的才能得到认可。", "进展缓慢，容易陷入拖延困境。设定小目标分步完成，避免因完美主义迟迟不肯交付。"],
    wealth: ["财运稳健，固定收入有小幅增长。适合开立储蓄计划或购买稳健理财产品，守财胜过冒险。", "支出超预算，物质享受的欲望较强。重新审视消费清单，区分必需品与冲动购买。"],
    health: ["身体状态平稳，消化系统功能良好。注意颈肩部位的保养，久坐后记得伸展活动。", "容易贪食导致肠胃不适，咽喉和甲状腺需要关注。饮食规律，少吃高糖高脂食物。"],
  },
  { // 双子
    love: ["口才魅力大放光彩，话题丰富让你成为感情中最有趣的那个人。新认识的人中有潜在缘分，保持开放心态。", "心猿意马，感情容易分心。对方感受到你的不专注，踏实下来才能让感情稳定发展。"],
    career: ["思维活跃，创意层出不穷，适合头脑风暴和多线并行的工作。沟通谈判能力出众，适合出面协调重要事务。", "注意力分散，多项任务同时推进导致每项都不到位。学会取舍，专注在最重要的一两件事上。"],
    wealth: ["信息差带来财富机会，消息灵通让你先人一步。副业或兼职有额外收入，灵活操作可获小利。", "分散投资过多，精力不集中导致收益平平。收拢战线，深耕一两个方向比广撒网更有效。"],
    health: ["精神状态活跃，社交频繁带来好心情。注意手腕、肺部及呼吸系统的保养，避免过度消耗神经。", "神经紧绷，睡眠质量下降。减少屏幕时间，睡前冥想放松，给大脑充分的休息空间。"],
  },
  { // 巨蟹
    love: ["月亮满盈，感情运势最旺！你的温柔体贴让伴侣深深感动，此时表达爱意最易打动人心。家庭关系和谐美满。", "情绪敏感容易多想，小事也可能放大成矛盾。练习直接说出需求，而非期望对方猜测你的心意。"],
    career: ["直觉准确，对团队氛围的把握超强，是调解内部矛盾的最佳人选。照顾好团队情绪带来整体效率提升。", "情绪化影响专业判断，容易将个人好恶带入工作决策。建立客观的评估标准，减少情绪驱动的决定。"],
    wealth: ["家庭相关投资回报好，置业或家居改善带来价值提升。稳健存款有利于安全感的建立。", "因情感问题产生不理性消费，例如送礼或安慰性购物。理性分析每一笔支出的实际价值。"],
    health: ["情绪平和带来身体健康，胃肠功能良好。多喝水，注意胸腔和乳腺的定期检查。", "情绪低落影响免疫力，肠胃敏感可能出现问题。找信任的人倾诉，或写日记释放内心情绪。"],
  },
  { // 狮子
    love: ["太阳光芒普照，你的魅力值达到顶峰！周围人对你的追捧让感情运势大旺。大胆主动，爱情就在眼前。", "自我意识过强，容易忽视伴侣的感受。学会倾听和妥协，关系中两个人都需要发光的舞台。"],
    career: ["领导力全面爆发，团队以你为核心，是展示才华和抢占先机的黄金时期。主动承担重要任务必有回报。", "控制欲过强引起团队不满，独断决策容易失去人心。学会放权，让团队成员也能发挥价值。"],
    wealth: ["财运强劲，投资眼光准确，适合大胆布局。贵人在财务上给予重要支持，抓住机会合作共赢。", "大手大脚，排场消费损耗财富。虚荣心驱动的支出性价比极低，量入为出方能长久富足。"],
    health: ["活力十足，是挑战体能极限的好时机。心脏和背部需要重点保养，规律运动保持强壮体魄。", "过度消耗体力，心脏和脊椎承受压力。注意劳逸结合，不要用健康换取短期的亮眼表现。"],
  },
  { // 处女
    love: ["细腻体贴在感情中大放异彩，你注意到的小细节让伴侣倍感珍惜。坦诚表达内心感受，别让完美主义成为阻碍。", "过度挑剔让对方感到压力，总看到缺点而忽略对方的付出。练习接受不完美，感情需要包容。"],
    career: ["严谨细致带来工作上的突破，质量把控能力受到高度认可。此时适合主导需要精确度的重要项目。", "陷入细节无法自拔，反而拖慢整体进度。学会把握80分即可交付的时机，完成胜过完美。"],
    wealth: ["精细化管理财务带来显著积累，记账和规划的习惯让财务状况持续改善。分析投资标的时优势尽显。", "过于保守错失良机，害怕风险导致资金大量趴在账上。适当配置一部分资金于成长性资产。"],
    health: ["健康管理意识强，定期体检的习惯带来安心。肠胃和消化系统功能良好，继续保持健康生活方式。", "神经质式的健康焦虑反而伤身，轻微症状过度担忧加重心理负担。信任身体，学会放松。"],
  },
  { // 天秤
    love: ["金星加持，感情魅力四射！你的优雅和体贴让人心动，是表白和增进感情的绝佳时机。两性关系和谐融洽。", "优柔寡断让对方失去耐心，总是等对方做决定会让关系陷入僵局。鼓起勇气表明自己的立场。"],
    career: ["社交和协调能力大放光彩，是解决团队矛盾、推进合作的最佳人选。美学相关工作迎来高光时刻。", "避免冲突导致重要事项一再拖延，不愿意得罪人却让工作进度停滞。适时表达原则性立场。"],
    wealth: ["合作投资回报好，伴侣或朋友的财务支持带来惊喜。奢侈品和美的事物的消费让你感到满足。", "人情消费超支，难以拒绝别人的请求导致钱财外流。学会说不，为自己的财务边界划定清晰界限。"],
    health: ["皮肤状态极佳，容光焕发吸引目光。注意肾脏保养，多喝水，腰部拉伸减少久坐带来的不适。", "过于追求外在让内在积累压力，皮肤可能出现应激反应。内外兼修，心情平和才是最好的美容。"],
  },
  { // 天蝎
    love: ["深邃磁性魅力让对方无法抗拒，感情运势强烈！深度的情感交流让关系更加牢固，隐秘心意此时表达正当时。", "占有欲和嫉妒心影响感情质量，控制型行为让对方产生窒息感。给彼此空间，信任是感情的基础。"],
    career: ["洞察力和分析能力达到巅峰，能看穿表象找到核心问题。适合处理复杂的调查、谈判或策略性工作。", "疑心过重导致与同事关系紧张，封闭自我错失协作机会。适当打开心扉，建立更广泛的信任关系。"],
    wealth: ["投资眼光犀利，隐藏的财务机会被你敏锐捕捉。遗产、合作分红或意外资产有望到位。", "秘密财务操作带来风险，隐患积累可能在某个时刻集中爆发。透明化财务行为降低潜在风险。"],
    health: ["恢复力强，曾经的健康问题迎来转机。生殖系统和排毒代谢需要重点关注，排毒养生效果显著。", "情绪压抑积累在身体内，内分泌系统受到影响。学会释放负面情绪，心理健康直接影响生理健康。"],
  },
  { // 射手
    love: ["木星带来好运，感情运势自由奔放！你的乐观和幽默感让人着迷，异地缘分或旅途邂逅有惊喜。", "不羁的性格让对方产生不安全感，承诺兑现度需要提高。自由重要，但给对方稳定感同样是爱。"],
    career: ["视野开阔带来宏观策略优势，适合拓展新市场或推进跨地域合作。贵人在远方，出差或商务拜访有收获。", "做事虎头蛇尾，大目标制定了但执行细节一塌糊涂。找一个细节控做搭档，你们将是绝配。"],
    wealth: ["海外或跨城市投资回报好，信息来源广带来先机。赌博运偏旺但不可依赖，适可而止。", "大手笔花销难以收住，旅行和体验类消费超预算。享受生活的同时为未来留出一定储备。"],
    health: ["精力充沛，适合户外运动和探险活动。大腿和肝脏需要重点保养，避免饮酒过量。", "旅途奔波带来体力消耗，时差和饮食不规律影响状态。及时补充营养，保持充足睡眠。"],
  },
  { // 摩羯
    love: ["土星稳定力量让感情踏实进展，长期积累的感情基础开花结果。认真负责的态度让对方深感安心和信赖。", "工作压力带入感情，陪伴时间不足让对方产生被忽视的感觉。工作再忙也要留出专属的感情时光。"],
    career: ["努力终于被看见，长期奋斗的成果迎来收获时刻。权威感和专业能力获得上层高度认可，晋升水到渠成。", "过于保守错失扩张机会，总是等待完美时机导致别人抢先。有时候适时冒险比等待更明智。"],
    wealth: ["长期投资开始产生复利回报，耐心持有的资产迎来价值释放。严格的财务规划让财富稳步积累。", "过于保守的财务策略跑不赢通胀，实际购买力在悄悄缩水。适当调整资产配置，引入一定成长性。"],
    health: ["自律健康生活方式带来良好体魄，骨骼和关节需要重点保养。补充钙质，保持适度力量训练。", "工作压力过大导致慢性疲劳，膝盖和皮肤需要特别关注。强迫自己休假，身体是工作的本钱。"],
  },
  { // 水瓶
    love: ["天王星带来意外惊喜，感情中的独特创意让对方耳目一新！非传统的相处方式反而成为感情的加分项。", "情感表达过于理性，让对方感到冷漠和距离感。感情需要温度，偶尔放下逻辑，用心去感受和表达。"],
    career: ["创新思维大放异彩，科技、互联网或前沿领域的机会把握绝佳。打破常规的提案获得意想不到的支持。", "过于标新立异脱离实际，创意再好也需要可执行的落地方案。与务实的搭档配合，创意才能真正实现价值。"],
    wealth: ["科技股或新兴领域投资眼光独到，早期布局带来超额回报。人脉带来独特财务机会，信息就是财富。", "过于分散的投资让精力和资金捉襟见肘，每一个领域都没有深耕。聚焦两三个最有把握的方向。"],
    health: ["身体状态总体良好，循环系统和神经系统是重点关注部位。电子设备使用过度要定期护眼和防辐射。", "神经系统持续高度紧张，睡眠碎片化影响深度恢复。建立规律作息，睡前断开电子设备。"],
  },
  { // 双鱼
    love: ["海王星浪漫光环笼罩，感情运势如梦如幻！深度情感连接让关系升华，直觉引导下的缘分令人惊喜。", "感情中理想化过强，对伴侣有不切实际的期待。接受真实的对方，爱一个人是爱他的全部，包括缺点。"],
    career: ["艺术创作、心理咨询或精神服务领域运势极佳，直觉和共情力成为最大竞争优势。灵感如泉涌，创作力爆棚。", "边界不清让自己承担了太多他人的工作，善良被人利用。学会说不，把精力留给真正值得的事。"],
    wealth: ["精神消费和艺术品投资有不错回报，慈善行为带来意想不到的好运回馈。", "容易被感情用事影响财务决策，对他人的请求难以拒绝导致财务损失。理性评估每一笔非必要支出。"],
    health: ["直觉感知力强，能提前感受到身体发出的信号。免疫系统和足部需要重点关注，睡眠质量直接影响整体状态。", "情绪吸收过多外界负能量，容易感到莫名疲惫。设立情绪边界，不要成为他人情绪的垃圾桶。"],
  },
];

// Weekly outlook per zodiac (2 variants)
const WEEKLY_READINGS = [
  ["本周火星持续发力，事业冲劲十足，适合推进重要项目的收尾或新阶段启动。感情上有突破性进展，感情关系发生积极变化。财运随行动力提升。", "本周需要控制冲动，谨防决策失误。给自己设立冷静期，重大行动延后到周末前再执行，避免因急躁付出代价。"],
  ["本周感情和财务双线稳健推进，是落实计划的好时机。和伴侣或家人的互动带来温暖能量，生活幸福感提升。", "本周容易固执己见，与他人产生摩擦。保持开放心态，听取不同意见，适当妥协有助于突破瓶颈。"],
  ["本周信息流通畅，适合谈判、演讲和多方沟通。思维跳跃带来创意灵感，记录下每一个闪光点。人际关系活跃。", "本周思绪纷乱，注意力涣散影响执行力。减少外部干扰，专注完成本周最重要的三件事。"],
  ["本周家庭运势最旺，与亲人的关系更加亲密。直觉异常准确，在工作中相信你的第六感。情感丰富创作类工作有突出表现。", "本周情绪波动较大，避免在低谷期做重要决定。找到情绪出口，运动或倾诉都是好的调节方式。"],
  ["本周是全年运势的高峰区间，把握机会主动展示自我！贵人运旺，重要决策得到关键支持，是签约、合作、亮相的黄金时机。", "本周自我要求过高导致内耗，别让完美主义拖慢你的脚步。先完成再完善，行动力才是真正的竞争力。"],
  ["本周工作效率极高，适合处理积压已久的复杂任务。健康意识增强，开始或坚持健康生活习惯带来持久收益。", "本周容易陷入焦虑循环，对小事过度分析消耗精力。接受不确定性，聚焦可控范围内的行动。"],
  ["本周社交和人际关系进入佳境，合作项目有重要进展。美好的约会或重要会面会让感情更进一步。外在形象吸引力达到高峰。", "本周逃避决策的倾向影响效率，拖延会使问题积累。列出待办清单，逐项清除，不留尾巴。"],
  ["本周深层次的真相浮出水面，洞察力帮你看穿复杂局面。隐性资产或隐藏资源有望激活，财务上有意外收获。", "本周疑心过重消耗大量心理能量，与其猜测不如直接沟通。信任建立在真实交流上，不是猜测。"],
  ["本周好运气来自意外方向，保持开放心态迎接惊喜！远方消息带来好事，适合拓展视野或开启新计划。", "本周过于随性导致重要事项疏漏，粗枝大叶容易付出代价。建立checklist，确保关键细节不遗漏。"],
  ["本周努力开始显现回报，上司或权威人物对你的工作给予肯定。长期坚守的事业进入收获阶段。", "本周过于强调结果而忽视过程中的人际关系，工作固然重要，但感情账户也需要及时充值。"],
  ["本周创新思维带来职场突破，打破常规的提案获得支持。科技和前沿领域机会涌现，灵活把握。", "本周情绪表达过于冷漠，人际关系出现裂缝。多表达关心和感谢，温暖的互动是最好的黏合剂。"],
  ["本周灵感充沛，创意类工作达到顶峰。直觉引导下遇见重要缘分，艺术、音乐或情感创作大有斩获。", "本周容易逃避现实，面对问题的勇气比任何计划都重要。直面困难，一小步一小步地解决，终会过去。"],
];

// Monthly outlook (2 variants per zodiac)
const MONTHLY_READINGS = [
  ["本月整体运势强劲，是全年最具行动力的月份之一。事业上有重大突破机会，感情关系迎来新里程碑。财运因行动力提升而改善，但需防止冲动消费。", "本月需要特别注意冲动决策带来的后遗症。给自己设立决策冷静期，重大事项三思而行。健康方面注意头部和心脏。"],
  ["本月感情和财务双线丰收，是安定下来的好时期。家庭投资或置业决策可稳步推进，伴侣关系迎来深化的机会。", "本月顽固的态度阻碍了新机会的到来，适当放开执念，接受变化带来的新可能，才能迎来突破。"],
  ["本月思维最为活跃，信息渠道广泛带来丰富机遇。多线并行项目有望同时推进，沟通谈判技能大放光彩。", "本月注意力过于分散，多项事务同步推进却每项都只完成一半。断舍离非核心任务，集中力量完成最重要的事。"],
  ["本月家庭运势最为突出，与亲人的羁绊加深。事业上需要依赖直觉和情感智慧做判断，往往比数据分析更准确。", "本月情绪化影响工作表现，建立情绪记录的习惯，识别触发点并找到应对策略，情绪稳定才是真正的竞争力。"],
  ["本月运势鼎盛，是全年签约、曝光、推进重大事项的最佳窗口期。贵人运极旺，主动结交新圈子回报丰厚。", "本月管理欲过强导致团队效率下降，学会信任授权。你的职责是定方向，而非事事亲力亲为。"],
  ["本月是全年效率最高的月份，积压已久的工作可得到清理。健康投资（体检、运动、饮食调整）在本月开始会有最好的长期效果。", "本月完美主义达到顶峰，容易因担心做错而陷入行动瘫痪。允许自己犯错、允许不完美，才能真正向前推进。"],
  ["本月人际关系全面升温，合作机会从四面八方涌来。感情运势尤其旺盛，婚恋进展有望，单身者社交圈中有良缘。", "本月拖延积累的问题在月中集中爆发，提前做好风险排查。重要决策不能无限期推迟，果断行动胜过完美等待。"],
  ["本月是揭开谜底的关键时期，长期悬而未决的问题迎来答案。资产重组或财务规划调整带来积极改变。深度工作状态最佳。", "本月控制欲过强让身边的人感到压力，学会放手一些不必要的掌控。信任他人，放权是领导力的重要组成部分。"],
  ["本月远程合作和跨城市机会大量涌现，出行带来重要收获。学习新技能或拓展视野是本月最值得的投资。", "本月轻敌大意造成不必要的失误，保持应有的谨慎和细心。乐观是优点，但不能代替实际的准备和执行。"],
  ["本月是收获长期付出的关键阶段，职位晋升或重要认可在本月落实。财务管理的努力在这个月转化为真实资产。", "本月工作与生活的失衡到了必须调整的临界点。关系和健康的透支会在未来出现反弹，现在做调整成本最低。"],
  ["本月创新力和前瞻性思维带来职场突破，所在行业的新趋势你最先把握。社群和圈子的价值在本月最大化体现。", "本月情感疏离让重要关系产生裂缝，改变从一个真诚的拥抱或一条贴心的消息开始。技术解决不了情感问题。"],
  ["本月是全年灵性能量最强的时期，直觉极其准确。艺术创作、灵修或心理探索带来深层次的自我成长与转变。", "本月逃避型行为最强，容易用幻想代替行动。现实不会因为逃避而改善，面对它，你比自己想象的更强大。"],
];

function hashDay(zodiacIdx: number, date: Date): number {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear() % 100;
  return (zodiacIdx * 17 + d * 13 + m * 7 + y * 3) % 100;
}

function getDailyScores(zodiacIdx: number, date: Date) {
  const h = hashDay(zodiacIdx, date);
  const love = 38 + ((h * 3 + zodiacIdx * 7 + 11) % 52);
  const career = 38 + ((h * 5 + zodiacIdx * 11 + 7) % 52);
  const wealth = 38 + ((h * 7 + zodiacIdx * 5 + 13) % 52);
  const health = 38 + ((h * 11 + zodiacIdx * 3 + 17) % 52);
  const overall = Math.round((love + career + wealth + health) / 4);
  return { love, career, wealth, health, overall };
}

function scoreLabel(score: number): string {
  if (score >= 80) return "大吉";
  if (score >= 65) return "吉";
  if (score >= 50) return "平";
  return "注意";
}

function scoreColor(score: number): string {
  if (score >= 80) return "#60c080";
  if (score >= 65) return "#c9a84c";
  if (score >= 50) return "#a08060";
  return "#e06060";
}

function StarField() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i, x: (i * 37 + 11) % 100, y: (i * 53 + 17) % 100,
    size: (i % 3) * 0.5 + 0.5, delay: (i % 5) * 0.6,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {stars.map((s) => (
        <motion.div key={s.id} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: "50%", background: "#fff" }}
          animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 2 + s.delay, repeat: Infinity, delay: s.delay }} />
      ))}
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  const stars = Math.round(value / 20);
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
        <span style={{ fontSize: "12px", color: "#a08060" }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "11px", color: scoreColor(value) }}>{scoreLabel(value)}</span>
          <span style={{ fontSize: "13px", color: color }}>{value}</span>
        </div>
      </div>
      <div style={{ height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8, delay: 0.2 }}
          style={{ height: "100%", background: `linear-gradient(to right, ${color}60, ${color})`, borderRadius: "3px" }} />
      </div>
    </div>
  );
}

export function HoroscopePage({ onBack }: HoroscopePageProps) {
  const [selectedZodiac, setSelectedZodiac] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("today");
  const today = new Date();

  const zodiac = selectedZodiac !== null ? ZODIACS[selectedZodiac] : null;
  const scores = selectedZodiac !== null ? getDailyScores(selectedZodiac, today) : null;

  const handleSelectZodiac = (i: number) => {
    setSelectedZodiac(i);
    const s = getDailyScores(i, today);
    saveToHistory({
      type: "horoscope",
      title: `星座运势 · ${ZODIACS[i].name}`,
      summary: `综合运势 ${s.overall}分 · ${today.getMonth() + 1}月${today.getDate()}日`,
      icon: ZODIACS[i].symbol,
    });
  };

  const getReadingVariant = (zodiacIdx: number): 0 | 1 => {
    return hashDay(zodiacIdx, today) >= 50 ? 0 : 1;
  };

  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;

  return (
    <div style={{ background: "linear-gradient(180deg, #05081a 0%, #0a0d20 50%, #0d0500 100%)", minHeight: "100%", fontFamily: "'Noto Serif SC', serif", color: "#e8d5a3", position: "relative", overflow: "hidden" }}>
      <StarField />
      <div style={{ display: "flex", alignItems: "center", padding: "16px 16px 0", gap: "12px", position: "relative", zIndex: 1 }}>
        <motion.button onClick={onBack} whileTap={{ scale: 0.9 }} style={{ background: "none", border: "none", color: "#c9a84c", fontSize: "20px", cursor: "pointer", padding: "4px" }}>‹</motion.button>
        <div>
          <div style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: "20px", color: "#f0d080" }}>星座运势</div>
          <div style={{ fontSize: "10px", color: "#a08060" }}>星辰指引 · {dateStr}</div>
        </div>
      </div>
      <div style={{ padding: "0 16px", position: "relative", zIndex: 1 }}>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #c9a84c40, transparent)", margin: "12px 0" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "0 16px" }}>
        <AnimatePresence mode="wait">
          {!selectedZodiac && selectedZodiac !== 0 ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ fontSize: "12px", color: "#a08060", textAlign: "center", marginBottom: "16px" }}>选择你的星座</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "24px" }}>
                {ZODIACS.map((z, i) => {
                  const s = getDailyScores(i, today);
                  return (
                    <motion.div key={z.name} onClick={() => handleSelectZodiac(i)} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} style={{
                      background: "rgba(5,8,26,0.8)", border: "1px solid rgba(100,100,180,0.2)",
                      borderRadius: "10px", padding: "12px 8px", textAlign: "center", cursor: "pointer",
                    }}>
                      <div style={{ fontSize: "22px", color: z.color, marginBottom: "3px" }}>{z.symbol}</div>
                      <div style={{ fontSize: "11px", color: "#e8d5a3" }}>{z.name}</div>
                      <div style={{ fontSize: "9px", color: "#6070a0", marginTop: "2px" }}>{z.dates}</div>
                      <div style={{ marginTop: "6px", fontSize: "10px", color: scoreColor(s.overall) }}>{scoreLabel(s.overall)}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : zodiac && scores && selectedZodiac !== null ? (
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setSelectedZodiac(null)} style={{ background: "none", border: "none", color: "#a08060", fontSize: "12px", cursor: "pointer", padding: "0 0 12px", display: "flex", alignItems: "center", gap: "4px" }}>
                ‹ 返回星座列表
              </button>

              {/* Hero card */}
              <div style={{
                background: `linear-gradient(145deg, ${zodiac.color}20, rgba(5,8,26,0.95))`,
                border: `1px solid ${zodiac.color}60`, borderRadius: "16px", padding: "20px",
                textAlign: "center", marginBottom: "14px", boxShadow: `0 0 40px ${zodiac.color}15`,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: "-20px", right: "-10px", fontSize: "100px", color: zodiac.color, opacity: 0.06 }}>{zodiac.symbol}</div>
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 6, repeat: Infinity }} style={{ fontSize: "44px", color: zodiac.color, marginBottom: "6px" }}>
                  {zodiac.symbol}
                </motion.div>
                <div style={{ fontSize: "20px", color: "#f0d080", fontFamily: "'Ma Shan Zheng', serif", marginBottom: "2px" }}>{zodiac.name}</div>
                <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "10px" }}>{zodiac.dates} · {zodiac.element} · {zodiac.planet}守护</div>
                <div style={{ fontSize: "11px", color: `${zodiac.color}cc`, fontStyle: "italic", marginBottom: "10px" }}>{zodiac.trait}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#a08060" }}>综合运势</span>
                  <span style={{ fontSize: "24px", color: zodiac.color, fontWeight: "bold" }}>{scores.overall}</span>
                  <span style={{ fontSize: "12px", padding: "2px 8px", background: `${scoreColor(scores.overall)}20`, border: `1px solid ${scoreColor(scores.overall)}`, borderRadius: "10px", color: scoreColor(scores.overall) }}>
                    {scoreLabel(scores.overall)}
                  </span>
                </div>
              </div>

              {/* View mode tabs */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                {(["today", "week", "month"] as ViewMode[]).map((m) => (
                  <button key={m} onClick={() => setViewMode(m)} style={{
                    flex: 1, padding: "8px", background: viewMode === m ? `${zodiac.color}20` : "rgba(5,8,26,0.6)",
                    border: `1px solid ${viewMode === m ? zodiac.color : "rgba(100,100,180,0.2)"}`,
                    borderRadius: "8px", color: viewMode === m ? zodiac.color : "#a08060",
                    fontSize: "12px", cursor: "pointer", fontFamily: "'Noto Serif SC', serif",
                  }}>
                    {m === "today" ? "今日" : m === "week" ? "本周" : "本月"}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {viewMode === "today" && (
                  <motion.div key="today" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    {/* Score bars */}
                    <div style={{ background: "rgba(5,8,26,0.8)", border: "1px solid rgba(100,100,180,0.2)", borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
                      <ScoreBar label="爱情运势" value={scores.love} color="#e06080" />
                      <ScoreBar label="事业运势" value={scores.career} color="#c9a84c" />
                      <ScoreBar label="财富运势" value={scores.wealth} color="#60c080" />
                      <ScoreBar label="健康运势" value={scores.health} color="#6090e0" />
                    </div>

                    {/* Detailed readings */}
                    {(["love", "career", "wealth", "health"] as const).map((dim, di) => {
                      const labels = ["爱情", "事业", "财运", "健康"];
                      const colors = ["#e06080", "#c9a84c", "#60c080", "#6090e0"];
                      const score = scores[dim];
                      const variant = getReadingVariant(selectedZodiac);
                      const reading = ZODIAC_READINGS[selectedZodiac][dim][variant];
                      return (
                        <div key={dim} style={{ background: "rgba(5,8,26,0.75)", border: `1px solid ${colors[di]}30`, borderRadius: "10px", padding: "14px", marginBottom: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <span style={{ fontSize: "11px", color: colors[di] }}>{labels[di]}</span>
                            <span style={{ fontSize: "11px", color: scoreColor(score) }}>{scoreLabel(score)} {score}分</span>
                          </div>
                          <p style={{ fontSize: "13px", color: "#e8d5a3", lineHeight: 1.9, margin: 0 }}>{reading}</p>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {viewMode === "week" && (
                  <motion.div key="week" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div style={{ background: "rgba(5,8,26,0.8)", border: `1px solid ${zodiac.color}30`, borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
                      <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "10px" }}>本周运势总览</div>
                      <p style={{ fontSize: "13px", color: "#e8d5a3", lineHeight: 2, margin: 0 }}>
                        {WEEKLY_READINGS[selectedZodiac][getReadingVariant(selectedZodiac)]}
                      </p>
                    </div>
                    {/* Weekly day bars */}
                    <div style={{ background: "rgba(5,8,26,0.75)", border: "1px solid rgba(100,100,180,0.2)", borderRadius: "12px", padding: "16px" }}>
                      <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "12px" }}>七日运势走势</div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "flex-end", height: "70px" }}>
                        {["一","二","三","四","五","六","日"].map((day, di) => {
                          const h = hashDay(selectedZodiac + di, today);
                          const barH = 30 + (h % 40);
                          const isToday = di === today.getDay() - 1;
                          return (
                            <div key={di} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                              <motion.div initial={{ height: 0 }} animate={{ height: barH }} transition={{ delay: di * 0.1, duration: 0.5 }}
                                style={{ width: "100%", background: isToday ? zodiac.color : `${zodiac.color}50`, borderRadius: "3px 3px 0 0", minHeight: "4px" }} />
                              <span style={{ fontSize: "9px", color: isToday ? zodiac.color : "#6070a0" }}>周{day}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {viewMode === "month" && (
                  <motion.div key="month" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div style={{ background: "rgba(5,8,26,0.8)", border: `1px solid ${zodiac.color}30`, borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
                      <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "10px" }}>{today.getMonth() + 1}月运势总览</div>
                      <p style={{ fontSize: "13px", color: "#e8d5a3", lineHeight: 2, margin: 0 }}>
                        {MONTHLY_READINGS[selectedZodiac][getReadingVariant(selectedZodiac)]}
                      </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      {[
                        { label: "本月爱情", score: Math.min(95, scores.love + 5), color: "#e06080" },
                        { label: "本月事业", score: Math.min(95, scores.career + 3), color: "#c9a84c" },
                        { label: "本月财运", score: Math.min(95, scores.wealth + 4), color: "#60c080" },
                        { label: "本月健康", score: Math.min(95, scores.health + 2), color: "#6090e0" },
                      ].map((item) => (
                        <div key={item.label} style={{ background: "rgba(5,8,26,0.75)", border: `1px solid ${item.color}30`, borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                          <div style={{ fontSize: "11px", color: "#a08060", marginBottom: "8px" }}>{item.label}</div>
                          <div style={{ fontSize: "26px", color: item.color, marginBottom: "4px" }}>{item.score}</div>
                          <div style={{ fontSize: "11px", color: scoreColor(item.score) }}>{scoreLabel(item.score)}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
