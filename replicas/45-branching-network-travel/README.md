# 分支网络 · 沿高亮路径穿行

以原生 SVG 重建黑色三维网络的二维投影：视点持续穿行，蓝色路线分三次连接节点，尾段接出第四条路线，灰色分支与带景深的数值节点随之经过。保留原片完整199帧、6.633秒与原生可编辑字幕。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

修改 `props.json` 的 `pathLabels`、`valueLabels`、`captions` 替换文案；`accentColor`、`lineColor`、`nodeColor` 和 `backgroundColor` 控制颜色，`nodeDensity` 控制点数，`labelScale` 控制数字字号，`durationSeconds` 调整全段节奏。`showCaptions` 可关闭字幕。轨迹与曲线实现位于 `src/Scene.tsx` 和原生坐标数据，不需要参考视频。

`docs/variant.json` 提供8.4秒的橙紫色虚构网络变体，改变数值标签、字幕、颜色和节点密度。默认原文仅用于复现参考；背景中不可辨的小数字为可替换示例。细灰线曲率、低景深散景和字体存在近似，详见 `docs/approximation.md`。

所有画面元素均为程序绘制，无随包图片或源视频。源水印和原声未纳入；本机字体不随公开包分发。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
