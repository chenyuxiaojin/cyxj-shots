# 碎条标题与笔刷揭示

标题从两侧开始，以竖条折片式遮罩逐渐显露，中间笔画补齐后橙色笔刷从左向右扫出。纸面人物和桌面随镜头缓慢拉远。默认演示保留参考画面的标题与字幕；变体演示虚构协作计划。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

编辑 `props.json`：`headline`、`subtitle`、`accentColor`、`subtitleColor`、`inkColor`、`paperColor`、`durationSeconds`、`showCaptions` 与 `captions`。`accentStart` / `accentEnd` 使用参考 local 帧号，分别控制笔刷开始和结束。`headlineWidth` 控制标题宽度。

`glyphMode: "matched"` 为默认五字使用独立 SVG 字形；只要文案包含字典外字符，整个标题自动回退到系统宋体。`glyphMode: "system"` 始终使用原生 SVG text，可替换任意标题。字体不随包分发：中文采用 `Songti SC, SimSun, serif`，英文采用 `Imperial Script, Snell Roundhand, cursive`。缺少首选字体仍可渲染，形态会随本机回退字体变化。

`assetMode: "source"` 使用三个局部透明插画资产；`assetMode: "native"` 切换为原生 SVG 人物与桌面。图形与源静态素材的出处、裁切和使用边界见 `docs/assets.md`，时序和锁定见 `docs/keyframes.md`，近似范围见 `docs/approximation.md`。

默认 5.6 秒、30 fps、1920×1080。渲染配置为 PNG 中间帧、BT.709、禁用 bundle 缓存；SVG 按当前帧重建，避免连续视频中的布局缓存差异。源视频、原片音频和私有逐帧分析不在公开包中。

发布包不分发本机字体。字体配置与回退见组件和资产说明；缺失字体时字形、字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
