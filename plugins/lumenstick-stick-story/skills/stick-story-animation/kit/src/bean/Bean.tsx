import React from "react";

/* Bean stick figure rig (original design). Local units: feet at (0,0), ~400 units tall, head centre (0,-290) r 88.
   Big round head, dot eyes under lids, tiny mouth, tapered bean torso with clothes drawn on, thin stick limbs. */

export const OL = "#2b2522";
export const SKIN = { a: "#f2c9a0", b: "#e8b48a", c: "#c98d5e", d: "#8d5a3b", e: "#f6d7b8" } as const;
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

export type Expr = "calm" | "neutral" | "smile" | "happy" | "shock" | "panic" | "worried" | "angry" | "think" | "smug" | "sad";
export type Arm = "down" | "hips" | "point" | "pointUp" | "wave" | "up" | "hold" | "shrug" | "chin" | "phone" | "box" | "reach";
export type BeanProps = {
  T: number;                  // global seconds
  x: number; y: number; s?: number;
  skin?: string; hair?: string; hairColor?: string; outfit?: string; color?: string; tie?: string;
  glasses?: "rect" | "round"; expr?: Expr; look?: number; lookY?: number;
  armL?: Arm; armR?: Arm; talk?: number[] | null; t0?: number;
  walk?: { x0: number; x1: number; a: number; b: number; y0?: number; y1?: number; steps?: number };
  flip?: boolean; seed?: number; holdR?: React.ReactNode; holdL?: React.ReactNode; holdBox?: React.ReactNode;
  sweat?: boolean; blush?: boolean; hat?: string; badge?: string; dim?: number;
};

// two-segment arms: [upper, lower] angles from straight down, positive = outward
const POSE: Record<Arm, [number, number]> = {
  down: [10, 4], hips: [62, -48], point: [98, 92], pointUp: [120, 148], wave: [108, 150], up: [118, 148],
  hold: [22, -72], shrug: [55, 125], chin: [18, -160], phone: [12, -128], box: [30, -55], reach: [80, 80],
};
const U = 60, L = 56;

const Limb: React.FC<{ side: 1 | -1; pose: Arm; T: number; skin: string; seed: number; w: number; children?: React.ReactNode }> = ({ side, pose, T, skin, seed, w, children }) => {
  let [u, l] = POSE[pose];
  if (pose === "wave") l += Math.sin(T * 9 + seed) * 22;
  if (pose === "point" || pose === "pointUp") { u += Math.sin(T * 2 + seed) * 3; l += Math.sin(T * 2 + seed) * 3; }
  if (pose === "down" || pose === "hips") { u += Math.sin(T * 1.6 + seed) * 2; }
  const sx = side * 40, sy = -192;
  const r = (a: number) => (a * Math.PI) / 180;
  const ex = sx + side * U * Math.sin(r(u)), ey = sy + U * Math.cos(r(u));
  const hx = ex + side * L * Math.sin(r(l)), hy = ey + L * Math.cos(r(l));
  return (
    <g>
      <path d={`M${sx},${sy} Q${ex},${ey} ${hx},${hy}`} stroke={OL} strokeWidth={w} fill="none" strokeLinecap="round" />
      <circle cx={hx} cy={hy} r={11} fill={skin} stroke={OL} strokeWidth={4} />
      {children ? <g transform={`translate(${hx},${hy})`}>{children}</g> : null}
    </g>
  );
};

const BODY = "M -40,-218 C -52,-170 -64,-120 -62,-92 C -60,-62 -36,-52 0,-52 C 36,-52 60,-62 62,-92 C 64,-120 52,-170 40,-218 Z";

