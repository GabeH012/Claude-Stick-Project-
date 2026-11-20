import React from "react";
import { OL, Bean, CAST } from "./Bean";
import { Audience, HAND, Txt, rnd } from "./sets";

const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const easeBack = (k: number) => { const c = 1.7; const x = clamp(k) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };
export const easeIO = (k: number) => { const x = clamp(k); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
export const prog = (T: number, a: number | undefined, d: number) => (a === undefined ? 1 : clamp((T - a) / d));

/* text that writes on letter by letter between a and b */
export const typed = (s: string, T: number, a?: number, b?: number) => {
  if (a === undefined) return s;
  const k = clamp((T - a) / Math.max(0.05, (b ?? a + s.length * 0.05) - a));
  return s.slice(0, Math.round(k * s.length));
};

export type PropSpec = { kind: string; x: number; y: number; s?: number; at?: number; out?: number; rot?: number; move?: { x: number; y: number; a: number; b: number }; [k: string]: any };

const Chip: React.FC<{ T: number; label?: string; glow?: boolean; dull?: boolean }> = ({ T, label, glow = true, dull }) => {
  const pulse = 0.75 + 0.25 * Math.sin(T * 4);
  const g = dull ? "#8a8f94" : "#2f9a4a";
  return (<g>
    {glow && !dull ? <circle r={170} fill="#76e05a" opacity={0.18 * pulse} /> : null}
    {glow && !dull ? <circle r={120} fill="#9dff7a" opacity={0.18 * pulse} /> : null}
    {Array.from({ length: 9 }).map((_, i) => { const p = -80 + i * 20; return <g key={i} fill="#e3b341" stroke={OL} strokeWidth={2}>
      <rect x={p - 5} y={-112} width={10} height={20} /><rect x={p - 5} y={92} width={10} height={20} /><rect x={-112} y={p - 5} width={20} height={10} /><rect x={92} y={p - 5} width={20} height={10} /></g>; })}
    <rect x={-95} y={-95} width={190} height={190} rx={12} fill={g} stroke={OL} strokeWidth={6} />
    <rect x={-58} y={-58} width={116} height={116} rx={8} fill={dull ? "#4a4f55" : "#14261a"} stroke={OL} strokeWidth={5} />
    {!dull ? <path d="M-34,10 C-34,-30 30,-34 30,-4 C30,22 -6,26 -10,6 C-12,-8 8,-12 10,-2" stroke="#8dff6a" strokeWidth={6} fill="none" strokeLinecap="round" opacity={pulse} /> : null}
    <circle cx={-76} cy={-76} r={7} fill="#e3b341" />
    {label ? <Txt x={0} y={170} size={54} fill="#fff" stroke={OL}>{label}</Txt> : null}
  </g>);
};

const Crt: React.FC<{ T: number; mode?: string }> = ({ T, mode = "game" }) => (<g>
  <circle r={200} fill="#5fb0ff" opacity={0.12} />
  <rect x={-150} y={-130} width={300} height={240} rx={22} fill="#e2dccb" stroke={OL} strokeWidth={6} />
  <rect x={-120} y={-105} width={240} height={175} rx={14} fill="#0e1830" stroke={OL} strokeWidth={4} />
  {mode === "game" ? (<g>
    <path d="M-120,40 L-70,-10 L-30,25 L20,-35 L70,15 L120,-20 L120,70 L-120,70 Z" fill="#2f7d4a" />
    <rect x={-100 + ((T * 60) % 180)} y={-2 - Math.abs(Math.sin(T * 5)) * 30} width={22} height={22} fill="#ffd21f" stroke="#000" strokeWidth={2} />
    <Txt x={-70} y={-78} size={22} fill="#fff">1UP 0{Math.floor(T * 7) % 10}40</Txt>
  </g>) : mode === "poly" ? (<g stroke="#7af0ff" strokeWidth={3} fill="none" transform={`rotate(${T * 30})`}>
    <path d="M0,-60 L52,30 L-52,30 Z" /><path d="M0,-60 L0,10 L52,30 M0,10 L-52,30" />
  </g>) : (<g>{Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-100} y={-90 + i * 26} width={60 + rnd(i + Math.floor(T * 3)) * 140} height={12} fill="#5fe08a" opacity={0.8} />)}</g>)}
  <rect x={-40} y={110} width={80} height={30} fill="#cfc8b6" stroke={OL} strokeWidth={5} />
  <rect x={-90} y={140} width={180} height={20} rx={6} fill="#cfc8b6" stroke={OL} strokeWidth={5} />
</g>);

const Money: React.FC<{ n?: number }> = ({ n = 5 }) => (<g>
  {Array.from({ length: n }).map((_, i) => <g key={i} transform={`translate(${(i % 2) * 8 - 4},${-i * 26})`}>
    <rect x={-110} y={-24} width={220} height={26} rx={4} fill="#5aa85a" stroke={OL} strokeWidth={4} />
    <rect x={-30} y={-24} width={60} height={26} fill="#e8e0b0" stroke={OL} strokeWidth={3} />
  </g>)}
</g>);

