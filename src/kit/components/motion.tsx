/**
 * motion.tsx — 全库帧动画基础常量。
 *
 * 旧版 FadeIn / SlideIn / Pop 从未被任何镜头或项目消费，且它们的额外
 * wrapper 会干扰绝对定位和复合 transform，因此按 2026-07-10 审计结论退役。
 * 具体入场继续由镜头按语义组合；出现真正逐字相同的复用后再晋升共享件。
 */

/** 所有 interpolate 的统一边界策略。 */
export const CLAMP = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;
