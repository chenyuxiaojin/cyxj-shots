# 薄壳碎裂 · 产品穿出揭示

倾斜薄壳短暂保持，在第26帧裂为放射状碎片；产品从中心放大穿出，标题随碎片上移淡去。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

在 props.json 修改文字、数值、配色和 durationSeconds。结构/轨迹见 src/Scene.tsx，来源与近似见 docs。静态参考资产如有保留，其权利属于原权利人，代码许可不涵盖这些资产。原片不包含在公开包内。

主要编辑参数：label / captions / showCaptions / background / accent / durationSeconds。

参数变体验证：
```sh
npx remotion render src/index.ts Replica preview/variant.mp4 --props=docs/variant.json
```

薄壳用渐变与程序噪点近似材质，分片形状和绕轴翻转采用确定性SVG裁切与旋转，不是原片的真实三维破碎网格。产品是从参考末帧单独提取的透明静态图，可通过image替换；轮廓和小挂耳存在手工遮罩误差。

发布包不分发本机字体。字体配置与回退见组件和资产说明；缺失字体时字形、字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
