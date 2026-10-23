# 卷带成型 · 卷绕受压与九宫装配

平面薄带旋转后连续卷绕，向镜头转为椭圆卷芯，再由双侧压力箭头挤压并复制成九宫阵列。

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

薄带卷绕、镜头转向、双侧压力、复制阵列及末尾电芯盖帽均为原生SVG几何重建。三维卷带用二维曲面采样和渐变近似，弯折处的真实透视、反射与形变不等同于原片3D模拟；末尾电芯为程序绘制替代，未使用原片连续帧。结构与节拍保留，材质是主要差异。

发布包不分发本机字体。字体配置与回退见组件和资产说明；缺失字体时字形、字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
