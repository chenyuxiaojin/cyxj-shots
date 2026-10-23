# 连续翻阅 · 书封与密集页片

原片窗口为F0–37，F38后下一场景混入，已排除。书封和所有正文均是原生文字与图形，没有参考帧作整页贴图。原文长段内容改为可编辑示范文字；页边弯曲以错帧横移、斜切和阴影近似，不是物理纸张模拟。未添加末尾静止或循环。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

修改 `props.json` 的文字、颜色、素材与 durationSeconds；`docs/variant.json` 是实际替换过参数的示例。默认输出尺寸和帧率见 shot.json。时长按比例映射，建议原时长的0.75–2倍。

将 Scene 作为子组件放入 Remotion Sequence 时，请为其提供对应时长的 Composition 配置，或单独渲染后剪入。原声不包含。近似说明见 docs/approximation.md。

发布包不分发本机字体。字体配置与回退见组件和资产说明；缺失字体时字形、字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
