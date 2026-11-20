import React from "react";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { OL } from "./Bean";

// our own type: Fredoka (rounded, upright) for labels/props, Lilita One for titles and cards (bundled locally in public/fonts)
for (const w of ["500", "600", "700"]) loadFont({ family: "Fredoka", url: staticFile(`fonts/fredoka-latin-${w}-normal.woff2`), weight: w });
loadFont({ family: "Lilita One", url: staticFile("fonts/lilita-one-latin-400-normal.woff2"), weight: "400" });
export const HAND = "Fredoka", TITLE = "Lilita One";
export const W = 1920, H = 1080;
export const FLOOR = 900;

// deterministic pseudo-random
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const Txt: React.FC<{ x: number; y: number; size: number; children: React.ReactNode; fill?: string; anchor?: "start" | "middle" | "end"; rot?: number; weight?: number; op?: number; stroke?: string }> =
  ({ x, y, size, children, fill = OL, anchor = "middle", rot = 0, weight = 700, op = 1, stroke }) => (
    <text x={x} y={y} fontSize={size} fontFamily={HAND} fontWeight={weight} fill={fill} textAnchor={anchor} opacity={op}
      transform={rot ? `rotate(${rot},${x},${y})` : undefined} stroke={stroke} strokeWidth={stroke ? size * 0.12 : 0} paintOrder="stroke" style={{ letterSpacing: 1 }}>{children}</text>
  );

const Grad: React.FC<{ id: string; stops: [number, string][]; x2?: number; y2?: number }> = ({ id, stops, x2 = 0, y2 = 1 }) => (
  <linearGradient id={id} x1={0} y1={0} x2={x2} y2={y2}>{stops.map(([o, c], i) => <stop key={i} offset={o} stopColor={c} />)}</linearGradient>
);
const Glow: React.FC<{ id: string; c: string; o?: number }> = ({ id, c, o = 0.6 }) => (
  <radialGradient id={id}><stop offset={0} stopColor={c} stopOpacity={o} /><stop offset={1} stopColor={c} stopOpacity={0} /></radialGradient>
);

const City: React.FC<{ y: number; c: string; win?: string; seed: number; h: number; T: number; n?: number }> = ({ y, c, win, seed, h, T, n = 16 }) => {
  const bw = W / n;
  return (<g>{Array.from({ length: n + 1 }).map((_, i) => {
    const bh = h * (0.45 + rnd(seed + i) * 0.55), x = i * bw - rnd(seed + i * 3) * 30, w = bw * (0.7 + rnd(seed + i * 7) * 0.5);
    return (<g key={i}>
      <rect x={x} y={y - bh} width={w} height={bh + 200} fill={c} />
      {win ? Array.from({ length: Math.floor(bh / 34) }).map((__, r) => Array.from({ length: Math.max(1, Math.floor(w / 30)) }).map((___, k) => {
        const on = rnd(seed * 3 + i * 31 + r * 7 + k) > 0.55;
        return on ? <rect key={`${r}-${k}`} x={x + 8 + k * 30} y={y - bh + 12 + r * 34} width={14} height={18} fill={win} opacity={0.75 + 0.25 * Math.sin(T * 0.7 + i + r)} /> : null;
      })) : null}
    </g>);
  })}</g>);
};

/* ---------------- backgrounds ---------------- */
type SetP = { T: number; v?: string; screen?: React.ReactNode; tv?: string[]; tick?: string; label?: string };