const Outfit: React.FC<{ kind: string; color: string; tie: string; id: string; badge?: string }> = ({ kind, color, tie, id, badge }) => {
  const sh = <ellipse cx={48} cy={-110} rx={34} ry={90} fill="#000" opacity={0.16} clipPath={`url(#b${id})`} />;
  const hl = <path d="M -30,-200 C -42,-160 -48,-120 -46,-95" stroke="#fff" strokeOpacity={0.22} strokeWidth={6} fill="none" strokeLinecap="round" />;
  const tieEl = <path d="M -6,-206 L 6,-206 L 9,-150 L 0,-138 L -9,-150 Z" fill={tie} stroke={OL} strokeWidth={3} />;
  let inner: React.ReactNode = null, fill = color;
  if (kind === "suit") {
    inner = (<>
      <path d="M -24,-216 L 24,-216 L 0,-150 Z" fill="#fff" stroke={OL} strokeWidth={3} />
      {tieEl}
      <path d="M -24,-216 L -6,-150 M 24,-216 L 6,-150" stroke={OL} strokeWidth={3} fill="none" />
      <circle cx={0} cy={-120} r={3.5} fill={OL} /><circle cx={0} cy={-98} r={3.5} fill={OL} />
    </>);
  } else if (kind === "shirt") {
    fill = color || "#f4f2ee";
    inner = (<>{tieEl}<path d="M -22,-218 L -4,-204 L -14,-196 Z M 22,-218 L 4,-204 L 14,-196 Z" fill="#fff" stroke={OL} strokeWidth={3} /></>);
  } else if (kind === "jacket") {
    fill = "#26262b";
    inner = (<>
      <path d="M -18,-216 L 18,-216 L 0,-172 Z" fill="#111" />
      <path d="M -26,-216 L -6,-168 L -20,-150 L -34,-196 Z M 26,-216 L 6,-168 L 20,-150 L 34,-196 Z" fill="#34343a" stroke={OL} strokeWidth={3} />
      <path d="M 4,-166 L 14,-60" stroke="#9a9aa2" strokeWidth={3} strokeDasharray="5 5" />
      <path d="M -40,-130 L -18,-128 M 22,-118 L 40,-120" stroke="#9a9aa2" strokeWidth={3} />
      <path d="M -36,-190 C -46,-150 -50,-120 -48,-100" stroke="#fff" strokeOpacity={0.35} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M 30,-180 C 36,-160 40,-140 40,-128" stroke="#fff" strokeOpacity={0.25} strokeWidth={4} fill="none" strokeLinecap="round" />
    </>);
  } else if (kind === "hoodie") {
    inner = (<>
      <path d="M -34,-214 C -20,-196 20,-196 34,-214" stroke={OL} strokeWidth={3.5} fill="none" />
      <path d="M -8,-202 L -10,-170 M 8,-202 L 10,-170" stroke="#fff" strokeWidth={3} />
      <path d="M -30,-110 L 30,-110 L 24,-84 L -24,-84 Z" fill="#000" opacity={0.12} stroke={OL} strokeWidth={2.5} />
    </>);
  } else if (kind === "coat") {
    fill = "#f5f5f2";
    inner = (<>
      <path d="M -16,-216 L 16,-216 L 0,-186 Z" fill={color} />
      <path d="M -16,-216 L 0,-150 L 16,-216 M 0,-150 L 0,-56" stroke={OL} strokeWidth={3} fill="none" />
      <rect x={-46} y={-118} width={24} height={18} rx={3} fill="none" stroke={OL} strokeWidth={2.5} />
    </>);
  } else if (kind === "vest") {
    inner = (<>
      <path d="M -40,-212 L -14,-212 L -16,-60 L -50,-70 Z M 40,-212 L 14,-212 L 16,-60 L 50,-70 Z" fill="#d9f53b" stroke={OL} strokeWidth={3} />
      <path d="M -52,-120 L -14,-120 M 14,-120 L 52,-120" stroke="#cfcfcf" strokeWidth={8} />
    </>);
  } else if (kind === "blouse") {
    inner = <path d="M -22,-218 C -14,-196 14,-196 22,-218" fill="#fff" stroke={OL} strokeWidth={3} />;
  } else {  // tee
    inner = <path d="M -24,-217 C -14,-202 14,-202 24,-217" stroke={OL} strokeWidth={3.5} fill="none" />;
  }
  return (
    <g>
      <clipPath id={`b${id}`}><path d={BODY} /></clipPath>
      <path d={BODY} fill={fill} />
      <g clipPath={`url(#b${id})`}>{inner}{sh}{hl}</g>
      <path d={BODY} fill="none" stroke={OL} strokeWidth={5} />
      {badge ? <g><rect x={-46} y={-150} width={34} height={22} rx={3} fill="#fff" stroke={OL} strokeWidth={2.5} /><text x={-29} y={-134} fontSize={13} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fill={OL}>{badge}</text></g> : null}
    </g>
  );
};

