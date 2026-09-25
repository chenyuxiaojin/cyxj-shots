/**
 * <WeChatChatScene> —— 微信聊天窗(通用,props 驱动)。
 *
 * 用 L1 壳件 components/WeChatChrome(移植自 wechat-2d 的真实微信皮:顶栏 / 白泡·绿泡 / 昵称 / 系统通知 / 输入栏)
 * 拼一部竖屏手机聊天窗:消息按顺序落下——对方的白泡逐字流出(0.045s/字)、己方绿泡 easeOutBack 弹入、
 * 系统通知居中灰字浮现;说话的人头像微信绿描边微放大;内容超过视口时整体上滚。所有节拍常数按原件。
 *
 * 岗位:口播讲"群里 / 私聊里发生了什么"的界面 B-roll;单聊(memberCount=0)与群聊(memberCount>1 显示昵称)都能配。
 * 工程(HARD_RULES ①):全 useCurrentFrame 驱动;interpolate 带 clamp;spring 只做窗体弹入;无随机无时钟;
 *   根节点透明(装配层铺底)。微信皮内颜色是镜像色(③-3 例外,见 WeChatChrome 头注)。
 */
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  WX,
  WeChatScreen,
  WeChatNotice,
  WeChatMessageRow,
  WeChatTextBubble,
  frameProgress,
  streamSeconds,
  popStyle,
  revealStyle,
} from '../components/WeChatChrome';
import type { SceneTag } from '../schema/sceneTag';

const clampBoth = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** 一条消息:kind 缺省 text;notice = 居中灰字系统通知(from/self 忽略) */
export type WxMsg = { from?: string; text: string; self?: boolean; kind?: 'text' | 'notice' };

export type WeChatChatSceneProps = {
  /** 顶栏标题(群名 / 对方昵称) */
  title?: string;
  /** 群人数:0 = 单聊(顶栏只显标题、不显昵称);>1 = 群聊,顶栏「标题(n)」并显示发送者昵称 */
  memberCount?: number;
  /** 消息序列,按顺序落下 */
  messages?: WxMsg[];
  /** 头像底色板,按发送者出场顺序分配 */
  avatarColors?: string[];
  /** 己方头像底色 */
  selfColor?: string;
  /** 己方昵称首字(头像用) */
  selfName?: string;
  /** 手机屏整体缩放(原件 390 宽) */
  scale?: number;
  /** 手机屏横向位置 */
  align?: 'center' | 'left' | 'right';
  /** 消息视口高(原件 660;压低让整屏落进安全区) */
  viewportH?: number;
  /** 第一条消息出现帧 */
  startAt?: number;
};

const DEFAULT_MESSAGES: WxMsg[] = [
  { kind: 'notice', text: '你邀请“前端”、“后端”、“测试”加入了群聊' },
  { from: '前端', text: '按钮改了,@后端 对一下接口' },
  { from: '后端', text: '收到,接口字段我十分钟发你' },
  { from: '我', text: '测试一起看下,别等到最后', self: true },
  { from: '测试', text: '好,我先把用例跑一遍' },
];

/* 视口内各条目高度(按 WeChatChrome 尺寸算) */
const H_NOTICE = 18;
const H_NAME = 19; // 昵称行 17 + 列间距 4 - 2
const BUBBLE_INNER_W = 250 - 19; // 最宽 250 减左右内边距
const LINE_H = 24;

/** 估气泡文字占几行(14.5px:CJK 1em / 其它 0.55em) */
const bubbleLines = (s: string): number => {
  let w = 0;
  for (const ch of s) w += (ch.charCodeAt(0) > 0x2e7f ? 1 : 0.55) * 14.5;
  return Math.max(1, Math.ceil(w / BUBBLE_INNER_W));
};

/** @片段染微信链接蓝 */
const renderText = (s: string): React.ReactNode =>
  s.split(/(@[^\s,，。;；!！?？]+)/g).map((part, i) =>
    part.startsWith('@') ? <span key={i} style={{ color: WX.link }}>{part}</span> : <React.Fragment key={i}>{part}</React.Fragment>,
  );