const Office: React.FC<SetP> = ({ T, v }) => {
  const night = v === "night";
  return (<g>
    <defs><Grad id="ofw" stops={night ? [[0, "#2c3646"], [1, "#222a37"]] : [[0, "#d6dde0"], [1, "#bfc8cc"]]} />
      <Grad id="ofs" stops={night ? [[0, "#0d1530"], [1, "#24305a"]] : [[0, "#9fd3ea"], [1, "#dff1f7"]]} /></defs>
    <rect width={W} height={H} fill="url(#ofw)" />
    <rect x={560} y={120} width={1300} height={520} fill="url(#ofs)" />
    <City y={640} c={night ? "#1a2240" : "#a9c1cc"} win={night ? "#ffd56b" : undefined} seed={5} h={330} T={T} n={12} />
    {[560, 885, 1210, 1535, 1860].map((x) => <rect key={x} x={x - 8} y={120} width={16} height={520} fill={night ? "#3a4456" : "#e9eef0"} stroke={OL} strokeWidth={3} />)}
    <rect x={552} y={112} width={1316} height={16} fill={night ? "#3a4456" : "#eef2f3"} stroke={OL} strokeWidth={3} />
    <rect x={552} y={632} width={1316} height={20} fill={night ? "#3a4456" : "#eef2f3"} stroke={OL} strokeWidth={3} />
    {/* whiteboard + plant */}
    <rect x={90} y={230} width={360} height={240} rx={8} fill="#f8f8f4" stroke={OL} strokeWidth={4} />
    <path d="M120,420 L190,380 L250,400 L330,320 L410,290" stroke="#3a9a5a" strokeWidth={6} fill="none" strokeLinecap="round" />
    <Txt x={180} y={280} size={30} anchor="start">Q3 GOALS</Txt>
    <rect x={0} y={FLOOR - 40} width={W} height={H} fill={night ? "#2a3240" : "#9aa5aa"} />
    <rect x={0} y={FLOOR - 46} width={W} height={10} fill={night ? "#3b4556" : "#c4ccd0"} />
    {night ? <ellipse cx={960} cy={FLOOR + 40} rx={700} ry={90} fill="#fff" opacity={0.04} /> : <ellipse cx={960} cy={FLOOR + 40} rx={800} ry={100} fill="#fff" opacity={0.12} />}
    <g transform="translate(1800,860)">
      <path d="M-40,0 L40,0 L30,-70 L-30,-70 Z" fill="#c9845a" stroke={OL} strokeWidth={4} />
      {[-60, -25, 10, 45].map((a, i) => <ellipse key={i} cx={Math.sin(a / 30) * 40} cy={-120 - i * 18} rx={22} ry={60} transform={`rotate(${a},0,-70)`} fill={i % 2 ? "#4f9a5a" : "#3f8a4c"} stroke={OL} strokeWidth={4} />)}
    </g>
  </g>);
};

const Garage: React.FC<SetP> = ({ T }) => (<g>
  <defs><Glow id="lamp" c="#ffcf7a" o={0.55} /></defs>
  <rect width={W} height={H} fill="#a26f43" />
  {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={i * 122} y={0} width={4} height={H} fill="#8a5c36" />)}
  <rect x={1280} y={150} width={420} height={300} fill="#1b2a4a" stroke={OL} strokeWidth={6} />
  {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={1290 + rnd(i) * 400} cy={160 + rnd(i + 50) * 280} r={2} fill="#fff" opacity={0.5 + 0.5 * Math.sin(T * 2 + i)} />)}
  <circle cx={1600} cy={230} r={30} fill="#f4f0d8" />
  <path d="M1490,150 L1490,450 M1280,300 L1700,300" stroke="#7a5030" strokeWidth={10} />
  {/* shelf with boxes */}
  <rect x={120} y={330} width={520} height={14} fill="#6b4426" stroke={OL} strokeWidth={4} />
  {[150, 260, 400, 500].map((x, i) => <rect key={x} x={x} y={330 - 70 - (i % 2) * 20} width={90 + (i % 2) * 20} height={70 + (i % 2) * 20} fill="#d7aa6c" stroke={OL} strokeWidth={4} />)}
  <rect x={0} y={FLOOR - 40} width={W} height={H} fill="#5e4130" />
  <rect x={0} y={FLOOR - 46} width={W} height={10} fill="#7a5640" />
  <circle cx={960} cy={120} r={500} fill="url(#lamp)" />
  <path d="M960,0 L960,90" stroke={OL} strokeWidth={4} />
  <path d="M920,120 L1000,120 L980,90 L940,90 Z" fill="#3c6b4a" stroke={OL} strokeWidth={4} />
  <circle cx={960} cy={126} r={10} fill="#fff6c8" />
</g>);

