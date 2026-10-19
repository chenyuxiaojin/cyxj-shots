# 四阶段波形 · 整流滤波稳压

交流波形持续滚动，三道斜切窗口依次引入整流、滤波和稳压。窗口重排时标题同步移位；窗口落位后波形继续移动。所有图表主体、斜线填充、标题、数值和字幕均由 SVG/文字绘制，没有整幅参考视频或截图参与 Replica。

```sh
npm ci
npm run dev
npm run check
npm run preview
npm run variant
```

编辑 `props.json`：

- `stageTitles` / `stageSubtitles`：四组中英文标题。
- `waveColor` / `inkColor` / `background` / `gridColor` / `hatchColor`：配色。
- `amplitudeScale` / `wavelength` / `phaseSpeed`：波幅、波长和相位速度。
- `filterRipple` / `outputLevel`：滤波纹波幅度和稳压线到基线的高度。
- `hatchSpacing` / `dividerAngle`：填充间距、斜分隔线对竖直方向的角度。
- `stageStarts`：三个斜窗首次可见的时间比例，使用递增的 0–1 数值。默认对应源 F62 / F148 / F268。
- `durationSeconds`：总时长。默认 12.4 秒；所有轨迹按比例映射，`phaseSpeed` 可单独改变连续波形速度。
- `upperValue` / `lowerValue`：两条参考线数值文字。
- `showCaptions` / `captions`：是否显示字幕、字幕内容及切换位置。字幕 `frame` 以源时间轴 0–371 表示，随总时长等比例映射。

`src/measurements.json` 存储逐帧几何；`src/geometry.ts` 存储解析波形和裁切窗。`docs/keyframes.md` 解释各元素入场、锁定与持续运动的边界。`docs/variant.json` 提供 15.6 秒变体，修改了四组标题、字幕、波形参数、颜色、斜线角度和出现时点。

默认外观采用局部可用的私有字体文件进行对照；字体文件被 `.gitignore` 排除，公开包不得包含它们。`Fonts` 加载失败时使用系统字体，图表和动画仍可运行。公开包不包含原参考、源帧或并排对照中的参考画面；`Trace` 仅在本地私有参考存在时使用，默认的 `Replica` 完全不依赖它。

近似：背景网格与颗粒、字体字宽和线边微色散采用程序绘制；右上角参考品牌水印省略。复刻的是原片的解释性图示，不是电路数值仿真。

发布包不分发本机字体。默认尝试已安装的宋体与阿里巴巴普惠体，缺失时回退到系统字体，字形和字宽可能与预览略有差别。需要精准匹配时请使用自己有权使用的字体。