const HairBack: React.FC<{ kind: string; c: string }> = ({ kind, c }) => {
  if (kind === "bob") return <path d="M -100,-232 C -112,-350 -60,-396 0,-396 C 60,-396 112,-350 100,-232 Z" fill={c} stroke={OL} strokeWidth={5} />;
  if (kind === "long") return <path d="M -96,-196 C -114,-350 -60,-398 0,-398 C 60,-398 114,-350 96,-196 C 80,-178 50,-190 40,-210 L -40,-210 C -50,-190 -80,-178 -96,-196 Z" fill={c} stroke={OL} strokeWidth={5} />;
  if (kind === "bun") return <circle cx={0} cy={-392} r={34} fill={c} stroke={OL} strokeWidth={5} />;
  return null;
};

const HairFront: React.FC<{ kind: string; c: string }> = ({ kind, c }) => {
  const st = { stroke: OL, strokeWidth: 5, strokeLinejoin: "round" as const };
  const lines = { stroke: shade(c, 0.72), strokeWidth: 3.5, fill: "none", strokeLinecap: "round" as const };
  switch (kind) {
    case "swept":   // voluminous, swept back (older exec)
      return (<g>
        <path d="M -92,-280 C -104,-352 -62,-398 4,-398 C 70,-398 106,-352 94,-282 C 86,-312 70,-330 40,-338 C 6,-348 -36,-342 -62,-326 C -80,-314 -88,-298 -92,-280 Z" fill={c} {...st} />
        <path d="M -60,-336 C -30,-372 20,-382 60,-360 M -30,-344 C 0,-366 40,-370 74,-344 M -76,-318 C -60,-352 -20,-370 10,-372" {...lines} />
      </g>);
    case "short":
      return <path d="M -90,-284 C -96,-366 -46,-390 0,-390 C 50,-390 96,-366 90,-284 C 82,-318 52,-334 4,-334 C -46,-334 -80,-318 -90,-284 Z" fill={c} {...st} />;
    case "side":
      return (<g><path d="M -90,-282 C -98,-366 -46,-392 4,-392 C 56,-392 98,-364 90,-282 C 84,-316 60,-334 30,-338 C 10,-322 -30,-316 -60,-318 C -78,-310 -86,-298 -90,-282 Z" fill={c} {...st} />
        <path d="M 28,-338 C 10,-362 -20,-372 -50,-364" {...lines} /></g>);
    case "spiky":
      return <path d="M -90,-286 L -96,-340 L -70,-332 L -64,-384 L -36,-356 L -14,-400 L 10,-362 L 40,-396 L 52,-352 L 84,-372 L 80,-330 L 96,-322 L 90,-286 C 70,-320 40,-334 0,-334 C -40,-334 -72,-322 -90,-286 Z" fill={c} {...st} />;
    case "curly":
      return (<g>{[[-74, -320], [-48, -356], [-12, -372], [24, -370], [58, -352], [80, -318], [-30, -340], [10, -348], [44, -334]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={30} fill={c} {...st} />)}</g>);
    case "bob": case "long":
      return <path d="M -92,-268 C -96,-360 -40,-394 6,-392 C 60,-390 98,-350 92,-268 C 84,-300 70,-318 48,-326 C 20,-312 -20,-300 -56,-306 C -76,-298 -88,-286 -92,-268 Z" fill={c} {...st} />;
    case "bun":
      return <path d="M -90,-284 C -96,-366 -46,-390 0,-390 C 50,-390 96,-366 90,-284 C 82,-318 52,-334 4,-334 C -46,-334 -80,-318 -90,-284 Z" fill={c} {...st} />;
    case "bald":
      return <path d="M -88,-300 C -96,-324 -90,-336 -80,-344 M 88,-300 C 96,-324 90,-336 80,-344" stroke={c} strokeWidth={14} strokeLinecap="round" fill="none" />;
    case "cap":
      return (<g><path d="M -92,-296 C -96,-372 -46,-398 0,-398 C 50,-398 96,-372 92,-296 Z" fill={c} {...st} /><path d="M -92,-300 C -40,-314 70,-312 150,-296 C 120,-282 40,-284 -92,-290 Z" fill={shade(c, 0.8)} {...st} /></g>);
    default: return null;
  }
};

