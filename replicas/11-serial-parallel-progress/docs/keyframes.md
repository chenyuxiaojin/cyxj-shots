# 逐帧拆解

坐标以960×540为逻辑画布，输出1920×1080。帧号从0开始。

|element|startFrame|visibleFrame|lockFrame|fadeOutFrame|x|y|w|h|rotate|opacity|notes|
|---|---:|---:|---:|---|---:|---:|---:|---:|---:|---:|---|
|CPU 矩阵|0|0|0|—|156|113|286|285|0|1|实际轨迹见 geometry.ts / Scene.ts|
|GPU 矩阵|0|0|0|—|519|113|286|285|0|1|实际轨迹见 geometry.ts / Scene.ts|
|百分比与标题|0|0|0|—|148|425|665|34|0|1|实际轨迹见 geometry.ts / Scene.ts|

两组几何全程固定。CPU 按行点亮，GPU 全体同步变亮。CPU 结束于51%，GPU在F70达到100%，没有补造CPU完成阶段。

已对原片上绘制 Trace 边框检查位置。背景网格、颗粒与光晕程序重建；不包含原视频声音、频道标志或讲解字幕。
