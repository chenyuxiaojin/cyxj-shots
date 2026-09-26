/** 惯性滚轮选择器：从历史 Rauno Craft A 镜头中独立提取。 */
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CreamDriftBackdrop} from '../components/CreamDriftBackdrop';
import {FullBleedBackdrop} from '../components/FullBleedBackdrop';
import {CLAMP} from '../components/motion';
import {FONT_STACKS, withAlpha} from '../components/styleTokens';
import type {SceneTag} from '../schema/sceneTag';
import {theme} from '../theme';

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));
const clampOpts = CLAMP;
const phase = (frame: number, from: number, to: number): number =>
  interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
const mapSpring = (value: number, from: number, to: number): number =>
  interpolate(value, [0, 1], [from, to], CLAMP);
const getScale = (width: number, height: number): number => Math.min(width / 1920, height / 1080);

type RcPalette = {fg: string; muted: string; surface: string; stroke: string};
const getPalette = (darkMode: boolean): RcPalette => darkMode
  ? {fg: theme.darkGlass.onDark, muted: theme.darkGlass.muted, surface: theme.darkGlass.surface, stroke: theme.darkGlass.stroke}
  : {fg: theme.colors.ink, muted: theme.colors.inkMuted, surface: theme.colors.surface, stroke: withAlpha(theme.colors.ink, 0.12)};
const RcBackdrop: React.FC<{darkMode: boolean}> = ({darkMode}) => darkMode
  ? <FullBleedBackdrop glows={[{tone: 'blue', x: 18, y: 22, strength: 0.18}, {tone: 'orange', x: 82, y: 78, strength: 0.14}]} vignette={0.34} />
  : <CreamDriftBackdrop />;

const RcCursor: React.FC<{x: number; y: number; scale: number; color: string; pressed?: boolean}> = ({x, y, scale, color, pressed = false}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 29 * scale, height: 37 * scale, transform: `translate(-4%,-4%) rotate(-16deg) scale(${pressed ? 0.8 : 1})`, transformOrigin: '4px 4px', filter: `drop-shadow(0 ${5 * scale}px ${8 * scale}px rgba(0,0,0,.28))`, zIndex: 30}}>
    <svg width="100%" height="100%" viewBox="0 0 29 37" aria-hidden="true"><path d="M3 2 25 20l-10 1 6 12-6 3-6-12-6 7Z" fill={color} stroke={theme.colors.white} strokeWidth="2" /></svg>
  </div>
);

const RcHeader: React.FC<{eyebrow: string; title: string; scale: number; color: string}> = ({eyebrow, title, scale, color}) => (
  <div style={{position: 'absolute', left: 110 * scale, top: 86 * scale}}>
    <div style={{fontFamily: FONT_STACKS.monoZh, fontSize: 24 * scale, letterSpacing: '.12em', color}}>{eyebrow}</div>
    <div style={{marginTop: 14 * scale, fontFamily: FONT_STACKS.zh, fontSize: 58 * scale, lineHeight: 1, fontWeight: 800, letterSpacing: '-.045em'}}>{title}</div>
  </div>
);

export type RcInertialSelectorSceneProps = {
  title?: string;
  values?: number[];
  selectedIndex?: number;
  unit?: string;
  accentColor?: string;
  darkMode?: boolean;
};

