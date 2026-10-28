# 三张商业路径海报递进入场

暗背景上三张商业路径海报依次从下方带模糊进入，形成等间距横排。只保留原片 F15–F100 的完整卡片动作，排除口播及漏光转场。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

在 props.json 修改文字、数值、配色和 durationSeconds。结构/轨迹见 src/Scene.tsx，来源与近似见 docs。静态参考资产如有保留，其权利属于原权利人，代码许可不涵盖这些资产。原片不包含在公开包内。

默认参数忠实保留参考内容。`docs/variant.json` 展示可替换文本、数值或配色，同时将时长延长20%。运行 `npx remotion render src/index.ts Replica preview/variant.mp4 --props=docs/variant.json` 验证变体。

发布包不分发本机字体。字体配置与回退见组件和资产说明；缺失字体时字形、字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
