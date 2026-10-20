# 词块集合 · 双栏面板展开

虚线容器长高、词块错峰弹入，灰色凹陷面板从背后向左展开，方法按钮逐项上弹，末段整组向右平移。默认文字为源片演示，全部信息、图形、纹理与阴影原生可编辑。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

在 `props.json` 修改九个词块 `words`、四个方法 `methods`、集合标签 `collectionLabel`、五段字幕 `captions`、配色与 `durationSeconds`。`variantLayout` 可切换三列词块网格。`docs/variant.json` 是已实际渲染的虚构项目示例，时长8.5秒。

默认30 fps / 194帧 / 6.466667秒，当前参考窗口原F4–197；本地帧+4即原片帧。运动在 `src/motion.ts` 与纯数值 `src/tracks.json`；原生绘制在 `src/Scene.tsx`。末段保留源片横向移动，没有补造点击或选中动作。

详细逐元素状态见 [关键帧与几何](docs/keyframes.md)，字体回退与近似边界见 [资产说明](docs/assets.md)。字体无需随包分发，Replica 不依赖源视频或源图片。内部 Trace/参考/测量材料只用于私有对照，公开包不含原片。

发布包不分发本机字体。英文使用 Arial，中文使用 PingFang SC / Microsoft YaHei 字体栈，缺失时回退到无衬线系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
