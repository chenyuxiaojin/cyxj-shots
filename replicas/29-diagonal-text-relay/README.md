# 斜向窗口 · 三字依次揭示

1920×1080、30fps、默认 1.7 秒的独立 Remotion 工程。一条斜向窗口从左向右扫描，依次揭示固定的三个字；窗口里画面铺满，窗口外保留上下黑边。

## 使用

```sh
npm ci
npm run dev
npm run check
npm run preview
npm run variant
```

编辑 `props.json`：

|参数|用途|
|---|---|
|`words`|三个独立文字，默认“涨 / 脑 / 子”；以单字为宜|
|`backgroundStart` / `backgroundEnd`|相对于 `public/` 的图片路径，也支持 HTTP(S) 图片|
|`backgroundMode`|`product-camera` 为参考产品素材的缩放近似；普通图片用 `crossfade`|
|`textColor`|文字颜色|
|`durationSeconds`|总时长；所有动作按整段比例重映射|
|`bandWidth` / `bandShear`|窗口宽度、从上到下的横向偏移，按 960×540 逻辑尺寸|
|`showLetterbox`|窗口外保留上下黑边|

换素材示例 `docs/variant.json` 使用“看 / 懂 / 了”、两张原创 SVG 图像、白字、390px 窗口和 2.5 秒时长。它不依赖参考背景。

## 逐帧依据与对照

- `docs/keyframes.md`：元素表、每个元素的 `lockFrame` 与近似说明。
- `src/tracking.json` / `docs/measurements.json`：完整 51 帧的窗口横坐标。
- `docs/trace-contact.jpg`：绿色边界叠加原片，黄色框标记固定文字。
- `docs/comparison.mp4`：左原片、右复刻。
- `docs/qa-sheet.jpg`：12 个阶段的并排抽帧。
- `docs/variant.mp4` / `docs/variant-qa-sheet.jpg`：真正不同参数的验证。
- `docs/qa.json` / `docs/validation.json`：来源哈希、边缘测量、媒体与包结构验证。

## 还原边界

窗口宽度、斜率、逐帧位置、三个字的位置与揭示次序按原片测量。文字几何从 F0 起锁定，显隐只受窗口控制；窗口 F49 完全出画。所有动画由 Remotion 帧数驱动。

默认背景取自参考的两个干净静帧，裁掉原字幕；电池内部流动、三维车体变化与摄像机拉远由静帧与缩放近似，F14–23 的画面差异最明显。字形、阴影、边缘抗锯齿与显示端色彩未宣称完全一致。原声、字幕、水印不纳入。

`Trace` composition 的原片仅供本地核验。`public/__reference.mp4`、`docs/frames` 与中间抽帧不得进入公共包；原参考媒体不是复刻动画的播放素材。默认静帧资产权利仍归原权利人，代码许可不涵盖参考资产。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