const Sign: React.FC<{ T: number; text: string; a?: number; b?: number; w?: number; band?: string; post?: boolean; size?: number; text2?: string; a2?: number; b2?: number }> = ({ T, text, a, b, w = 420, band = "#c8262c", post, size = 54, text2, a2, b2 }) => {
  const h = text2 ? 220 : 160;
  return (<g>
    {post ? <rect x={-8} y={0} width={16} height={260} fill="#8a6a4a" stroke={OL} strokeWidth={4} /> : null}
    <rect x={-w / 2} y={-h} width={w} height={h} rx={8} fill="#fbfaf5" stroke={OL} strokeWidth={6} />
    <rect x={-w / 2} y={-h} width={w} height={26} rx={6} fill={band} stroke={OL} strokeWidth={6} />
    <Txt x={0} y={-h + 100} size={size}>{typed(text, T, a, b)}</Txt>
    {text2 ? <Txt x={0} y={-h + 170} size={size * 0.75} fill="#666">{typed(text2, T, a2, b2)}</Txt> : null}
  </g>);
};

const Calendar: React.FC<{ T: number; month: string; from?: number | string; to: number | string; a?: number; b?: number }> = ({ T, month, from, to, a, b }) => {
  let val: string | number = to;
  if (from !== undefined && typeof from === "number" && typeof to === "number" && a !== undefined) {
    const k = clamp((T - a) / Math.max(0.1, (b ?? a + 1) - a)); val = Math.round(from + (to - from) * easeIO(k));
  }
  const flip = a !== undefined && T > a && T < (b ?? a + 1) ? (T * 8) % 1 : 1;
  return (<g>
    <rect x={-130} y={-150} width={260} height={290} rx={10} fill="#fbfaf5" stroke={OL} strokeWidth={6} />
    <rect x={-130} y={-150} width={260} height={70} rx={8} fill="#c8262c" stroke={OL} strokeWidth={6} />
    <Txt x={0} y={-100} size={42} fill="#fff">{month}</Txt>
    <g transform={`scale(1,${0.3 + 0.7 * flip})`}><Txt x={0} y={60} size={typeof val === "number" && val > 999 ? 96 : 130}>{val}</Txt></g>
    {[-80, -30, 20, 70].map((x) => <circle key={x} cx={x} cy={-150} r={9} fill="#555" stroke={OL} strokeWidth={3} />)}
  </g>);
};

const Chair: React.FC<{ label?: string; T: number; spin?: boolean }> = ({ label = "CEO", T, spin }) => {
  const sx = spin ? Math.cos(T * 2) : 1;
  return (<g>
    <path d="M-70,0 L70,0 M0,0 L0,-80 M-60,0 L-70,14 M60,0 L70,14" stroke={OL} strokeWidth={8} strokeLinecap="round" />
    <g transform={`scale(${sx},1)`}>
      <rect x={-90} y={-130} width={180} height={50} rx={14} fill="#5a1f26" stroke={OL} strokeWidth={6} />
      <path d="M-80,-130 L-90,-360 C-90,-400 90,-400 90,-360 L80,-130 Z" fill="#6e2730" stroke={OL} strokeWidth={6} />
      <path d="M-50,-170 L-56,-340 M0,-170 L0,-350 M50,-170 L56,-340" stroke="#000" strokeOpacity={0.2} strokeWidth={5} />
    </g>
    {label ? <g><rect x={-70} y={-470} width={140} height={56} rx={6} fill="#f1c84b" stroke={OL} strokeWidth={5} /><Txt x={0} y={-430} size={38}>{label}</Txt></g> : null}
  </g>);
};

const Podium: React.FC<{ label?: string }> = ({ label }) => (<g>
  <path d="M-110,-230 L110,-230 L90,0 L-90,0 Z" fill="#7a5034" stroke={OL} strokeWidth={6} />
  <rect x={-130} y={-260} width={260} height={34} rx={6} fill="#8d5f3e" stroke={OL} strokeWidth={6} />
  <path d="M30,-260 L60,-320" stroke={OL} strokeWidth={6} /><ellipse cx={64} cy={-330} rx={14} ry={20} fill="#333" stroke={OL} strokeWidth={4} transform="rotate(30,64,-330)" />
  {label ? <Txt x={0} y={-120} size={40} fill="#fbe7b0">{label}</Txt> : null}
</g>);

const Phone: React.FC<{ T: number; head?: string; sub?: string; a?: number; posts?: string[]; hand?: boolean; skin?: string; tag?: string; typing?: string; ta?: number }> = ({ T, head = "", sub, a, posts = [], hand = true, skin = "#e8b48a", tag, typing, ta }) => (<g>
  {hand ? <path d="M-170,360 C-190,200 -170,120 -120,90 L120,90 C170,120 190,200 170,360 Z" fill={skin} stroke={OL} strokeWidth={6} /> : null}
  <rect x={-150} y={-300} width={300} height={560} rx={36} fill="#16181e" stroke={OL} strokeWidth={6} />
  <rect x={-132} y={-270} width={264} height={500} rx={20} fill="#f6f6f2" />
  <rect x={-132} y={-270} width={264} height={60} rx={20} fill="#2c3a63" />
  <Txt x={0} y={-228} size={28} fill="#fff">{sub ?? "TRENDING"}</Txt>
  <Txt x={0} y={-160} size={34} fill="#c8262c">{typed(head, T, a, a !== undefined ? a + 0.8 : undefined)}</Txt>
  {tag ? <g transform="rotate(-8,0,-110)"><rect x={-100} y={-140} width={200} height={40} rx={6} fill="none" stroke="#c8262c" strokeWidth={4} /><Txt x={0} y={-110} size={26} fill="#c8262c">{tag}</Txt></g> : null}
  {posts.map((p, i) => {
    const k = a === undefined ? 1 : clamp((T - a - 0.6 - i * 0.45) / 0.3);
    return <g key={i} opacity={k} transform={`translate(0,${(1 - k) * 30})`}>
      <rect x={-118} y={-80 + i * 92} width={236} height={78} rx={12} fill="#fff" stroke="#c9c9c3" strokeWidth={3} />
      <circle cx={-90} cy={-41 + i * 92} r={18} fill={["#e08a2c", "#3f8f6a", "#7a6ad8", "#d23b33"][i % 4]} />
      <Txt x={-62} y={-30 + i * 92} size={24} anchor="start">{p}</Txt>
    </g>;
  })}
  {typing ? <g><rect x={-118} y={160} width={236} height={50} rx={25} fill="#fff" stroke="#999" strokeWidth={3} /><Txt x={-100} y={194} size={26} anchor="start">{typed(typing, T, ta, ta !== undefined ? ta + 1.5 : undefined)}</Txt></g> : null}
</g>);

