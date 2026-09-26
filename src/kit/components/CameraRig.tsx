/**
 * <CameraRig> — 世界摄像机骨架(空间型连续 B-roll 的通用容器)。
 *
 * 核心思想(与 <Stage> 互补,不重复):
 *   <Stage> 管「一个主体在画框里的姿态」(缩卡/inset/圆角);
 *   <CameraRig> 管「摄像机在一张比屏幕大的世界平面上飞」——内容各就各位,
 *   动的是整个世界平面的 transform(平移+变焦),观众感觉是"镜头在移动"。
 *
 * 数据驱动(语义对齐、帧数松绑):
 *   waypoints = 站点列表 [{ x, y, zoom, atSec }, ...]。atSec 是"大约第几秒到站",
 *   从口播逐字稿时间戳来;摄像机在到站前 travelSec 秒出发,段间用
 *   Easing.inOut(Easing.cubic) 滑过去(无弹跳=不抖,HARD_RULES 战疤 1 正解)。
 *   口播改了 → 只改 waypoints 数据,不碰动画逻辑。
 *
 * 官方依据(timing.md):每段先算一个 normalized progress(0..1,eased),
 *   再派生 x / y / zoom —— "separate timing from mapping"。
 *
 * ⚠️ 战疤 1:站内静止保持,【不加】breathing / 微漂移。
 * ⚠️ 本组件必须直接吃全局帧(不要套进会归零本地帧的 <Sequence>),连续性才成立。
 *
 * 用法(三件套):
 *   <CameraRig waypoints={WAYPOINTS}>
 *     <CameraRig.Layer depth={0.25}>…远景装饰(视差层,动得慢)…</CameraRig.Layer>
 *     <CameraRig.World>…世界内容(绝对定位在世界像素坐标里)…</CameraRig.World>
 *   </CameraRig>
 *   不包 World 的子节点不受摄像机影响(钉死在画框上,如字幕/水印)。
 */
import {CLAMP as MOTION_CLAMP} from './motion';
import React, { createContext, useContext } from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/** clamp 选项:所有 interpolate 必带(HARD_RULES ①-3)。 */
const clampBoth = MOTION_CLAMP;

/** 一个站点:摄像机对准世界坐标 (x,y),变焦 zoom,大约 atSec 秒到站。 */
export type CameraWaypoint = {
  /** 站点中心的世界坐标 x(px,世界平面自己的坐标系) */
  x: number;
  /** 站点中心的世界坐标 y(px) */
  y: number;
  /** 到站时的变焦。1 = 世界 1px 渲染成屏幕 1px;<1 看得更广(俯瞰),>1 更近。默认 1。 */
  zoom?: number;
  /** 大约第几秒到站(语义对齐帧数松绑:顺序必须递增,数值跟口播时间戳走个大概)。 */
  atSec: number;
  /** 本段飞行时长(秒),从上一站出发到本站。默认 rig 的 defaultTravelSec。 */
  travelSec?: number;
  /** 可选:本站目标落在画框上的 X/Y。缺省继承 CameraRig 的固定 anchor。 */
  anchorX?: number;
  anchorY?: number;
};

export type CameraState = {
  x: number;
  y: number;
  zoom: number;
  anchorX: number;
  anchorY: number;
};

export type CameraRigProps = {
  /** 站点列表。必须按 atSec 递增给(组件内部会防御性排序)。至少 1 个。 */
  waypoints: CameraWaypoint[];
  /** 默认单段飞行时长(秒)。默认 1.2(比 poseSlideSec 稍长,世界跨度大)。 */
  defaultTravelSec?: number;
  /**
   * 站点在画框上的锚点(屏幕 px)。默认画框正中(viewport/2)。
   * 世界不铺满画框时(如左右分栏,世界只占右 60%),把锚点设到该分栏可视区中心,
   * waypoint 的世界坐标就会落在那里而不是全画框正中。
   */
  anchorX?: number;
  anchorY?: number;
  /** 逻辑画布宽高；在 TalkingHead uiScale 盒内用 1920×1080，不读原生 4K 尺寸。 */
  viewportWidth?: number;
  viewportHeight?: number;
  children: React.ReactNode;
};

