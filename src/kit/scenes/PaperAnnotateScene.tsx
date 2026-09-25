/**
 * <PaperAnnotateScene> —— 纸面批注(编辑部·纸面 8 件套 #5,2026-08-25 镜头库大修阶段1)。
 *
 * 岗位:标注层(拉片研究 元素#5)——旁白读到哪句,笔就落到哪句:文段先摆上纸,
 * 黄荧光笔/红笔下划线/红圈/划掉按 atSec 逐个画上(每一刻只有一支笔在动,响色只给当前重点),
 * 红印章(RedSeal 手法,差评君真源:multiply 让印泥吃进纸纹)最后定论。
 * 全部批注免 DOM 测量:荧光/下划线/划掉 = span 背景带扫入;红圈 = 词内随盒 SVG 椭圆描线
 * (HARD_RULES 战疤11-③:随内容缩放的标注自画 SVG,不用 rough-notation)。
 *
 * 约定:被 TalkingHead 套在 <Sequence> 里渲染;段尾淡出由 FadeWrap 统一负责。
 * 硬规则:色值只从 styles.PAPER_PRESET 取(经 paper.tsx);interpolate 全带 clamp。
 */
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { EditableElement, useElementOverride } from '../components/EditableElement';
import { PAPER_FONTS, PaperSeal, PaperStage } from '../components/paper';
import { PAPER_PRESET } from '../styles';
import type { SceneTag } from '../schema/sceneTag';

const P = PAPER_PRESET;
const { serif: SERIF, sans: SANS } = PAPER_FONTS;

/** 小写命名以匹配 hard-rules 守卫的 clamp 检测 */
const clampLin = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const clampOut = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
  easing: Easing.out(Easing.cubic),
} as const;
const clampQuad = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
  easing: Easing.out(Easing.quad),
} as const;

export type PaperMarkKind = 'highlight' | 'underline' | 'circle' | 'strike';

export type PaperAnnotateSceneProps = {
  /** 文段(逐行给,一项一行) */
  lines?: string[];
  /** 批注:find=要标的子串(取首个命中行),kind=笔法,atSec=落笔秒 */
  marks?: { find: string; kind?: PaperMarkKind; atSec: number }[];
  /** 红印章定论(最后一笔) */
  seal?: { text: string; atSec: number };
  /** 出处小字(右下,随文段一起浮现) */
  source?: string;
};

type MarkSpec = { find: string; kind?: PaperMarkKind; atSec: number };

/** 一行按命中的批注切段(命中段挂 mark;重叠命中丢弃后者) */
const segmentLine = (
  line: string,
  marks: MarkSpec[],
): Array<{ text: string; mark?: MarkSpec }> => {
  const hits = marks
    .map((m) => ({ m, i: m.find ? line.indexOf(m.find) : -1 }))
    .filter((h) => h.i !== -1)
    .sort((a, b) => a.i - b.i);
  const segs: Array<{ text: string; mark?: MarkSpec }> = [];
  let pos = 0;
  for (const h of hits) {
    if (h.i < pos) continue;
    if (h.i > pos) segs.push({ text: line.slice(pos, h.i) });
    segs.push({ text: h.m.find, mark: h.m });
    pos = h.i + h.m.find.length;
  }
  if (pos < line.length) segs.push({ text: line.slice(pos) });
  return segs;
};

