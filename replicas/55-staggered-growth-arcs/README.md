# 三阶段错位大数与弧线增长

三组固定大数字随文字纸面上移、拉远而先后入画；增长率和弧线淡入聚焦，两角钞票背景独立旋转与拉远。默认忠实参考片段，包含漏光、失焦和字幕边界。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

Remotion 4.0.533，1920×1080、30 fps，默认 114 帧 / 3.8 秒。渲染配置使用 PNG 中间帧与 BT.709；SVG 根按参考帧重建。

修改 `props.json`：`heading`、`labels`、`values`、`unit`、`growth`；配色 `paper`/`ink`/`accent`；时长 `durationSeconds`；字幕 `showCaptions` 和 `captions` 数组（from/to 是参考帧，to 不含）；素材 `upperSrc`/`lowerSrc`（相对 public）。也可将 `assetMode` 改为 `tickets` 使用原生虚构票券。文字长度会缩放适配当前排版，不自动重算增长率。

字体通过可选的本机字体加载，不携带字体文件；找不到字体时使用系统回退，仍可渲染。默认数字优先 Bebas Neue，增长率优先 Lora Bold Italic。见 `docs/assets.md`。素材来源/裁切范围、关键帧、近似与验证分别见 `docs/assets.md`、`docs/keyframes.md`、`docs/approximation.md`、`docs/QA.md`。

`Replica` 是可分发的合成；`Trace` 留作私有核对入口，只有本地提供 `public/__reference.mp4` 时可使用。公开包不含参考视频、源逐帧或字体。参考资产的权利归原权利人。

发布包不分发本机字体。字体配置与回退见组件和资产说明；缺失字体时字形、字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
