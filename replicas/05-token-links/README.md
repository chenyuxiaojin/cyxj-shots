# 词语卡片 · 连线与同步点亮

独立可编辑的 Remotion 复刻工程。默认参数 `props.json`，动画 `src/Scene.tsx`，composition `Replica`。

```sh
cd replicas/05-token-links
npm ci
npm run dev
# 修改 props.json 后导出：
npm run preview
```

1920 × 1080，30 fps，默认 10.40 秒。修改 `durationSeconds` 同步缩放节奏。`connections` 使用词语数组的零基索引，替换词语后同步检查连线端点。

## 复刻边界

GPU 与面板整体位移、缩放及芯片点亮读取源帧轨迹；卡片弹动与三轮弧线按关键帧重建。文字字形、轻微运动模糊和部分弧线透明度为近似。原片字幕与水印未复制。

原片、原声、逐帧参考、对照视频与本机路径未上传。字体通过本机 Songti SC Regular、Alibaba PuHuiTi 2 65 Medium、Alibaba PuHuiTi 2 75 SemiBold（标题）加载；缺少字体时正常回退。字体文件不分发，因此换机的字形和字宽可能有差异。线上视频保留本次渲染效果。

## 来源与许可

来源索引及范围见 `docs/source.json`；运动节点见 `docs/keyframes.md`。参考提取的人像、品牌图案及示例预览不在 MIT 代码许可范围内，复用时替换为自己的素材。代码许可遵循根目录 LICENSE 和 NOTICE.md。
