# 纹理字窗 · 定点放大穿出

标题最初短暂保持；F11 后围绕 (640,440) 放大，F89 完全越出上边界。没有增加周期位移。蓝色网络纹理由确定性线段与点重建，原片内部素材并非同一纹理；字体字形和细微亮度存在近似。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

修改 `props.json` 的文字、颜色、素材与 durationSeconds；`docs/variant.json` 是实际替换过参数的示例。默认输出尺寸和帧率见 shot.json。时长按比例映射，建议原时长的0.75–2倍。

将 Scene 作为子组件放入 Remotion Sequence 时，请为其提供对应时长的 Composition 配置，或单独渲染后剪入。原声不包含。近似说明见 docs/approximation.md。

发布包不分发本机字体。字体配置与回退见组件和资产说明；缺失字体时字形、字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
