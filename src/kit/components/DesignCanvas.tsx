/**
 * <DesignCanvas> — 把固定逻辑画布等比装入当前或指定视口。
 *
 * 镜头布局始终使用 1920×1080 等逻辑坐标；4K 只改变最终缩放，不参与
 * 内部几何计算。指定 viewportWidth/viewportHeight 时也可嵌入卡片或窗口。
 */
import React from 'react';
import {useVideoConfig} from 'remotion';

export type DesignCanvasProps = {
  children: React.ReactNode;
  width?: number;
  height?: number;
  viewportWidth?: number;
  viewportHeight?: number;
};

export const DesignCanvas: React.FC<DesignCanvasProps> = ({
  children,
  width = 1920,
  height = 1080,
  viewportWidth,
  viewportHeight,
}) => {
  const video = useVideoConfig();
  const targetWidth = viewportWidth ?? video.width;
  const targetHeight = viewportHeight ?? video.height;
  const scale = Math.min(targetWidth / width, targetHeight / height);
  const left = (targetWidth - width * scale) / 2;
  const top = (targetHeight - height * scale) / 2;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {children}
    </div>
  );
};
