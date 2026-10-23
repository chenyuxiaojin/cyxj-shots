import React from 'react';
import { Composition } from 'remotion';
import { Scene } from './Scene';
import defaults from '../props.json';
export const Root = () => <><Composition id="Replica" component={Scene} width={720} height={1280} fps={30.0} durationInFrames={41} defaultProps={defaults} calculateMetadata={({ props }) => ({ durationInFrames: Math.max(30.0, Math.round(props.durationSeconds * 30.0)) })}/></>;
