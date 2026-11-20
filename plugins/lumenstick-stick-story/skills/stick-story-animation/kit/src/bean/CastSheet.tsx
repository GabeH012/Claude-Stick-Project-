import React from "react";
import { AbsoluteFill } from "remotion";
import { Bean, CAST, Expr } from "./Bean";
import { HAND } from "./sets";

/* Reference sheet: every CAST preset (with its name) and every expression. `npx remotion still CastSheet out/cast.png` */
const EXPRS: Expr[] = ["calm", "neutral", "smile", "happy", "shock", "panic", "worried", "angry", "think", "smug", "sad"];
export const CastSheet: React.FC = () => {
  const names = Object.keys(CAST);
  const per = Math.ceil(names.length / 2);
  return (
    <AbsoluteFill style={{ background: "#d9dcd8" }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        {names.map((n, i) => {
          const row = Math.floor(i / per), col = i % per, x = 90 + col * (1760 / Math.max(1, per - 1));
          const y = row ? 1010 : 480;
          return <g key={n}>
            <Bean T={1.3 + i * 0.1} x={x} y={y} s={0.8} {...CAST[n]} expr={EXPRS[i % EXPRS.length]} />
            <text x={x} y={y + (col % 2 ? 74 : 42)} fontFamily={HAND} fontWeight={700} fontSize={24} textAnchor="middle" fill="#2b2522">{n} · {EXPRS[i % EXPRS.length]}</text>
          </g>;
        })}
      </svg>
    </AbsoluteFill>
  );
};
