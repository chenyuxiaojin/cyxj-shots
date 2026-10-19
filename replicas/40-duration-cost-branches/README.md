# 工期与成本 · 圆环展开和双分支

日数圆环先增长，灰色费用胶囊从圆盘背后展开；主卡随后缩小上移，左右箭头与费用块依次出现。所有日数、费用、标签、占比、圆环、箭头和背景网格均为原生可编辑元素。

默认文案和数字仅为源片复现示例，不作为医药费用数据结论。docs/variant.json 使用虚构项目工期与预算，修改文字、数据、占比角度、颜色和时长，并实际渲染为15秒。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

编辑 props.json：days/dayPrefix/dayUnit/dayLabel/introLabel 是圆盘信息；totalLabel/totalLow/totalHigh 是总费用；leftLabel/leftLow/leftHigh/leftPercent 和 rightLabel/rightLow/rightHigh/rightPercent 是分支；costUnit、percentLabel、配色和 durationSeconds 均可改。leftArcDegrees/rightArcDegrees 与占比文字分别控制，默认保留原片两个扇环约120°的视觉，包含右侧66%的原样展示。

src/motion.json 为360帧圆盘与胶囊测量；src/branches.json 为分支滑入、箭头路径和占比弧测量；src/counters.json 保留日数与费用计数。时长改变时按比例映射完整动作。Trace 是私有源片叠加测量，Replica 不播放源片。

remotion.config.ts 使用 BT.709、PNG 渲染帧并关闭打包缓存。默认预览 preview/preview.mp4；虚构项目变体 docs/variant.mp4；左右对照 docs/comparison.mp4；关键帧 docs/qa-part-1.jpg 至 qa-part-4.jpg；逐元素表 docs/keyframes.md；验证 docs/verification.json。

已知近似：背景细碎纸纹和不规则网格明暗用程序纹理代替；原片字体不明，使用本机已安装字体，动态数字字形与运动模糊略有差异。遮挡严重的初始计数由同一实测相位插值，清晰可见阶段默认数值使用逐帧记录。源片水印与烧录字幕不加入复刻。

原片、全帧和私有参考仅供本地对照，不属于公开包。字体权利属于其各自权利人。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
