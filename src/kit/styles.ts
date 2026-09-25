/**
 * styles.ts —— 风格真源(2026-07-18 小陈拍板建立)。
 *
 * 回答一个问题:这条生产线有哪几种「视觉风格」,每种的色板/动效手感/家族组件是什么。
 * 与 theme.ts 的分工:theme.ts 是【品牌 token】(值由 视觉系统/tokens.mjs 生成,DO NOT EDIT);
 * 本文件是【风格层】——品牌两套明暗主题之外,还登记与品牌并列的「风格家族」
 * (宣纸·墨 / VOX 纸雕……),它们的色板明确【非品牌 token,勿并入 theme.ts】,真源在这里。
 *
 * 消费方:
 *   ① SceneTag.style 的取值白名单 = STYLES[].id(lint-tags 检查⑤ 会校验);
 *   ② 镜头目录画廊 /api/styles(风格卡:色板/组件清单/可复制用法);
 *   ③ 组件代码 import 风格预设(如 collage.tsx re-export VOX_PRESET)。
 *
 * 画廊派生契约(同 SceneTag 的字面量纪律):INK_PRESET / VOX_PRESET 必须是纯字面量;
 * STYLES 数组里只允许引用 theme.* / INK_PRESET.* / VOX_PRESET.*
 * (镜头目录 server.mjs 用文本抽取 + 注入求值,引用其它标识符会抽取失败)。
 * 零依赖红线:只 import 仓内 theme.ts;类型 import 一律 type-only。
 */
import { theme } from './theme';
import type { CollagePalette } from './components/collage';

/* ================= 风格预设(非品牌 token) ================= */

/** 宣纸·墨色板。值 = 「找未知」v4 生产工程 src/w2.ts 实测原值(2026-07-09 发布片,4K 验证)。 */
export interface InkPalette {
  /** 宣纸舞台底 */ stage: string;
  /** 纸面/卡面 */ paper: string;
  /** 主墨(正文/标题) */ ink: string;
  /** 勾线墨(BrushPath 主用) */ inkSoft: string;
  /** 淡墨(注脚) */ inkMuted: string;
  /** 朱砂印色 */ seal: string;
  /** 墨渍淡洗 */ markWash: string;
  /** 朱砂淡洗 */ sealWash: string;
}
export const INK_PRESET: InkPalette = {
  stage: '#efe9de',
  paper: '#f6f2ea',
  ink: '#26221c',
  inkSoft: '#3a362e',
  inkMuted: '#8b8478',
  seal: '#b5493a',
  markWash: 'rgba(58,54,46,.13)',
  sealWash: 'rgba(181,73,58,.18)',
};

/** VOX 纸雕色板:赛场工程「5 色 + 白」硬约束原值(2026-07-14 自对决赛场晋升,
 * 2026-07-18 自 collage.tsx 收编至此定居;collage.tsx re-export 保住旧引用)。 */
export const VOX_PRESET: CollagePalette = {
  paper: '#C9BB9C',
  ink: '#1A1A1A',
  gray: '#8C8C8C',
  red: '#D62E1F',
  mustard: '#D9A441',
  white: '#FFFFFF',
};

/** 编辑部·纸面色板(2026-08-24 镜头库大修立家族;08-24 晚 v2 改锚差评君档案纸面)。
 * 值 = 差评君档案纸面风原值(视频项目/2026-07-24-wenyan-ai-token/src/common.tsx 的 P,
 * 该片复刻《为了赢苏联…》并经小陈拍板「是我喜欢的风格」):
 * 浅暖灰米方格纸 + 白框卡 + 巨字淡灰水印 + 档案黄高亮 + 暗红印章;深度靠柔投影,零辉光。 */
