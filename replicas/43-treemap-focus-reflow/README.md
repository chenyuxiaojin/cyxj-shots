# 树图聚焦与矩形重排

可编辑 Remotion 镜头：从“奇幻”主区域展开完整分类图，再扩张中心图片，把周围类别压缩成窄条并重排底部配色块。默认 6 秒、30 fps、1920×1080。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

在 `props.json` 修改 `nodes` 中的类别文字与配色、`headline` / `subheadline`、`focusImage`、`layoutScale` / `layoutOffsetX/Y`、`durationSeconds` 与字幕。类别 ID 用于关联对应运动轨迹；保留 ID 即可替换它的内容。文字按测得的字框自动适配，类别数通过 nodes 列表控制，新增布局可修改 `src/tracks.json`。

`src/tracks.json` 是 180 帧测得的外框、34 个矩形、类别字框和中心图片数值数据。主体完全由 SVG 多边形和文字生成；参考图表没有作为背景图或整幅视频播放。SVG 使用每帧 key，使快速改变的几何即时绘制。

中心默认素材 `public/media/focus-default.png` 仅裁取原片中央照片，不含图表、标注或字幕。其权利仍属于原权利人，代码许可不授予该照片权利。可用自己的照片替换 `focusImage`。`focus-variant.svg` 是本任务自行绘制的虚构山湖图；已渲染的 `docs/variant.json` 改了所有类别、标题、配色、图片、布局和 7.4 秒时长。

```sh
npx remotion render src/index.ts Replica docs/variant.mp4 --props=docs/variant.json --codec=h264 --concurrency=2
```

输出为 BT.709，使用 PNG 渲染帧并关闭 bundle cache。公开包排除原片、全帧截图和字体文件。字体缺失时使用系统字体；`Trace` 仅用于私有对照，公开使用 `Replica`。

近似边界：原片黑色手绘边缘、局部色彩细噪点、具体字形和压缩抗锯齿由原生近似取代；中心照片采用一张局部静帧，照片内微小像素/颗粒变化不复制。矩形与文字的出现、缩放、重排以及照片画框扩张仍由测量值驱动。末段只锁定量测变化不超过 2px 的稳定元素。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
