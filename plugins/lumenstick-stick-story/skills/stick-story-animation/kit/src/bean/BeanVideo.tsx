import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Bean, CAST, OL } from "./Bean";
import { FLOOR, H, HAND, SETS, SETS_FG, TITLE, W } from "./sets";
import { Prop, PropSpec, easeIO } from "./props";

export const FPS = 30;
type Key = { t: number; expr?: string; armL?: string; armR?: string; look?: number; lookY?: number };
type CharSpec = { c: string; x: number; y?: number; s?: number; k?: Key[]; talk?: boolean; front?: boolean; [k: string]: any };
export type Shot = {
  type: "stage" | "card" | "split"; t0: number; t1: number;
  set?: string; v?: string; chars?: CharSpec[]; props?: PropSpec[]; fg?: PropSpec[]; cam?: { z?: [number, number]; f?: [number, number]; pan?: [number, number]; shake?: number };
  blur?: number; place?: string; screen?: PropSpec[]; tv?: string[]; tick?: string; dark?: number;
  text?: string; a?: number; b?: number; chapter?: boolean; panels?: Shot[];
  label?: string; // building sign text for sets that have one (hq)
  cx?: number;   // vertical mode: centre of the visible stage window (stage units, default 960)
};

/* Frame: 16:9 (1920x1080) or vertical 9:16 (1080x1920). In vertical mode the 1920x1080 stage is seen through a
   607.5-unit-wide window (full stage height) centred on shot.cx, so sets/props/characters stay in stage units. */
const Ctx = React.createContext<{ lips: number[]; vertical: boolean }>({ lips: [], vertical: false });
export const FW = (v: boolean) => (v ? 1080 : W), FH = (v: boolean) => (v ? 1920 : H);

const Char: React.FC<{ ch: CharSpec; T: number }> = ({ ch, T }) => {
  const { lips } = React.useContext(Ctx);
  const st: any = { ...CAST[ch.c], ...ch };
  (ch.k ?? []).forEach((k) => { if (T >= k.t) Object.entries(k).forEach(([kk, vv]) => { if (kk !== "t") st[kk] = vv; }); });
  return <Bean {...st} T={T} x={ch.x} y={ch.y ?? FLOOR} s={ch.s ?? 1} talk={ch.talk ? lips : null}
    holdR={ch.holdR ? <Prop p={{ ...ch.holdR, x: ch.holdR.x ?? 0, y: ch.holdR.y ?? 0 }} T={T} /> : undefined}
    holdL={ch.holdL ? <Prop p={{ ...ch.holdL, x: ch.holdL.x ?? 0, y: ch.holdL.y ?? 0 }} T={T} /> : undefined}
    holdBox={ch.holdBox ? <Prop p={{ ...ch.holdBox, x: ch.holdBox.x ?? 0, y: ch.holdBox.y ?? 0 }} T={T} /> : undefined} />;
};

