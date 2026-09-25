/**
 * <ScenePreview> —— 镜头目录专用 composition 内容层。
 *
 * 与成片 <TalkingHead> 明确分家：直接渲染 SCENE_MAP 中的 scene，不挂 SpeakerTrack、
 * pose schedule 或 FadeWrap。只有 preview contract 明确要求口播上下文时，才在底层放
 * preview-only 安全占位；透明叠加镜头使用中性网格，纯场景不注入口播素材。
 */
import React from 'react';
import {
  AbsoluteFill,
  Html5Video,
  OffthreadVideo,
  staticFile,
  useRemotionEnvironment,
  useVideoConfig,
} from 'remotion';
import {theme} from '../theme';
import {SCENE_MAP} from './sceneMap';

export type ScenePreviewContractInput = {
  version: 1;
  kind: 'scene' | 'opaque-scene' | 'transparent-overlay' | 'speaker-context' | 'sidecard-pip';
  background: 'scene' | 'opaque' | 'transparent';
  context: 'none' | 'neutral-grid' | 'safe-speaker';
  galleryLoop: 'loop' | 'once';
};

export type ScenePreviewProps = {
  scene: {type: string; props: Record<string, unknown>};
  contract: ScenePreviewContractInput;
  /** 只能指向无真人的 preview-only 素材；渲染脚本会显式传值。 */
  safeSpeakerPlaceholder: string;
};

const NeutralGrid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: theme.darkGlass.bg,
      backgroundImage:
        `linear-gradient(45deg, ${theme.darkGlass.stroke} 25%, transparent 25%), ` +
        `linear-gradient(-45deg, ${theme.darkGlass.stroke} 25%, transparent 25%), ` +
        `linear-gradient(45deg, transparent 75%, ${theme.darkGlass.stroke} 75%), ` +
        `linear-gradient(-45deg, transparent 75%, ${theme.darkGlass.stroke} 75%)`,
      backgroundPosition: '0 0, 0 24px, 24px -24px, -24px 0',
      backgroundSize: '48px 48px',
    }}
  />
);

export const ScenePreview: React.FC<ScenePreviewProps> = ({
  scene,
  contract,
  safeSpeakerPlaceholder,
}) => {
  const Content = SCENE_MAP[scene.type];
  const {durationInFrames} = useVideoConfig();
  const env = useRemotionEnvironment();
  const Footage = env.isRendering ? OffthreadVideo : Html5Video;
  if (!Content) return null;

  // 口播上下文两种放法(2026-08-24 纸面口播底补):
  //   background 非 opaque(旧口径):占位视频全屏垫底,透明镜头浮其上(talk 等存量不变);
  //   background opaque(纸面家族口播底):镜头自带不透明底会盖死垫底层,改为把占位
  //   渲成 cardRight 缩卡浮在镜头上层——几何借 poses.cardRight 值(11%/4%/11%/54%,r22),
  //   仅预览仿真,成片中人由 TalkingHead 姿态系统渲。
  const speakerUnder = contract.context === 'safe-speaker' && contract.background !== 'opaque';
  const speakerCard = contract.context === 'safe-speaker' && contract.background === 'opaque';
  return (
    <AbsoluteFill style={{backgroundColor: theme.darkGlass.bg}}>
      {contract.context === 'neutral-grid' ? <NeutralGrid /> : null}
      {speakerUnder ? (
        <Footage
          src={staticFile(safeSpeakerPlaceholder)}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      ) : null}
      <Content {...scene.props} sceneDurationFrames={durationInFrames} />
      {speakerCard ? (
        <div
          style={{
            position: 'absolute',
            top: '11%',
            right: '4%',
            bottom: '11%',
            left: '54%',
            borderRadius: 22,
            overflow: 'hidden',
            boxShadow: '0 18px 40px rgba(30,26,20,0.22)',
          }}
        >
          <Footage
            src={staticFile(safeSpeakerPlaceholder)}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export default ScenePreview;