const Keynote: React.FC<SetP> = ({ T, screen }) => (<g>
  <defs><Grad id="kn" stops={[[0, "#0b1022"], [1, "#1a1f3a"]]} /><Glow id="spot" c="#fff" o={0.35} /><Glow id="scr" c="#76b900" o={0.35} /></defs>
  <rect width={W} height={H} fill="url(#kn)" />
  <circle cx={960} cy={330} r={720} fill="url(#scr)" opacity={0.6} />
  <rect x={410} y={70} width={1100} height={520} rx={14} fill="#0e1a12" stroke="#2c3a30" strokeWidth={8} />
  <g transform="translate(960,330)">{screen}</g>
  {[300, 960, 1620].map((x, i) => <path key={x} d={`M${x},-20 L${x - 260},${FLOOR + 40} L${x + 260},${FLOOR + 40} Z`} fill="#fff" opacity={0.045 + 0.02 * Math.sin(T * 1.5 + i)} />)}
  <path d={`M0,${FLOOR - 30} L${W},${FLOOR - 30} L${W},${H} L0,${H} Z`} fill="#20253f" />
  <rect x={0} y={FLOOR - 36} width={W} height={8} fill="#3a4170" />
  <ellipse cx={960} cy={FLOOR - 10} rx={320} ry={40} fill="url(#spot)" />
</g>);

export const Audience: React.FC<{ T: number; flashes?: boolean; n?: number; y?: number }> = ({ T, flashes = true, n = 26, y = 1060 }) => (<g>
  {Array.from({ length: n }).map((_, i) => {
    const x = (i + 0.5) * (W / n) + (rnd(i) - 0.5) * 30, yy = y + (i % 2) * 18;
    return <g key={i}><ellipse cx={x} cy={yy + 60} rx={56} ry={70} fill="#0a0d18" /><circle cx={x} cy={yy - 30} r={46} fill="#0f1322" stroke="#1d2338" strokeWidth={3} /></g>;
  })}
  {flashes ? Array.from({ length: 6 }).map((_, k) => {
    const ph = (T * 1.7 + k * 0.37) % 1.3;
    return ph < 0.08 ? <g key={k}><circle cx={150 + rnd(k + Math.floor(T * 1.7)) * 1620} cy={y - 60} r={60} fill="#fff" opacity={0.5} /><circle cx={150 + rnd(k + Math.floor(T * 1.7)) * 1620} cy={y - 60} r={16} fill="#fff" /></g> : null;
  }) : null}
</g>);

const DataCenter: React.FC<SetP> = ({ T }) => {
  const vx = 960, vy = 470;
  const rack = (side: 1 | -1, k: number) => {
    const x0 = vx + side * (110 + k * 0), d = 1 - k * 0.0;
    return d && x0;
  };
  void rack;
  return (<g>
    <defs><Glow id="dcg" c="#4fb8ff" o={0.4} /></defs>
    <rect width={W} height={H} fill="#0d1424" />
    <path d={`M0,${H} L${vx - 90},${vy + 60} L${vx + 90},${vy + 60} L${W},${H} Z`} fill="#1a2234" />
    <path d={`M0,0 L${vx - 90},${vy - 150} L${vx + 90},${vy - 150} L${W},0 Z`} fill="#121a2c" />
    {[-1, 1].map((sd) => Array.from({ length: 7 }).map((_, k) => {
      const t0 = k / 7, t1 = (k + 0.85) / 7;
      const X = (t: number) => sd === -1 ? 0 + (vx - 90) * Math.pow(t, 0.6) : W - (W - vx - 90) * Math.pow(t, 0.6);
      const yT = (t: number) => 0 + (vy - 150) * Math.pow(t, 0.6), yB = (t: number) => H - (H - vy - 60) * Math.pow(t, 0.6);
      const xa = X(t0), xb = X(t1);
      const pts = `${xa},${yT(t0)} ${xb},${yT(t1)} ${xb},${yB(t1)} ${xa},${yB(t0)}`;
      return (<g key={`${sd}${k}`}>
        <polygon points={pts} fill="#1e2a44" stroke="#0a0f1c" strokeWidth={4} />
        {Array.from({ length: 9 }).map((__, r) => {
          const fy = 0.12 + r * 0.09;
          const ya = yT(t0) + (yB(t0) - yT(t0)) * fy, yb = yT(t1) + (yB(t1) - yT(t1)) * fy;
          return <g key={r}>
            <line x1={xa} y1={ya} x2={xb} y2={yb} stroke="#0e1628" strokeWidth={3} />
            {[0.25, 0.45, 0.65].map((q, j) => {
              const on = Math.sin(T * (3 + rnd(k * 31 + r * 7 + j) * 6) + rnd(r + j * 5) * 20) > 0.1;
              const cx = xa + (xb - xa) * q, cy = ya + (yb - ya) * q + 10 * (1 - t0);
              return <circle key={j} cx={cx} cy={cy} r={5 * (1 - t0 * 0.7)} fill={j === 1 ? "#76e05a" : "#4fb8ff"} opacity={on ? 1 : 0.2} />;
            })}
          </g>;
        })}
      </g>);
    }))}
    <circle cx={vx} cy={vy} r={460} fill="url(#dcg)" />
    {Array.from({ length: 5 }).map((_, i) => { const t = i / 5; const y = (vy - 150) * Math.pow(t, 0.6); return <rect key={i} x={vx - 300 * (1 - t) - 30} y={y + 10} width={600 * (1 - t) + 60} height={10} fill="#bfe6ff" opacity={0.5} />; })}
  </g>);
};

