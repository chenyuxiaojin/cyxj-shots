/**
 * <FinderOrganizeScene> —— macOS Finder「乱 → 自动整理 → 分门别类入文件夹」动画(《CLAUDE.md 分家》S5,2026-06-30)。
 *
 * 隐喻:一堆乱七八糟的文件 → 自动归位成网格 → 按类别飞进各自文件夹 = 把 CLAUDE.md「分了一次家」。
 * 还原依据:联网研究真实 Sonoma/Sequoia 浅色 Finder UI(规格见出片工程 docs/S5-finder-spec.md):
 *   交通灯 12px·窗口圆角 10px·近白工具栏·文件夹蓝竖渐变+顶 tab·文档白纸折角·图标网格。
 *   ⚠️ Finder 系统色是【还原 macOS】,刻意用真实系统色(蓝/交通灯),不套品牌橙——这是"像不像 Mac"的命门。
 *
 * 三幕(5.7s≈171f@30):乱 0–1.2s → spring 吸附整理 1.2–3.7s(错峰)→ 入夹 2.0s(缩进文件夹+夹口回弹)。
 * 工程(HARD_RULES):全程 useCurrentFrame 驱动;两 spring 叠成 phase p∈[0,2] 走 散布→网格→夹;
 *   random(seed) 确定性散布;interpolate 全 clamp;无 CSS 动画/随机时钟。
 */
import {CLAMP as MOTION_CLAMP} from '../components/motion';
import {FONT_STACKS} from '../components/styleTokens';
import React from 'react';
import type { SceneTag } from '../schema/sceneTag';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';
import { MacFolderIcon, MacDocIcon } from '../components/MacIcons';

const clampOpts = MOTION_CLAMP;
const FONT = FONT_STACKS.zh;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 研究得到的真实 Finder 浅色系统色(规格 docs/S5-finder-spec.md;还原 macOS 不走品牌 token)。 */
const F = {
  desktop: 'linear-gradient(155deg,#34291f,#1d150f)', // 窗口身后的桌面(走品牌 espresso 暗向,让白窗弹出)
  windowBg: '#FFFFFF',
  toolbar: 'linear-gradient(180deg,#FCFCFC,#F1F1F2)',
  divider: '#E2E2E4',
  sidebar: 'rgba(242,242,247,0.96)',
  selBlue: '#007AFF',
  text: 'rgba(0,0,0,0.82)',
  textMuted: 'rgba(0,0,0,0.35)',
  lights: ['#FF5F57', '#FEBC2E', '#28C840'],
};

const TrafficLights: React.FC = () => (
  <div style={{ display: 'flex', gap: 8, position: 'absolute', left: 18, top: 17 }}>
    {F.lights.map((c, i) => (
      <div key={i} style={{ width: 13, height: 13, borderRadius: 7, background: c, boxShadow: `inset 0 0 0 0.5px rgba(0,0,0,0.12)` }} />
    ))}
  </div>
);

export type FinderOrganizeSceneProps = {
  /** 目标文件夹标签(1–N 个,分门别类去向;默认 3 个)。 */
  folders?: string[];
  /** 窗口标题(工具栏中央)。 */
  title?: string;
};

const TAG_COLORS = [theme.colors.blue, theme.colors.orange, theme.focusTones.green.label];