const Paperdoc: React.FC<{ T: number; title?: string; lines?: number; a?: number }> = ({ T, title = "", lines = 6, a }) => (<g>
  <rect x={-150} y={-200} width={300} height={400} rx={6} fill="#fbfaf5" stroke={OL} strokeWidth={5} />
  <Txt x={0} y={-140} size={34}>{typed(title, T, a, a !== undefined ? a + 0.7 : undefined)}</Txt>
  {Array.from({ length: lines }).map((_, i) => <rect key={i} x={-110} y={-100 + i * 42} width={180 + rnd(i) * 40} height={12} rx={6} fill="#b8b4aa" />)}
</g>);

const Stamp: React.FC<{ T: number; text: string; a?: number; color?: string; size?: number }> = ({ T, text, a, color = "#d1262e", size = 64 }) => {
  if (a !== undefined && T < a) return null;
  const k = a === undefined ? 1 : clamp((T - a) / 0.18);
  const sc = 2.2 - 1.2 * k;
  const w = text.length * size * 0.62 + 50;
  return (<g transform={`rotate(-12) scale(${sc})`} opacity={k}>
    <rect x={-w / 2} y={-size * 0.85} width={w} height={size * 1.4} rx={10} fill="none" stroke={color} strokeWidth={8} />
    <text x={0} y={size * 0.28} fontSize={size} fontFamily={HAND} fontWeight={700} fill={color} textAnchor="middle" style={{ letterSpacing: 4 }}>{text}</text>
  </g>);
};

const Magnifier: React.FC = () => (<g>
  <path d="M60,60 L170,170" stroke="#6b4a2e" strokeWidth={30} strokeLinecap="round" />
  <path d="M60,60 L170,170" stroke={OL} strokeWidth={36} strokeLinecap="round" opacity={0.25} />
  <circle r={90} fill="#bfe6ff" fillOpacity={0.35} stroke={OL} strokeWidth={14} />
  <circle r={90} fill="none" stroke="#c9a13a" strokeWidth={8} />
  <path d="M-50,-30 A60,60 0 0 1 -20,-60" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />
</g>);

const Lock: React.FC = () => (<g>
  <path d="M-60,-40 L-60,-100 A60,60 0 0 1 60,-100 L60,-40" stroke="#9aa0a8" strokeWidth={24} fill="none" />
  <path d="M-60,-40 L-60,-100 A60,60 0 0 1 60,-100 L60,-40" stroke={OL} strokeWidth={32} fill="none" opacity={0.25} />
  <rect x={-90} y={-50} width={180} height={150} rx={18} fill="#e3b341" stroke={OL} strokeWidth={6} />
  <circle cx={0} cy={10} r={18} fill={OL} /><rect x={-6} y={14} width={12} height={40} fill={OL} />
</g>);

const Shield: React.FC<{ label?: string }> = ({ label }) => (<g>
  <path d="M0,-130 L110,-90 C110,10 70,90 0,130 C-70,90 -110,10 -110,-90 Z" fill="#2f5d9a" stroke={OL} strokeWidth={7} />
  <path d="M0,-60 L18,-18 L62,-18 L26,8 L40,52 L0,26 L-40,52 L-26,8 L-62,-18 L-18,-18 Z" fill="#fff" />
  {label ? <Txt x={0} y={200} size={48} fill="#fff" stroke={OL}>{label}</Txt> : null}
</g>);

const Brain: React.FC<{ T: number; label?: string }> = ({ T, label }) => (<g>
  <circle r={150} fill="#ff7ad9" opacity={0.15 + 0.08 * Math.sin(T * 3)} />
  <path d="M-90,30 C-130,10 -120,-60 -80,-70 C-80,-120 -20,-130 0,-100 C20,-130 80,-120 80,-70 C120,-60 130,10 90,30 C90,80 30,90 0,70 C-30,90 -90,80 -90,30 Z" fill="#f7a6c9" stroke={OL} strokeWidth={6} />
  <path d="M0,-100 L0,70 M-60,-40 C-30,-30 -40,10 -70,20 M60,-40 C30,-30 40,10 70,20 M-40,40 C-20,30 -30,0 -50,-10 M40,40 C20,30 30,0 50,-10" stroke="#c4618f" strokeWidth={5} fill="none" strokeLinecap="round" />
  {Array.from({ length: 6 }).map((_, i) => { const a = i * 1.05 + T; return <circle key={i} cx={Math.cos(a) * 170} cy={Math.sin(a) * 120} r={8} fill="#7af0ff" />; })}
  {label ? <Txt x={0} y={200} size={56} fill="#fff" stroke={OL}>{label}</Txt> : null}
</g>);

