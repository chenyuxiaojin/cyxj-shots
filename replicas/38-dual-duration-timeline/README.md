# 双泳道时间成本 · 阶段展开与推近对照

按源373帧复刻双泳道时间成本对照：等待年数与灰条增长、两段黄色阶段、推近末端弧形说明、拉回下方总周期条，以及原有倾斜下移出场。标题全段保留BEFORE 1984；文字、周期、楼宇图、配色与总时长可编辑。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

在 props.json 修改文字、数值、配色和 durationSeconds。结构/轨迹见 src/Scene.tsx，来源与近似见 docs。静态参考资产如有保留，其权利属于原权利人，代码许可不涵盖这些资产。原片不包含在公开包内。

## 可编辑参数

- `headline` / `prefix` / `companyLabel`：年份与语境标题。默认完整保留源片 BEFORE 1984，不存在 AFTER 画面。
- `years` / `unit` / `axisLabel`：计数终值、单位与横轴标签；阶段条形的相对布局沿用参考比例。
- `protectionLabel` / `researchLabel` / `trialLabel` / `totalLabel`：四段条形的原生文字。
- `arcLabel` / `annotationLines`：沿弧线逐字显示的说明与双行结论。
- `buildingImage`：可替换楼宇图。默认是仅含楼宇的参考透明裁片；变体使用自绘 SVG。
- `backgroundColor` / `gridColor` / `accentColor` / `barColor` / `highlightColor` / 各文字颜色：可直接改色。
- `durationSeconds`：按同一完整动作窗口伸缩时长，保留尾部下移和旋转。

`docs/variant.json` 使用虚构设计项目、两部门周期对照、12周计数、自绘办公楼及15.5秒时长。原生标题、数字、线条、气泡条形、网格和曲线均可编辑。字体及楼宇前几帧的局部层间透视是近似；逐元素时序和几何证据见 `docs/keyframes.md`。

`public/__reference.mp4` 与 `docs/frames` 仅用于私有 Trace/对照，不属于公开发布包。请保留 `remotion.config.ts`，编码固定 PNG 中间帧与 BT.709，避免比较时矩阵和范围不一致。

动态前景 SVG 保留 `key={f}`，确保完整视频连续镜头变化后的文字布局与单帧预览一致；删除此 key 会使部分 SVG 文字变小或偏移。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
