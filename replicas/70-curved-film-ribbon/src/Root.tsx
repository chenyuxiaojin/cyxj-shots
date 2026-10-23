import React from 'react';
import { Composition } from 'remotion';
import { Scene } from './Scene';
import defaults from '../props.json';
export const Root = () => <><Composition id="Replica" component={Scene} width={1280} height={720} fps={30.0} durationInFrames={198} defaultProps={defaults} calculateMetadata={({ props }) => ({ durationInFrames: Math.max(30.0, Math.round(props.durationSeconds * 30.0)) })}/></>;
