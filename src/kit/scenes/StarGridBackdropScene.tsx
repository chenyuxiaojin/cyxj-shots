import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {StarGridBackdrop, type StarGridProps} from '../components/StarGridBackdrop';
import type {SceneTag} from '../schema/sceneTag';

export const StarGridBackdropScene: React.FC<StarGridProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps,width,height} = useVideoConfig();
  return <StarGridBackdrop {...props} frame={frame} fps={fps} videoWidth={width} videoHeight={height}/>;
};

export const stargridTag: SceneTag = {
  id:'stargrid',componentName:'StarGridBackdropScene',title:'灰阶菱格 · 旋转星芒',
  category:'转场·背景',style:'中立',status:'experimental',
  intent:'在固定灰阶光场与渐隐菱格上，以两角六角星芒的加速旋转和缓停建立背景节奏。',
  suitableFor:'竖屏产品展示、搜索内容容器、留白文字背景；可独立关闭星芒或网格。',
  notFor:'需要模拟真实搜索结果页面内容的片段，本镜头不包含搜索框与结果文字。',
  exampleBeats:['星芒加速旋转两圈后逐步停下','移除星芒，只保留灰阶菱格背景'],
  form:'F4',defaultPose:'audio-only',fullscreenOnly:true,needsExternalAsset:false,assetType:null,
  previewSeconds:11,preview:{version:1,kind:'opaque-scene',background:'opaque',context:'none',galleryLoop:'loop'},
  fields:[
    {key:'motionSeconds',label:'旋转过程秒数',type:'number',tier:'primary',default:10,help:'缓动全过程时长，结束后几何冻结。'},
    {key:'turns',label:'旋转圈数',type:'number',tier:'primary',default:2,help:'负数反向旋转，零为静态。'},
    {key:'starScale',label:'星芒尺寸倍率',type:'number',tier:'primary',default:1},
    {key:'starColor',label:'星芒颜色',type:'color',tier:'primary',default:'#151515'},
    {key:'baseColor',label:'背景暗部',type:'color',tier:'primary',default:'#323232'},
    {key:'glowColor',label:'中心光晕',type:'color',tier:'primary',default:'#c7c7c7'},
    {key:'gridColor',label:'网格颜色',type:'color',tier:'primary',default:'#000000'},
    {key:'gridSpacing',label:'菱格间距',type:'number',tier:'advanced',default:92.5,help:'720宽参考画布下的像素距离。'},
    {key:'gridLineWidth',label:'网格线宽',type:'number',tier:'advanced',default:1},
    {key:'gridOpacity',label:'网格浓度',type:'number',tier:'advanced',default:1},
    {key:'glowStrength',label:'光晕强度',type:'number',tier:'advanced',default:1},
    {key:'shadowOpacity',label:'阴影浓度',type:'number',tier:'advanced',default:0.57},
    {key:'shadowBlur',label:'阴影柔化',type:'number',tier:'advanced',default:17},
    {key:'shadowOffset',label:'阴影偏移',type:'number',tier:'advanced',default:25},
    {key:'topX',label:'右上星芒横坐标',type:'number',tier:'advanced',default:0.895833,help:'画宽比例。'},
    {key:'topY',label:'右上星芒纵坐标',type:'number',tier:'advanced',default:0.059063,help:'画高比例。'},
    {key:'bottomX',label:'左下星芒横坐标',type:'number',tier:'advanced',default:0.088333,help:'画宽比例。'},
    {key:'bottomY',label:'左下星芒纵坐标',type:'number',tier:'advanced',default:0.928125,help:'画高比例。'},
    {key:'showStars',label:'显示星芒',type:'boolean',tier:'primary',default:true},
    {key:'showGrid',label:'显示菱格',type:'boolean',tier:'primary',default:true},
    {key:'showBaseFill',label:'显示底色',type:'boolean',tier:'primary',default:true,help:'关闭后组件透明，可叠加自己的素材。ScenePreview 仍会垫深底。'},
  ],
  catalog:{narratorPosition:'不出镜，竖屏背景',supportingElements:['六角星芒','柔阴影','渐隐菱格','灰阶光场'],animation:'固定中心旋转两圈 → 缓停 → 保持',background:'参考专用灰阶，不替换为品牌暖色'},
  tagVersion:1,promotedFrom:'create-vibe-motion',
};
