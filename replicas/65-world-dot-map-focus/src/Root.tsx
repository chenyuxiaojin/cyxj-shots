import React from 'react';
import { Composition } from 'remotion';
import { Scene } from './Scene';
import defaults from '../props.json';
export const Root = () => <><Composition id="Replica" component={Scene} width={540} height={960} fps={30.0} durationInFrames={176} defaultProps={defaults} calculateMetadata={({ props }) => ({ durationInFrames: Math.max(30.0, Math.round(props.durationSeconds * 30.0)) })}/></>;