const EX = 27, EY = -290;
const Eyes: React.FC<{ e: Expr; look: number; lookY: number; blink: boolean; skin: string }> = ({ e, look, lookY, blink, skin }) => {
  const lx = look * 6, ly = lookY * 4;
  return (<g>{[-1, 1].map((sd) => {
    const x = sd * EX;
    if (blink) return <path key={sd} d={`M${x - 11},${EY + 1} L${x + 11},${EY + 1}`} stroke={OL} strokeWidth={4.5} strokeLinecap="round" />;
    if (e === "happy") return <path key={sd} d={`M${x - 12},${EY + 4} Q${x},${EY - 12} ${x + 12},${EY + 4}`} stroke={OL} strokeWidth={5} fill="none" strokeLinecap="round" />;
    if (e === "shock" || e === "panic") return (<g key={sd}>
      <circle cx={x} cy={EY - 2} r={18} fill="#fff" stroke={OL} strokeWidth={4} />
      <circle cx={x + lx * 0.6} cy={EY - 1 + ly} r={6.5} fill={OL} /></g>);
    if (e === "calm" || e === "smile" || e === "angry" || e === "smug") return (<g key={sd}>
      <circle cx={x + lx} cy={EY + 2 + ly} r={7.5} fill={OL} />
      <rect x={x - 14} y={EY - 14} width={28} height={12} fill={skin} />
      <path d={`M${x - 12},${EY - 2} Q${x},${EY - 5} ${x + 12},${EY - 2}`} stroke={OL} strokeWidth={4} fill="none" strokeLinecap="round" /></g>);
    return <circle key={sd} cx={x + lx} cy={EY + ly} r={7.5} fill={OL} />;
  })}</g>);
};

const Brows: React.FC<{ e: Expr }> = ({ e }) => {
  const p = (d: string, k: number) => <path key={k} d={d} stroke={OL} strokeWidth={6} strokeLinecap="round" fill="none" />;
  const by = EY - 30;
  switch (e) {
    case "shock": return <g>{p(`M-40,${by - 14} Q-27,${by - 24} -14,${by - 14}`, 1)}{p(`M14,${by - 14} Q27,${by - 24} 40,${by - 14}`, 2)}</g>;
    case "panic": case "worried": case "sad": return <g>{p(`M-42,${by - 2} L-14,${by - 12}`, 1)}{p(`M14,${by - 12} L42,${by - 2}`, 2)}</g>;
    case "angry": return <g>{p(`M-42,${by - 8} L-14,${by + 4}`, 1)}{p(`M14,${by + 4} L42,${by - 8}`, 2)}</g>;
    case "think": case "smug": return <g>{p(`M-40,${by} L-16,${by}`, 1)}{p(`M14,${by - 6} Q28,${by - 18} 42,${by - 8}`, 2)}</g>;
    case "neutral": return <g>{p(`M-38,${by} L-18,${by - 2}`, 1)}{p(`M18,${by - 2} L38,${by}`, 2)}</g>;
    default: return null;
  }
};

