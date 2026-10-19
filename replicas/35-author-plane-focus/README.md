# 作者名单平面 · 透视巡航与姓名浮起

默认文字用于源片演示。183 条细名单、12 个强调姓名、三行中文资料标题和圆点全部原生 SVG，可编辑。名单从直立变为倾斜错列，姓名依次提亮，镜头持续巡航至下一组。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

在 props.json 修改 columns、heroes、listHeading、heading、detailLine1、detailLine2、accentColor、textColor、backgroundTint、backgroundMode 和 durationSeconds。backgroundMode=reference-texture 使用移除信息文字后的静态低频背景；procedural 使用纯程序背景。时长更改按比例映射整套相机与姓名时间轴。

src/camera.json 是连续的 198 帧透视轨迹；src/hero-tracks.json 保留姓名层视差。src/columns.json / heroes.json 定义默认布局与进入窗口。Trace 只用于本地原片叠加测量，Replica 不播放源片。remotion.config.ts 固定 BT.709 / PNG 渲染。

默认预览 preview/preview.mp4；对照 docs/comparison.mp4；中性虚构名单变体 docs/variant.mp4。逐元素表 docs/keyframes.md，验证 docs/verification.json，已知近似 docs/QA.md。模糊边缘细名单转录不能作为事实来源。

原片与 docs/frames 仅供私有对照。参考背景图及字体权利属于各自权利人；代码许可不涵盖这些静态资产。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
