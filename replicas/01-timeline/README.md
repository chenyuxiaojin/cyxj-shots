# 三段经历卡片时间轴

且曼镜头库已审阅的可编辑 Remotion 复刻工程。参数入口 `props.json`，动画 `src/Scene.tsx`，composition `Replica`。

```sh
cd replicas/01-timeline
npm ci
npm run dev
# 修改 props.json 后预览，导出：
npm run preview
```

帧率 30 fps；修改 `durationSeconds` 会同步缩放动画节奏。素材路径相对于 `public/`，文字与图片均可替换。

## 复刻边界

卡片、年份、弧线和总结条为独立图层。头像由参考画面提取；汉字重新排版，使用本机宋体近似，未声称匹配原字体。纸张纹理和高光重建，原片末段的缓慢全局拉远保留。

原片、原声、逐帧参考和本机路径未上传。字体使用本机 Songti SC 和 Alibaba PuHuiTi 2.0（如已安装），缺失时正常使用浏览器字体回退；字体文件不随仓库分发。换机字形与字宽可能与已审阅预览有差异，恢复对应字体后可接近原效果。

## 来源与许可

参考索引与裁切范围见 `docs/source.json`，动作节点见 `docs/keyframes.md`。`public/media` 中参考提取的人像、产品图、分子图，以及示例预览不在 MIT 代码许可覆盖范围内；用于其他作品时替换为自己的素材。分子图外围部分为视觉近似，不用于化学知识校验。代码许可遵循根目录 LICENSE 和 NOTICE.md。
