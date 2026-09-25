/**
 * <PaperTypeScene> —— 纸面大字关键词(编辑部·纸面 8 件套 #4,2026-08-25 镜头库大修阶段1)。
 *
 * 岗位:旁白说到哪个词,哪个词砸上屏(拉片研究 元素#4:Vox kinetic 大字 + JH 钉词蒙太奇 + 差评君巨字)。
 * 两种形态,一个组件:
 *   · 核心形态(lines):宋体 900 巨字逐行按 atSec 砸上纸面(scale 盖章式干落地,家族语法),
 *     强调词档案黄荧光笔错峰扫亮(共享件 PaperMarkText);全部落定后只剩全片极缓推近。
 *   · 钉词蒙太奇变体(pinWord+plates):一个词钉在画面正中白纸条上纹丝不动,
 *     背后真实文献/截图整版硬切、节奏由慢到快(JH match cut on text:首张 ~14 帧,逐张加速至 4 帧);
 *     建议装配层给每次硬切配 tick 音效。
 * 硬规则:色值只从 styles.PAPER_PRESET 取(经 paper.tsx);interpolate 全带 clamp;
 * 随机只用 remotion random(seed)(板材微缩放,确定性)。
 */
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { EditableElement, useElementOverride } from '../components/EditableElement';
import { PAPER_FONTS, PaperMarkText, PaperStage } from '../components/paper';
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

export type PaperTypeSceneProps = {
  /** 核心形态:逐行砸上屏的关键词 */
  lines?: { text: string; atSec: number; accentWord?: string }[];
  /** 底部小注(淡墨拉字距,最后一行落定后浮现) */
  sub?: string;
  /** 钉词蒙太奇:钉在正中的词(与 plates 同时给才启用) */
  pinWord?: string;
  /** 钉词蒙太奇:背后硬切的真实文献/截图文件名数组(public/screenshots/ 下) */
  plates?: string[];
};

/** 蒙太奇硬切排程(30fps 基准帧):首张 14 帧,逐张加速至 4 帧封底 */
const plateStartsAt30 = (count: number): number[] => {
  const starts: number[] = [];
  let acc = 0;
  for (let i = 0; i < count; i++) {
    starts.push(acc);
    acc += Math.max(4, 14 - 2 * i);
  }
  return starts;
};

export const PaperTypeScene: React.FC<PaperTypeSceneProps> = ({
  lines,
  sub,
  pinWord,
  plates,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const subColor = useElementOverride('sub').color ?? P.inkSoft;

  // 30fps 基准换算
  const t = (f30: number) => Math.round((f30 / 30) * fps);

  const montage = Boolean(pinWord && plates && plates.length > 0);

  // ---- 钉词蒙太奇变体 ----
  if (montage) {
    const montageStart = t(6);
    const starts = plateStartsAt30(plates!.length).map((s) => montageStart + t(s));
    let current = 0;
    for (let i = 0; i < starts.length; i++) if (frame >= starts[i]) current = i;
    const pinScale = interpolate(frame, [montageStart, montageStart + t(6)], [1.35, 1], clampOut);
    const pinOp = interpolate(frame, [montageStart, montageStart + t(3)], [0, 1], clampLin);
    return (
      <AbsoluteFill style={{ fontFamily: SERIF }}>
        <PaperStage>
          {/* 真实板材整版硬切(JH:词不动,世界在换) */}
          {plates!.map((p, i) => (
            <div key={i} style={{ ...{ position: 'absolute', inset: 0 }, opacity: current === i && frame >= starts[i] ? 1 : 0 }}>
              <Img
                src={staticFile('screenshots/' + p)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  scale: String(1.02 + 0.04 * random('papertype-plate-' + i)),
                }}
              />
            </div>
          ))}
          {/* 钉词:白纸条 + 宋体 900,落定后纹丝不动 */}
          <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                background: P.card,
                color: P.ink,
                padding: '18px 46px',
                border: '1px solid rgba(38,35,30,0.08)',
                boxShadow: P.shadow,
                fontFamily: SERIF,
                fontWeight: 900,
                fontSize: 108,
                letterSpacing: 6,
                scale: String(pinScale),
                opacity: pinOp,
              }}
            >
              {pinWord}
            </div>
          </AbsoluteFill>
        </PaperStage>
      </AbsoluteFill>
    );
  }

  // ---- 核心形态:逐行砸词 ----
  const safeLines = lines ?? [];
  const lastAt = safeLines.reduce((m, ln) => Math.max(m, ln.atSec), 0);
  const subFrom = t(Math.round(lastAt * 30) + 10);
  const subOp = interpolate(frame, [subFrom, subFrom + t(10)], [0, 1], clampLin);
  const subY = interpolate(frame, [subFrom, subFrom + t(10)], [18, 0], clampOut);

  return (
    <AbsoluteFill style={{ fontFamily: SERIF }}>
      <PaperStage>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 26,
          }}
        >
          {safeLines.map((ln, i) => {
            const f0 = t(Math.round(ln.atSec * 30));
            const sc = interpolate(frame, [f0, f0 + t(6)], [1.42, 1], clampOut);
            const op = interpolate(frame, [f0, f0 + t(3)], [0, 1], clampLin);
            const sweep = interpolate(frame, [f0 + t(7), f0 + t(17)], [0, 100], {
              ...clampLin,
              easing: Easing.out(Easing.quad),
            });
            const size = interpolate(ln.text.length, [4, 14], [150, 96], clampLin);
            return (
              <div
                key={i}
                style={{
                  fontFamily: SERIF,
                  fontWeight: 900,
                  fontSize: size,
                  letterSpacing: 6,
                  lineHeight: 1.18,
                  textAlign: 'center',
                  color: P.ink,
                  opacity: op,
                  scale: String(sc),
                }}
              >
                <PaperMarkText text={ln.text} accentWord={ln.accentWord} sweepPct={sweep} />
              </div>
            );
          })}
          {sub ? (
            <EditableElement id="sub" label="小注" colorable>
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 30,
                  letterSpacing: 10,
                  color: subColor,
                  opacity: subOp,
                  translate: `0px ${subY}px`,
                }}
              >
                {sub}
              </div>
            </EditableElement>
          ) : null}
        </AbsoluteFill>
      </PaperStage>
    </AbsoluteFill>
  );
};

