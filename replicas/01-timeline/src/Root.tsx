import React from 'react';
import {Composition} from 'remotion';
import {Scene} from './Scene';
import defaults from '../props.json';
export const Root=()=><><Composition id="Replica" component={Scene} width={1278} height={720} fps={30} durationInFrames={302} defaultProps={defaults} calculateMetadata={({props})=>({durationInFrames:Math.max(30,Math.round(props.durationSeconds*30))})}/></>;