export const WeChatChatScene: React.FC<WeChatChatSceneProps> = ({
  title = '项目群',
  memberCount = 4,
  messages = DEFAULT_MESSAGES,
  avatarColors = ['#5b8def', '#e0a35a', '#6bbf7a', '#b57edc', '#e57373'],
  selfColor = '#3d7be0',
  selfName = '我',
  scale = 1.3,
  align = 'center',
  viewportH = 520,
  startAt = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isGroup = memberCount > 1;
  const header = isGroup ? `${title}(${memberCount})` : title;

  /* 窗体弹入(spring 0..1 再重映射) */
  const winPop = spring({ frame, fps, config: { damping: 15, stiffness: 150, mass: 0.8 } });

  /* 发送者 → 头像色(按出场顺序) */
  const senderColor = new Map<string, string>();
  messages.forEach((m) => {
    if (m.kind === 'notice' || m.self) return;
    const k = m.from ?? '';
    if (!senderColor.has(k)) senderColor.set(k, avatarColors[senderColor.size % Math.max(1, avatarColors.length)] ?? '#9b9b9b');
  });

  /* 时间表:每条 start = 上一条 end + 0.5s;对方文字按字数流出,己方 0.32s 弹入,通知 0.28s 浮现 */
  const revealF = (WX.STREAM_REVEAL_SEC / WX.STREAM_SPEED) * fps;
  type Timed = { m: WxMsg; start: number; dur: number; height: number; prog: number };
  const timed: Timed[] = [];
  let cursor = startAt;
  messages.forEach((m) => {
    let dur: number;
    let height: number;
    if (m.kind === 'notice') {
      dur = revealF * 3;
      height = H_NOTICE;
    } else if (m.self) {
      dur = WX.POP_SEC * fps;
      height = (isGroup ? 0 : 0) + bubbleLines(m.text) * LINE_H + 16;
    } else {
      dur = streamSeconds(m.text) * fps;
      height = (isGroup ? H_NAME : 0) + bubbleLines(m.text) * LINE_H + 16;
    }
    const prog = frameProgress(frame, cursor, dur);
    timed.push({ m, start: cursor, dur, height, prog });
    cursor += dur + WX.GAP_SEC * fps;
  });

  /* 视口滚动:内容超过视口时整体上移(条目高按出现进度计入,推得平滑) */
  let contentH = WX.PAD * 2;
  timed.forEach((t, i) => {
    const vis = t.m.kind === 'notice' || t.m.self ? t.prog : frameProgress(frame, t.start, revealF);
    if (vis <= 0) return;
    contentH += t.height * vis + (i > 0 ? WX.ITEM_GAP * vis : 0);
  });
  const scrollOffset = Math.max(0, contentH - viewportH);

  /* 手机屏几何 */
  const phoneH = WX.HEADER_H + viewportH + WX.COMPOSER_H;
  const s = scale * (0.85 + 0.15 * winPop);
  const px = align === 'left' ? 200 : align === 'right' ? 1920 - 200 - WX.SCREEN_W * scale : 960 - (WX.SCREEN_W * scale) / 2;
  const py = Math.max(36, (1080 - phoneH * scale) / 2);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <div style={{ position: 'absolute', left: px, top: py, width: WX.SCREEN_W, height: phoneH, transform: `scale(${s})`, transformOrigin: '50% 50%', opacity: winPop, filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.22))' }}>
        <WeChatScreen title={header} viewportH={viewportH} scrollOffset={scrollOffset} borderRadius={14}>
          {timed.map((t, i) => {
            if (frame < t.start) return null;
            const m = t.m;
            if (m.kind === 'notice') {
              return (
                <div key={i} style={revealStyle(t.prog)}>
                  <WeChatNotice>{m.text}</WeChatNotice>
                </div>
              );
            }
            if (m.self) {
              const speaking = interpolate(frame, [t.start, t.start + 4, t.start + t.dur + 12, t.start + t.dur + 24], [0, 1, 1, 0], clampBoth);
              return (
                <div key={i} style={popStyle(t.prog, true)}>
                  <WeChatMessageRow avatarColor={selfColor} isSelf initial={selfName} speaking={speaking}>
                    <WeChatTextBubble isSelf>{renderText(m.text)}</WeChatTextBubble>
                  </WeChatMessageRow>
                </div>
              );
            }
            // 对方:整条 0.14s 上浮浮现,文字按流出进度逐字
            const reveal = frameProgress(frame, t.start, revealF);
            const chars = Array.from(m.text);
            const shown = chars.slice(0, Math.floor(chars.length * t.prog)).join('');
            const speaking = interpolate(frame, [t.start - 2, t.start + 4, t.start + t.dur + 10, t.start + t.dur + 22], [0, 1, 1, 0], clampBoth);
            const name = m.from ?? '';
            return (
              <div key={i} style={revealStyle(reveal)}>
                <WeChatMessageRow avatarColor={senderColor.get(name) ?? '#9b9b9b'} senderName={isGroup ? name : undefined} initial={name} speaking={speaking}>
                  <WeChatTextBubble minWidth={36}>{renderText(shown)}</WeChatTextBubble>
                </WeChatMessageRow>
              </div>
            );
          })}
        </WeChatScreen>
      </div>
    </AbsoluteFill>
  );
};

