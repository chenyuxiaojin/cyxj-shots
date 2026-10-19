# 元素测量与锁定表

源坐标 960×540；源帧 0–134；所有头像中心逐帧来自模板相关检测与双向匹配。F100 检出完整 84 个图标。

头像的局部格点在 F93 后稳定，整体镜头仍缓慢移动；F118 后加速上移。源 F100→120 的中心平均位移 9.15px，因此不能把整个画面冻结。

|element|startFrame|visibleFrame|lockFrame|fadeOutFrame|x|y|w|h|rotate|opacity|notes|
|---|---:|---:|---|---|---:|---:|---:|---:|---:|---:|---|
|上一场人才画像|0|0|开场已在位|4|约70|约35|420|280|-37|1|标题与3头像整体上移出画；F18后结束|
|实习生标题|48|49|55 local|118 group|445|380|165|52|-37|1|斜向遮罩擦入；随全组移动|
|正式员工标题|68|69|75 local|118 group|97|189|215|52|-37|1|斜向遮罩擦入；随全组移动|
|黄色人数|58|59|74 local|118 group|740|166|215|130|-37|1|计数至28，字号与位置独立可编辑|
|蓝色人数|58|59|92 local|118 group|540|40|215|130|-37|1|计数至56，后段仍随全组移动|
|头像 00 / group 0 / 0,0|83|85|93 local|118 group|185.0|231.0|40|26|源蒙版内|0.689|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 01 / group 0 / 1,0|80|82|93 local|118 group|216.0|208.0|40|26|源蒙版内|0.526|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 02 / group 0 / 2,0|68|70|93 local|118 group|246.0|185.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 03 / group 0 / 3,0|75|77|93 local|118 group|276.0|162.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 04 / group 0 / 4,0|67|69|93 local|118 group|306.0|139.0|40|26|源蒙版内|0.529|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 05 / group 0 / 5,0|72|74|93 local|118 group|337.0|116.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 06 / group 0 / 6,0|69|71|93 local|118 group|367.0|93.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 07 / group 0 / 0,1|76|78|93 local|118 group|217.0|248.0|40|26|源蒙版内|0.526|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 08 / group 0 / 1,1|73|75|93 local|118 group|247.0|225.0|40|26|源蒙版内|0.513|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 09 / group 0 / 2,1|61|63|93 local|118 group|277.0|202.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 10 / group 0 / 3,1|68|70|93 local|118 group|308.0|179.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 11 / group 0 / 4,1|60|62|93 local|118 group|338.0|156.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 12 / group 0 / 5,1|65|67|93 local|118 group|368.0|133.0|40|26|源蒙版内|0.526|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 13 / group 0 / 6,1|62|64|93 local|118 group|399.0|110.0|40|26|源蒙版内|0.531|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 14 / group 0 / 0,2|69|71|93 local|118 group|249.0|264.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 15 / group 0 / 1,2|66|68|93 local|118 group|279.0|241.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 16 / group 0 / 2,2|57|59|93 local|118 group|309.0|219.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 17 / group 0 / 3,2|61|63|93 local|118 group|340.0|195.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 18 / group 0 / 4,2|59|61|93 local|118 group|370.0|172.0|40|26|源蒙版内|0.531|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 19 / group 0 / 5,2|58|60|93 local|118 group|400.0|149.0|40|26|源蒙版内|0.529|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 20 / group 0 / 6,2|53|55|93 local|118 group|430.0|127.0|40|26|源蒙版内|0.539|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 21 / group 0 / 0,3|62|64|93 local|118 group|280.0|281.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 22 / group 0 / 1,3|59|61|93 local|118 group|310.0|258.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 23 / group 0 / 2,3|47|49|93 local|118 group|341.0|235.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 24 / group 0 / 3,3|54|56|93 local|118 group|371.0|212.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 25 / group 0 / 4,3|46|48|93 local|118 group|401.0|189.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 26 / group 0 / 5,3|51|53|93 local|118 group|432.0|166.0|40|26|源蒙版内|0.531|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 27 / group 0 / 6,3|48|50|93 local|118 group|462.0|143.0|40|26|源蒙版内|0.531|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 28 / group 0 / 0,4|55|57|93 local|118 group|312.0|298.0|40|26|源蒙版内|0.511|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 29 / group 0 / 1,4|52|54|93 local|118 group|342.0|275.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 30 / group 0 / 2,4|40|42|93 local|118 group|372.0|252.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 31 / group 0 / 3,4|47|49|93 local|118 group|403.0|229.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 32 / group 0 / 4,4|39|41|93 local|118 group|433.0|206.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 33 / group 0 / 5,4|44|46|93 local|118 group|463.0|183.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 34 / group 0 / 6,4|41|43|93 local|118 group|493.0|160.0|40|26|源蒙版内|0.535|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 35 / group 0 / 0,5|48|50|93 local|118 group|343.0|315.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 36 / group 0 / 1,5|45|47|93 local|118 group|374.0|292.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 37 / group 0 / 2,5|33|35|93 local|118 group|404.0|269.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 38 / group 0 / 3,5|40|42|93 local|118 group|434.0|246.0|40|26|源蒙版内|0.526|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 39 / group 0 / 4,5|32|34|93 local|118 group|464.0|223.0|40|26|源蒙版内|0.526|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 40 / group 0 / 5,5|37|39|93 local|118 group|495.0|200.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 41 / group 0 / 6,5|34|36|93 local|118 group|525.0|177.0|40|26|源蒙版内|0.531|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 42 / group 0 / 0,6|41|43|93 local|118 group|375.0|331.0|40|26|源蒙版内|0.526|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 43 / group 0 / 1,6|38|40|93 local|118 group|405.0|308.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 44 / group 0 / 2,6|29|31|93 local|118 group|436.0|285.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 45 / group 0 / 3,6|33|35|93 local|118 group|466.0|262.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 46 / group 0 / 4,6|31|33|93 local|118 group|496.0|240.0|40|26|源蒙版内|0.526|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 47 / group 0 / 5,6|30|32|93 local|118 group|526.0|217.0|40|26|源蒙版内|0.526|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 48 / group 0 / 6,6|25|27|93 local|118 group|557.0|193.0|40|26|源蒙版内|0.526|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 49 / group 0 / 0,7|34|36|93 local|118 group|407.0|348.0|40|26|源蒙版内|0.52|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 50 / group 0 / 1,7|31|33|93 local|118 group|437.0|325.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 51 / group 0 / 2,7|28|30|93 local|118 group|467.0|302.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 52 / group 0 / 3,7|26|28|93 local|118 group|498.0|279.0|40|26|源蒙版内|0.518|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 53 / group 0 / 4,7|24|26|93 local|118 group|528.0|256.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 54 / group 0 / 5,7|22|24|93 local|118 group|558.0|233.0|40|26|源蒙版内|0.522|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 55 / group 0 / 6,7|18|20|93 local|118 group|588.0|210.0|40|26|源蒙版内|0.531|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 56 / group 1 / 0,0|40|42|93 local|118 group|547.0|422.0|40|26|源蒙版内|0.588|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 57 / group 1 / 1,0|36|38|93 local|118 group|577.0|399.0|40|26|源蒙版内|0.292|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 58 / group 1 / 2,0|26|28|93 local|118 group|607.0|376.0|40|26|源蒙版内|0.29|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 59 / group 1 / 3,0|29|31|93 local|118 group|638.0|353.0|40|26|源蒙版内|0.294|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 60 / group 1 / 4,0|27|29|93 local|118 group|668.0|330.0|40|26|源蒙版内|0.288|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 61 / group 1 / 5,0|23|25|93 local|118 group|698.0|307.0|40|26|源蒙版内|0.29|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 62 / group 1 / 6,0|18|20|93 local|118 group|728.0|284.0|40|26|源蒙版内|0.286|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 63 / group 1 / 0,1|54|56|93 local|118 group|579.0|439.0|40|26|源蒙版内|0.286|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 64 / group 1 / 1,1|50|52|93 local|118 group|609.0|416.0|40|26|源蒙版内|0.29|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 65 / group 1 / 2,1|34|36|93 local|118 group|639.0|393.0|40|26|源蒙版内|0.29|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 66 / group 1 / 3,1|43|45|93 local|118 group|669.0|370.0|40|26|源蒙版内|0.284|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 67 / group 1 / 4,1|35|37|93 local|118 group|700.0|347.0|40|26|源蒙版内|0.286|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 68 / group 1 / 5,1|38|40|93 local|118 group|730.0|324.0|40|26|源蒙版内|0.286|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 69 / group 1 / 6,1|32|34|93 local|118 group|760.0|301.0|40|26|源蒙版内|0.29|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 70 / group 1 / 0,2|48|50|93 local|118 group|611.0|455.0|40|26|源蒙版内|0.294|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 71 / group 1 / 1,2|65|67|93 local|118 group|641.0|432.0|40|26|源蒙版内|0.29|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 72 / group 1 / 2,2|61|63|93 local|118 group|671.0|410.0|40|26|源蒙版内|0.294|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 73 / group 1 / 3,2|49|51|93 local|118 group|701.0|387.0|40|26|源蒙版内|0.286|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 74 / group 1 / 4,2|55|57|93 local|118 group|733.0|364.0|40|26|源蒙版内|0.284|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 75 / group 1 / 5,2|53|55|93 local|118 group|763.0|341.0|40|26|源蒙版内|0.29|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 76 / group 1 / 6,2|47|49|93 local|118 group|794.0|318.0|40|26|源蒙版内|0.286|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 77 / group 1 / 0,3|82|84|93 local|118 group|644.0|473.0|40|26|源蒙版内|0.29|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 78 / group 1 / 1,3|78|80|93 local|118 group|675.0|450.0|40|26|源蒙版内|0.294|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 79 / group 1 / 2,3|62|64|93 local|118 group|705.0|427.0|40|26|源蒙版内|0.29|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 80 / group 1 / 3,3|71|73|93 local|118 group|735.0|404.0|40|26|源蒙版内|0.29|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 81 / group 1 / 4,3|63|65|93 local|118 group|767.0|382.0|40|26|源蒙版内|0.286|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 82 / group 1 / 5,3|66|68|93 local|118 group|797.0|359.0|40|26|源蒙版内|0.29|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|
|头像 83 / group 1 / 6,3|60|62|93 local|118 group|828.0|336.0|40|26|源蒙版内|0.29|每帧位置见 src/tracks.json；颜色按 source brightness 调制；匹配遮挡段最多5帧线性补齐|