const DEFAULT_ZOOM = 1;
const DEFAULT_TRAVEL_SEC = 1.2;

/** 段间缓动:inOut cubic,无弹跳(战疤 1 正解;弹跳会在到站时抖)。 */
const FLIGHT_EASING = Easing.inOut(Easing.cubic);

/** 小幅伪推进的统一预设；用于无需世界坐标、只需整组缓推的镜头。 */
export const pushInScale = (
  frame: number,
  durationFrames: number,
  from = 1,
  to = 1.03,
): number => interpolate(frame, [0, Math.max(1, durationFrames)], [from, to], MOTION_CLAMP);

type CameraContextValue = {
  /** 当前帧的摄像机状态 */
  cam: CameraState;
  /** 第 0 帧的摄像机状态(视差层用它算"相对起点走了多远") */
  cam0: CameraState;
  viewportWidth: number;
  viewportHeight: number;
  /** 站点锚点(屏幕 px,见 CameraRigProps.anchorX/anchorY) */
  anchorX: number;
  anchorY: number;
};

const CameraContext = createContext<CameraContextValue | null>(null);

/** 在 CameraRig 子树里读当前摄像机状态(高级用法:速度感联动、按距离淡出等)。 */
export const useCamera = (): CameraContextValue => {
  const ctx = useContext(CameraContext);
  if (!ctx) {
    throw new Error('useCamera / CameraRig.World / CameraRig.Layer 必须用在 <CameraRig> 内部');
  }
  return ctx;
};

/** 纯函数:给定帧号算摄像机状态。frame 单调 → 结果确定(逐帧可复现)。 */
const cameraAtFrame = (
  frame: number,
  waypoints: CameraWaypoint[],
  fps: number,
  defaultTravelSec: number,
  defaultAnchorX: number,
  defaultAnchorY: number,
): CameraState => {
  const wp = (i: number): CameraState => ({
    x: waypoints[i].x,
    y: waypoints[i].y,
    zoom: waypoints[i].zoom ?? DEFAULT_ZOOM,
    anchorX: waypoints[i].anchorX ?? defaultAnchorX,
    anchorY: waypoints[i].anchorY ?? defaultAnchorY,
  });

  if (waypoints.length === 1) return wp(0);

  const arrivals = waypoints.map((w) => Math.round(w.atSec * fps));
  if (frame <= arrivals[0]) return wp(0);

  for (let i = 0; i < waypoints.length - 1; i++) {
    const a0 = arrivals[i];
    const a1 = arrivals[i + 1];
    // 站点时间重合/乱序的兜底:当作硬跳,不产生非法 inputRange([x,x] 不严格递增会崩)
    if (a1 <= a0) continue;
    const travelSec = waypoints[i + 1].travelSec ?? defaultTravelSec;
    // 飞行时长不许超过两站间隔;至少 1 帧,保证 inputRange 严格递增
    const travel = Math.min(Math.max(1, Math.round(travelSec * fps)), a1 - a0);
    const depart = a1 - travel;

    if (frame < depart) return wp(i); // 站内静止保持(不加 breathing,战疤 1)
    if (frame < a1) {
      // 官方 timing.md:一个 eased progress,派生所有属性
      const p = interpolate(frame, [depart, a1], [0, 1], {
        easing: FLIGHT_EASING,
        ...clampBoth,
      });
      const from = wp(i);
      const to = wp(i + 1);
      return {
        x: interpolate(p, [0, 1], [from.x, to.x], clampBoth),
        y: interpolate(p, [0, 1], [from.y, to.y], clampBoth),
        zoom: interpolate(p, [0, 1], [from.zoom, to.zoom], clampBoth),
        anchorX: interpolate(p, [0, 1], [from.anchorX, to.anchorX], clampBoth),
        anchorY: interpolate(p, [0, 1], [from.anchorY, to.anchorY], clampBoth),
      };
    }
  }
  return wp(waypoints.length - 1);
};