const Boardroom: React.FC<SetP> = ({ T, v }) => (<g>
  <rect width={W} height={H} fill="#6a4630" />
  {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={i * 200} y={0} width={190} height={H} fill="#734c34" stroke="#5a3a26" strokeWidth={4} />)}
  <rect x={420} y={110} width={1080} height={430} fill={v === "night" ? "#101a36" : "#bfe2f0"} stroke={OL} strokeWidth={6} />
  <City y={540} c={v === "night" ? "#1c2546" : "#9db7c4"} win={v === "night" ? "#ffd56b" : undefined} seed={9} h={300} T={T} n={10} />
  <rect x={410} y={100} width={1100} height={20} fill="#4a3020" />
  <rect x={410} y={530} width={1100} height={20} fill="#4a3020" />
  <path d="M960,110 L960,540" stroke="#4a3020" strokeWidth={12} />
  <rect x={0} y={FLOOR - 40} width={W} height={H} fill="#3d2a20" />
  <circle cx={130} cy={260} r={60} fill="#f4f1e6" stroke={OL} strokeWidth={5} />
  <path d={`M130,260 L130,${260 - 40} M130,260 L${130 + 30 * Math.cos(T)},${260 + 30 * Math.sin(T)}`} stroke={OL} strokeWidth={5} strokeLinecap="round" />
</g>);
const BoardroomFG: React.FC = () => (<g>
  <path d="M120,760 L1800,760 L1880,850 L40,850 Z" fill="#5a3826" stroke={OL} strokeWidth={6} />
  <rect x={40} y={850} width={1840} height={40} fill="#432a1c" stroke={OL} strokeWidth={6} />
  <path d="M200,780 L1700,780" stroke="#fff" strokeOpacity={0.12} strokeWidth={6} />
</g>);

const Screens: React.FC<SetP> = ({ T, tv }) => {
  const items = tv ?? ["BREAKING", "?", "NEWS", "CEO?"];
  return (<g>
    <rect width={W} height={H} fill="#111522" />
    {Array.from({ length: 12 }).map((_, i) => {
      const c = i % 4, r = Math.floor(i / 4);
      const x = 160 + c * 410, y = 70 + r * 250, fl = 0.85 + 0.15 * Math.sin(T * 13 + i * 3);
      const label = items[i % items.length];
      return (<g key={i}>
        <rect x={x} y={y} width={380} height={220} rx={10} fill="#1d2233" stroke="#05070c" strokeWidth={8} />
        <rect x={x + 12} y={y + 12} width={356} height={196} fill={i % 3 === 0 ? "#2b3a63" : i % 3 === 1 ? "#5a2230" : "#24453a"} opacity={fl} />
        <rect x={x + 12} y={y + 160} width={356} height={36} fill="#c8262c" opacity={fl} />
        <Txt x={x + 190} y={y + 188} size={26} fill="#fff">{label}</Txt>
        <circle cx={x + 190} cy={y + 80} r={42} fill="#f2c9a0" opacity={0.9 * fl} stroke={OL} strokeWidth={4} />
        <path d={`M${x + 150},${y + 66} C${x + 150},${y + 30} ${x + 230},${y + 30} ${x + 230},${y + 66} C${x + 210},${y + 52} ${x + 170},${y + 52} ${x + 150},${y + 66} Z`} fill="#d9d9d6" stroke={OL} strokeWidth={3} />
        <path d={`M${x + 160},${y + 82} L${x + 220},${y + 82}`} stroke="#3a3330" strokeWidth={4} />
      </g>);
    })}
    <rect x={0} y={FLOOR + 20} width={W} height={H} fill="#0b0e18" />
  </g>);
};

