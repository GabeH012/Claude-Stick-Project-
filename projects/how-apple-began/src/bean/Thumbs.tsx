import React from "react";
import { AbsoluteFill } from "remotion";
import { OL } from "./Bean";
import { ShotStill, Shot } from "./BeanVideo";
import { TITLE } from "./sets";
import thumbs from "./thumbs.json";

/* Two YouTube thumbnails (1920x1080) from src/bean/thumbs.json:
   { "A": { "stage": <a shot: set, v, blur, chars, props, label>, "zoom": 1.0, "T": 2,
            "line1": "WHITE LINE", "line2": "BIG YELLOW LINE?", "x": 70, "y": 180, "size": 150 }, "B": {...} }
   Characters and props use the same fields as shots_spec.py (stage units 1920x1080, floor y = 900). */
type Spec = { stage: Partial<Shot>; zoom?: number; T?: number; line1: string; line2: string; x?: number; y?: number; size?: number; dark?: number };

const Big: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={TITLE} fontSize={size} fill={fill} stroke={OL} strokeWidth={size * 0.16} paintOrder="stroke"
    transform={`rotate(-4,${x},${y})`} style={{ letterSpacing: 2 }}>{children}</text>
);

const Thumb: React.FC<{ spec: Spec }> = ({ spec }) => {
  const x = spec.x ?? 70, y = spec.y ?? 180, size = spec.size ?? 150;
  return (<AbsoluteFill>
    <ShotStill sh={spec.stage} T={spec.T ?? 2} zoom={spec.zoom ?? 1} />
    {spec.dark ? <AbsoluteFill style={{ background: "#000", opacity: spec.dark }} /> : null}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)" }} />
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute" }}>
      <Big x={x} y={y} size={size * 0.85} fill="#fff">{spec.line1}</Big>
      <Big x={x} y={y + size * 1.02} size={size} fill="#ffd21f">{spec.line2}</Big>
    </svg>
  </AbsoluteFill>);
};

export const ThumbA: React.FC = () => <Thumb spec={(thumbs as any).A} />;
export const ThumbB: React.FC = () => <Thumb spec={(thumbs as any).B} />;