const MY = -248;
const Mouth: React.FC<{ e: Expr; open: number }> = ({ e, open }) => {
  const red = "#7a2228";
  if (open > 0 && e !== "happy" && e !== "panic") return <ellipse cx={0} cy={MY} rx={open > 1 ? 11 : 8} ry={open > 1 ? 10 : 5.5} fill={red} stroke={OL} strokeWidth={3} />;
  switch (e) {
    case "happy": return (<g><path d={`M-24,${MY - 6} Q0,${MY + 30} 24,${MY - 6} Z`} fill={red} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M-20,${MY - 4} L20,${MY - 4} L18,${MY + 2} L-18,${MY + 2} Z`} fill="#fff" /></g>);
    case "smile": return <path d={`M-16,${MY - 4} Q0,${MY + 10} 16,${MY - 4}`} stroke={OL} strokeWidth={4.5} fill="none" strokeLinecap="round" />;
    case "smug": return <path d={`M-14,${MY} Q4,${MY + 6} 18,${MY - 8}`} stroke={OL} strokeWidth={4.5} fill="none" strokeLinecap="round" />;
    case "shock": return <ellipse cx={0} cy={MY + 2} rx={10} ry={13} fill={red} stroke={OL} strokeWidth={3.5} />;
    case "panic": return (<g><rect x={-30} y={MY - 14} width={60} height={28} rx={10} fill="#fff" stroke={OL} strokeWidth={4} />
      <path d={`M-30,${MY} L30,${MY} M-15,${MY - 14} L-15,${MY + 14} M0,${MY - 14} L0,${MY + 14} M15,${MY - 14} L15,${MY + 14}`} stroke={OL} strokeWidth={3} /></g>);
    case "worried": return <path d={`M-16,${MY + 2} Q-8,${MY - 5} 0,${MY + 2} Q8,${MY + 9} 16,${MY + 2}`} stroke={OL} strokeWidth={4} fill="none" strokeLinecap="round" />;
    case "sad": case "angry": return <path d={`M-14,${MY + 5} Q0,${MY - 6} 14,${MY + 5}`} stroke={OL} strokeWidth={4.5} fill="none" strokeLinecap="round" />;
    case "think": return <path d={`M-6,${MY + 2} L14,${MY - 2}`} stroke={OL} strokeWidth={4.5} strokeLinecap="round" />;
    default: return <path d={`M-9,${MY} L9,${MY}`} stroke={OL} strokeWidth={4.5} strokeLinecap="round" />;
  }
};

export const Bean: React.FC<BeanProps> = (p) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const { T } = p;
  const seed = p.seed ?? 1;
  const skin = p.skin ?? SKIN.a, hairC = p.hairColor ?? "#2a211c", outfit = p.outfit ?? "tee", color = p.color ?? "#4f7cac";
  const expr = p.expr ?? "calm";
  let x = p.x, y = p.y, walking = false, legA = 0, bob = 0;
  if (p.walk) {
    const { x0, x1, a, b } = p.walk;
    const k = Math.max(0, Math.min(1, (T - a) / Math.max(0.01, b - a)));
    x = x0 + (x1 - x0) * k;
    if (p.walk.y0 !== undefined && p.walk.y1 !== undefined) {
      const st = p.walk.steps ?? 0;
      const kk = st ? Math.floor(k * st + 0.0001) / st : k;
      y = p.walk.y0 + (p.walk.y1 - p.walk.y0) * kk;
    }
    walking = T > a && T < b;
    if (walking) { legA = Math.sin((T - a) * 11) * 22; bob = Math.abs(Math.sin((T - a) * 11)) * -8; }
  }
  const breathe = 1 + Math.sin(T * 2.1 + seed) * 0.008;
  // talking: per-frame mouth levels for the global timeline
  let open = 0;
  if (p.talk) { const fi = Math.floor(T * 30); open = p.talk[fi] ?? 0; }
  const headTilt = Math.sin(T * 1.3 + seed * 2) * 2 + (open ? Math.sin(T * 7) * 2 : 0);
  const cyc = 3.4 + (seed % 5) * 0.37;
  const blink = ((T + seed * 0.71) % cyc) < 0.12;
  const look = p.look ?? 0, lookY = p.lookY ?? 0;
  const s = p.s ?? 1;
  const flip = p.flip ? -1 : 1;
  const armW = 7;
  const fx = look * 10;   // face shift toward look direction (3/4 feel)
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s * flip},${s})`} opacity={p.dim ?? 1}>
      <ellipse cx={0} cy={2} rx={58} ry={9} fill="#000" opacity={0.18} />
      {/* legs */}
      {[-1, 1].map((sd) => {
        const a = (sd * legA * Math.PI) / 180;
        const hx = sd * 15, fx2 = hx + Math.sin(a) * 62, fy = -60 + Math.cos(a) * 62;
        return <g key={sd}><path d={`M${hx},-62 L${fx2},${fy}`} stroke={OL} strokeWidth={armW} strokeLinecap="round" />
          <path d={`M${fx2},${fy} L${fx2 + sd * 10},${fy}`} stroke={OL} strokeWidth={armW} strokeLinecap="round" /></g>;
      })}
      <g transform={`scale(1,${breathe})`} style={{ transformOrigin: "0px -55px" }}>
        <Outfit kind={outfit} color={color} tie={p.tie ?? "#c8262c"} id={uid} badge={p.badge} />
        {p.holdBox ? <g transform="translate(0,-130)">{p.holdBox}</g> : null}
        <Limb side={-1} pose={p.armL ?? "down"} T={T} skin={skin} seed={seed} w={armW}>{p.holdL}</Limb>
        <Limb side={1} pose={p.armR ?? "down"} T={T} skin={skin} seed={seed + 1} w={armW}>{p.holdR}</Limb>
        <g transform={`rotate(${headTilt},0,-215)`}>
          <HairBack kind={p.hair ?? "short"} c={hairC} />
          <clipPath id={`h${uid}`}><circle cx={0} cy={-290} r={88} /></clipPath>
          <circle cx={0} cy={-290} r={88} fill={shade(skin, 0.86)} />
          <circle cx={-16} cy={-300} r={86} fill={skin} clipPath={`url(#h${uid})`} />
          <ellipse cx={-40} cy={-330} rx={18} ry={10} fill="#fff" opacity={0.25} transform="rotate(-30,-40,-330)" />
          <circle cx={0} cy={-290} r={88} fill="none" stroke={OL} strokeWidth={5} />
          <g transform={`translate(${fx},0)`}>
            {p.blush || expr === "happy" ? <g opacity={0.35}><ellipse cx={-50} cy={-262} rx={14} ry={7} fill="#e8646b" /><ellipse cx={50} cy={-262} rx={14} ry={7} fill="#e8646b" /></g> : null}
            <Eyes e={expr} look={look} lookY={lookY} blink={blink && expr !== "happy"} skin={skin} />
            <Brows e={expr} />
            <Mouth e={expr} open={open} />
            {p.glasses ? (p.glasses === "rect"
              ? <g fill="#fff" fillOpacity={0.12} stroke="#3a3330" strokeWidth={3.5}><rect x={-46} y={-306} width={36} height={28} rx={6} /><rect x={10} y={-306} width={36} height={28} rx={6} /><path d="M-10,-294 L10,-294 M-46,-296 L-84,-302 M46,-296 L84,-302" fill="none" /></g>
              : <g fill="#fff" fillOpacity={0.12} stroke="#3a3330" strokeWidth={3.5}><circle cx={-27} cy={-292} r={19} /><circle cx={27} cy={-292} r={19} /><path d="M-8,-294 L8,-294 M-46,-296 L-84,-302 M46,-296 L84,-302" fill="none" /></g>) : null}
          </g>
          <HairFront kind={p.hair ?? "short"} c={hairC} />
          {p.hat === "salakot" ? (<g>
            <path d="M -175,-322 Q 0,-470 175,-322 Q 0,-296 -175,-322 Z" fill="#d8b066" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
            <path d="M -120,-344 Q 0,-330 120,-344 M -70,-380 Q 0,-372 70,-380 M -40,-330 L -10,-430 M 40,-330 L 10,-430" stroke="#a9813f" strokeWidth={3.5} fill="none" />
            <circle cx={0} cy={-432} r={9} fill="#a9813f" stroke={OL} strokeWidth={3} />
          </g>) : null}
          {(p.sweat || expr === "panic" || expr === "worried") ? <path d={`M66,-336 C 58,-322 60,-312 68,-310 C 76,-312 78,-322 66,-336 Z`} fill="#8fd3f4" stroke={OL} strokeWidth={2.5} transform={`translate(0,${(T * 20) % 14})`} /> : null}
        </g>
      </g>
    </g>
  );
};