const TICK = ["ACME", "CHIP", "BOLT", "ZINC", "NOVA", "GRID", "HALO", "KITE", "OPAL", "FLUX"];
const Trading: React.FC<SetP> = ({ T, tick }) => (<g>
  <rect width={W} height={H} fill="#141a26" />
  <rect x={0} y={20} width={W} height={70} fill="#06080d" />
  <g transform={`translate(${-((T * 160) % 1600)},0)`}>
    {Array.from({ length: 24 }).map((_, i) => {
      const up = tick === "down" ? i % 4 === 0 : rnd(i) > 0.4; const nm = TICK[i % TICK.length];
      return <g key={i}><Txt x={80 + i * 160} y={70} size={34} fill="#e8e8e8" anchor="start">{nm}</Txt>
        <Txt x={180 + i * 160} y={70} size={28} fill={up ? "#5fd35f" : "#ff5a4f"} anchor="start">{up ? "▲" : "▼"}</Txt></g>;
    })}
  </g>
  {Array.from({ length: 4 }).map((_, i) => (
    <g key={i}><rect x={80 + i * 460} y={130} width={420} height={260} rx={8} fill="#0b1220" stroke="#2c3550" strokeWidth={6} />
      <polyline points={Array.from({ length: 12 }).map((__, k) => `${100 + i * 460 + k * 34},${330 - (tick === "down" ? -k * 9 : k * 10) - rnd(i * 20 + k) * 60 - (tick === "down" ? 120 : 0)}`).join(" ")} fill="none" stroke={tick === "down" && i % 2 === 0 ? "#ff5a4f" : "#5fd35f"} strokeWidth={5} />
    </g>))}
  <rect x={0} y={FLOOR - 40} width={W} height={H} fill="#262d3c" />
</g>);

const Skyline: React.FC<SetP> = ({ T, v }) => {
  const night = v === "night";
  return (<g>
    <defs><Grad id="sky" stops={night ? [[0, "#070b1f"], [1, "#1d2a55"]] : [[0, "#2b1b4d"], [0.5, "#b4527a"], [1, "#f6a65a"]]} /><Glow id="sun" c={night ? "#fff" : "#ffe08a"} o={0.7} /></defs>
    <rect width={W} height={H} fill="url(#sky)" />
    {night ? Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i + 99) * 500} r={2} fill="#fff" opacity={0.4 + 0.6 * Math.abs(Math.sin(T + i))} />) : null}
    <circle cx={1420} cy={night ? 200 : 640} r={night ? 160 : 260} fill="url(#sun)" />
    <circle cx={1420} cy={night ? 200 : 640} r={night ? 50 : 90} fill={night ? "#f4f0d8" : "#ffe4a0"} />
    {!night ? [[200, 260], [700, 180], [1150, 300]].map(([x, y], i) => <g key={i} transform={`translate(${x + T * 6},${y})`} fill="#f7b8b0" opacity={0.85}>
      <ellipse cx={0} cy={0} rx={110} ry={34} /><ellipse cx={-50} cy={-20} rx={50} ry={34} /><ellipse cx={30} cy={-30} rx={60} ry={42} /></g>) : null}
    <City y={800} c={night ? "#141c3a" : "#5a3a6a"} seed={2} h={420} T={T} n={14} />
    <City y={880} c={night ? "#0c1228" : "#3a2550"} win="#ffd56b" seed={7} h={380} T={T} n={11} />
    <rect x={0} y={FLOOR} width={W} height={H} fill={night ? "#090d1c" : "#2a1a3a"} />
  </g>);
};

const Paper: React.FC<SetP> = ({ v }) => {
  const dark = v === "dark";
  return (<g>
    <defs><Grad id="pp" stops={dark ? [[0, "#1b1d24"], [1, "#2a2d36"]] : [[0, "#dedcd6"], [1, "#d0cec8"]]} /><Glow id="ppl" c="#fff" o={dark ? 0.12 : 0.5} /></defs>
    <rect width={W} height={H} fill="url(#pp)" />
    <path d={`M0,${FLOOR - 60} C600,${FLOOR - 90} 1320,${FLOOR - 90} ${W},${FLOOR - 60} L${W},${H} L0,${H} Z`} fill={dark ? "#24272f" : "#c6c3bc"} />
    <ellipse cx={960} cy={500} rx={900} ry={520} fill="url(#ppl)" />
  </g>);
};

