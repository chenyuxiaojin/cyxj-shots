# 空间网格 · Vibe Coding 字母翻入

透视地面网格展开，标题字母以不同相位旋转显现、停留后逐字退场；保留左下头像位置。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

在 props.json 修改文字、数值、配色和 durationSeconds。结构/轨迹见 src/Scene.tsx，来源与近似见 docs。静态参考资产如有保留，其权利属于原权利人，代码许可不涵盖这些资产。原片不包含在公开包内。

参数说明：`durationSeconds` 按比例调整整体节奏；文字和配色在 props.json 修改。静态媒体的路径在同一参数文件中替换，相对 public/ 解析。图表数据保持非空；双曲线每组至少两点。图片建议保持默认宽高比。复刻默认保留字幕开关 showCaptions；若无该字段则无原片字幕。

发布包不分发本机字体。字体配置与回退见组件和资产说明；缺失字体时字形、字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
