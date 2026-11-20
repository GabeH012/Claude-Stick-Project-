import React from "react";
import { AbsoluteFill } from "remotion";
import { Bean, CAST, OL, SKIN } from "./Bean";
import { Prop } from "./props";
import { HAND, TITLE } from "./sets";

/* YouTube channel banner, 2560x1440. Safe area on every device = centre 1546x423 (x 507-2053, y 508-931):
   the mascot's face and the title live there. Desktop also shows the full-width band y 508-931; TV shows everything. */
export const Banner: React.FC<{ guides?: boolean }> = ({ guides }) => {
  const T = 0.4;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #2a3350 0%, #161b2b 55%, #0b0d14 100%)" }}>
      <svg viewBox="0 0 2560 1440" width={2560} height={1440}>
        {/* sunburst + soft spotlight behind the mascot */}
        <g transform="translate(640,690)" opacity={0.07}>
          {Array.from({ length: 20 }).map((_, i) => <path key={i} d="M0,0 L-90,-1500 L90,-1500 Z" fill="#ffd21f" transform={`rotate(${i * 18})`} />)}
        </g>
        <ellipse cx={1280} cy={720} rx={1200} ry={330} fill="#2f3d66" opacity={0.35} />
        {/* drifting dust like the title cards */}
        {Array.from({ length: 60 }).map((_, i) => (
          <circle key={i} cx={(Math.sin(i * 91.7) * 0.5 + 0.5) * 2560} cy={(Math.cos(i * 37.3) * 0.5 + 0.5) * 1440} r={2 + (i % 3) * 1.5} fill="#fff" opacity={0.08 + (i % 4) * 0.03} />
        ))}
        {/* floor band */}
        <rect x={0} y={1000} width={2560} height={440} fill="#0f1320" />
        <rect x={0} y={994} width={2560} height={10} fill="#2a3350" />

        {/* left wing (desktop/TV): story props */}
        <g transform="translate(215,700) scale(0.3)"><Prop p={{ kind: "chart", x: 0, y: 0, label: "GROWTH" }} T={T} /></g>
        <g transform="translate(215,905) scale(0.32)"><Prop p={{ kind: "money", x: 0, y: 0, n: 4 }} T={T} /></g>
        <Bean T={T} x={420} y={1000} s={0.6} {...CAST.cof2} expr="shock" look={0.6} armL="up" armR="up" />

        {/* mascot (same as the profile photo) + idea bulb */}
        <Bean T={T} x={650} y={985} s={1.0} hair="side" hairColor="#3a2418" outfit="hoodie" color="#ffd21f" skin={SKIN.a} expr="happy" look={0.4} lookY={-0.5} armR="pointUp" seed={2} />
        <g transform="translate(800,575) scale(0.42)"><Prop p={{ kind: "bulb", x: 0, y: 0 }} T={T} /></g>

        {/* title */}
        <text x={880} y={765} fontFamily={TITLE} fontSize={176} stroke={OL} strokeWidth={24} paintOrder="stroke" style={{ letterSpacing: 3 }}>
          <tspan fill="#ffffff">Mini</tspan><tspan fill="#ffd21f">Motions</tspan>
        </text>
        <rect x={890} y={795} width={1000} height={14} rx={7} fill="#ffd21f" />
        <text x={892} y={870} fontFamily={HAND} fontWeight={600} fontSize={46} fill="#c9d2ea" style={{ letterSpacing: 6 }}>BIG STORIES, TOLD SMALL</text>

        {/* right wing (desktop/TV): globe, board and a cheering pair */}
        <g transform="translate(2370,650) scale(0.34)"><Prop p={{ kind: "globe", x: 0, y: 0, net: 1 }} T={T} /></g>
        <g transform="translate(2370,900) scale(0.22)"><Prop p={{ kind: "board", x: 0, y: 0, glow: false }} T={T} /></g>
        <Bean T={T} x={2170} y={1000} s={0.6} {...CAST.woman} expr="happy" look={-0.5} armL="up" armR="wave" />

        {guides ? <g fill="none" strokeWidth={6}>
          <rect x={507} y={508} width={1546} height={423} stroke="#ff3b3b" />
          <rect x={0} y={508} width={2560} height={423} stroke="#3bff6b" strokeDasharray="20 14" />
        </g> : null}
      </svg>
    </AbsoluteFill>
  );
};
export const ChannelBanner: React.FC = () => <Banner />;
export const ChannelBannerGuides: React.FC = () => <Banner guides />;
