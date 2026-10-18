# CPU 与 GPU · 串行并行对照

两组几何全程固定。CPU 按行点亮，GPU 全体同步变亮。CPU 结束于51%，GPU在F70达到100%，没有补造CPU完成阶段。

```sh
npm ci
npm run dev
npm run check
npm run preview
```

默认参数见 props.json。修改标题、数值和颜色，时长按 durationSeconds 重映射全部局部帧。数据柱建议非负并小于 axisMax，标题保持与默认相近长度。独立接入可导入 Scene 并使用 Sequence。

本地对照保留在 docs，发布包不包含原片或本机字体。程序绘制图形，不依赖参考视频渲染。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
