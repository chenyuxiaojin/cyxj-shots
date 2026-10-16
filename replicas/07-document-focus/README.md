# 资料页 · 划重点与推近回看

独立可编辑的 Remotion 复刻工程。参数入口 `props.json`，动画 `src/Scene.tsx`，composition `Replica`。

```sh
cd replicas/07-document-focus
npm ci
npm run dev
# 修改 props.json 后导出：
npm run preview
```

1920 × 1080，30 fps，默认 5.13 秒。修改 `durationSeconds` 等比调整节奏。

## 可编辑范围

资料页逐行变清晰，重点段落高亮，镜头推近横移后拉回整页。可替换标题、正文、高亮范围、配图和时长。

正文固定五行，高亮以字符索引定位；文字按测量宽度排版，超长文案应手动分行。配图为静态图，按原尺寸裁切；durationSeconds 最短 2 秒。

## 复刻边界

按源帧测量推近、横移和回拉；标题、正文与黄色高亮独立可编辑。纸面光影使用原片无文字区域，字体、局部景深和高亮边缘为近似。

原片、原声、逐帧参考、对照视频与本机路径未上传。字体使用本机 Songti SC Regular、Alibaba PuHuiTi 2 65 Medium 和 Alibaba PuHuiTi 2 75 SemiBold；缺少字体时回退到浏览器字体。字体文件不分发，换机字形可能不同，线上视频保留审阅过的本地渲染效果。

## 来源与许可

来源索引与范围见 `docs/source.json`，运动节点见 `docs/keyframes.md`。参考提取的静态纹理、钱币或麦克风图像及示例预览不属于 MIT 媒体再授权；复用时可替换为自己的素材。代码许可遵循根目录 LICENSE 和 NOTICE.md。
