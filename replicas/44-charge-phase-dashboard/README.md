# 充电阶段面板 · 柱线图巡航与百分比推进

默认文字与数据是源片演示。手机电量与液态环持续运动，右侧用电柱图依次放大到恒流、恒压及接近充满的区间；曲线点、气泡和100%强调均为原生可编辑元素。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

在 props.json 修改文字、数值、配色和 durationSeconds。结构/轨迹见 src/Scene.tsx，来源与近似见 docs。静态参考资产如有保留，其权利属于原权利人，代码许可不涵盖这些资产。原片不包含在公开包内。

默认 556 帧 / 18.5333 秒；`docs/variant.json` 是虚构样机的 22 秒参数变体。`barProfiles` 的四组数据对应初始图和三次图内巡航，默认逐帧测量轨迹位于 `src/motion.json`。`stagePercents` 与 `initialPercent` 同时驱动大数字和手机内百分比。`axisLabels`、状态栏、微小充电说明及所有阶段文案均为原生文本。`ringScale` / `dropScale` 控制原生液态环和液滴。

本包没有使用源片截图作 Replica 背景、图表或手机屏幕；`Trace` 使用的 `public/__reference.mp4` 仅用于私有逐帧对照，发布包应排除。源片自带水印、烧录字幕与开头残留前一场景不复刻。手机金属边、微小图标、字体、细碎液滴轮廓、工程背景纹理和虚线曲线的细微弧度属于明确近似。源片 F119 的百分比短暂回退经实图确认后保留，尾段只有 100% 强调，没有另增“涓流阶段”气泡。

验证与对照见 `docs/verification.json`、`docs/comparison.mp4`、`docs/qa-part-1.jpg` 至 `docs/qa-part-4.jpg`、`docs/variant-overview.jpg`。颜色从源直接解码 RGB PNG 取样；默认、变体和对照均为 limited BT.709。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
