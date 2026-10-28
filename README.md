# cyxj-shots

陈与小金的 Remotion 口播镜头，11 个，全部数据驱动：**改 `src/shots.json` 就能换成你自己的内容**。

在线预览和一键复制「改内容提示词」：[且曼镜头库](https://qieman-shots.pages.dev)

## 跑起来

```bash
npm install
npm run dev        # 打开 Remotion Studio，左侧每个 composition 就是一个镜头
npx remotion render ccwindow out/ccwindow.mp4   # 导出某个镜头
```

## 镜头清单

| composition id | 镜头 | 时长 | 适合 | 主要可改内容 |
|---|---|---|---|---|
| `ccwindow` | Claude Code 镜像窗 | 7s | 讲「我让 Claude Code 做了 X」 | `promptText` 提示词、`lines` 回应行、`model` `cwd` |
| `pipswap` | 画中画旋落交接 | 3s | 真人讲解交接到网页 / 工作台 | `workspaceTitle` `workspaceSections`、`accentTone` |
| `wechatchat` | 微信聊天窗 | 8s | 复述一段群聊、对话 | `title` 群名、`messages` 消息 |
| `title` | 点题关键词卡 | 6s | 一句话一个关键词，逐步建立观点链 | `cards` |
| `talk` | 口播标签 | 6s | 纯口播承接 | `label` |
| `list` | 侧栏要点列表 | 6s | 逐条拆解步骤、优缺点 | `items`、`portraitSide` |
| `aiinput` | AI 输入页(可换 AI) | 6s | 演示输入提示词、发送与思考 | `provider`、`promptText`、`responseText` |
| `finderorganize` | 文件自动归类 | 6s | 散乱文件自动归位 | `title`、`folders` |
| `rankdays` | 排名四宫格 | 6s | 多阶段安排、分组排名 | `days`、颜色与镜头移动参数 |
| `rc006` | 惯性滚轮选择器 | 6s | 展示档位与数值选择 | `title`、`values`、`selectedIndex`、`unit` |
| `stargrid` | 灰阶菱格 · 旋转星芒 | 11s · 竖屏 | 产品与内容展示背景 | 配色、网格、星芒位置 / 尺寸、旋转时间 / 圈数、图层开关 |

`aiinput` 默认透明底，画廊宿主会垫深色背景；叠加到实拍上时按需要设置 `transparentBackground: false`。`responseText` 只在 `provider: "claude-code"` 时显示，其他产品变体演示输入、发送与思考。

每个字段的完整说明（类型、默认值、可选值）在对应镜头文件末尾的 `xxxTag.fields`,例如 `src/kit/scenes/WeChatChatScene.tsx` 的 `wechatchatTag`。

## 怎么换内容

1. 打开 `src/shots.json`,找到镜头 id,改 `scene.props` 里的文字和数据；时长改 `durationInSeconds`。
2. `npm run dev` 看效果。
3. 口播类镜头(`talk` `title` `list` 等)底下的「口播画面」是占位视频 `public/speaker-placeholder-card.mp4`,换成你自己的口播视频即可。

也可以把这句话交给 Claude Code / Codex:

> 克隆 https://github.com/chenyuxiaojin/cyxj-shots ,读 README,把 `wechatchat` 镜头换成我的内容：（你的群名和消息）。改完用 remotion studio 给我看，不要导出。

## 目录

```
src/
  shots.json      每个镜头的内容(改这里)
  Root.tsx        每个镜头注册成一个 composition
  kit/            镜头与零件源码(scenes/ components/ theme.ts styles.ts)
public/
  fonts/          Noto Sans SC、Space Grotesk、Space Mono(均为 SIL OFL 开源字体)
  speaker-placeholder-card.mp4   口播占位
```

## 许可

作者有权许可的代码采用 [MIT](LICENSE)：允许免费使用、修改、分发和商用，分发代码或其重要部分时保留版权声明与许可全文。字体按各自的 OFL 许可，原文随附于 `public/fonts/`。依赖、参考作品与媒体的授权边界见 [NOTICE.md](NOTICE.md)。

## 本次精选归档

2026-09-26 新增上述 4 个镜头，按用户筛选结果从 `cyxj-remotion` 历史提交 `72b97dab5c3636fd63d9e517d637ee08d3a8dde6` 恢复；`rc006` 从原多镜头文件单独提取。已有 6 个镜头继续保留。在线预览沿用用户已审阅的本地预览，源码中的同名 composition 提供可编辑版本。

`stargrid` 使用 720×1280 竖屏，其他镜头保持 1920×1080。可在对应配置中设置 `width` / `height`。星芒与网格均为矢量，动画由帧数驱动；关闭 `showStars` 可单独用菱格背景。10 秒旋转后保留 1 秒终态。参考原片不包含在仓库或成品中。

复刻边界：星芒轮廓和旋转曲线按参考追踪，灰阶光场、渐隐网格与柔阴影为参数化近似；没有复刻原视频的压缩纹理，也不包含原声。

## Eagle 精选复刻（2026-10-12）

以下三个独立工程各自锁定依赖，不影响上方原有镜头。进入对应目录运行 `npm ci && npm run dev`，改 `props.json` 即可换内容。

- [三段经历卡片时间轴](replicas/01-timeline/README.md)
- [扇形卡片展开](replicas/02-fan-cards/README.md)
- [搜索框展开成产品信息卡](replicas/03-search-card/README.md)

## Eagle 精选复刻（2026-10-13）

三个独立可编辑工程，修改各自 `props.json` 后在 Remotion Studio 查看。

- [亏损到盈利 · 面积曲线生长](replicas/04-profit-curve/README.md)
- [词语卡片 · 连线与同步点亮](replicas/05-token-links/README.md)
- [收入减支出 · 公式与金额卡](replicas/06-budget-formula/README.md)

## Eagle 精选复刻（2026-10-16）

三个独立可编辑工程，修改各自 `props.json` 后在 Remotion Studio 查看。

- [资料页 · 划重点与推近回看](replicas/07-document-focus/README.md)
- [数值矩阵 · 分层旋转合成像素](replicas/08-matrix-pixels/README.md)
- [四层目录 · 空间排布后聚焦一层](replicas/09-layer-directory/README.md)

## Eagle 精选复刻（2026-10-19）

独立可编辑工程，修改各自 `props.json` 后在 Remotion Studio 查看。

- [并行计算 · 像素矩阵拆解](replicas/10-parallel-grid/README.md)
- [CPU 与 GPU · 串行并行对照](replicas/11-serial-parallel-progress/README.md)
- [营收对比 · 双柱逐次增长](replicas/12-revenue-bars/README.md)

- [份额拆分 · 比例条与人物归属](replicas/14-share-allocation/README.md)
- [计算工作量 · 时钟与大数字](replicas/15-token-clock/README.md)

- [交付成果 · 多卡片依次展开](replicas/13-delivery-cards/README.md)

- [AI 三要素 · 轨道节点轮转](replicas/16-ai-orbit/README.md)
- [神经网络 · 数字输入与逐层激活](replicas/17-neural-propagation/README.md)
- [创意象限 · 平移聚焦与说明](replicas/18-quadrant-focus/README.md)
- [模型排行 · 增长后单行聚焦](replicas/19-model-ranking/README.md)
- [上下文机制 · 双路汇聚流程](replicas/20-context-flow/README.md)

- [创意积木 · 七模块拆解与重组](replicas/21-idea-modules/README.md)
- [学历分布 · 圆环分段强调](replicas/22-education-donut/README.md)
- [职业路径 · 双桑基图对照](replicas/23-career-sankey/README.md)
- [人物关系 · 分层展开与文档进入](replicas/24-family-relations/README.md)

- [年龄分布 · 区间高亮与样本叠加](replicas/25-age-highlight/README.md)

- [学习路径 · 角色沿进度线行走](replicas/26-learning-track/README.md)

## Eagle 精选复刻（2026-10-20）

独立可编辑工程，修改各自 `props.json` 后在 Remotion Studio 查看。

- [院校分布 · 气泡错帧生长](replicas/28-graduate-bubbles/README.md)
- [斜向窗口 · 三字依次揭示](replicas/29-diagonal-text-relay/README.md)

- [像素尺寸标注与总量引线](replicas/30-pixel-dimensions/README.md)

- [双圆规模对比 · 推近与重构图](replicas/32-circle-scale-compare/README.md)

- [屏幕纵深帧栈](replicas/31-frame-depth-stack/README.md)

- [人数结构 · 双组图标累积](replicas/27-people-ratio/README.md)

- [蛇形流程链 · 巡航与末项聚焦](replicas/33-serpentine-keyword-chain/README.md)

- [四阶段波形 · 整流滤波稳压](replicas/36-ac-waveform-stages/README.md)

- [播放量卡片 · 浮入与持续增长](replicas/37-media-card-views/README.md)

- [聊天气泡 · 输入发送与三轮对话](replicas/34-chat-message-rounds/README.md)

- [作者名单平面 · 透视巡航与姓名浮起](replicas/35-author-plane-focus/README.md)

- [双泳道时间成本 · 阶段展开与推近对照](replicas/38-dual-duration-timeline/README.md)
- [分词编码与反向解码](replicas/39-token-encode-decode/README.md)
- [工期与成本 · 圆环展开和双分支](replicas/40-duration-cost-branches/README.md)

- [图片甩切 · 立体关键词浮现](replicas/41-image-keyword-carousel/README.md)

- [树图聚焦与矩形重排](replicas/43-treemap-focus-reflow/README.md)

- [双曲线峰值与面积阈值 · 轨迹生长对照](replicas/42-dual-curve-threshold/README.md)

- [充电阶段面板 · 柱线图巡航与百分比推进](replicas/44-charge-phase-dashboard/README.md)

- [人群分组与交叉时间卡](replicas/46-cohort-crossover-trial/README.md)

- [微距点阵电量](replicas/47-pixel-battery-macro/README.md)

- [分支网络 · 沿高亮路径穿行](replicas/45-branching-network-travel/README.md)

- [年份卷轴档案 · 逐字归拢与圆形开合](replicas/48-year-reel-archive/README.md)

## Eagle 精选复刻（2026-10-20 续批）

独立可编辑工程，修改各自 `props.json` 后在 Remotion Studio 查看。

- [连续检视 · 应用图标接力](replicas/50-continuous-inspection/README.md)

- [薄层曝光 · 遮罩与局部移除](replicas/49-layered-mask-etch/README.md)

- [词块集合 · 双栏面板展开](replicas/52-token-panel-unfold/README.md)

- [碎条标题与笔刷揭示](replicas/51-fragmented-title-collage/README.md)

- [三阶段错位大数与弧线增长](replicas/55-staggered-growth-arcs/README.md)

- [清单反转 · 未兑现的一项](replicas/53-checklist-reversal/README.md)

- [选择性换牌 · 保留、洗牌与重组](replicas/54-selective-card-regroup/README.md)

## Eagle 精选复刻（2026-10-23 续批）

独立可编辑工程，修改各自 `props.json` 后在 Remotion Studio 查看。

- [纹理字窗 · 定点放大穿出](replicas/56-text-aperture-zoom/README.md)

- [连续翻阅 · 书封与密集页片](replicas/57-riffling-book-pages/README.md)
- [结构对照 · 翻面分栏与局部圈示](replicas/58-structure-spotlight-compare/README.md)

- [卷带成型 · 卷绕受压与九宫装配](replicas/59-ribbon-coil-compression/README.md)

- [薄壳碎裂 · 产品穿出揭示](replicas/60-shell-shatter-reveal/README.md)
- [检测图标 · 汽车电池切换手机](replicas/61-device-outline-morph/README.md)

- [像素展开 · 二维矩阵到一维向量](replicas/63-pixel-vector-unroll/README.md)
- [字阵扩散 · 推近聚焦与中心点亮](replicas/64-matrix-center-wave/README.md)

- [字块选中 · 光标扫选与整板推近](replicas/62-token-order-scramble/README.md)

- [地图巡航 · 点阵区域切换与标签揭示](replicas/65-world-dot-map-focus/README.md)
- [纸盒展开 · 字母脱离与盒盖翻开](replicas/66-paper-box-unfold/README.md)

- [故障字标 · 横向切片与色道收束](replicas/67-glitch-title-resolve/README.md)
- [粒子字标 · 星点成环与字母融合](replicas/69-particle-ring-wordmark/README.md)
- [轮盘隧道 · 螺旋缩放与金字显影](replicas/68-roulette-spiral-tunnel/README.md)

- [曲面影带 · 弧形展屏与图片巡游](replicas/70-curved-film-ribbon/README.md)
- [粒子飘落 · 筹码与纸片翻转](replicas/71-confetti-currency-rain/README.md)
- [图标漩涡 · 旋转隧道收拢成展屏](replicas/72-icon-vortex-wall/README.md)

## Eagle 精选复刻（2026-10-25 续批）

独立可编辑工程，修改各自 `props.json` 后在 Remotion Studio 查看。

- [杆秤联动·承重摆动与局部分析](replicas/73-balance-analysis/README.md)

## Eagle 精选复刻（2026-10-28 续批）

独立可编辑工程，修改各自 `props.json` 后在 Remotion Studio 查看。

- [档案时间轴 · 双排电脑卡片展开](replicas/74-archive-timeline/README.md)
- [Token 立方体 · 语言标签环绕](replicas/75-token-language-cube/README.md)
- [文档引句 · 高亮抽出双行标题](replicas/76-document-pullquote/README.md)
