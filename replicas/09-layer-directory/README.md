# 四层目录 · 空间排布后聚焦一层

独立可编辑的 Remotion 复刻工程。参数入口 `props.json`，动画 `src/Scene.tsx`，composition `Replica`。

```sh
cd replicas/09-layer-directory
npm ci
npm run dev
# 修改 props.json 后导出：
npm run preview
```

1920 × 1080，30 fps，默认 5.17 秒。修改 `durationSeconds` 等比调整节奏。

## 可编辑范围

四个层级围绕麦克风展开，随后收束并聚焦选定层级。可替换标题、聚焦项、铭牌、配色和时长。

标题固定四个，focusIndex 取 0–3；每个中文标题建议 3–4 字，英文副标题与铭牌也可改。麦克风头与讲台为独立静态素材，替换时保持画幅和遮挡关系。durationSeconds 最短 2 秒。

## 复刻边界

按源帧测量麦克风位置、缩放和旋转，分离标题、铭牌、前后讲台与背景。头部与木纹取自参考静帧；背景透视、文字中间轨迹、金属柄和景深为近似。

原片、原声、逐帧参考、对照视频与本机路径未上传。字体使用本机 Songti SC Regular、Alibaba PuHuiTi 2 65 Medium 和 Alibaba PuHuiTi 2 75 SemiBold；缺少字体时回退到浏览器字体。字体文件不分发，换机字形可能不同，线上视频保留审阅过的本地渲染效果。

## 来源与许可

来源索引与范围见 `docs/source.json`，运动节点见 `docs/keyframes.md`。参考提取的静态纹理、钱币或麦克风图像及示例预览不属于 MIT 媒体再授权；复用时可替换为自己的素材。代码许可遵循根目录 LICENSE 和 NOTICE.md。