/** 批注段的 span 样式(highlight 带与共享件 PaperMarkText 同参:58% 带高/82% 落位) */
const markSpanStyle = (kind: PaperMarkKind, sweepPct: number): React.CSSProperties => {
  if (kind === 'highlight') {
    return {
      backgroundImage: `linear-gradient(rgba(227,179,58,0.62), rgba(227,179,58,0.62))`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${sweepPct}% 58%`,
      backgroundPosition: '0% 82%',
      padding: '0 6px',
    };
  }
  if (kind === 'underline') {
    return {
      backgroundImage: `linear-gradient(rgba(169,59,45,0.85), rgba(169,59,45,0.85))`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${sweepPct}% 6%`,
      backgroundPosition: '0% 99%',
      padding: '0 2px',
    };
  }
  // strike:红笔从中间划掉,被划的字仍看得见(HARD_RULES 战疤11-②)
  return {
    backgroundImage: `linear-gradient(rgba(169,59,45,0.8), rgba(169,59,45,0.8))`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${sweepPct}% 7%`,
    backgroundPosition: '0% 56%',
    padding: '0 2px',
  };
};

export const PaperAnnotateScene: React.FC<PaperAnnotateSceneProps> = ({
  lines,
  marks,
  seal,
  source,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sourceColor = useElementOverride('source').color ?? P.inkSoft;

  // 30fps 基准换算
  const t = (f30: number) => Math.round((f30 / 30) * fps);

  const safeLines = lines ?? [];
  const safeMarks = marks ?? [];

  // 每条批注归到首个命中行(避免多行重复标)
  const perLine: MarkSpec[][] = safeLines.map(() => []);
  for (const m of safeMarks) {
    const li = safeLines.findIndex((ln) => m.find && ln.includes(m.find));
    if (li !== -1) perLine[li].push(m);
  }

  // 文段整块先摆上纸(批注在它落定后才开始)
  const blockOp = interpolate(frame, [t(4), t(10)], [0, 1], clampLin);
  const blockY = interpolate(frame, [t(4), t(14)], [24, 0], clampOut);

  const markProgress = (m: MarkSpec) => {
    const f0 = t(Math.round(m.atSec * 30));
    const dur = (m.kind ?? 'highlight') === 'circle' ? t(14) : t(12);
    return interpolate(frame, [f0, f0 + dur], [0, 1], clampQuad);
  };

  const sealF0 = seal ? t(Math.round(seal.atSec * 30)) : 0;

  return (
    <AbsoluteFill style={{ fontFamily: SERIF }}>
      <PaperStage>
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              position: 'relative',
              maxWidth: 1240,
              opacity: blockOp,
              translate: `0px ${blockY}px`,
            }}
          >
            {safeLines.map((line, li) => (
              <div
                key={li}
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: 46,
                  lineHeight: 1.85,
                  letterSpacing: 2,
                  color: P.ink,
                }}
              >
                {segmentLine(line, perLine[li]).map((seg, si) => {
                  if (!seg.mark) return <span key={si}>{seg.text}</span>;
                  const kind = seg.mark.kind ?? 'highlight';
                  const p = markProgress(seg.mark);
                  if (kind === 'circle') {
                    return (
                      <span
                        key={si}
                        style={{ position: 'relative', display: 'inline-block', padding: '0 4px' }}
                      >
                        {seg.text}
                        {/* 随盒 SVG 红圈描线:pathLength 归一免测量,随内容缩放笔触不变形 */}
                        <svg
                          style={{
                            position: 'absolute',
                            inset: '-12% -9%',
                            width: '118%',
                            height: '124%',
                            overflow: 'visible',
                            rotate: '-2deg',
                            pointerEvents: 'none',
                          }}
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <ellipse
                            cx="50"
                            cy="50"
                            rx="49"
                            ry="46"
                            fill="none"
                            stroke={P.red}
                            strokeWidth={3}
                            vectorEffect="non-scaling-stroke"
                            pathLength={1}
                            strokeDasharray={1}
                            strokeDashoffset={1 - p}
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    );
                  }
                  return (
                    <span key={si} style={markSpanStyle(kind, p * 100)}>
                      {seg.text}
                    </span>
                  );
                })}
              </div>
            ))}
            {source ? (
              <EditableElement id="source" label="出处" colorable>
                <div
                  style={{
                    marginTop: 26,
                    textAlign: 'right',
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: 26,
                    letterSpacing: 2,
                    color: sourceColor,
                  }}
                >
                  {source}
                </div>
              </EditableElement>
            ) : null}
            {seal ? (
              <div style={{ position: 'absolute', right: -46, top: -54 }}>
                <PaperSeal text={seal.text} at={sealF0} />
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
      </PaperStage>
    </AbsoluteFill>
  );
};

/** 镜头说明书(SceneTag)—— 见 ../schema/sceneTag.ts。 */
export const paperannotateTag: SceneTag = {
  id: 'paperannotate',
  componentName: 'PaperAnnotateScene',
  title: '纸面批注',
  category: '语录·评论',
  style: '编辑部·纸面',
  status: 'stable',
  intent:
    '旁白读到哪句笔就落到哪句:文段先摆上纸,黄荧光笔/红笔下划线/红圈/划掉按时刻逐笔画上(每一刻只有一支笔在动),红印章 multiply 吃进纸纹做最后定论',
  suitableFor: '逐句拆解一段引文/条款/说法的段落;划重点、圈关键词、划掉错误说法、盖章定论的论证节拍',
  notFor: '展示整份图像证据(用 paperevidence);单个关键词砸屏(用 papertype);无逐句拆解需求的段落',
  exampleBeats: ['注意这句话里的这个词', '这个说法直接划掉'],
  form: 'F4',
  defaultPose: 'audio-only',
  fullscreenOnly: true,
  needsExternalAsset: false,
  assetType: null,
  textBinding: 'lines',
  fields: [
    {
      key: 'lines',
      label: '文段',
      type: 'list',
      tier: 'primary',
      required: true,
      help: '要批注的文段,一项一行(每项一个字符串);建议 2-4 行短句',
      example: ['大模型的能力没有上限,', '真正的上限是你的想象力,', '和你敢不敢把它用到极限。'],
    },
    {
      key: 'marks',
      label: '批注',
      type: 'list',
      tier: 'primary',
      help: '按旁白节奏逐笔落:find=要标的子串(取首个命中行),atSec=落笔秒',
      itemFields: [
        { key: 'find', label: '标注子串', type: 'text', tier: 'primary', required: true },
        {
          key: 'kind',
          label: '笔法',
          type: 'enum',
          tier: 'primary',
          values: ['highlight', 'underline', 'circle', 'strike'],
          default: 'highlight',
          help: 'highlight=黄荧光笔;underline=红笔下划线;circle=红圈描线;strike=红笔划掉(字仍可见)',
        },
        { key: 'atSec', label: '落笔秒', type: 'number', tier: 'primary', required: true },
      ],
      example: [
        { find: '真正的上限', kind: 'highlight', atSec: 0.8 },
        { find: '想象力', kind: 'circle', atSec: 1.6 },
        { find: '敢不敢', kind: 'underline', atSec: 2.3 },
      ],
    },
    {
      key: 'seal',
      label: '红印章',
      type: 'group',
      tier: 'primary',
      help: '最后定论的印章(差评君 RedSeal 手法:multiply 吃进纸纹);不给则不出',
      fields: [
        { key: 'text', label: '章文', type: 'text', tier: 'primary', required: true },
        { key: 'atSec', label: '盖章秒', type: 'number', tier: 'primary', required: true },
      ],
      example: { text: '已验证', atSec: 3 },
    },
    {
      key: 'source',
      label: '出处',
      type: 'text',
      tier: 'primary',
      help: '右下出处小字,保证据感;留空不出',
      example: '—— 工作台实录 2026',
    },
  ],
  catalog: {
    narratorPosition: '不出现/仅声音',
    supportingElements: ['黄荧光笔', '红笔下划线·红圈·划掉', '红印章', '出处小字', '方格纸网格'],
    animation:
      '文段先浮上纸 → 批注按 atSec 逐笔画上(荧光带扫入、红圈 SVG 描线、下划线/划掉扫入;每一刻只有一支笔动)→ 红印章 1.7→1 盖下(multiply 吃纸纹);全部落定后只剩极缓推近',
    background: '家族纸底 PaperStage(浅暖灰米 + 方格纸 + 颗粒 + 暗角,零辉光)',
  },
  preview: {
    version: 1,
    kind: 'opaque-scene',
    background: 'opaque',
    context: 'none',
    galleryLoop: 'once',
  },
  previewSeconds: 4,
  tagVersion: 1,
};

export default PaperAnnotateScene;
