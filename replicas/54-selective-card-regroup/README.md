# 选择性换牌 · 保留、洗牌与重组

单张参考卡展开为七张卡，保留两张，其余五张合拢并依次换顶，再合并成新的扇形顺序。默认文字及双语字幕为来源演示内容。全部信息与卡片、光圈均为原生 SVG / React 元素。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

编辑 `props.json`：

- `referenceTitle` 与 `labels`：参考卡标题和七张卡的名称；使用 `\n` 换行。支持七张卡，建议每行不超过 10 个拉丁字母。扇形重叠会遮住长标签（变体中的 DELIVERY / RESEARCH 亦如此），可手工换行或缩短；本镜头不自动扩宽卡片。
- `selectedIndices`：两张保留卡的索引，使用 0–6 的两个不同整数。
- `shuffleOrder`：未保留卡中四个不同索引。首项是原先的顶牌，后三项是依次换上的顶牌；剩余一张处于底层。
- `finalOrder`：七个索引的完整排列，控制重组后的从左到右顺序。
- `durationSeconds`：整体时长；所有动作与字幕按相同比例伸缩，帧率保持 30 fps。
- `cardTop`、`cardBottom`、`stroke`、`halo`、`haloAccent`、`cornerLeft`、`cornerRight`、文字颜色：配色。
- `captions`：中英字幕；`start` 使用来源时间轴的 0–395 帧。可删除 `zhWidth` / `enWidth` 让新文案自动估计宽度，或自行调整。

`docs/variant.json` 是虚构产品方案示例：换全部卡片文案、保留索引、洗牌顺序、终态顺序与青绿色配色，并延长为 16.2 秒。

来源与字体范围见 [assets.md](docs/assets.md)，逐元素轨迹见 [keyframes.md](docs/keyframes.md)，近似边界见 [approximation.md](docs/approximation.md)，验收见 [QA.md](docs/QA.md)。原片和私人 Trace 参考仅用于内部核验，不属于公开可编辑包。

发布包不分发本机字体。字体配置与回退见组件和资产说明；缺失字体时字形、字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
