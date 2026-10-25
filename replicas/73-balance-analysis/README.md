# 杆秤联动 · 承重摆动与局部分析

独立 Remotion 镜头：药片缩小落入秤盘，秤杆绕支点回摆，秤砣滑移直到读数稳定；推近后出现两条分析引线，最后秤体移出。1920×1080，30 fps，默认 206 帧（6.87 秒）。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

## 参数

修改 `props.json`，在 Remotion Studio 的 `Replica` 合成中查看。

|参数|用途|
|---|---|
|brand、itemLabel、periodLabel|品牌、物品名称、周期弧文字|
|weight、unit|最终读数与单位|
|labels|两条分析引线文字|
|accent、background|主题色与背景色|
|showCaptions、captions|字幕开关及四段文本|
|durationSeconds|整体时长，全部阶段等比例映射|
|itemImage、beamImage、panImage、weightImage、stacksImage|五个独立局部素材，可替换为 public 下文件或 URL|

`src/geometry.ts` 是帧测量轨迹，`src/Scene.tsx` 负责图层、悬挂联动、周期弧与标注。运动全由 `useCurrentFrame` 驱动，固定种子噪点不随时间随机变化。锁定段不使用循环弹簧。

`docs/variant.json` 给出 8 秒、蓝色、8 公斤、不同标签且关闭字幕的替换示例。`docs/keyframes.md` 记录源窗口内关键时序；`docs/approximation.md` 与 `docs/assets.md` 说明近似和资产边界。

原片视频、原声和对照视频不包含在公开包中。五个静态局部素材的权利属于原权利人，代码许可不涵盖这些素材；复用时可替换为自己有权使用的资产。字体按本机可用字体回退。

发布包不分发本机字体。字体配置与回退见组件和资产说明；缺失字体时字形、字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