const Globe: React.FC<{ T: number; net?: number }> = ({ T, net = 1 }) => (<g>
  <circle r={210} fill="#3d7fc4" stroke={OL} strokeWidth={7} />
  <clipPath id="glc"><circle r={206} /></clipPath>
  <g clipPath="url(#glc)">
    <g transform={`translate(${((T * 40) % 420) - 210},0)`}>
      {[-420, 0, 420].map((o) => <g key={o} transform={`translate(${o},0)`} fill="#7fbf6a" stroke={OL} strokeWidth={4}>
        <path d="M-150,-120 C-100,-160 -30,-140 -20,-90 C-40,-40 -90,-30 -110,10 C-150,0 -180,-60 -150,-120 Z" />
        <path d="M40,-60 C90,-90 150,-60 160,0 C150,60 100,90 60,70 C40,30 20,-20 40,-60 Z" />
        <path d="M-60,80 C-30,60 10,80 0,130 C-30,160 -70,130 -60,80 Z" />
      </g>)}
    </g>
  </g>
  {net ? Array.from({ length: 8 }).map((_, i) => {
    const a1 = i * 0.8, a2 = i * 0.8 + 2.1; const k = clamp(net * (T * 0.8 - i * 0.12) % 2);
    const p1 = [Math.cos(a1) * 170, Math.sin(a1) * 150], p2 = [Math.cos(a2) * 170, Math.sin(a2) * 150];
    return <g key={i}><path d={`M${p1[0]},${p1[1]} Q0,${-260 + i * 20} ${p2[0]},${p2[1]}`} stroke="#ffe066" strokeWidth={4} fill="none" strokeDasharray="8 8" opacity={0.6 + 0.4 * k} />
      <circle cx={p1[0]} cy={p1[1]} r={9} fill="#ffe066" stroke={OL} strokeWidth={3} /></g>;
  }) : null}
  <ellipse cx={-70} cy={-110} rx={50} ry={24} fill="#fff" opacity={0.25} transform="rotate(-30,-70,-110)" />
</g>);

const QMark: React.FC<{ T: number; c?: string; size?: number }> = ({ T, c = "#ffd21f", size = 220 }) => (
  <g transform={`translate(0,${Math.sin(T * 4) * 10}) rotate(${Math.sin(T * 3) * 8})`}>
    <text x={0} y={size * 0.35} fontSize={size} fontFamily={HAND} fontWeight={700} fill={c} textAnchor="middle" stroke={OL} strokeWidth={size * 0.05} paintOrder="stroke">?</text>
  </g>
);

const Box: React.FC<{ label?: string; items?: boolean }> = ({ label, items }) => (<g>
  {items ? <g><rect x={-50} y={-110} width={30} height={60} fill="#5fb0ff" stroke={OL} strokeWidth={3} transform="rotate(-10)" /><circle cx={30} cy={-80} r={24} fill="#76b900" stroke={OL} strokeWidth={3} /></g> : null}
  <path d="M-90,-70 L90,-70 L80,40 L-80,40 Z" fill="#d7aa6c" stroke={OL} strokeWidth={5} />
  <path d="M-90,-70 L-110,-100 M90,-70 L110,-100" stroke={OL} strokeWidth={5} />
  {label ? <Txt x={0} y={0} size={36} fill="#5a3a1a">{label}</Txt> : null}
</g>);

const Scale: React.FC<{ T: number; left?: string; right?: string; tilt?: number[]; tAt?: number[]; lItem?: string; rItem?: string }> = ({ T, left, right, tilt = [0], tAt = [], lItem, rItem }) => {
  let ang = tilt[0];
  tAt.forEach((t, i) => { if (T > t) { const k = easeBack(clamp((T - t) / 0.6)); ang = tilt[i] + (tilt[i + 1] - tilt[i]) * k; } });
  ang += Math.sin(T * 2) * 1.2;
  const r = (ang * Math.PI) / 180, L = 300;
  const lx = -L * Math.cos(r), ly = -L * Math.sin(r), rx = L * Math.cos(r), ry = L * Math.sin(r);
  const Pan: React.FC<{ x: number; y: number; t?: string; it?: string }> = ({ x, y, t, it }) => (<g transform={`translate(${x},${y})`}>
    <path d="M0,0 L-100,170 M0,0 L100,170" stroke={OL} strokeWidth={4} />
    <path d="M-130,170 L130,170 C110,220 -110,220 -130,170 Z" fill="#e3b341" stroke={OL} strokeWidth={6} />
    {it === "chip" ? <g transform="translate(0,120) scale(0.45)"><Chip T={T} glow={false} /></g> : null}
    {it && it !== "chip" && CAST[it] ? <g transform="translate(0,168) scale(0.38)"><Bean T={T} x={0} y={0} {...CAST[it]} expr="smile" /></g> : null}
    {t ? <Txt x={0} y={290} size={62} fill="#fff" stroke={OL}>{t}</Txt> : null}
  </g>);
  return (<g>
    <path d="M-120,420 L120,420 L60,380 L-60,380 Z" fill="#c9a13a" stroke={OL} strokeWidth={6} />
    <rect x={-14} y={-20} width={28} height={400} fill="#c9a13a" stroke={OL} strokeWidth={6} />
    <path d={`M${lx},${ly} L${rx},${ry}`} stroke={OL} strokeWidth={16} strokeLinecap="round" />
    <path d={`M${lx},${ly} L${rx},${ry}`} stroke="#e3b341" strokeWidth={9} strokeLinecap="round" />
    <circle r={22} fill="#e3b341" stroke={OL} strokeWidth={6} />
    <Pan x={lx} y={ly} t={left} it={lItem} /><Pan x={rx} y={ry} t={right} it={rItem} />
  </g>);
};

