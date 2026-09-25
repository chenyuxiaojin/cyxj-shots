/**
 * sceneTag.ts —— 镜头「自描述说明书(SceneTag)」的共享类型,**零依赖纯类型**(同 schema/types.ts)。
 *
 * 一处声明、三处消费:每个镜头在自己的文件里 co-located 写 `export const xxxTag: SceneTag = {...}`,
 * 两处现读它:① 配镜目录 `skills/cyxj-storyboard-plan/scripts/thin-index.mjs`
 *   ② 镜头目录画廊与预览渲染 `Remotion/镜头目录/lib/catalog.mjs`。
 *
 * 零依赖红线:本文件只能有纯类型 + 纯数据,不引任何运行时库(kit 无 node_modules)。
 * tag 的值必须是【字面量】(Q3「先镜像」:照抄镜头现有默认,别引用外部常量)——
 *   构建脚本靠「读源码文本 + 取对象字面量求值」抽取,引用外部常量会导致抽取失败。
 */

/** 字段控件类型 —— 对得上 Remotion zod 控件 */
export type FieldType =
  | 'text'     // 文本     → zod zTextarea
  | 'number'   // 数值     → z.number
  | 'boolean'  // 开关     → z.boolean
  | 'enum'     // 固定选项 → z.enum   (必带 values)
  | 'color'    // 颜色     → zColor
  | 'asset'    // public 下文件 → staticFile (必带 assetRoot)
  | 'list'     // 重复项数组 → z.array。对象数组必带 itemFields;【标量数组(string[]/number[])不写 itemFields】,help 注明每项是什么(样板:ProfessionPan crowd.figures)——单键 itemFields 会让下游当对象数组,喂进吃标量的组件就是 [object Object](2026-07-06 审计:29 处已按此修正)
  | 'group';   // 嵌套对象 → z.object (必带 fields)

/** 字段暴露层级(Q4 已定:分两级) */
export type FieldTier =
  | 'primary'   // 每条视频都要填的(文字/图/选项)→ 网页台摆明面
  | 'advanced'; // 偶尔才调的(颜色/动效快慢)→ 收起,但仍可调,一个不扔

export interface SceneField {
  key: string;            // 镜头组件的 prop 名(如 'label' / 'provider')
  label: string;          // 人看的中文名
  type: FieldType;
  tier: FieldTier;        // Q4:每条字段必须分级(primary 摆明面 / advanced 收起仍可调)
  required?: boolean;     // 不填镜头就不成立(默认 false)
  default?: unknown;      // 镜头自带的合理默认 —— 填这里=自描述,下游不再硬编码默认
  help?: string;          // 一句话给 AI 看:这字段干嘛、怎么填
  values?: string[];      // type:'enum' 必填
  assetRoot?: string;     // type:'asset' 必填,如 'screenshots/'
  itemFields?: SceneField[]; // type:'list' 且项为对象时必填;项为标量(string/number)时【不写】(见 FieldType 'list' 注释)
  fields?: SceneField[];     // type:'group' 必填:嵌套对象的字段
  keyframeable?: boolean; // 这个值能否在时间轴上打关键帧(默认 false)
  example?: unknown;      // 一个示例值,给 AI 照着填
}

/**
 * 口播位 —— 统一 6 值。
 *
 * ⚠️ Q1 已核对锁定(2026-06-29):主线 poses.ts 的 `center` 姿态是【两用】的——
 *   EdlRenderer.tsx:164-180 里 `fullscreen` 和 `audio-only` 都映射到 `center` 这一个 pose。
 *   所以从 poses 反推 6 值时,按「人出不出镜」区分:
 *     · 人出镜、居中说话铺满屏(如 talk / title)                         → 'fullscreen'
 *     · 全屏图形 / B-roll 盖住人、人不出镜(如 contextsiphon/professionpan/quote) → 'audio-only'
 *   talk 的 TalkScene 只在口播视频上叠一行标签、人全程出镜 → 'fullscreen'。
 */
export type Pose =
  | 'fullscreen'   // 人占满屏、居中说话(poses.center,人出镜)
  | 'card-left' | 'card-right'      // 人缩成左/右圆角卡(poses.cardLeft/cardRight)
  | 'corner-left' | 'corner-right'  // 人缩成角落小卡
  | 'audio-only';  // 只有声音、不出人(全屏盖人大图/母题 多用,poses.center 的另一用法)

/**
 * 目录展示用的自然语言描述(给人/AI 读;这些是镜头自身的编辑性描述,无其它结构化来源)。
 * 画廊与配镜目录直接读这些字段。
 */
