import React from 'react';
export const Backdrop = ({ color }: {
    color: string;
}) => <><defs><linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1"><stop offset=".72" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".55"/></linearGradient></defs><rect width="960" height="540" fill={color}/><rect width="960" height="540" fill="url(#bottom)"/></>;
export const Caption = ({ text }: {
    text: string;
}) => <text x="480" y="509" textAnchor="middle" fontFamily="ReplicaSans,sans-serif" fontWeight="700" fontSize="32" fill="white" stroke="#777" strokeWidth=".7" paintOrder="stroke">{text}</text>;
