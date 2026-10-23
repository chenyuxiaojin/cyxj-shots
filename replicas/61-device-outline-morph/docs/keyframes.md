# 逐帧测量

坐标为960×540。帧号对应截取窗口本地帧；原始映射见本地 frame-mapping.md。-1表示窗口内不存在锁定/退场。测量存在约数像素误差。

|element|startFrame|visibleFrame|lockFrame|fadeOutFrame|x|y|w|h|rotate|opacity|notes|
|---|---|---|---|---|---|---|---|---|---|---|---|
|battery|0|0|14|-1|333|80|290|290|0|1|F14后外框固定|
|magnifier|8|9|-1|-1|variable|variable|130|140|0|1|持续扫动，无静止帧|
|car|0|0|14|74|318|318|340|137|0|1|F14–62保持，随后右移退场|
|phone|76|78|94|-1|438|315|82|150|0|1|F94后保持|