export interface SceneCatalog {
  narratorPosition?: string;     // 构图位的自然语言版(可比 defaultPose 更细,如带 framing 说明)
  supportingElements?: string[]; // 画面里还有什么(浮卡/列表/数据/截图…;无则 ['无'])
  animation?: string;            // 主要动效一句话(如 '静态' / '依次弹出')
  background?: string;           // 背景一句话(如 '口播视频')
}

/** 镜头目录预览契约；缺省时由 schema/previewContract.mjs 做可审计推断。 */
export interface ScenePreviewContract {
  version: 1;
  kind: 'scene' | 'opaque-scene' | 'transparent-overlay' | 'speaker-context' | 'sidecard-pip';
  background?: 'scene' | 'opaque' | 'transparent';
  context?: 'none' | 'neutral-grid' | 'safe-speaker';
  galleryLoop?: 'loop' | 'once';
}

export interface SceneTag {
  /* —— 身份 —— */
  id: string;             // 必须 === sceneMap 注册键(闸会校验)
  componentName: string;  // 导出的组件名
  title: string;          // 人看的中文名
  // 9 组通俗分类(2026-07-14 小陈拍板)+ 4 运动家族组(2026-07-18 拍板,承接 remotion-kit 复刻批次),
  // 画廊/配镜目录按它分组。取值只能是这 13 个:
  // 口播 / 要点卡片 / 数据图表 / 截图·录屏 / AI 对话·终端 / 动画小剧场 / 语录·评论 / 转场·背景 / 片尾·关注
  // / 运动·空间文字 / 运动·转场遮罩 / 运动·路径纵深 / 运动·形变粒子
  category: string;
  // 风格归属(2026-07-18 小陈拍板,画廊按它呈现风格轴)。取值只能是 styles.ts STYLES[].id:
  // 品牌·奶油浅底 / 品牌·espresso深底 / 品牌·双主题 / 宣纸·墨 / VOX纸雕 / 中立
  // 判据:看镜头根层实际铺的底——CreamDriftBackdrop/bgCream=奶油浅底;FullBleedBackdrop/darkGlass=espresso深底;
  // 双底 props 或透底叠口播=双主题;用 ink.tsx 件=宣纸·墨;用 collage.tsx 件=VOX纸雕;颜色全 props 无默认=中立。
  style: string;
  // deprecated = 暂不给新片配:配镜目录与画廊都跳过它
  status: 'stable' | 'experimental' | 'deprecated';

  /* —— 给 AI 选镜头(意图)—— */
  intent: string;         // 一句话:这镜头让观众 get 什么 / 什么视觉动作
  suitableFor: string;    // 什么意图/内容点该用它
  notFor?: string;        // 什么时候别用(防 AI 滥用)
  exampleBeats?: string[];// 1-2 个真实口播节拍示例

  /* —— 构图位 —— */
  form: string;                 // 视觉形态(F0/F1/F2…)
  defaultPose: Pose;            // 默认口播姿态(对齐 poses.ts)
  supportedPoses?: Pose[];      // 能配合的口播位(默认 [defaultPose])
  fullscreenOnly?: boolean;     // true=只能全屏盖人(如 context 母题)
  needsExternalAsset: boolean;  // 要不要用户素材(截图/logo)
  assetType?: 'screenshot' | 'logo' | 'image' | 'video' | null;
  assetRoot?: string;           // 素材在 public/ 下哪个目录

  /* —— 文本绑定 —— */
  textBinding?: string;   // 哪个字段默认接口播文本(如 talk → 'label')

  /* —— 可编辑契约(自描述核心)—— */
  fields: SceneField[];

  /* —— 目录展示描述 —— */
  catalog?: SceneCatalog;

  /* —— 预览渲染(镜头目录画廊)—— */
  // 预览时长(秒,可选,缺省 6s):画廊 render-previews.mjs 优先读它。
  // 该值须覆盖完整 lockFrame/动画终态并留 ≥1s 定格——原脚本侧 DURATION_OVERRIDES
  // 手工表 2026-07-27 收编于此(时长单一真源随镜头走,新镜头不再漏登)。
  previewSeconds?: number;
  // 新镜头应显式声明；存量 1300+ 条允许不填，由结构化回退迁移并在 report 标出推断来源。
  preview?: ScenePreviewContract;

  /* —— 元 —— */
  tagVersion: 1;
  promotedFrom?: 'create-vibe-motion' | 'inline';
}
