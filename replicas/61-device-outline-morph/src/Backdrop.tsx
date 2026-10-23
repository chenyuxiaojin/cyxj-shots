import React from 'react';
export const Backdrop = ({ color }: {
    color: string;
}) => <><defs><pattern id="grid" width="17" height="14" patternUnits="userSpaceOnUse"><path d="M17 0H0V14" fill="none" stroke="#080e0f" strokeWidth="1" opacity=".6"/></pattern><radialGradient id="shade"><stop stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".43"/></radialGradient><filter id="texture"><feTurbulence baseFrequency=".72" numOctaves="2" seed="9"/><feColorMatrix type="saturate" values="0"/></filter></defs><rect width="960" height="540" fill={color}/><rect width="960" height="540" fill="url(#grid)"/><rect width="960" height="540" fill="url(#shade)"/><rect width="960" height="540" filter="url(#texture)" opacity=".035"/>{[70, 346, 886].map(x => <circle key={x} cx={x} cy="0" r="9" fill="#141817"/>)}</>;
export const Caption = ({ text }: {
    text: string;
}) => <text x="480" y="513" textAnchor="middle" fill="white" stroke="#111" strokeWidth="3" paintOrder="stroke" fontFamily="ReplicaTitle, sans-serif" fontWeight="900" fontSize="36">{text}</text>;