export const RcInertialSelectorScene: React.FC<RcInertialSelectorSceneProps> = ({
  title = '拖拽后仍保留惯性', values = [0.25, 0.5, 0.75, 1, 1.25, 1.5], selectedIndex = 4,
  unit = '×', accentColor = theme.colors.orange, darkMode = true,
}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const scale = getScale(width, height);
  const palette = getPalette(darkMode);
  const safeValues = values.length ? values : [1];
  const target = Math.min(safeValues.length - 1, Math.max(0, Math.round(selectedIndex)));
  const intro = spring({frame, fps, durationInFrames: 22, config: {damping: 18, stiffness: 150, mass: 0.76}});
  const drag = phase(frame, 30, 104);
  const coast = phase(frame, 104, 132);
  const settle = phase(frame, 132, 158);
  const overshoot = Math.min(safeValues.length - 1, target + 0.48);
  const indexPosition = frame < 104
    ? interpolate(drag, [0, 1], [0, overshoot], CLAMP)
    : frame < 132
      ? interpolate(coast, [0, 1], [overshoot, Math.max(0, target - 0.22)], CLAMP)
      : interpolate(settle, [0, 1], [Math.max(0, target - 0.22), target], CLAMP);
  const step = 174 * scale;
  const trackX = -indexPosition * step;
  const chosen = safeValues[target];
  const cursorX = interpolate(drag, [0, 1], [680, 1180], CLAMP) * scale;
  const cursorY = 678 * scale;
  return (
    <AbsoluteFill style={{overflow: 'hidden', color: palette.fg, fontFamily: FONT_STACKS.zh}}>
      <RcBackdrop darkMode={darkMode} />
      <RcHeader eyebrow="PRESET DRAG + INERTIA" title={title} scale={scale} color={accentColor} />
      <div style={{position: 'absolute', left: '50%', top: '54%', width: 1240 * scale, height: 360 * scale, transform: `translate(-50%,-50%) scale(${mapSpring(intro, 0.92, 1)})`, opacity: mapSpring(intro, 0, 1), background: palette.surface, border: `${1.5 * scale}px solid ${palette.stroke}`, borderRadius: 34 * scale, boxShadow: darkMode ? theme.shadow.dark : theme.shadow.card, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: '50%', top: 34 * scale, transform: 'translateX(-50%)', fontFamily: FONT_STACKS.monoZh, fontSize: 22 * scale, color: palette.muted}}>选择播放速度</div>
        <div style={{position: 'absolute', left: '50%', top: 104 * scale, width: 0, height: 160 * scale}}>
          <div style={{position: 'absolute', left: trackX - 73 * scale, display: 'flex', gap: 28 * scale}}>
            {safeValues.map((value, index) => {
              const distance = Math.abs(index - indexPosition);
              const focus = clamp01(1 - distance / 1.35);
              const itemScale = interpolate(focus, [0, 1], [0.82, 1.18], CLAMP);
              const isChosen = index === target && frame >= 118;
              return <div key={`${value}-${index}`} style={{width: 146 * scale, height: 122 * scale, borderRadius: 24 * scale, display: 'grid', placeItems: 'center', background: isChosen ? withAlpha(accentColor, 0.18) : withAlpha(palette.fg, 0.06), border: `${2 * scale}px solid ${isChosen ? accentColor : palette.stroke}`, transform: `scale(${itemScale})`, opacity: interpolate(focus, [0, 1], [0.45, 1], CLAMP)}}><span style={{fontFamily: FONT_STACKS.display, fontSize: 42 * scale, fontWeight: 800}}>{value}{unit}</span></div>;
            })}
          </div>
        </div>
        <div style={{position: 'absolute', left: '50%', bottom: 34 * scale, transform: 'translateX(-50%)', fontSize: 27 * scale, color: palette.muted}}>落点 <b style={{color: accentColor}}>{chosen}{unit}</b></div>
        <div style={{position: 'absolute', left: '50%', top: 86 * scale, bottom: 84 * scale, width: 3 * scale, transform: 'translateX(-50%)', background: accentColor, borderRadius: 999, boxShadow: `0 0 ${20 * scale}px ${withAlpha(accentColor, 0.4)}`}} />
      </div>
      <RcCursor x={cursorX} y={cursorY} scale={scale} color={accentColor} pressed={frame >= 30 && frame < 104} />
    </AbsoluteFill>
  );
};

export const rc006Tag: SceneTag = {
  id: 'rc006', componentName: 'RcInertialSelectorScene', title: 'RC A｜惯性滚轮选择器', category: '动画小剧场', style: '品牌·双主题', status: 'experimental',
  intent: '把拖拽轨迹、越界惯性和回弹落点完整演出来，表达连续选择器的物理手感。', suitableFor: '速度、倍数、档位、比例、日期或任意离散值滚轮。', notFor: '只有二元开关、需要精确键盘输入或条目很多且必须快速搜索的选择。', exampleBeats: ['拖到 1.25× 后继续滑一点，再回弹落定', '离散档位也能保留惯性手感'],
  form: 'F4', defaultPose: 'audio-only', fullscreenOnly: true, needsExternalAsset: false, assetType: null, textBinding: 'title',
  fields: [
    {key: 'title', label: '标题', type: 'text', tier: 'primary', default: '拖拽后仍保留惯性', required: true},
    {key: 'values', label: '选项数值', type: 'list', tier: 'primary', default: [0.25, 0.5, 0.75, 1, 1.25, 1.5], required: true, help: '数值数组，数量决定滚轮项数'},
    {key: 'selectedIndex', label: '落点序号', type: 'number', tier: 'primary', default: 4}, {key: 'unit', label: '单位', type: 'text', tier: 'primary', default: '×'},
    {key: 'accentColor', label: '强调色', type: 'color', tier: 'advanced'}, {key: 'darkMode', label: '深色模式', type: 'boolean', tier: 'advanced', default: true},
  ], catalog: {narratorPosition: '不出现/仅声音，全屏滚轮选择器', supportingElements: ['离散值卡', '中心落点线', '拖拽鼠标', '惯性回弹'], animation: '拖拽 → 越界惯性 → 反向回弹 → 对齐落点', background: 'XCYJ 品牌双主题'}, tagVersion: 1, promotedFrom: 'inline',
};

