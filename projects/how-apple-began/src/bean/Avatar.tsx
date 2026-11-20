import React from "react";
import { AbsoluteFill } from "remotion";
import { Bean, OL, SKIN } from "./Bean";
import { Prop } from "./props";

/* Channel profile photo (800x800, safe inside YouTube's circle crop): an original bean mascot with the "idea" bulb. */
export const Avatar: React.FC<{ bg?: string }> = ({ bg = "ink" }) => {
  const ink = bg === "ink";
  return (
    <AbsoluteFill style={{ background: ink ? "radial-gradient(circle at 50% 42%, #2a3350 0%, #161b2b 60%, #0b0d14 100%)" : "radial-gradient(circle at 50% 42%, #ffe36b 0%, #ffd21f 55%, #e8b400 100%)" }}>
      <svg viewBox="0 0 800 800" width={800} height={800}>
        {/* sunburst behind the head */}
        <g transform="translate(400,400)" opacity={ink ? 0.07 : 0.22}>
          {Array.from({ length: 16 }).map((_, i) => (
            <path key={i} d="M0,0 L-60,-460 L60,-460 Z" fill={ink ? "#ffd21f" : "#fff"} transform={`rotate(${i * 22.5})`} />
          ))}
        </g>
        <circle cx={400} cy={410} r={330} fill={ink ? "#2f3d66" : "#fff6cf"} opacity={ink ? 0.6 : 0.5} />
        <Bean T={0.4} x={350} y={440 + 290 * 2.35} s={2.35} hair="side" hairColor="#3a2418" outfit="hoodie" color={ink ? "#ffd21f" : "#2f8f7a"}
          skin={SKIN.a} expr="happy" look={0.35} lookY={-0.6} armR="pointUp" seed={2} />
        <g transform="translate(590,215) scale(0.85)"><Prop p={{ kind: "bulb", x: 0, y: 0 }} T={0.6} /></g>
        <circle cx={400} cy={400} r={396} fill="none" stroke={OL} strokeWidth={0} />
      </svg>
    </AbsoluteFill>
  );
};
export const AvatarInk: React.FC = () => <Avatar bg="ink" />;
export const AvatarSun: React.FC = () => <Avatar bg="sun" />;