const Hub: React.FC<{ T: number; center: string; nodes: { t: string; at?: number }[]; r?: number; centerChip?: boolean }> = ({ T, center, nodes, r = 330, centerChip }) => (<g>
  {nodes.map((n, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / nodes.length;
    const k = n.at === undefined ? 1 : clamp((T - n.at) / 0.4);
    const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.8;
    return <g key={i}>
      <path d={`M0,0 L${x * k},${y * k}`} stroke={OL} strokeWidth={6} strokeDasharray="14 10" />
      <g transform={`translate(${x},${y}) scale(${easeBack(k)})`}>
        <rect x={-Math.max(140, n.t.length * 15 + 40)} y={-46} width={Math.max(280, n.t.length * 30 + 80)} height={92} rx={46} fill="#fbfaf5" stroke={OL} strokeWidth={6} />
        <Txt x={0} y={16} size={44}>{n.t}</Txt>
      </g>
    </g>;
  })}
  {centerChip ? <g transform="scale(0.8)"><Chip T={T} /></g> : null}
  <g><circle r={centerChip ? 0 : 110} fill="#76b900" stroke={OL} strokeWidth={centerChip ? 0 : 7} />
    <Txt x={0} y={centerChip ? 150 : 16} size={centerChip ? 50 : 46} fill="#fff" stroke={centerChip ? OL : undefined}>{center}</Txt></g>
</g>);

const Chart: React.FC<{ T: number; a?: number; b?: number; crash?: boolean; label?: string; w?: number; h?: number }> = ({ T, a, b, crash, label, w = 900, h = 520 }) => {
  const k = a === undefined ? 1 : clamp((T - a) / Math.max(0.2, (b ?? a + 2) - a));
  const n = 40, pts: string[] = [];
  for (let i = 0; i <= Math.floor(n * k); i++) {
    const x = (i / n) * w;
    const base = crash ? (i < 28 ? Math.pow(i / 28, 2) * 0.9 : 0.9 - (i - 28) * 0.06) : Math.pow(i / n, 2.6);
    pts.push(`${x - w / 2},${h / 2 - (base * 0.92 + rnd(i) * 0.05) * h}`);
  }
  const last = pts[pts.length - 1]?.split(",").map(Number) ?? [-w / 2, h / 2];
  return (<g>
    <rect x={-w / 2 - 40} y={-h / 2 - 40} width={w + 80} height={h + 80} rx={10} fill="#fbfaf5" stroke={OL} strokeWidth={6} />
    {Array.from({ length: 5 }).map((_, i) => <line key={i} x1={-w / 2} x2={w / 2} y1={-h / 2 + i * h / 4} y2={-h / 2 + i * h / 4} stroke="#ddd" strokeWidth={3} />)}
    <polyline points={pts.join(" ")} fill="none" stroke={crash ? "#d1262e" : "#2f9a4a"} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
    <circle cx={last[0]} cy={last[1]} r={14} fill={crash ? "#d1262e" : "#2f9a4a"} stroke={OL} strokeWidth={4} />
    {label ? <Txt x={-w / 2 + 20} y={-h / 2 + 50} size={44} anchor="start">{label}</Txt> : null}
  </g>);
};

const Book: React.FC<{ T: number; left: string; right: string; a?: number }> = ({ T, left, right, a }) => {
  const k = a === undefined ? 1 : easeIO(clamp((T - a) / 0.8));
  return (<g>
    <path d="M-420,-260 L0,-230 L420,-260 L420,260 L0,290 L-420,260 Z" fill="#7a3a2a" stroke={OL} strokeWidth={6} />
    <path d="M-400,-240 L0,-215 L0,270 L-400,245 Z" fill="#fbf6e8" stroke={OL} strokeWidth={5} />
    <g transform={`scale(${k * 2 - 1},1)`}><path d="M400,-240 L0,-215 L0,270 L400,245 Z" fill="#fbf6e8" stroke={OL} strokeWidth={5} /></g>
    <Txt x={-200} y={0} size={56}>{left}</Txt>
    {k > 0.6 ? <Txt x={200} y={20} size={150} fill="#c8262c">{right}</Txt> : null}
    <path d="M0,-215 L0,270" stroke={OL} strokeWidth={6} />
  </g>);
};

const Binoculars: React.FC = () => (<g>
  <rect x={-70} y={-30} width={60} height={70} rx={14} fill="#2b2b30" stroke={OL} strokeWidth={5} />
  <rect x={10} y={-30} width={60} height={70} rx={14} fill="#2b2b30" stroke={OL} strokeWidth={5} />
  <circle cx={-40} cy={-30} r={26} fill="#5fb0ff" stroke={OL} strokeWidth={5} /><circle cx={40} cy={-30} r={26} fill="#5fb0ff" stroke={OL} strokeWidth={5} />
  <rect x={-12} y={-10} width={24} height={30} fill="#444" stroke={OL} strokeWidth={4} />
</g>);

