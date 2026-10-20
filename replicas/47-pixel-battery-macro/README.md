# 微距点阵电量

可编辑的 Remotion 镜头：黑底倾斜屏幕上，百分比逐帧变化，电池按点阵列填充并跨阈值换色，旁边保留发光闪电。默认忠实保留原片66帧节奏，包括11%→10%的短暂回落、20%仍红与最终32%。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

修改 `props.json` 的 `startValue`、`endValue`、`threshold`、低/高电量颜色、数字/外框/背景颜色、`durationSeconds`、光晕强度与相机移动强度。数字与电池均原生 SVG；每5%增加两列，超过阈值后变色。数值映射保留参考片的逐帧节奏，支持0–100范围。百分号用原生路径；`suffix` 可设为 `%` 或空串。`cameraMotion=0` 可去掉微动，倾斜平面仍保留。

`src/glyphs.json` 是轻无衬线数字轮廓字典；`src/tracks.json` 保存测得的66帧数值与相机仿射矩阵。`src/geometry.ts` 管理局部透视和填充，`src/Scene.tsx` 管理RGB点阵、光晕和景深。没有依赖运行时字体。几何和帧状态详见 `docs/keyframes.md`。虚构设备变体见 `docs/variant.json`。

光学景深、颜色串扰、模糊与字形边缘为原生近似。原片来源字幕及水印未作为模板内容。参考片仅用于私人对照：公开包必须排除 `public/__reference.mp4`、`docs/rgb`、原片帧、对照视频及带原画面的Trace/QA图。源素材及参考画面权利属于原权利人。导出配置使用BT.709和PNG帧，每帧重建SVG防止连续渲染布局缓存。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