## 不宣称完全一致的部分

- 原片头像存在部分被平面边界裁切的进入帧；检测从完整形状可辨时开始，前2帧用透明度和速度外推近似。
- 图标是静态参考蒙版；文字、人数、数量、配色、时长均可编辑。
- 背景为原片空白窗静态采样与局部清理；光照与颗粒的细微动态未逐帧重建。
- 中文字体使用本机宋体，西文字体及标题擦入边缘为近似。
- 字幕、水印、原声不纳入。
- 没有生成2:1段落；原片只显示56与28。

## 数字逐帧核对

完整序列见 `count-sequence.json`。蓝组 F59 开始微弱显现，F92 到 56；黄组 F59 开始显现，F74 到 28。中段非匀速，按每帧读数映射替换参数。F59 蓝色读数较暗，按 2 处理。


## 头像和数字素材说明

头像的外圈透明度已依据源片 F100 修正。0–9 数字字形来自源片 F74–100 的透视校正静帧，保持源数字的圆端与粗细反差；输入数值会真正重组数字，不是覆盖源视频。字形蒙版位于 public/media/digits，来源帧见 src/digitMasks.json。数字整体透视再次按源 F100 拟合，结果见 mask-numeric-fit.json。


## 标题显现复核

F68–75 正式员工、F48–55 实习生是在文字平面内由基线向字顶擦入，整行字同时展开；不使用逐字横向擦入。蓝点 F71–73、黄点 F51–54 从扁平线段展开为椭圆。对应细帧截图为 title-timing-review.jpg、title-yellow-review.jpg。


## 快速退场重新标定

周期性头像格子在 F123 后会让逐格匹配混淆。最终实现改用“实习生”整行白字作唯一标记，模板相关分数 F120–134 为 0.915–0.967；F134 位移为 (-383, -240) 源像素。F118 后全部图标使用已锁定局部位置加同一相机位移，避免各头像串位；数据见 exit-camera.json。


## 标题遮挡平面复核修正

源 F49 的实习生标题只有约20个白色像素，早版固定位置擦入显示过多。最终改为源投影平面内文字上移，在固定下边界遮挡下露出；每帧位移取白字顶端测量，见 src/title-lift.json。黄色 F49–56、蓝色 F69–76 是主要显现段，之后继续缓动落位，F90后统一跟随相机。
