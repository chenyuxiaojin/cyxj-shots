import React from 'react';
import { Composition } from 'remotion';
import { Scene } from './Scene';
import defaults from '../props.json';
export const Root = () => <><Composition id="Replica" component={Scene} width={1280} height={720} fps={25.0} durationInFrames={71} defaultProps={defaults} calculateMetadata={({ props }) => ({ durationInFrames: Math.max(25.0, Math.round(props.durationSeconds * 25.0)) })}/></>;
