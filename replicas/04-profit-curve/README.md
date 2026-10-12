# 亏损到盈利 · 面积曲线生长

独立可编辑的 Remotion 复刻工程。默认参数 `props.json`，动画 `src/Scene.tsx`，composition `Replica`。

```sh
cd replicas/04-profit-curve
npm ci
npm run dev
# 修改 props.json 后导出：
npm run preview
```

1920 × 1080，30 fps，默认 9.20 秒。修改 `durationSeconds` 同步缩放节奏。曲线点的 `value` 控制显示数字，`y` 独立控制画面几何（按原参考的位置，不是统一数值坐标轴）；修改数值时可同步调整 `y`。

## 复刻边界

保持了纸面构图、正负面积、节点和零点停顿。苹果剪影按参考提取轮廓重建；头像为参考静帧提取。纸张纹理、图案揭示和曲线末端软边为近似，字体并非原字体。原片前 9 帧含上一场景，已排除。

原片、原声、逐帧参考、对照视频与本机路径未上传。字体通过本机 Songti SC Regular、Alibaba PuHuiTi 2 85 Bold、Alibaba PuHuiTi 2 75 SemiBold（标题）加载；缺少字体时正常回退。字体文件不分发，因此换机的字形和字宽可能有差异。线上视频保留本次渲染效果。

## 来源与许可

来源索引及范围见 `docs/source.json`；运动节点见 `docs/keyframes.md`。参考提取的人像、品牌图案及示例预览不在 MIT 代码许可范围内，复用时替换为自己的素材。代码许可遵循根目录 LICENSE 和 NOTICE.md。