export interface PaperPalette {
  /** 浅暖灰米纸底 */ stage: string;
  /** 深一档纸底(分区/铺底) */ stageDeep: string;
  /** 卡面暖白 */ card: string;
  /** 主墨 */ ink: string;
  /** 淡墨(注脚/副标) */ inkSoft: string;
  /** 巨型水印淡灰 */ ghost: string;
  /** 方格纸网格线 */ line: string;
  /** 档案黄(荧光笔/贴纸) */ yellow: string;
  /** 档案黄淡底 */ yellowPale: string;
  /** 印章暗红 */ red: string;
  /** 印章亮红(深底用) */ redBright: string;
  /** 主卡柔投影(深度唯一来源,禁辉光) */ shadow: string;
  /** 次级柔投影 */ shadowSoft: string;
  /** 边缘暗角淡洗 */ wash: string;
}
export const PAPER_PRESET: PaperPalette = {
  stage: '#EDEAE2',
  stageDeep: '#E1DDD2',
  card: '#FBFAF6',
  ink: '#26231E',
  inkSoft: '#6E675B',
  ghost: 'rgba(38, 35, 30, 0.075)',
  line: 'rgba(38, 35, 30, 0.09)',
  yellow: '#E3B33A',
  yellowPale: '#F4E3B0',
  red: '#A93B2D',
  redBright: '#C24A38',
  shadow: '0 16px 36px rgba(30,26,20,0.16), 0 3px 8px rgba(30,26,20,0.08)',
  shadowSoft: '0 8px 18px rgba(30,26,20,0.12), 0 2px 5px rgba(30,26,20,0.07)',
  wash: 'rgba(31,27,21,0.09)',
};

/* ================= 风格登记表 ================= */

export interface StyleSwatch {
  key: string;
  label: string;
  value: string;
}

export interface StyleComponentDoc {
  /** 组件/工具名(与代码导出名一致) */
  name: string;
  /** 一句话:干嘛的 */
  oneLiner: string;
  /** 可复制的最小用法片段(只写核实过签名的;没有就不给,宁缺毋滥) */
  usage?: string;
}

export interface StyleDef {
  /** === SceneTag.style 的取值 */
  id: string;
  /** brand=品牌主题 / family=风格家族(非品牌色) / neutral=不吃主题的工具 */
  kind: 'brand' | 'family' | 'neutral';
  title: string;
  /** 一句话手感 */
  tagline: string;
  /** 徽章/筛选点用的代表色 */
  accent: string;
  palette: StyleSwatch[];
  fonts?: string[];
  /** 动效语汇一句话 */
  motion: string;
  /** 时间参数约定(两家族约定不混:宣纸用秒,纸雕用局部帧) */
  timeUnit?: string;
  /** 晋升来源 */
  origin?: string;
  /** 风格件真身文件(画廊「复制整件源码」白名单,kit 内相对路径) */
  sourceFiles: string[];
  components: StyleComponentDoc[];
}