/* pw/ph = pixel size of the box this stage is drawn into; the visible window is (ph-matched) 1080 stage units tall */
const Stage: React.FC<{ sh: Shot; T: number; pw?: number; ph?: number; w?: number }> = ({ sh, T, pw, ph, w }) => {
  const Set = SETS[sh.set ?? "paper"], FG = SETS_FG[sh.set ?? ""];
  const len = sh.t1 - sh.t0, k = easeIO((T - sh.t0) / Math.max(0.5, len));
  const z = sh.cam?.z ?? [1.0, 1.1], f = sh.cam?.f ?? [0.5, 0.55], pan = sh.cam?.pan ?? [0, 0];
  const zoom = z[0] + (z[1] - z[0]) * k;
  // window in stage units
  const boxW = pw ?? w ?? W, boxH = ph ?? H;
  const vw = pw !== undefined ? (H * boxW) / boxH : boxW;
  const cx = sh.cx ?? 960, x0 = pw !== undefined ? cx - vw / 2 : (W - vw) / 2;
  let sx = 0, sy = 0;
  if (sh.cam?.shake !== undefined && T > sh.cam.shake && T < sh.cam.shake + 0.5) { const d = 1 - (T - sh.cam.shake) / 0.5; sx = Math.sin(T * 80) * 14 * d; sy = Math.cos(T * 70) * 10 * d; }
  const px = pan[0] + (pan[1] - pan[0]) * k;
  const fx = x0 + f[0] * vw, fy = f[1] * H;
  const chars = sh.chars ?? [];
  const tagS = pw !== undefined ? Math.min(1, (vw - 60) / (sh.place ? sh.place.length * 21 + 56 : 1)) * 0.95 : 1;
  return (
    <svg viewBox={`${x0} 0 ${vw} ${H}`} width={boxW} height={boxH} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs><marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#fff" stroke={OL} strokeWidth={0.6} /></marker></defs>
      <g transform={`translate(${fx + sx + px},${fy + sy}) scale(${zoom}) translate(${-fx},${-fy})`}>
        <g style={sh.blur ? { filter: `blur(${sh.blur}px)` } : undefined}>
          <Set T={T} v={sh.v} tv={sh.tv} tick={sh.tick} label={sh.label} screen={sh.screen ? <g>{sh.screen.map((p, i) => <Prop key={i} p={p} T={T} />)}</g> : undefined} />
        </g>
        {sh.dark ? <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#000" opacity={sh.dark} /> : null}
        {(sh.props ?? []).filter((p) => !p.front).map((p, i) => <Prop key={i} p={p} T={T} />)}
        {chars.filter((c) => !c.front).map((c, i) => <Char key={i} ch={c} T={T} />)}
        {FG ? <FG /> : null}
        {chars.filter((c) => c.front).map((c, i) => <Char key={`f${i}`} ch={c} T={T} />)}
        {(sh.props ?? []).filter((p) => p.front).map((p, i) => <Prop key={`fp${i}`} p={p} T={T} />)}
        {(sh.fg ?? []).map((p, i) => <Prop key={`fg${i}`} p={p} T={T} />)}
      </g>
      {sh.place ? <g transform={`translate(${x0 + 30},${pw !== undefined ? 150 : 56}) scale(${tagS})`}>
        <rect x={0} y={0} width={sh.place.length * 21 + 56} height={64} rx={32} fill="#ffd21f" stroke={OL} strokeWidth={5} />
        <circle cx={32} cy={32} r={9} fill={OL} />
        <text x={54} y={44} fontFamily={HAND} fontWeight={700} fontSize={34} fill={OL} style={{ letterSpacing: 1.5 }}>{sh.place}</text>
      </g> : null}
    </svg>
  );
};

/* Title cards, our own design: ink background with a soft spotlight and drifting dust.
   Chapter = small "CHAPTER n" tag + big title + yellow underline sweep.
   Line = words pop up one by one across the spoken phrase; *starred* words turn yellow. */
const INK = "radial-gradient(ellipse at 50% 45%, #232a3d 0%, #141824 55%, #0b0d14 100%)";
const Card: React.FC<{ sh: Shot; T: number }> = ({ sh, T }) => {
  const { vertical } = React.useContext(Ctx);
  const fw = FW(vertical), fh = FH(vertical);
  const lt = T - sh.t0;
  const dust = Array.from({ length: 26 }).map((_, i) => {
    const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * fw, y = ((Math.cos(i * 37.3) * 0.5 + 0.5) * fh - lt * (8 + (i % 5) * 4) + fh) % fh;
    return <circle key={i} cx={x} cy={y} r={1.5 + (i % 3)} fill="#fff" opacity={0.08 + (i % 4) * 0.03} />;
  });
  const bg = <svg width={fw} height={fh} style={{ position: "absolute" }}>{dust}</svg>;
  if (sh.chapter) {
    const k = easeIO(lt / 0.5), bar = easeIO((lt - 0.35) / 0.55);
    return (
      <AbsoluteFill style={{ background: INK, alignItems: "center", justifyContent: "center" }}>
        {bg}
        <div style={{ textAlign: "center", transform: `translateY(${(1 - k) * 30}px)`, opacity: k, maxWidth: fw - 120 }}>
          {(sh as any).num ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: "#ffd21f", marginBottom: 18 }}>{(sh as any).tag ?? "CHAPTER"} {(sh as any).num}</div> : null}
          <div style={{ fontFamily: TITLE, fontSize: vertical ? 124 : 132, color: "#fff", lineHeight: 1.05, letterSpacing: 2 }}>{sh.text}</div>
          <div style={{ height: 14, width: `${bar * 100}%`, background: "#ffd21f", borderRadius: 7, margin: "22px auto 0" }} />
        </div>
      </AbsoluteFill>
    );
  }
  const words = (sh.text ?? "").split(" ");
  const a = sh.a ?? sh.t0 + 0.1, b = Math.max(a + 0.3, (sh.b ?? a + words.length * 0.3) - 0.15);
  return (
    <AbsoluteFill style={{ background: INK, alignItems: "center", justifyContent: "center" }}>
      {bg}
      <div style={{ fontFamily: TITLE, fontSize: vertical ? 158 : 92, color: "#fff", textAlign: "center", maxWidth: vertical ? 920 : 1560, lineHeight: 1.15, letterSpacing: 1.5, marginTop: vertical ? -200 : 0 }}>
        {words.map((w, i) => {
          const at = a + ((b - a) * i) / Math.max(1, words.length);
          const k = Math.max(0, Math.min(1, (T - at) / 0.22));
          const hot = w.includes("*");
          const clean = w.replace(/\*/g, "");
          return <span key={i} style={{ display: "inline-block", marginRight: 26, opacity: k, transform: `translateY(${(1 - k) * 26}px) scale(${0.85 + 0.15 * k})`, color: hot ? "#ffd21f" : "#fff" }}>{clean}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const ShotView: React.FC<{ sh: Shot; Tover?: number }> = ({ sh, Tover }) => {
  const f = useCurrentFrame();
  const { vertical } = React.useContext(Ctx);
  const T = Tover ?? sh.t0 + f / FPS;
  if (sh.type === "card") return <Card sh={sh} T={T} />;
  if (sh.type === "split" && vertical) {   // stacked panels, each a wide window onto its own stage
    const n = sh.panels!.length, gap = 10, ph = (1920 - gap * (n - 1)) / n;
    return (<AbsoluteFill style={{ background: "#111" }}>
      {sh.panels!.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: 0, top: i * (ph + gap), width: 1080, height: ph, overflow: "hidden" }}>
          <Stage sh={{ ...p, t0: sh.t0, t1: sh.t1 }} T={T} pw={1080} ph={ph} />
        </div>))}
    </AbsoluteFill>);
  }
  if (sh.type === "split") {
    const n = sh.panels!.length, pw = W / n;
    return (<AbsoluteFill style={{ background: "#111" }}>
      {sh.panels!.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: i * pw + (i ? 6 : 0), top: 0, width: pw - (i < n - 1 ? 6 : 0) - (i ? 6 : 0), height: H, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: -(W - pw) / 2 - (i ? 6 : 0), top: 0, width: W, height: H }}>
            <Stage sh={{ ...p, t0: sh.t0, t1: sh.t1 }} T={T} />
          </div>
        </div>))}
    </AbsoluteFill>);
  }
  return <AbsoluteFill>{vertical ? <Stage sh={sh} T={T} pw={1080} ph={1920} /> : <Stage sh={sh} T={T} />}</AbsoluteFill>;
};