const HQ: React.FC<SetP> = ({ T, v, label }) => {
  const dusk = v === "dusk";
  return (<g>
    <defs><Grad id="hqs" stops={dusk ? [[0, "#3b2a5a"], [1, "#f0a067"]] : [[0, "#8fcbe8"], [1, "#e6f4f8"]]} /></defs>
    <rect width={W} height={H} fill="url(#hqs)" />
    {[[260, 200], [1500, 150]].map(([x, y], i) => <g key={i} transform={`translate(${x + T * 8},${y})`} fill="#fff" opacity={dusk ? 0.35 : 0.9}><ellipse rx={100} ry={30} /><ellipse cx={-40} cy={-20} rx={50} ry={34} /><ellipse cx={30} cy={-26} rx={56} ry={40} /></g>)}
    {/* angular glass building */}
    <path d="M300,820 L420,360 L1500,360 L1620,820 Z" fill={dusk ? "#3f4a5c" : "#5d6b78"} stroke={OL} strokeWidth={6} />
    {Array.from({ length: 22 }).map((_, i) => { const x = 330 + i * 60; return <path key={i} d={`M${x},820 L${x + 60},360`} stroke={dusk ? "#56637a" : "#90a8b8"} strokeWidth={4} />; })}
    {Array.from({ length: 22 }).map((_, i) => { const x = 330 + i * 60; return <path key={i} d={`M${x},360 L${x + 60},820`} stroke={dusk ? "#4c5870" : "#7e95a6"} strokeWidth={3} opacity={0.7} />; })}
    <path d="M420,360 L1500,360 L1480,330 L440,330 Z" fill="#2c333d" stroke={OL} strokeWidth={5} />
    <rect x={760} y={240} width={400} height={90} rx={10} fill="#1d2329" stroke={OL} strokeWidth={5} />
    <Txt x={960} y={306} size={64} fill="#76b900">{label ?? "HQ"}</Txt>
    <rect x={860} y={690} width={200} height={130} fill="#bfe6f5" stroke={OL} strokeWidth={5} />
    <path d="M960,690 L960,820" stroke={OL} strokeWidth={4} />
    <rect x={0} y={820} width={W} height={H} fill={dusk ? "#7a6a68" : "#b9b5ad"} />
    <path d={`M0,840 L${W},840`} stroke="#fff" strokeOpacity={0.3} strokeWidth={6} />
    {[150, 1770].map((x) => <g key={x} transform={`translate(${x},860)`}><rect x={-10} y={-120} width={20} height={120} fill="#6b4a2e" stroke={OL} strokeWidth={4} /><circle cx={0} cy={-170} r={70} fill="#4f9a5a" stroke={OL} strokeWidth={5} /></g>)}
  </g>);
};

const Capitol: React.FC<SetP> = ({ T }) => (<g>
  <defs><Grad id="cps" stops={[[0, "#060a1a"], [1, "#1a2448"]]} /><Glow id="cpg" c="#ffe3a0" o={0.5} /></defs>
  <rect width={W} height={H} fill="url(#cps)" />
  {[600, 1320].map((x, i) => <path key={x} d={`M${x},${FLOOR} L${x + (i ? 300 : -300) + Math.sin(T * 0.5 + i) * 80},-50 L${x + (i ? 380 : -220) + Math.sin(T * 0.5 + i) * 80},-50 Z`} fill="#fff" opacity={0.06} />)}
  <circle cx={960} cy={560} r={520} fill="url(#cpg)" opacity={0.6} />
  <g fill="#e8e2d0" stroke={OL} strokeWidth={5}>
    <rect x={560} y={600} width={800} height={240} />
    <path d="M520,600 L1400,600 L1360,560 L560,560 Z" />
    <rect x={780} y={420} width={360} height={140} />
    <path d="M800,420 C800,250 1120,250 1120,420 Z" />
    <rect x={948} y={200} width={24} height={80} />
  </g>
  {Array.from({ length: 13 }).map((_, i) => <rect key={i} x={590 + i * 60} y={620} width={22} height={200} fill="#cfc8b4" stroke={OL} strokeWidth={3} />)}
  <rect x={0} y={840} width={W} height={H} fill="#10162a" />
</g>);

