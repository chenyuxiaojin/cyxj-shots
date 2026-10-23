# 检测图标 · 汽车电池切换手机

线框电池与汽车组合落定，黄色放大镜持续扫动；汽车向右退场，手机从下方升入，电池外框保持固定。

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

电池、汽车、手机、放大镜均为原生SVG线条和文字。放大镜位置按原片黄色区域逐帧测量，边线阴影、圆角、Li字体和局部渐变存在近似。汽车退场沿原片可见区域裁切。

发布包不分发本机字体。字体配置与回退见组件和资产说明；缺失字体时字形、字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
