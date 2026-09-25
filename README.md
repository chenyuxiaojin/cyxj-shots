# cyxj-shots

陈与小金的 Remotion 口播镜头，8 个，全部数据驱动：**改 `src/shots.json` 就能换成你自己的内容**。

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
| `paperannotate` | 纸面批注 | 4s | 逐句拆解一段引文、划重点 | `lines` 正文、`marks` 批注(高亮/圈/划掉)、`seal` `source` |
| `papertype` | 纸面大字关键词 | 4s | 点出金句、反转结论 | `lines`(每行 `text` + `accentWord` 高亮词)、`sub` |
| `pipswap` | 画中画旋落交接 | 3s | 真人讲解交接到网页 / 工作台 | `workspaceTitle` `workspaceSections`、`accentTone` |
| `wechatchat` | 微信聊天窗 | 8s | 复述一段群聊、对话 | `title` 群名、`messages` 消息 |
| `title` | 点题关键词卡 | 6s | 一句话一个关键词，逐步建立观点链 | `cards` |
| `talk` | 口播标签 | 6s | 纯口播承接 | `label` |
| `list` | 侧栏要点列表 | 6s | 逐条拆解步骤、优缺点 | `items`、`portraitSide` |

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
  fonts/          Noto Sans SC、Space Mono(均为 SIL OFL 开源字体)
  speaker-placeholder-card.mp4   口播占位
```

## 许可

代码 MIT。字体按各自的 OFL 许可。
