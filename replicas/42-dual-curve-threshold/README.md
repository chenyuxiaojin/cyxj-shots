# 双曲线峰值与面积阈值 · 轨迹生长对照

按原片F18–444复刻：图表板回弹与放大、青灰双曲线逐步生长、圆点沿曲线到峰值、上下阈值、斜线面积与包络变形、灰色斜线转为黄色并改变倾斜角、两张说明牌依次回弹进入。曲线、阈值、标签、配色与时长可编辑。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

在 props.json 修改文字、数值、配色和 durationSeconds。结构/轨迹见 src/Scene.tsx，来源与近似见 docs。静态参考资产如有保留，其权利属于原权利人，代码许可不涵盖这些资产。原片不包含在公开包内。


## 可编辑内容

`props.json` 的 `curvePoints`、`upperCurvePoints`、`lowerCurvePoints` 分别控制主曲线、上包络和下包络。每个点为 `[x, y]`，x 在横轴0–1之间，y为自底部向上的归一高度；运行时使用原生SVG平滑路径。三个数组可独立改变。

`lowerThresholdValue` / `upperThresholdValue` 是显示的百分数；`lowerThresholdHeight` / `upperThresholdHeight` 是图内实际位置，两者分别编辑以忠实保留参考示意图。其他字段控制轴名、图例、峰值、面积说明、上下说明牌和配色。`durationSeconds` 按比例伸缩整段时序。

`docs/variant.json` 为虚构系统的两方案负载比较，改变曲线形状、阈值、名称、文字、配色和时长（17.2秒）。所有内容均为原生元素，不含源静帧资产。源的水印、解说字幕与声音不属于模板。

请保留 `remotion.config.ts`（PNG中间帧、BT.709）和动态SVG的 `key={f}`（避免连续缩放时的文字布局缓存）。`public/__reference.mp4`、`docs/reference-window.mp4`、`docs/frames` 仅用于私有对照，不属于公开包。原件与裁片的SHA-256见 `docs/source.json`，帧对应见 `docs/frame-mapping.md`。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