export const FinderOrganizeScene: React.FC<FinderOrganizeSceneProps> = ({
  folders = ['项目规则', 'Hooks', 'Skills'],
  title = '我的项目',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 护栏:文件夹为空时文档无处可归,整镜不渲(避免下游 Math.max 空数组 → -Infinity 崩溃)
  if (folders.length === 0) return null;

  // ── 窗口几何(@1080 设计)──
  const winW = 1300;
  const winH = 770;
  const winX = (1920 - winW) / 2;
  const winY = (1080 - winH) / 2 - 6;
  const titleH = 48;
  const sideW = 212;
  const cx0 = sideW; // 内容区左(窗口内局部)
  const cy0 = titleH; // 内容区上
  const contentW = winW - sideW;

  // ── 8 个文档 → 按夹数均匀分派 ──
  const N = 8;
  // 哪个文档进哪个夹:按 folders.length 动态均匀分派;3 夹时恰为旧写死表 [0,0,0,1,1,1,2,2],逐帧行为不变
  const assign = Array.from({ length: N }, (_, i) => Math.floor((i * folders.length) / N));

  // 文件夹落位(内容区底部一排,窗口局部坐标)
  const folderW = 104;
  const folderY = cy0 + 545;
  const folderXs = folders.map((_, k) => cx0 + 150 + k * ((contentW - 230) / Math.max(1, folders.length - 1)));

  // 文档网格落位(内容区上半,4 列 × 2 行)
  const cols = 4;
  const gridX0 = cx0 + 95;
  const gridY0 = cy0 + 78;
  const colGap = (contentW - 200) / (cols - 1);
  const rowGap = 196;

  // 三幕时间(帧)
  const A2 = 36; // 整理起点
  const A3 = 112; // 入夹起点

  return (
    <AbsoluteFill style={{ background: F.desktop }}>
      {/* 桌面暖暗纹理上的居中 Finder 窗口 */}
      <div
        style={{
          position: 'absolute',
          left: winX,
          top: winY,
          width: winW,
          height: winH,
          borderRadius: 11,
          background: F.windowBg,
          overflow: 'hidden',
          boxShadow: '0 40px 90px -20px rgba(0,0,0,0.55), 0 12px 30px -12px rgba(0,0,0,0.4)',
          fontFamily: FONT,
        }}
      >
        {/* 工具栏 / 标题栏 */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: titleH, background: F.toolbar, borderBottom: `1px solid ${F.divider}` }}>
          <TrafficLights />
          {/* 后退/前进 占位 */}
          <div style={{ position: 'absolute', left: 96, top: 14, display: 'flex', gap: 14, color: F.textMuted, fontSize: 18 }}>
            <span>‹</span>
            <span>›</span>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 14, textAlign: 'center', fontSize: 16, fontWeight: 700, color: F.text }}>{title}</div>
          {/* 视图切换 / 搜索 占位 */}
          <div style={{ position: 'absolute', right: 150, top: 16, display: 'flex', gap: 10 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 18, height: 14, borderRadius: 3, background: i === 1 ? F.selBlue : 'rgba(0,0,0,0.16)' }} />
            ))}
          </div>
          <div style={{ position: 'absolute', right: 16, top: 11, width: 118, height: 25, borderRadius: 7, background: 'rgba(0,0,0,0.05)', border: `1px solid ${F.divider}` }} />
        </div>

        {/* 侧边栏 */}
        <div style={{ position: 'absolute', left: 0, top: titleH, width: sideW, bottom: 0, background: F.sidebar, borderRight: `1px solid ${F.divider}`, padding: '18px 14px' }}>
          {['个人收藏', 'iCloud', '位置'].map((g, gi) => (
            <div key={gi} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: F.textMuted, letterSpacing: 0.5, marginBottom: 8 }}>{g}</div>
              {[0, 1, 2].map((r) => {
                const sel = gi === 0 && r === 1;
                return (
                  <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 9, height: 26, padding: '0 8px', borderRadius: 6, background: sel ? F.selBlue : 'transparent' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: sel ? '#fff' : 'rgba(0,0,0,0.22)' }} />
                    <div style={{ width: 78 - r * 12, height: 7, borderRadius: 4, background: sel ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.16)' }} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 内容区:文件夹(目标)+ 文档(动) */}
        {/* 目标文件夹 + 标签 */}
        {folders.map((label, k) => {
          // 接住回弹:当分派到该夹的文档陆续到达(p→2)时给一个小 pop
          const docsHere = assign.map((a, i) => (a === k ? i : -1)).filter((i) => i >= 0);
          // 护栏:夹数 > 文档数时该夹可能分不到文档——docsHere 为空则不回弹(否则 Math.max(...[]) = -Infinity 会让 interpolate inputRange 非法直接崩)
          const lastArrive = docsHere.length > 0 ? Math.max(...docsHere.map((i) => A3 + i * 3 + 16)) : null;
          const pop = lastArrive === null ? 0 : interpolate(frame, [lastArrive - 6, lastArrive, lastArrive + 10], [0, 1, 0], clampOpts);
          const appear = interpolate(frame, [10 + k * 4, 26 + k * 4], [0, 1], clampOpts);
          return (
            <div key={k} style={{ position: 'absolute', left: folderXs[k] - folderW / 2, top: folderY, width: folderW, textAlign: 'center', opacity: appear }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <MacFolderIcon w={folderW} idx={k} pop={pop} />
              </div>
              <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700, color: F.text }}>{label}</div>
            </div>
          );
        })}

        {/* 文档:散布 → 网格 → 入夹 */}
        {Array.from({ length: N }).map((_, i) => {
          const docW = 62;
          // 散布位(确定性 random,内容区内)
          const sx = lerp(cx0 + 50, cx0 + contentW - 110, random(`x${i}`));
          const sy = lerp(cy0 + 40, cy0 + 470, random(`y${i}`));
          const srot = (random(`r${i}`) - 0.5) * 18;
          // 网格位
          const gx = gridX0 + (i % cols) * colGap;
          const gy = gridY0 + Math.floor(i / cols) * rowGap;
          // 入夹位(目标文件夹口中心)
          const fk = assign[i];
          const fx = folderXs[fk];
          const fy = folderY + folderW * 0.32;

          // 两 spring 叠 phase:p 0(散)→1(网格)→2(夹)
          const a2 = spring({ frame: frame - (A2 + i * 3), fps, config: { damping: 17, mass: 0.8 } });
          const a3 = spring({ frame: frame - (A3 + i * 3), fps, config: { damping: 15, mass: 0.7 } });
          const p = a2 + a3;

          const x = interpolate(p, [0, 1, 2], [sx, gx, fx], clampOpts);
          const y = interpolate(p, [0, 1, 2], [sy, gy, fy], clampOpts);
          const scale = interpolate(p, [0, 1, 1.55, 2], [1, 1, 1, 0.06], clampOpts);
          const rot = interpolate(p, [0, 1], [srot, 0], clampOpts);
          const op = interpolate(p, [1.72, 1.98], [1, 0], clampOpts);

          return (
            <div key={i} style={{ position: 'absolute', left: x - docW / 2, top: y, transform: `rotate(${rot}deg) scale(${scale})`, opacity: op, willChange: 'transform' }}>
              <MacDocIcon w={docW} tag={TAG_COLORS[fk % TAG_COLORS.length]} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const finderorganizeTag: SceneTag = {
  id: 'finderorganize',
  componentName: 'FinderOrganizeScene',
  title: '文件自动归类',
  category: '动画小剧场',
  style: '品牌·espresso深底',
  status: 'stable',
  intent: '还原真实 macOS 浅色 Finder 窗口:一堆乱序文档 spring 吸附成网格,再按类别缩进飞入各自文件夹(夹口回弹)= 把东西「分了一次家」',
  suitableFor: '「把一堆乱七八糟的东西自动分门别类、各归各位」的通用比喻段落——不只 CLAUDE.md 分家:整理项目结构、文件归类、任何「散乱→有序归位」都可',
  notFor: '需要品牌橙色调的卡片(本镜刻意用真实 macOS 系统色,不套品牌 token);需要真人出镜或非「文件归类」比喻的内容',
  exampleBeats: ['把它分一次家,乱糟糟的东西各归各位', '规则、Hooks、Skills,自动归到该去的文件夹'],
  form: 'F2',
  defaultPose: 'audio-only',
  supportedPoses: ['audio-only'],
  fullscreenOnly: true,
  needsExternalAsset: false,
  assetType: null,
  textBinding: 'title',
  fields: [
    {
      key: 'folders',
      label: '目标文件夹',
      type: 'list',
      tier: 'primary',
      help: '目标文件夹标签(分门别类的去向;8 个文档按夹数均匀分派飞入,3 夹时即 [0,0,0,1,1,1,2,2]);每项一个文件夹名字符串(标量数组)',
      default: ['项目规则', 'Hooks', 'Skills'],
    },
    { key: 'title', label: '窗口标题', type: 'text', tier: 'primary', default: '我的项目', help: 'Finder 工具栏中央的窗口标题' },
  ],
  catalog: {
    narratorPosition: '不出现/仅声音,全屏 Finder 窗口盖住口播',
    supportingElements: ['macOS Finder 浅色窗口', '乱序文档', '目标文件夹'],
    animation: '其他-文档散乱 → spring 吸附成 4×2 网格 → 按类别缩进飞入各自文件夹(接住回弹 pop)',
    background: '暖暗桌面(espresso 向)上的居中 Finder 浅色窗口',
  },
  tagVersion: 1,
  promotedFrom: 'inline',
};

export default FinderOrganizeScene;
