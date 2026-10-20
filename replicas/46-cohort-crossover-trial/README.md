# 人群分组与交叉时间卡

7 人落下与白色头牌收拢，年龄箭头逐个出现，新增人物后分到左右两群。两张时间卡分别从相反方向展开，卡片内部按 A→B、B→A 顺序向上滚动。默认 14.8 秒、30fps、1920×1080。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

在 props.json 修改 header、ages、ageSuffix、planA、planB、timelineLabel、captions 和 durationSeconds。配色、layoutScale、offsetX、offsetY 可调整整体布局；人物/标尺/卡片/标签是原生 SVG，精确运动数据在 src/tracks.json，人物造型与锚点在 src/Scene.tsx。SVG 每帧更新 key，渲染使用 BT.709、PNG 帧和禁用缓存。

默认 tokenA / tokenB 是两种胶囊的透明局部裁切，出处和像素坐标见 docs/assets.md。仅胶囊本身保留原素材，其权利属于原作者；独立复用时替换素材。useNativeTokens=true 使用代码绘制的两种通用几何图形。docs/variant.json 已提供虚构 A/B 体验流程：换编号、文案、原生图形、配色、布局和 17.6 秒时长，不包含真实医疗效果断言。

与原片的边界：人物形状、动模糊、纸纹、字体字形及严重遮挡处的先后关系为原生近似。原始来源水印不复制。源视频及逐帧对照仅用于私有 QA，Replica 不加载它们；字体文件不进入公开包，缺少字体时回退到 PingFang SC / Microsoft YaHei / sans-serif。

发布排除 public/__reference.mp4、public/media/*.ttf，以及 docs 中的源帧、原片、私有对照、原始源路径与追踪材料。可公开源码、props、remotion.config.ts、说明与获准使用的局部素材；变体无需任何原片图片。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
