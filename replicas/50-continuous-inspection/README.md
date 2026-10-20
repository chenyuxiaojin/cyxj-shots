# 连续检视 · 应用图标接力

共用电池主体保持，黄色检视镜持续绕行；汽车向右退出，手机从下方进入，检视动作不间断。默认保留原片136帧、30fps、4.533333秒，原字幕原生重建。

```sh
npm ci
npm run dev
npm run check
npm run preview
npm run variant
```

在 `props.json` 修改 `symbol`、`captions`、`captionColor`、背景与轮廓渐变色、`lensColor`、布局缩放/偏移和 `durationSeconds`。`firstObject` 可选 car/package，`secondObject` 可选 phone/chip；其路径在 `src/Scene.tsx` 中直接可编辑。时长改变时整段运动按源帧比例映射。默认 symbol=Li 使用原生字形路径，换成其他文字后使用原生文本。

`docs/variant.json` 为虚构模块检测：包装盒替换汽车、控制模块替换手机，改为QA符号、橙棕轮廓与蓝色检测镜、浅底、新字幕、不同布局和6.4秒时长。不存在真实检测效果承诺。

逐帧电池仿射矩阵、检测镜坐标、汽车位移和手机位移在 `src/tracks.json`。`docs/keyframes.md` 说明阶段、遮挡及锁定时机；`docs/assets.md` 说明素材边界。主体全原生，不读取参考视频、图片或相邻包。

源中汽车在x711的局部窗口裁切，手机从y468的窗口底部进入；检测镜只有绕行标记，没有镜内放大。原生线条边缘、字体、阴影与纸纹为近似，核心运动及字幕时机据原帧测量。F136起的下一段设置界面不在本窗口内。

渲染固定 Remotion 4.0.533、PNG、BT.709，禁用缓存，SVG每帧更新key。公开包排除参考视频、源帧、对照/Trace材料及本机字体；缺字使用系统回退字体。所有主体仍可独立渲染。

最终核验见 `docs/qa.json` 与 `docs/visual-readback.json`。默认136帧、变体192帧、左右对照136帧均完整解码通过，源 SHA-256 不变。F6–7 的检视镜淡入色调略有差异；背景纹理仍属程序近似。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
