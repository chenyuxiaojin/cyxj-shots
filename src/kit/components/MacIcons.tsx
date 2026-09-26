/**
 * <MacFolderIcon> / <MacDocIcon> —— 还原 macOS 真实「文件夹 / 文档」图标(矢量,确定性)。
 *
 * 来源:联网研究真实 Sonoma/Sequoia Finder 图标(规格见出片工程 docs/S5-finder-spec.md):
 *   文件夹 = 后片 + 顶 tab(露左上)+ 前片竖向蓝渐变;文档 = 白纸 + 右上折角 + 几条灰文字线 + 可选底部类别色条。
 *   ⚠️ 这是【还原 macOS 系统色】,刻意用真实蓝/白,不套品牌橙 token——"像不像 Mac"的命门。
 *   tint='accent' 给文件夹换成品牌陶土橙(用于强调某个"特殊文件夹",如路由锚点)。
 *
 * 共享:S5 finderorganize、S9 splitreveal four 都用 → 真实文件/文件夹是本片的视觉词汇(晋升候选)。
 * 工程:纯 SVG,无状态、无随机/时钟;父层用 useCurrentFrame 驱动 transform/opacity,本组件只画静态形。
 */
import React from 'react';

const FOLDER = {
  blue: { top: '#27A0FF', bot: '#0A6CE0', tab: '#5FB8F0', shadow: 'rgba(8,60,140,0.30)' },
  accent: { top: '#E79A7E', bot: '#C25C3C', tab: '#EFB39E', shadow: 'rgba(120,60,40,0.32)' },
} as const;

const DOC = {
  paper: '#FFFFFF',
  stroke: '#D9D9DD',
  fold: '#E9E9EC',
  line: '#D2D2D7',
};

/** 文件夹图标:tint 选蓝(默认)或陶土橙;idx 保证 gradient id 唯一;pop 接住回弹(0..1)。 */
export const MacFolderIcon: React.FC<{ w: number; idx?: number; tint?: 'blue' | 'accent'; pop?: number }> = ({
  w,
  idx = 0,
  tint = 'blue',
  pop = 0,
}) => {
  const c = FOLDER[tint];
  const gid = `macfg-${tint}-${idx}`;
  return (
    <svg
      width={w}
      height={w * 0.8}
      viewBox="0 0 120 96"
      style={{ display: 'block', transform: `scale(${1 + pop * 0.12})`, filter: `drop-shadow(0 6px 10px ${c.shadow})` }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.top} />
          <stop offset="1" stopColor={c.bot} />
        </linearGradient>
      </defs>
      <path
        d="M6,30 V20 a7,7 0 0 1 7,-7 h28 a7,7 0 0 1 5.5,2.8 l5,7 h56 a7,7 0 0 1 7,7 V72 a7,7 0 0 1 -7,7 H13 a7,7 0 0 1 -7,-7 Z"
        fill={c.tab}
      />
      <rect x="6" y="33" width="108" height="50" rx="9" fill={`url(#${gid})`} />
    </svg>
  );
};

/** 文档图标:白纸 + 右上折角 + 几条灰文字线 + 可选底部类别色条(tag)。 */
export const MacDocIcon: React.FC<{ w: number; tag?: string }> = ({ w, tag }) => (
  <svg width={w} height={w * 1.28} viewBox="0 0 80 102" style={{ display: 'block', filter: 'drop-shadow(0 5px 9px rgba(40,30,20,0.22))' }}>
    <path
      d="M12,4 h40 l20,20 v70 a5,5 0 0 1 -5,5 H12 a5,5 0 0 1 -5,-5 V9 a5,5 0 0 1 5,-5 Z"
      fill={DOC.paper}
      stroke={DOC.stroke}
      strokeWidth="1.4"
    />
    <path d="M52,4 v15 a5,5 0 0 0 5,5 h15 Z" fill={DOC.fold} />
    <rect x="18" y="44" width="44" height="4" rx="2" fill={DOC.line} />
    <rect x="18" y="55" width="44" height="4" rx="2" fill={DOC.line} />
    <rect x="18" y="66" width="30" height="4" rx="2" fill={DOC.line} />
    {tag ? <rect x="12" y="84" width="56" height="6" rx="3" fill={tag} /> : null}
  </svg>
);
