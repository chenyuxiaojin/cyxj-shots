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