const Door: React.FC<{ label?: string }> = ({ label = "EXIT" }) => (<g>
  <rect x={-120} y={-400} width={240} height={400} fill="#4a3a30" stroke={OL} strokeWidth={6} />
  <rect x={-100} y={-380} width={200} height={380} fill="#7a5a44" stroke={OL} strokeWidth={5} />
  <circle cx={70} cy={-190} r={10} fill="#e3b341" stroke={OL} strokeWidth={3} />
  <rect x={-70} y={-470} width={140} height={54} rx={6} fill="#2f9a4a" stroke={OL} strokeWidth={5} />
  <Txt x={0} y={-430} size={38} fill="#fff">{label}</Txt>
</g>);

const Bubble: React.FC<{ T: number; text: string; a?: number; w?: number; tail?: number }> = ({ T, text, a, w = 360, tail = -1 }) => (<g>
  <rect x={-w / 2} y={-70} width={w} height={110} rx={50} fill="#fff" stroke={OL} strokeWidth={6} />
  <path d={`M${tail * 40},38 L${tail * 70},90 L${tail * 90},34`} fill="#fff" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
  <rect x={tail * 40 - 6} y={28} width={tail * 56} height={14} fill="#fff" />
  <Txt x={0} y={4} size={46}>{typed(text, T, a, a !== undefined ? a + 0.7 : undefined)}</Txt>
</g>);

const Thought: React.FC<{ children?: React.ReactNode }> = ({ children }) => (<g>
  <circle cx={-120} cy={210} r={16} fill="#fff" stroke={OL} strokeWidth={5} /><circle cx={-80} cy={160} r={26} fill="#fff" stroke={OL} strokeWidth={5} />
  <ellipse rx={230} ry={150} fill="#fff" stroke={OL} strokeWidth={6} />
  {children}
</g>);

const Speed: React.FC<{ T: number; c?: string }> = ({ T, c = "#ffd21f" }) => (<g>
  {Array.from({ length: 18 }).map((_, i) => { const a = (i / 18) * Math.PI * 2; const r0 = 260 + (Math.sin(T * 20 + i) * 30); return <path key={i} d={`M${Math.cos(a) * r0},${Math.sin(a) * r0} L${Math.cos(a) * (r0 + 120 + rnd(i) * 80)},${Math.sin(a) * (r0 + 120 + rnd(i) * 80)}`} stroke={c} strokeWidth={10} strokeLinecap="round" />; })}
</g>);

const Bars: React.FC<{ T: number; vals: number[]; a?: number; labels?: string[]; color?: string }> = ({ T, vals, a, labels = [], color = "#2f9a4a" }) => (<g>
  <path d="M-500,0 L520,0 M-500,0 L-500,-560" stroke={OL} strokeWidth={8} strokeLinecap="round" />
  {vals.map((v, i) => { const k = a === undefined ? 1 : easeBack(clamp((T - a - i * 0.18) / 0.5)); const h = v * 520 * k; return <g key={i}>
    <rect x={-460 + i * (960 / vals.length)} y={-h} width={960 / vals.length - 30} height={h} fill={color} stroke={OL} strokeWidth={6} />
    {labels[i] ? <Txt x={-460 + i * (960 / vals.length) + (960 / vals.length - 30) / 2} y={60} size={40}>{labels[i]}</Txt> : null}
  </g>; })}
</g>);

const Label: React.FC<{ T: number; text: string; size?: number; c?: string; a?: number; b?: number; arrow?: [number, number]; stroke?: boolean }> = ({ T, text, size = 64, c = "#fff", a, b, arrow, stroke = true }) => (<g>
  <Txt x={0} y={0} size={size} fill={c} stroke={stroke ? OL : undefined}>{typed(text, T, a, b)}</Txt>
  {arrow ? <path d={`M0,${size * 0.3} Q${arrow[0] * 0.2},${arrow[1] * 0.7} ${arrow[0]},${arrow[1]}`} stroke={c} strokeWidth={7} fill="none" strokeLinecap="round" markerEnd="url(#arrowhead)" /> : null}
</g>);

const Subscribe: React.FC<{ T: number; a?: number }> = ({ T, a }) => {
  const press = a !== undefined && T > a + 0.5 && T < a + 0.8;
  const done = a !== undefined && T > a + 0.65;
  return (<g>
    <g transform={`scale(${press ? 0.92 : 1})`}>
      <rect x={-300} y={-80} width={600} height={160} rx={80} fill={done ? "#8a8a8a" : "#e1252c"} stroke={OL} strokeWidth={7} />
      <Txt x={0} y={26} size={78} fill="#fff">{done ? "SUBSCRIBED" : "SUBSCRIBE"}</Txt>
    </g>
    <g transform={`translate(400,0) rotate(${done ? Math.sin(T * 18) * 14 : 0})`}>
      <path d="M-50,40 C-50,-50 50,-50 50,40 L66,60 L-66,60 Z" fill="#f1c84b" stroke={OL} strokeWidth={6} /><circle cx={0} cy={72} r={14} fill="#f1c84b" stroke={OL} strokeWidth={5} />
    </g>
    {a !== undefined ? <g transform={`translate(${80 + (1 - easeIO((T - a) / 0.5)) * 420},${20 + (1 - easeIO((T - a) / 0.5)) * 260}) scale(${press ? 0.85 : 1})`}>
      <path d="M0,0 L0,92 L24,70 L40,108 L56,100 L40,64 L72,62 Z" fill="#fff" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
    </g> : null}
  </g>);
};

