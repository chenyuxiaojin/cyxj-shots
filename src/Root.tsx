/**
 * 每个镜头一个 composition,id 就是镜头名。内容全在 src/shots.json:
 * 改 scene.props 换文字 / 数据，改 durationInSeconds 换时长。可改字段见各镜头文件尾的 xxxTag.fields。
 */
import React from 'react';
import { Composition } from 'remotion';
import { ScenePreview, type ScenePreviewProps } from './kit/scenes/ScenePreview';
import shots from './shots.json';

type ShotProps = ScenePreviewProps & { durationInSeconds: number; width?: number; height?: number };
const FPS = 30;
const Shot = ScenePreview as unknown as React.FC<Record<string, unknown>>;

export const RemotionRoot: React.FC = () => (
  <>
    {Object.entries(shots as unknown as Record<string, ShotProps>).map(([id, props]) => (
      <Composition
        key={id}
        id={id}
        component={Shot}
        defaultProps={props as unknown as Record<string, unknown>}
        fps={FPS}
        width={props.width ?? 1920}
        height={props.height ?? 1080}
        durationInFrames={Math.round(props.durationInSeconds * FPS)}
      />
    ))}
  </>
);
