# 用户增长曲线与终点标注

复古云桌面上折线沿月度坐标延伸，产品图标跟随线头移动，末端两行绿色数据标签延迟展开。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

在 props.json 修改文字、数值、配色和 durationSeconds。结构/轨迹见 src/Scene.tsx，来源与近似见 docs。静态参考资产如有保留，其权利属于原权利人，代码许可不涵盖这些资产。原片不包含在公开包内。

默认参数忠实保留参考内容。`docs/variant.json` 展示可替换文本、数值或配色，同时将时长延长20%。运行 `npx remotion render src/index.ts Replica preview/variant.mp4 --props=docs/variant.json` 验证变体。

发布包不分发本机字体。字体配置与回退见组件和资产说明；缺失字体时字形、字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