const Tag: React.FC<{ text: string }> = ({ text }) => {
  const hw = Math.max(90, text.length * 12 + 30);
  return (<g>
    <path d={`M${-hw},-40 L${hw},-40 L${hw + 40},0 L${hw},40 L${-hw},40 Z`} fill="#fbfaf5" stroke={OL} strokeWidth={5} />
    <circle cx={hw + 8} cy={0} r={8} fill="none" stroke={OL} strokeWidth={4} />
    <Txt x={0} y={13} size={36}>{text}</Txt>
  </g>);
};

const Crowd: React.FC<{ T: number; n?: number; w?: number; expr?: string; s?: number }> = ({ T, n = 9, w = 1500, expr = "calm", s = 0.5 }) => {
  const keys = ["suitA", "woman", "tech", "suitB", "kid", "tech2", "suitC", "reporter", "suitD", "eng", "cof2", "worker"];
  return (<g>{Array.from({ length: n }).map((_, i) => <Bean key={i} T={T} x={-w / 2 + (i + 0.5) * (w / n) + (rnd(i) - 0.5) * 30} y={(i % 2) * 30} s={s} {...CAST[keys[i % keys.length]]} seed={i + 30} expr={expr as any} look={rnd(i + 5) - 0.5} />)}</g>);
};

const Rack: React.FC<{ T: number; filled?: number }> = ({ T, filled = 1 }) => (<g>
  <rect x={-110} y={-520} width={220} height={520} rx={8} fill="#1e2a44" stroke={OL} strokeWidth={6} />
  {Array.from({ length: 10 }).map((_, i) => <g key={i}>
    <rect x={-92} y={-500 + i * 50} width={184} height={40} rx={4} fill={i / 10 < filled ? "#2a3a5c" : "#151d30"} stroke="#0a0f1c" strokeWidth={3} />
    {i / 10 < filled ? <circle cx={70} cy={-480 + i * 50} r={6} fill={Math.sin(T * 6 + i * 2) > 0 ? "#76e05a" : "#2d5a26"} /> : null}
    {i / 10 < filled ? <rect x={-80} y={-486 + i * 50} width={100} height={12} fill="#76b900" opacity={0.7} /> : null}
  </g>)}
</g>);

const Digits: React.FC<{ T: number; w?: number; h?: number }> = ({ T, w = 900, h = 600 }) => (<g opacity={0.8}>
  {Array.from({ length: 22 }).map((_, i) => { const x = -w / 2 + (i / 22) * w; const y = ((T * (80 + rnd(i) * 120) + rnd(i + 3) * h) % h) - h / 2;
    return <g key={i}>{[0, 1, 2, 3].map((k) => <Txt key={k} x={x} y={y - k * 44} size={34} fill="#7af07a" op={1 - k * 0.25}>{(rnd(i * 7 + k + Math.floor(T * 4)) > 0.5 ? "1" : "0")}</Txt>)}</g>; })}
</g>);

const Crown: React.FC = () => (<g>
  <path d="M-110,40 L-120,-60 L-60,-10 L0,-90 L60,-10 L120,-60 L110,40 Z" fill="#f1c84b" stroke={OL} strokeWidth={7} strokeLinejoin="round" />
  <rect x={-112} y={30} width={224} height={34} rx={6} fill="#e3b341" stroke={OL} strokeWidth={6} />
  {[-70, 0, 70].map((x) => <circle key={x} cx={x} cy={47} r={9} fill="#c8262c" />)}
</g>);

const Mountain: React.FC<{ T: number; top?: React.ReactNode }> = ({ T, top }) => (<g>
  <path d="M-560,0 L-120,-460 L-60,-420 L0,-520 L80,-430 L560,0 Z" fill="#7a8a99" stroke={OL} strokeWidth={7} strokeLinejoin="round" />
  <path d="M-120,-460 L-60,-420 L0,-520 L80,-430 L40,-380 L0,-420 L-50,-370 Z" fill="#fff" stroke={OL} strokeWidth={5} />
  <path d="M0,-520 L0,-640" stroke={OL} strokeWidth={6} />
  <path d={`M0,-640 L${90 + Math.sin(T * 5) * 8},-615 L0,-590 Z`} fill="#76b900" stroke={OL} strokeWidth={5} />
  {top}
</g>);

const Truck: React.FC<{ label?: string }> = ({ label }) => (<g>
  <rect x={-260} y={-200} width={360} height={170} fill="#f4f2ee" stroke={OL} strokeWidth={6} />
  <path d="M100,-140 L190,-140 L240,-80 L240,-30 L100,-30 Z" fill="#2f9a4a" stroke={OL} strokeWidth={6} />
  <rect x={130} y={-128} width={60} height={46} fill="#bfe6f5" stroke={OL} strokeWidth={4} />
  {[-180, 0, 180].map((x) => <g key={x}><circle cx={x} cy={-20} r={34} fill="#333" stroke={OL} strokeWidth={6} /><circle cx={x} cy={-20} r={12} fill="#999" /></g>)}
  {label ? <Txt x={-80} y={-100} size={50} fill="#2f9a4a">{label}</Txt> : null}
</g>);