/** 把摄像机状态换算成世界平面的 CSS transform 平移量(世界原点相对画框左上角)。 */
const worldTranslate = (
  cam: CameraState,
  anchorX: number,
  anchorY: number,
): { tx: number; ty: number } => ({
  // 让世界坐标 (cam.x, cam.y) 落在锚点(默认画框正中):先 scale(zoom) 再平移
  tx: anchorX - cam.x * cam.zoom,
  ty: anchorY - cam.y * cam.zoom,
});

const CameraRigRoot: React.FC<CameraRigProps> = ({
  waypoints,
  defaultTravelSec = DEFAULT_TRAVEL_SEC,
  anchorX,
  anchorY,
  viewportWidth,
  viewportHeight,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (waypoints.length === 0) {
    throw new Error('<CameraRig> waypoints 至少要有 1 个站点');
  }
  // 防御性排序(不改调用方数组)。正常应按 atSec 递增传入。
  const sorted = [...waypoints].sort((a, b) => a.atSec - b.atSec);

  const logicalWidth = viewportWidth ?? width;
  const logicalHeight = viewportHeight ?? height;
  const defaultAnchorX = anchorX ?? logicalWidth / 2;
  const defaultAnchorY = anchorY ?? logicalHeight / 2;
  const cam = cameraAtFrame(frame, sorted, fps, defaultTravelSec, defaultAnchorX, defaultAnchorY);
  const cam0 = cameraAtFrame(0, sorted, fps, defaultTravelSec, defaultAnchorX, defaultAnchorY);

  return (
    <CameraContext.Provider
      value={{
        cam,
        cam0,
        viewportWidth: logicalWidth,
        viewportHeight: logicalHeight,
        anchorX: cam.anchorX,
        anchorY: cam.anchorY,
      }}
    >
      <AbsoluteFill style={{ overflow: 'hidden' }}>{children}</AbsoluteFill>
    </CameraContext.Provider>
  );
};

/** 世界平面:子节点用绝对定位摆在世界像素坐标里,整体吃摄像机 transform。 */
const World: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cam, anchorX, anchorY } = useCamera();
  const { tx, ty } = worldTranslate(cam, anchorX, anchorY);
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        transformOrigin: '0 0',
        transform: `translate(${tx}px, ${ty}px) scale(${cam.zoom})`,
      }}
    >
      {children}
    </div>
  );
};

export type CameraRigLayerProps = {
  /**
   * 视差深度 0..1:0 = 钉死在画框(无穷远),1 = 跟世界平面等速。
   * 装饰性远景取 0.15~0.35 就有"近快远慢"的纵深感。
   * 只做平移视差(不跟变焦),子节点用画框坐标摆放。
   */
  depth: number;
  children: React.ReactNode;
};

/** 视差装饰层:按 depth 比例跟随摄像机平移(相对第 0 帧的位移)。 */
const Layer: React.FC<CameraRigLayerProps> = ({ depth, children }) => {
  const { cam, cam0 } = useCamera();
  const t = worldTranslate(cam, cam.anchorX, cam.anchorY);
  const t0 = worldTranslate(cam0, cam0.anchorX, cam0.anchorY);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${(t.tx - t0.tx) * depth}px, ${(t.ty - t0.ty) * depth}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

type CameraRigComponent = React.FC<CameraRigProps> & {
  World: typeof World;
  Layer: typeof Layer;
};

export const CameraRig = CameraRigRoot as CameraRigComponent;
CameraRig.World = World;
CameraRig.Layer = Layer;
