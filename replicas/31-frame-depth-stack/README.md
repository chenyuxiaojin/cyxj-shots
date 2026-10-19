# 屏幕纵深帧栈

显示器外壳退去，屏幕沿纵深依次复制为六层画面。保留原片前屏左移、镜头回移和片尾微移。空间运动由独立的图像面和透视矩阵重建，可逐层替换图片。

```sh
npm ci
npm run dev
npm run check
npm run preview
npm run variant
```

默认成片为 1920×1080、30 fps、121 帧（4.033 秒）。`Replica` 为可编辑复刻；`Trace` 为私有原片加测量线的核对层。原参考视频不进入公开包，公开包中单独运行 `Trace` 需要自行提供 `public/__reference.mp4`。

在 `props.json` 编辑：

|参数|用途|
|---|---|
|`screenImages`|至少一张图片，路径相对 `public/`；按层循环取图，可一层一图。可用 PNG/JPG/SVG。图片会适配屏幕平面比例。|
|`layerCount`|1–12 层，默认 6。|
|`depthSpacing`|纵深距离，默认 1，范围 0.2–2。|
|`perspective`|透视强度，默认 1；0 为平行平面，建议 0.6–1.4。|
|`stackStartFrame` / `stackEndFrame`|复制展开阶段在源 F0–120 中的起止，默认 19 / 65。|
|`durationSeconds`|最终时长；完整 F0–120 连续轨迹映射到新时长。|
|`depthFade`|后层暗化强度，0–1，默认 1。|
|`openingLabel`|片头可编辑标注。第一个空格前为大号数字/主文字，后为小号单位。|
|`monitorSrc` / `showMonitor`|开头机壳的本地透明图片和显示开关。替换画面由屏幕图层覆盖。|
|`backgroundColor` / `glowColor` / `gridColor`|背景、顶部雾光、网格颜色，使用六位 HEX。|
|`accentColor` / `borderColor` / `calloutColor` / `calloutBackground`|前屏柔光、后层边缘、标注前景和底色。|

`docs/variant.json` 演示三张原创数据面板、八层、不同透视/配色/展开节奏及 5.2 秒时长。所有运行素材均在本目录内，安装依赖后不需要兄弟工程。

测量数据在 `src/measurements.json`，投影算法在 `src/geometry.ts`。`docs/keyframes.md` 记录元素时序、四角、深度值和近似边界。

近似范围：默认游戏画面取自原片 F15 的无标注屏幕局部静帧，屏幕内部像素运动未重建；显示器是静态材质外观；背景星点、雾光及标注字体近似重绘；后层的公共纵深模型在早期纵向角点有少量像素误差。源字幕、水印只存在于对照中。默认参考资产的权利属于原权利人，代码许可不涵盖这些资产；三张变体 SVG 为本包新绘制的虚构示例。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