const Building: React.FC<{ T: number; grow?: number; a?: number; b?: number; label?: string }> = ({ T, a, b, label }) => {
  const k = a === undefined ? 1 : easeIO(clamp((T - a) / Math.max(0.2, (b ?? a + 2) - a)));
  const h = 120 + 640 * k;
  return (<g>
    <rect x={-120} y={-h} width={240} height={h} fill="#2c3a4a" stroke={OL} strokeWidth={6} />
    {Array.from({ length: Math.floor(h / 50) }).map((_, r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-90 + c * 66} y={-h + 20 + r * 50} width={44} height={28} fill={rnd(r * 3 + c) > 0.3 ? "#ffd56b" : "#1a2533"} />))}
    <rect x={-100} y={-h - 70} width={200} height={60} rx={8} fill="#1d2329" stroke={OL} strokeWidth={5} />
    {label ? <Txt x={0} y={-h - 26} size={40} fill="#76b900">{label}</Txt> : null}
  </g>);
};

const Stairs: React.FC<{ n?: number; w?: number; h?: number; c?: string }> = ({ n = 5, w = 160, h = 90, c = "#5d8fc4" }) => (<g>
  {Array.from({ length: n }).map((_, i) => <rect key={i} x={i * w} y={-(n - i) * h} width={w} height={(n - i) * h} fill={c} stroke={OL} strokeWidth={6} />)}
</g>);

const Note: React.FC<{ text: string; c?: string }> = ({ text, c = "#ffe35a" }) => (<g>
  <rect x={-120} y={-80} width={240} height={160} fill={c} stroke={OL} strokeWidth={4} transform="rotate(-3)" />
  <Txt x={0} y={16} size={40} rot={-3}>{text}</Txt>
</g>);

const Columns: React.FC<{ T: number; left: string; right: string }> = ({ left, right }) => (<g>
  <rect x={-560} y={-330} width={1120} height={620} rx={10} fill="#fbfaf5" stroke={OL} strokeWidth={8} />
  <path d="M0,-300 L0,270" stroke={OL} strokeWidth={6} />
  <Txt x={-280} y={-240} size={70} fill="#2f9a4a">{left}</Txt><Txt x={280} y={-240} size={70} fill="#d1262e">{right}</Txt>
  <path d="M-500,-200 L500,-200" stroke={OL} strokeWidth={5} />
</g>);

const Counter: React.FC<{ label?: string }> = ({ label }) => (<g>
  <rect x={-300} y={-200} width={600} height={200} fill="#2f9a4a" stroke={OL} strokeWidth={6} />
  <rect x={-320} y={-220} width={640} height={30} rx={6} fill="#e9e5da" stroke={OL} strokeWidth={6} />
  {label ? <Txt x={0} y={-80} size={70} fill="#fff" stroke={OL}>{label}</Txt> : null}
</g>);

export const KINDS: Record<string, React.FC<any>> = {
  chip: Chip, crt: Crt, money: Money, sign: Sign, calendar: Calendar, chair: Chair, podium: Podium, phone: Phone, doc: Paperdoc, stamp: Stamp,
  magnifier: Magnifier, lock: Lock, shield: Shield, brain: Brain, globe: Globe, q: QMark, box: Box, scale: Scale, hub: Hub, chart: Chart,
  book: Book, binoculars: Binoculars, door: Door, bubble: Bubble, speed: Speed, bars: Bars, label: Label, subscribe: Subscribe, tag: Tag,
  crowd: Crowd, rack: Rack, digits: Digits, crown: Crown, mountain: Mountain, truck: Truck, building: Building, stairs: Stairs, note: Note,
  columns: Columns, counter: Counter, thought: Thought, audience: Audience,
};

export const Prop: React.FC<{ p: PropSpec; T: number }> = ({ p, T }) => {
  const C = KINDS[p.kind];
  if (!C) return null;
  if (p.out !== undefined && T > p.out + 0.25) return null;
  let x = p.x, y = p.y;
  if (p.move) { const k = easeIO(clamp((T - p.move.a) / Math.max(0.05, p.move.b - p.move.a))); x += (p.move.x - p.x) * k; y += (p.move.y - p.y) * k; }
  const inK = p.kind === "stamp" ? 1 : p.at === undefined ? 1 : easeBack((T - p.at) / 0.35);
  const outK = p.out === undefined ? 1 : 1 - clamp((T - p.out) / 0.25);
  if (p.at !== undefined && T < p.at && p.kind !== "stamp") return null;
  let sc = (p.s ?? 1) * Math.max(0, inK) * outK;
  if (p.grow) sc *= 1 + (p.grow.s - 1) * easeIO(clamp((T - p.grow.a) / Math.max(0.1, p.grow.b - p.grow.a)));
  const { kind, x: _x, y: _y, s: _s, at: _a, out: _o, rot, move: _m, grow: _g, ...rest } = p;
  void _g;
  void kind; void _x; void _y; void _s; void _a; void _o; void _m;
  return <g transform={`translate(${x},${y}) rotate(${rot ?? 0}) scale(${sc})`}>
    <C T={T} {...rest} a={rest.a} children={rest.thoughtChip ? <g transform="scale(0.5)"><Chip T={T} /></g> : undefined} />
  </g>;
};
