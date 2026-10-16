# 数值矩阵 · 分层旋转合成像素

独立可编辑的 Remotion 复刻工程。参数入口 `props.json`，动画 `src/Scene.tsx`，composition `Replica`。

```sh
cd replicas/08-matrix-pixels
npm ci
npm run dev
# 修改 props.json 后导出：
npm run preview
```

1920 × 1080，30 fps，默认 3.97 秒。修改 `durationSeconds` 等比调整节奏。

## 可编辑范围

48 个数值拆为 RGB 三层，再合成为 4×4 像素图，公式卡进入。可替换数值、色块、公式、配色和时长。

数值固定 48 个（4 × 12，拆成三组 4 × 4），像素固定 16 色；数字建议不超过六个字符，公式过长需缩短或调整字号。durationSeconds 最短 2 秒。

## 复刻边界

重建 48 个数值单元、RGB 三层透视重排和 4×4 像素合成。分层终态与原片边框核对；中间插值、网格扭曲与发光为近似。

原片、原声、逐帧参考、对照视频与本机路径未上传。字体使用本机 Songti SC Regular、Alibaba PuHuiTi 2 65 Medium 和 Alibaba PuHuiTi 2 75 SemiBold；缺少字体时回退到浏览器字体。字体文件不分发，换机字形可能不同，线上视频保留审阅过的本地渲染效果。

## 来源与许可

来源索引与范围见 `docs/source.json`，运动节点见 `docs/keyframes.md`。参考提取的静态纹理、钱币或麦克风图像及示例预览不属于 MIT 媒体再授权；复用时可替换为自己的素材。代码许可遵循根目录 LICENSE 和 NOTICE.md。
