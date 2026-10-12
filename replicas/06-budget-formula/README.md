# 收入减支出 · 公式与金额卡

独立可编辑的 Remotion 复刻工程。默认参数 `props.json`，动画 `src/Scene.tsx`，composition `Replica`。

```sh
cd replicas/06-budget-formula
npm ci
npm run dev
# 修改 props.json 后导出：
npm run preview
```

1920 × 1080，30 fps，默认 11.33 秒。修改 `durationSeconds` 同步缩放节奏。金额、标题、项目名、债券标签与颜色可替换；金额示例沿用参考画面，仅作动效演示。

## 复刻边界

标题、算式、卡片与结果圆保持原构图和出现次序。债券标签路径、旋转与虚化按参考重建，逐张轨迹和暗部建筑为近似。原作者出镜、口播、字幕和水印不进入模板。

原片、原声、逐帧参考、对照视频与本机路径未上传。字体通过本机 Songti SC Regular、Alibaba PuHuiTi 2 65 Medium、Alibaba PuHuiTi 2 75 SemiBold（标题）加载；缺少字体时正常回退。字体文件不分发，因此换机的字形和字宽可能有差异。线上视频保留本次渲染效果。

## 来源与许可

来源索引及范围见 `docs/source.json`；运动节点见 `docs/keyframes.md`。参考提取的人像、品牌图案及示例预览不在 MIT 代码许可范围内，复用时替换为自己的素材。代码许可遵循根目录 LICENSE 和 NOTICE.md。