/** 镜头说明书(SceneTag)—— 见 ../schema/sceneTag.ts。 */
export const papertypeTag: SceneTag = {
  id: 'papertype',
  componentName: 'PaperTypeScene',
  title: '纸面大字关键词',
  category: '要点卡片',
  style: '编辑部·纸面',
  status: 'stable',
  intent:
    '旁白说到哪个词哪个词砸上纸面:宋体 900 巨字逐行盖章式干落地,强调词档案黄荧光笔错峰扫亮;另有钉词蒙太奇变体(词钉正中白纸条不动,背后真实文献整版硬切由慢到快)',
  suitableFor: '旁白点出核心关键词/金句/反转结论的段落;钉词蒙太奇适合「同一个词在无数材料里反复出现」的论证段',
  notFor: '要展示单份完整证据的段落(用 paperevidence);章节翻篇(用 papertransition);长句大段文字',
  exampleBeats: ['算力没变贵 是你终于用得起', '每一份报告里都在说同一个词'],
  form: 'F4',
  defaultPose: 'audio-only',
  fullscreenOnly: true,
  needsExternalAsset: false,
  assetType: null,
  textBinding: 'lines',
  fields: [
    {
      key: 'lines',
      label: '关键词行',
      type: 'list',
      tier: 'primary',
      help: '逐行砸上屏的关键词(1-3 行,短词短句);atSec 对齐旁白说到该词的时刻',
      itemFields: [
        { key: 'text', label: '词句', type: 'text', tier: 'primary', required: true },
        { key: 'atSec', label: '砸上秒', type: 'number', tier: 'primary', required: true },
        { key: 'accentWord', label: '荧光笔词', type: 'text', tier: 'primary', help: '该行里要扫亮的子串;留空不扫' },
      ],
      example: [
        { text: '算力没变贵', atSec: 0.3, accentWord: '没变贵' },
        { text: '是你终于用得起', atSec: 1.5, accentWord: '用得起' },
      ],
    },
    {
      key: 'sub',
      label: '小注',
      type: 'text',
      tier: 'primary',
      help: '底部淡墨拉字距小字,最后一行落定后浮现;留空不出',
      example: 'THE REAL SHIFT',
    },
    {
      key: 'pinWord',
      label: '钉词',
      type: 'text',
      tier: 'advanced',
      help: '钉词蒙太奇变体:钉在正中白纸条上的词;与 plates 同时给才启用,启用后 lines 不渲',
    },
    {
      key: 'plates',
      label: '蒙太奇板材',
      type: 'list',
      tier: 'advanced',
      help: '真实文献/截图文件名数组(public/screenshots/ 下),每项一个文件名字符串;背后整版硬切由慢到快(建议装配层每切配 tick 音效)',
    },
  ],
  catalog: {
    narratorPosition: '不出现/仅声音',
    supportingElements: ['档案黄荧光笔', '底部小注', '方格纸网格'],
    animation:
      '宋体巨字逐行盖章式干落地(旁白说到哪行哪行砸上)→ 强调词荧光笔错峰扫亮 → 小注浮现;钉词蒙太奇变体=词钉正中不动、背后板材硬切由慢到快;全部落定后只剩极缓推近',
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

export default PaperTypeScene;