export const STYLES: StyleDef[] = [
  {
    id: '品牌·奶油浅底',
    kind: 'brand',
    title: '品牌 · 奶油浅底',
    tagline: '奶油亮底 + 漂浮云光斑,实色卡/浅玉玻璃卡,近黑文字(全局默认浅色主题)',
    accent: theme.colors.orange,
    palette: [
      { key: 'bgCream', label: '奶油底', value: theme.colors.bgCream },
      { key: 'surface', label: '实色卡面', value: theme.colors.surface },
      { key: 'backcard', label: '叠层卡', value: theme.colors.backcard },
      { key: 'ink', label: '主文字(近黑)', value: theme.colors.ink },
      { key: 'inkMuted', label: '暖灰注脚', value: theme.colors.inkMuted },
      { key: 'orange', label: '陶土橙(品牌锚点)', value: theme.colors.orange },
      { key: 'blue', label: '蓝(命名/主体)', value: theme.colors.blue },
    ],
    fonts: [theme.fonts.zh, theme.fonts.display, theme.fonts.serif, theme.fonts.mono],
    motion: '品牌动效 token:入场 12 帧、卡片 spring damping 18、气泡 damping 12、多卡错峰 70ms',
    timeUnit: '帧(30fps,theme.motion)',
    sourceFiles: ['theme.ts', 'components/CreamDriftBackdrop.tsx'],
    components: [
      {
        name: 'CreamDriftBackdrop',
        oneLiner: '奶油云飘底:亮场缩卡的组件级默认 backdrop,三团云光斑确定性游走',
        usage: "import {CreamDriftBackdrop} from 'cyxj-remotion/components';\n\n<AbsoluteFill>\n  <CreamDriftBackdrop />\n  {/* 内容 */}\n</AbsoluteFill>",
      },
      {
        name: 'theme.cards.glassLight / cardSolid',
        oneLiner: '浅玉玻璃卡 / 实色卡配方:直接铺到 style 上',
        usage: "import {theme} from 'cyxj-remotion/theme';\n\n<div style={{...theme.cards.cardSolid, padding: theme.spacing.lg}}>…</div>",
      },
    ],
  },
  {
    id: '品牌·espresso深底',
    kind: 'brand',
    title: '品牌 · espresso 深底',
    tagline: 'espresso 暖暗底(或口播视频/全屏纹理),深玉玻璃卡,暖白文字,蓝橙只做标注',
    accent: theme.darkGlass.bg,
    palette: [
      { key: 'bg', label: 'espresso 底', value: theme.darkGlass.bg },
      { key: 'surface', label: '深玉玻璃卡面', value: theme.darkGlass.surface },
      { key: 'stroke', label: '玻璃卡描边', value: theme.darkGlass.stroke },
      { key: 'onDark', label: '暖白文字', value: theme.darkGlass.onDark },
      { key: 'muted', label: '弱化文字', value: theme.darkGlass.muted },
      { key: 'accent', label: '蓝(深底强调)', value: theme.darkGlass.accent },
      { key: 'orange', label: '陶土橙(品牌锚点)', value: theme.colors.orange },
    ],
    fonts: [theme.fonts.zh, theme.fonts.display, theme.fonts.serif, theme.fonts.mono],
    motion: '同品牌动效 token(与奶油浅底共用 theme.motion;深底禁纯黑/冷黑,全屏底走暖向渐变)',
    timeUnit: '帧(30fps,theme.motion)',
    sourceFiles: ['theme.ts', 'components/FullBleedBackdrop.tsx'],
    components: [
      {
        name: 'FullBleedBackdrop',
        oneLiner: '全屏暖底纹理(自动 espresso):全屏镜头铺底,避免纯平深底',
        usage: "import {FullBleedBackdrop} from 'cyxj-remotion/components';\n\n<AbsoluteFill>\n  <FullBleedBackdrop />\n  {/* 内容 */}\n</AbsoluteFill>",
      },
      {
        name: 'theme.cards.glassDark',
        oneLiner: '深玉玻璃卡配方(gold-standard 实测值):直接铺到 style 上',
        usage: "import {theme} from 'cyxj-remotion/theme';\n\n<div style={{...theme.cards.glassDark, padding: theme.spacing.lg}}>…</div>",
      },
    ],
  },
  {
    id: '品牌·双主题',
    kind: 'brand',
    title: '品牌 · 双主题',
    tagline: '同一镜头两套底都能跑:显式 light/dark 变体,或透底叠口播视频(底色随所叠内容)',
    accent: theme.colors.blue,
    palette: [
      { key: 'bgCream', label: '奶油底(浅态)', value: theme.colors.bgCream },
      { key: 'bg', label: 'espresso 底(深态)', value: theme.darkGlass.bg },
      { key: 'orange', label: '陶土橙(品牌锚点)', value: theme.colors.orange },
      { key: 'blue', label: '蓝(命名/主体)', value: theme.colors.blue },
    ],
    fonts: [theme.fonts.zh, theme.fonts.display, theme.fonts.serif, theme.fonts.mono],
    motion: '同品牌动效 token;单个镜头内只用一套主题(design.md §1 铁律)',
    timeUnit: '帧(30fps,theme.motion)',
    sourceFiles: ['theme.ts'],
    components: [],
  },
  {
    id: '宣纸·墨',
    kind: 'family',
    title: '宣纸 · 墨(手绘家族)',
    tagline: '宣纸底上笔触勾画/墨团晕染/落墨字/朱砂落印,洇边滤镜 + 微呼吸,秒驱动',
    accent: INK_PRESET.seal,
    palette: [
      { key: 'stage', label: '宣纸舞台底', value: INK_PRESET.stage },
      { key: 'paper', label: '纸面/卡面', value: INK_PRESET.paper },
      { key: 'ink', label: '主墨', value: INK_PRESET.ink },
      { key: 'inkSoft', label: '勾线墨', value: INK_PRESET.inkSoft },
      { key: 'inkMuted', label: '淡墨注脚', value: INK_PRESET.inkMuted },
      { key: 'seal', label: '朱砂印', value: INK_PRESET.seal },
    ],
    motion: '笔触 evolvePath 勾画 + 墨团逐层生长 + 由糊到锐落墨;专用缓动 INK/STROKE/GROW_EASE;一切有微呼吸不死帧',
    timeUnit: '秒(与 VOX 纸雕的局部帧约定互斥,两家不混)',
    origin: '「找未知」v4(2026-07-09 抖音发布,4K 验证)→ 2026-07-14 晋升入 kit',
    sourceFiles: ['components/ink.tsx'],
    components: [
      {
        name: 'InkDefs',
        oneLiner: '洇边滤镜定义:必须与 BrushPath/DashedPath/InkWash 挂同一个 <svg> 里',
        usage: "import {InkDefs, BrushPath} from 'cyxj-remotion/components/ink';\n\n<svg width={1920} height={1080}>\n  <InkDefs />\n  <BrushPath d=\"M 200 300 L 800 300\" startSec={0.5} endSec={1.8}\n    color={INK_PRESET.inkSoft} width={6} />\n</svg>",
      },
      { name: 'BrushPath', oneLiner: '三层叠笔触墨线勾画(宽淡+中+细浓,evolvePath + 洇边)' },
      {
        name: 'InkWash',
        oneLiner: '晕染墨团:三层嵌套不规则墨团错峰生长,常驻微呼吸',
        usage: "<InkWash cx={960} cy={540} r={220} seed=\"wash-1\" startSec={1}\n  color={INK_PRESET.ink} />",
      },
      {
        name: 'InkSeal',
        oneLiner: '印章晕染式落印(scale 落定 + 墨晕洇开呼吸);纸雕对应件是 Stamp,两家不混',
        usage: "<InkSeal text=\"已验证\" startSec={2}\n  sealColor={INK_PRESET.seal} textColor={INK_PRESET.paper}\n  washColor={INK_PRESET.sealWash} style={{left: 1400, top: 200}} />",
      },
      {
        name: 'InkText',
        oneLiner: '落墨字:渐显 + 沉降 + 由糊到锐',
        usage: "<InkText startSec={1.2} style={{left: 300, top: 400, color: INK_PRESET.ink}}>\n  标题\n</InkText>",
      },
      {
        name: 'InkSweep',
        oneLiner: '关键词身后低透明淡染从左到右扫开(行内包住文字用)',
        usage: "<InkSweep startSec={2} washColor={INK_PRESET.sealWash}>关键词</InkSweep>",
      },
      {
        name: 'PaperGrain',
        oneLiner: '纸纹常驻层(multiply 低透明,盖在画箱上)',
        usage: '<PaperGrain width={1920} height={1080} />',
      },
      {
        name: 'Breathe',
        oneLiner: '呼吸层:极慢微 zoom + noise 漂移,包住世界让摄像机「到站不死」',
        usage: '<Breathe>{/* 世界内容 */}</Breathe>',
      },
      { name: 'handLine / inkBlob / DashedPath', oneLiner: '手抖线(直线的手绘替身,防 SVG 零厚度滤镜塌陷)/ 不规则墨团轮廓 / 虚线笔触' },
    ],
  },
  {
    id: 'VOX纸雕',
    kind: 'family',
    title: 'VOX 纸雕拼贴',
    tagline: '做旧档案纸 + 半调网点 + 红套印错位 + 撕纸/印章/巨型数字,12fps 图形顿挫',
    accent: VOX_PRESET.red,
    palette: [
      { key: 'paper', label: '档案纸米', value: VOX_PRESET.paper },
      { key: 'ink', label: '墨黑', value: VOX_PRESET.ink },
      { key: 'gray', label: '半调灰', value: VOX_PRESET.gray },
      { key: 'red', label: '套印正红', value: VOX_PRESET.red },
      { key: 'mustard', label: '芥末黄', value: VOX_PRESET.mustard },
      { key: 'white', label: '纸白', value: VOX_PRESET.white },
    ],
    motion: '图形动画 12fps 顿挫(quantizeFrame);相机/视差吃原始 frame 保 30fps 平滑;印章硬弹簧砸落',
    timeUnit: '局部帧 at / durationInFrames(与宣纸·墨的秒约定互斥,两家不混)',
    origin: '对决赛场三轮 + vox-pilot salvage → 2026-07-14 晋升入 kit',
    sourceFiles: ['components/collage.tsx'],
    components: [
      {
        name: 'CollagePaper',
        oneLiner: '做旧档案纸底(纸噪 + 纸筋漂移 + 等高线,纯代码零素材)',
        usage: "import {CollagePaper, VOX_PRESET} from 'cyxj-remotion/components/collage';\n\n<CollagePaper palette={VOX_PRESET} />",
      },
      {
        name: 'quantizeFrame',
        oneLiner: '12fps 图形顿挫:把驱动帧量化成阶梯;只喂图形动画,相机吃原始 frame',
        usage: "const qf = quantizeFrame(frame, 12, fps); // 图形动画用 qf,相机用 frame",
      },
      { name: 'HalftoneDots / PrintGrain / RegistrationMarks', oneLiner: '半调网点 / 印刷颗粒 / 套准十字(印刷质感三件套)' },
      { name: 'TornCard / TearOpen / TornWipe', oneLiner: '撕边卡 / 撕开揭示 / 撕纸转场(textureUrl 显式素材位)' },
      { name: 'Stamp', oneLiner: '印章硬弹簧砸落;宣纸对应件是 InkSeal,两家不混' },
      { name: 'BigNum / SlamIn / ArchiveHeader', oneLiner: '巨型数字 / 方向砸入 / 档案页眉' },
      { name: 'MarkerStroke / UnderlineSwipe', oneLiner: '马克笔圈画 / 下划线扫过' },
      { name: 'CollageStage', oneLiner: '编辑台分层相机(背景不动、内容层动;push/pull/left/right/up)' },
      { name: 'HalftoneFigure', oneLiner: '半调人物(src 显式素材位)' },
    ],
  },
  {
    id: '编辑部·纸面',
    kind: 'family',
    title: '编辑部 · 纸面(大修骨干家族)',
    tagline: '浅暖灰米方格纸 + 白框卡柔投影 + 巨字淡灰水印,宋体 900 大字,档案黄荧光笔 + 暗红印章双强调;深度靠投影,零辉光',
    accent: PAPER_PRESET.red,
    palette: [
      { key: 'stage', label: '浅暖灰米纸底', value: PAPER_PRESET.stage },
      { key: 'card', label: '卡面暖白', value: PAPER_PRESET.card },
      { key: 'ink', label: '主墨', value: PAPER_PRESET.ink },
      { key: 'inkSoft', label: '淡墨注脚', value: PAPER_PRESET.inkSoft },
      { key: 'yellow', label: '档案黄(荧光笔)', value: PAPER_PRESET.yellow },
      { key: 'red', label: '印章暗红', value: PAPER_PRESET.red },
    ],
    fonts: ['"Noto Serif SC", "Songti SC", serif', '"Noto Sans SC", sans-serif', '"Playfair Display"(数字)'],
    motion: '动效预算花在入场:分批入场、贴纸/印章盖章式砸落、荧光笔从左扫亮;全片唯一相机语言=极缓推近(~1.6%);落位后不再加戏,禁无目的 idle 永动',
    timeUnit: '帧(30fps)',
    origin: '2026-08-24 大修立家族,锚差评君档案纸面风:色值/手法原值取自 视频项目/2026-07-24-wenyan-ai-token/src/common.tsx(小陈拍板「是我喜欢的风格」);另参 参考/差评君-token-卡片系统-2026-08-14 拆解',
    sourceFiles: ['components/paper.tsx', 'scenes/PaperTransitionScene.tsx', 'scenes/PaperTalkScene.tsx'],
    components: [
      {
        name: 'PaperStage',
        oneLiner: '家族舞台底:方格纸+颗粒+暗角,children 吃全片唯一极缓推近(~1.6%)',
        usage: "import {PaperStage} from 'cyxj-remotion/components/paper';\n\n<PaperStage>{/* 内容 */}</PaperStage>",
      },
      {
        name: 'PaperNameTag',
        oneLiner: '纸面名牌:卡面暖白+细边+柔投影+微旋转,盖章式落定后静止',
      },
      {
        name: 'PaperTransitionScene',
        oneLiner: '8件套#7 章节卡:巨字水印铺底,宋体大标题升入、档案黄扫亮强调词,随后定格',
      },
      {
        name: 'PaperTalkScene',
        oneLiner: '8件套#2 口播底:纸底盖掉奶油默认底,人缩卡浮上,左下纸面名牌点题',
      },
    ],
  },
  {
    id: '中立',
    kind: 'neutral',
    title: '中立(不吃主题)',
    tagline: '颜色全走 props、不带任何品牌/家族默认色的可复用工具镜头',
    accent: '#8c8c8c',
    palette: [],
    motion: '随调用方;组件自身不定义风格化动效语汇',
    sourceFiles: [],
    components: [],
  },
];