/* One frozen stage (thumbnails, cast sheets): the shot at time T with a fixed camera zoom. */
export const ShotStill: React.FC<{ sh: Partial<Shot>; T: number; zoom?: number; vertical?: boolean }> = ({ sh, T, zoom = 1, vertical = false }) => {
  const s = { type: "stage", t0: 0, t1: 1, ...sh, cam: { z: [zoom, zoom], f: [0.5, 0.5], ...(sh.cam ?? {}) } } as Shot;
  return (<Ctx.Provider value={{ lips: [], vertical }}><AbsoluteFill style={{ background: "#000" }}>
    {vertical ? <Stage sh={s} T={T} pw={1080} ph={1920} /> : <Stage sh={s} T={T} />}</AbsoluteFill></Ctx.Provider>);
};

/* QA: frame i shows shot floor(i/3) at 20% / 55% / 90% of its length */
export const BeanSampler: React.FC<{ shots: Shot[]; lips: number[]; vertical?: boolean }> = ({ shots, lips, vertical = false }) => {
  const f = useCurrentFrame();
  const sh = shots[Math.min(shots.length - 1, Math.floor(f / 3))];
  const T = sh.t0 + (sh.t1 - sh.t0) * [0.2, 0.55, 0.9][f % 3];
  return (<Ctx.Provider value={{ lips, vertical }}><AbsoluteFill style={{ background: "#000" }}><ShotView sh={sh} Tover={T} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)" }} /></AbsoluteFill></Ctx.Provider>);
};

export const BeanVideo: React.FC<{ shots: Shot[]; lips: number[]; audio?: string; total: number; vertical?: boolean }> = ({ shots, lips, audio, vertical = false }) => {
  const f = useCurrentFrame();
  return (
    <Ctx.Provider value={{ lips, vertical }}>
      <AbsoluteFill style={{ background: "#000" }}>
        {shots.map((sh, i) => (
          <Sequence key={i} from={Math.round(sh.t0 * FPS)} durationInFrames={Math.max(1, Math.round(sh.t1 * FPS) - Math.round(sh.t0 * FPS))}>
            <ShotView sh={sh} />
          </Sequence>
        ))}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)", pointerEvents: "none" }} />
        <Img src={staticFile(`grain${Math.floor(f / 2) % 6}.png`)} style={{ position: "absolute", width: FW(vertical), height: FH(vertical), opacity: 0.05, mixBlendMode: "overlay", objectFit: "cover" }} />
        {audio ? <Audio src={staticFile(audio)} /> : null}
      </AbsoluteFill>
    </Ctx.Provider>
  );
};