const Bedroom: React.FC<SetP> = ({ T }) => (<g>
  <rect width={W} height={H} fill="#1d2440" />
  <rect x={1350} y={140} width={360} height={280} fill="#0b1026" stroke={OL} strokeWidth={6} />
  <circle cx={1600} cy={220} r={36} fill="#f4f0d8" />
  <path d="M1530,140 L1530,420 M1350,280 L1710,280" stroke="#2c3560" strokeWidth={10} />
  <rect x={180} y={150} width={220} height={300} fill="#c8262c" stroke={OL} strokeWidth={5} transform="rotate(-4,290,300)" />
  <Txt x={290} y={300} size={50} fill="#fff" rot={-4}>GAME</Txt><Txt x={290} y={360} size={50} fill="#ffd21f" rot={-4}>ON!</Txt>
  <rect x={0} y={FLOOR - 40} width={W} height={H} fill="#151a30" />
  <circle cx={960} cy={600} r={400 + Math.sin(T * 6) * 10} fill="#5fb0ff" opacity={0.08} />
</g>);


const Home: React.FC<SetP> = ({ T }) => (<g>
  <defs><Glow id="hml" c="#ffd98a" o={0.45} /></defs>
  <rect width={W} height={H} fill="#e7c9a0" />
  {Array.from({ length: 24 }).map((_, i) => <rect key={i} x={i * 84} y={0} width={30} height={FLOOR - 40} fill="#dcbb90" />)}
  <rect x={1240} y={150} width={460} height={360} fill="#a8dcf2" stroke={OL} strokeWidth={8} />
  <circle cx={1600} cy={240} r={44} fill="#fff4c0" />
  {[[1330, 300], [1480, 260]].map(([x, y], i) => <g key={i} transform={`translate(${x + Math.sin(T * 0.3 + i) * 20},${y})`} fill="#fff"><ellipse rx={60} ry={20} /><ellipse cx={-24} cy={-12} rx={30} ry={20} /><ellipse cx={20} cy={-16} rx={34} ry={24} /></g>)}
  <path d="M1240,420 C1350,380 1450,440 1700,400 L1700,510 L1240,510 Z" fill="#7fbf6a" />
  <path d="M1470,150 L1470,510 M1240,330 L1700,330" stroke="#f4efe4" strokeWidth={12} />
  <rect x={1220} y={500} width={500} height={22} fill="#f4efe4" stroke={OL} strokeWidth={5} />
  {/* framed picture + lamp */}
  <rect x={170} y={190} width={240} height={180} fill="#f8f4ea" stroke={OL} strokeWidth={6} />
  <path d="M200,340 L260,270 L300,310 L340,250 L380,340 Z" fill="#6aa6d8" stroke={OL} strokeWidth={3} /><circle cx={360} cy={230} r={16} fill="#ffd21f" />
  <circle cx={600} cy={200} r={260} fill="url(#hml)" />
  <path d="M600,0 L600,140" stroke={OL} strokeWidth={4} />
  <path d="M540,190 L660,190 L630,140 L570,140 Z" fill="#e0703a" stroke={OL} strokeWidth={5} />
  <rect x={0} y={FLOOR - 40} width={W} height={H} fill="#9c6b45" />
  {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${i * 200},${FLOOR - 40} L${i * 200 - 60},${H}`} stroke="#8a5c3a" strokeWidth={4} />)}
  <rect x={0} y={FLOOR - 46} width={W} height={10} fill="#7a5034" />
  <ellipse cx={960} cy={FLOOR + 60} rx={620} ry={70} fill="#c8504a" opacity={0.55} />
</g>);

const Black: React.FC<SetP> = () => <rect width={W} height={H} fill="#000" />;

export const SETS: Record<string, React.FC<SetP>> = { office: Office, garage: Garage, keynote: Keynote, datacenter: DataCenter, boardroom: Boardroom, screens: Screens, trading: Trading, skyline: Skyline, paper: Paper, hq: HQ, capitol: Capitol, bedroom: Bedroom, home: Home, black: Black };
export const SETS_FG: Record<string, React.FC> = { boardroom: BoardroomFG };
