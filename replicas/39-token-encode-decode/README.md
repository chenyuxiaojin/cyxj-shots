# 分词编码与反向解码

可编辑 Remotion 镜头：文字拆成字符与 Token 分组，映射到编号；镜头转向解码端，将另一组编号还原为 Token、拼成文字并沿回程箭头返回人类端。

默认复刻 18.6 秒、1920×1080、30 fps。画面中的文字、数字、分组框、卡片、图标和连线均为原生 SVG；Replica 不播放参考视频或截图。ID 是可编辑的演示映射，不会执行真实模型分词。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

在 `props.json` 修改：

- `inputTokens` / `outputTokens`：每组的 `text` 与 `id`。组内文字自动拆成字符卡；边框宽度、间隔、ID 中点跟随内容。
- `inputText` / `outputText`：上下完整文字槽；`processorLabel`、`processorSubtitle`、两端名称与编码/解码标签。
- `accentColor`、`backgroundColor`、`cardColor`、`textColor`、`lineColor`：全套配色。
- `panelWidth`、`nodeSeparation`、`layoutScale`、`layoutOffsetX/Y`：容器宽度、两端间距和整体布局。
- `durationSeconds`：整段时长。字符进入、分组闪现、编号、镜头、回程线和字幕都随总时长映射。
- `captions`、`showCaptions`、`cursorGlyph`：旁白字幕和源片游标符号。字幕的 `startFrame` 用原始 558 帧时间轴描述。

`docs/variant.json` 是已渲染的虚构“星港译码”变体：改写两端信息、两组文字/ID、橙色配色、容器宽度、节点间距与 15.2 秒时长。可运行：

```sh
npx remotion render src/index.ts Replica docs/variant.mp4 --props=docs/variant.json --codec=h264 --concurrency=2
```

原片按帧拆解见 `docs/keyframes.md`；几何追踪见 `docs/trace-contact.jpg` 和 `src/geometry.ts`；`src/tracks.json` 保存运动窗口的数值轨迹与分组显现强度。全局位移和中央前卡为独立运动。F45–215、F285–550 的全局几何按量测锁定，末尾细微移动保留。

输出配置为 BT.709、PNG 渲染帧并关闭 bundle cache。源片、逐帧截图和字体文件只供本地核对，不进入公共包；字体加载失败使用系统中文字库 fallback。独立运行无需兄弟目录。`Trace` 是私有对照 composition，依赖未发布的参考文件；公开使用 `Replica`。

近似边界：背景低频灰纹、软阴影、背板斜纹、绿色边框毛边、人形/原子图标细节与具体字形为原生近似；源片水印不复制。内容变长或分组数量变化会重新排版，而非保持某组像素形状。源图/视频的权利不由此代码包授予。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