/** 镜头说明书(SceneTag)—— 值纯字面量。 */
export const wechatchatTag: SceneTag = {
  id: 'wechatchat',
  componentName: 'WeChatChatScene',
  title: '微信聊天窗',
  category: '动画小剧场',
  style: '品牌·双主题',
  status: 'stable',
  intent: '一部竖屏手机微信聊天窗弹出,消息按顺序落下:对方白泡逐字流出、己方绿泡弹入、系统通知居中浮现,说话的人头像亮绿圈——「群里 / 私聊里发生了什么」的界面 B-roll',
  suitableFor: '口播复述一段对话 / 群聊 / 消息往来的段落;要把「谁说了什么」演成真实微信界面而不是示意图的地方;单聊群聊都行',
  notFor: '需要图片消息 / 语音条 / 转账等非文字消息的段落;要拖拽物件进聊天窗的叙事(另造);终端对话(用 ccwindow)',
  exampleBeats: ['前端在群里甩了一句 按钮改了 后端对一下接口', '他们三个自己在群里就把事碰完了'],
  form: 'F4',
  defaultPose: 'audio-only',
  fullscreenOnly: true,
  needsExternalAsset: false,
  assetType: null,
  textBinding: 'title',
  fields: [
    { key: 'title', label: '顶栏标题', type: 'text', tier: 'primary', required: true, default: '项目群', help: '群名或对方昵称' },
    { key: 'memberCount', label: '群人数', type: 'number', tier: 'primary', default: 4, help: '0 = 单聊(不显昵称);大于 1 = 群聊,顶栏「标题(n)」并显示发送者昵称' },
    {
      key: 'messages', label: '消息序列', type: 'list', tier: 'primary', required: true,
      default: [
        { kind: 'notice', text: '你邀请“前端”、“后端”、“测试”加入了群聊' },
        { from: '前端', text: '按钮改了,@后端 对一下接口' },
        { from: '后端', text: '收到,接口字段我十分钟发你' },
        { from: '我', text: '测试一起看下,别等到最后', self: true },
        { from: '测试', text: '好,我先把用例跑一遍' },
      ],
      help: '按顺序落下;kind 缺省 text;notice = 居中灰字系统通知;self=true 是己方绿泡;文字里 @xx 自动染微信蓝',
      itemFields: [
        { key: 'from', label: '发送者', type: 'text', tier: 'primary', help: '昵称首字做头像;notice / self 可不填' },
        { key: 'text', label: '文字', type: 'text', tier: 'primary', required: true },
        { key: 'self', label: '己方', type: 'boolean', tier: 'primary', default: false },
        { key: 'kind', label: '形态', type: 'enum', tier: 'primary', default: 'text', values: ['text', 'notice'] },
      ],
    },
    { key: 'scale', label: '手机屏缩放', type: 'number', tier: 'advanced', default: 1.3, help: '原件 390 宽;1.3 → 507 宽' },
    { key: 'align', label: '横向位置', type: 'enum', tier: 'advanced', default: 'center', values: ['center', 'left', 'right'] },
    { key: 'viewportH', label: '消息视口高', type: 'number', tier: 'advanced', default: 520, help: '原件 660;压低让整屏落进安全区' },
    { key: 'startAt', label: '首条出现帧', type: 'number', tier: 'advanced', default: 10 },
    { key: 'avatarColors', label: '头像色板', type: 'list', tier: 'advanced', default: ['#5b8def', '#e0a35a', '#6bbf7a', '#b57edc', '#e57373'], help: '每项一个 #rrggbb,按发送者出场顺序分配' },
    { key: 'selfColor', label: '己方头像色', type: 'color', tier: 'advanced', default: '#3d7be0' },
    { key: 'selfName', label: '己方昵称', type: 'text', tier: 'advanced', default: '我', help: '首字做己方头像' },
  ],
  catalog: {
    narratorPosition: '不出现/仅声音,画面中央一部竖屏手机微信窗',
    supportingElements: ['微信顶栏', '昵称首字头像', '白泡 / 绿泡', '系统通知灰字', '空输入栏'],
    animation: '手机屏弹入 → 消息按序落下(对方逐字流出、己方弹入、通知浮现)→ 说话者头像绿圈微放大 → 超出视口整体上滚',
    background: '透明(装配层铺底)+ 微信灰白屏',
  },
  previewSeconds: 8,
  preview: { version: 1, kind: 'scene', background: 'transparent', context: 'none', galleryLoop: 'once' },
  tagVersion: 1,
};

export default WeChatChatScene;
