# 蛇形流程链 · 巡航与末项聚焦

忠实对应 Eagle MROSKYB2TT1WJ 原片 F1–355。默认文字为源片演示；核心为三行文字链的两次折返、镜头巡航、全景收束和末项聚焦。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

在 `props.json` 修改 `heading`、`row1` 六项、`row2` 五项、`finalLabel`、`stampText`、颜色和 `durationSeconds`。`background` 支持本地 public 路径或网址；`backgroundWidth` 表示底图在960坐标系中的宽度，默认1184。`backgroundOpacity` 与 `backgroundTint` 可完全替换素材背景。

全部标签、圆点、红章、连续折返路径和椭圆均为原生 SVG，可独立改文案和颜色。镜头轨迹保留在 `src/camera.json`，描线路径长度保留在 `src/path-track.json`；全部动画由 Remotion 帧驱动，默认 355 帧/30fps，变体为 435 帧/14.5秒。

预览 `preview/preview.mp4`，对照 `docs/comparison.mp4`，中性流程变体 `docs/variant.mp4`。Trace 与逐元素表见 `src/Trace.tsx` 和 `docs/keyframes.md`。本地 F0 对应原 Eagle F1，不包含后续法律文档。

背景使用参考无字首帧，并以时序中值恢复右侧新露区域，其中3020个未充分观察像素以邻域修补。未使用原视频播放作为主体；没有原声、字幕或水印。字体为本机 Songti SC，字形、章的粗糙纹理、局部入场弹动和背景逐帧噪点为近似。参考源及分离资产的权利属于原权利人，代码许可不覆盖这些资产。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
