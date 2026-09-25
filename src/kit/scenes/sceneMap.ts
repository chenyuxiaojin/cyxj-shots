/**
 * SCENE_MAP —— 镜头类型字符串 → 内容组件。TalkingHead / ScenePreview 据此把每个 scene 渲成图形。
 *
 * 库里只留会被反复复用的镜头;单片镜头留在出片工程 `src/scenes/`,经 registerScenes 接入。
 * 加一个库镜头:写受 props 驱动的组件 → 在这里登记一行 type → 组件 → 需要特殊姿态时在 poses.ts 加一条。
 */
import type React from 'react';
import { TitleScene, TalkScene, ListScene } from './content';
import { PictureInPictureSwapScene } from './PictureInPictureSwapScene';
import { PaperTypeScene } from './PaperTypeScene';
import { PaperAnnotateScene } from './PaperAnnotateScene';
import { ClaudeCodeWindowScene } from './ClaudeCodeWindowScene';
import { WeChatChatScene } from './WeChatChatScene';

export const SCENE_MAP: Record<string, React.FC<any>> = {
  talk: TalkScene,
  title: TitleScene,
  list: ListScene,
  pipswap: PictureInPictureSwapScene,
  papertype: PaperTypeScene,
  paperannotate: PaperAnnotateScene,
  ccwindow: ClaudeCodeWindowScene,
  wechatchat: WeChatChatScene,
};

/**
 * 工程本地镜头注册口 —— 出片工程把只属于本片的镜头(工程 `src/scenes/`)合并进查表,不进库。
 * TalkingHead / ScenePreview / 时长计算都查同一个 SCENE_MAP 对象,注册一次全局生效;同名键以工程为准。
 */
export function registerScenes(extra: Record<string, React.FC<any>>): void {
  Object.assign(SCENE_MAP, extra);
}