/* Cast presets (original designs). exec / execMid / execYoung = the same founder at three ages (grey swept hair + jacket,
   pepper hair, young with black hair and tie). Add your own presets here; never draw likenesses of real people. */
export const CAST: Record<string, Partial<BeanProps>> = {
  exec: { hair: "swept", hairColor: "#d9d9d6", outfit: "jacket", glasses: "rect", skin: SKIN.a, seed: 3 },
  execYoung: { hair: "side", hairColor: "#1f1a17", outfit: "shirt", color: "#e9eef3", tie: "#3a6ea5", glasses: "rect", skin: SKIN.a, seed: 4 },
  execMid: { hair: "swept", hairColor: "#7d7a77", outfit: "jacket", glasses: "rect", skin: SKIN.a, seed: 5 },
  cof1: { hair: "short", hairColor: "#6b4a2e", outfit: "shirt", color: "#f3efe4", tie: "#6a8f3c", skin: SKIN.e, seed: 6 },
  cof2: { hair: "curly", hairColor: "#3a2a20", outfit: "tee", color: "#c7643a", skin: SKIN.b, glasses: "round", seed: 7 },
  suitA: { hair: "short", hairColor: "#2a211c", outfit: "suit", color: "#2f3e5c", skin: SKIN.b, seed: 8 },
  suitB: { hair: "bald", hairColor: "#7a6f66", outfit: "suit", color: "#3a3a40", tie: "#2f6db0", skin: SKIN.c, glasses: "round", seed: 9 },
  suitC: { hair: "bob", hairColor: "#a8642e", outfit: "suit", color: "#5a2f3c", tie: "#ead9b8", skin: SKIN.e, seed: 10 },
  suitD: { hair: "side", hairColor: "#1a1512", outfit: "suit", color: "#3d4a3a", skin: SKIN.d, seed: 11 },
  woman: { hair: "long", hairColor: "#2b1d16", outfit: "blouse", color: "#d6455a", skin: SKIN.b, seed: 12 },
  kid: { hair: "spiky", hairColor: "#3b2a1e", outfit: "hoodie", color: "#3f8f6a", skin: SKIN.e, seed: 13 },
  eng: { hair: "short", hairColor: "#2a211c", outfit: "coat", color: "#4f7cac", skin: SKIN.c, glasses: "round", seed: 14 },
  eng2: { hair: "bun", hairColor: "#5a3a22", outfit: "coat", color: "#a04060", skin: SKIN.a, seed: 15 },
  worker: { hair: "cap", hairColor: "#e0b020", outfit: "vest", color: "#5c6b7a", skin: SKIN.d, seed: 16 },
  rival: { hair: "short", hairColor: "#1f1a17", outfit: "tee", color: "#d23b33", skin: SKIN.b, seed: 17 },
  tech: { hair: "side", hairColor: "#6b4a2e", outfit: "hoodie", color: "#7a6ad8", skin: SKIN.e, glasses: "round", seed: 18 },
  tech2: { hair: "curly", hairColor: "#141010", outfit: "tee", color: "#2aa4b8", skin: SKIN.d, seed: 19 },
  reporter: { hair: "bob", hairColor: "#2b1d16", outfit: "blouse", color: "#3e7c8f", skin: SKIN.c, seed: 20 },
  reporter2: { hair: "short", hairColor: "#8a6a3a", outfit: "shirt", color: "#f4f2ee", tie: "#333", skin: SKIN.a, glasses: "rect", seed: 21 },
  shadow: { hair: "cap", hairColor: "#1a1a1e", outfit: "suit", color: "#1d1d22", tie: "#1d1d22", skin: "#3a3a42", seed: 22 },
  host: { hair: "side", hairColor: "#2a211c", outfit: "hoodie", color: "#e08a2c", skin: SKIN.b, seed: 23 },
};
