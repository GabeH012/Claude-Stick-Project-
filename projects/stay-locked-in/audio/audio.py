# Music + SFX stems for a Stick Story video. Run inside audio/: python audio.py -> music.wav + sfx.wav (48 kHz stereo).
# The music changes mood at every chapter card (sections = cold open + one per chapter); pick the moods in MOODS below.
# SFX are placed automatically from the shot list (src/bean/shots.json): whooshes on cuts, pops when props appear,
# word pops on cards, thuds on stamps and camera shakes, ticks on calendars/price tags, footsteps on walks.
import json
import numpy as np
from scipy import signal
from dsp import SR, TAU, ns, tt, rng, lp, hp, bp, pan, place, fades, write_wav, read_wav, make_ir, smooth_noise
import instruments as I

V, _ = read_wav('voice48.wav')
N = V.shape[1]; DUR = N / SR
R = rng(5)
m2f = I.m2f
shots = json.load(open('../src/bean/shots.json', encoding='utf-8'))
CH = [s['t0'] for s in shots if s.get('chapter')]
BOUNDS = [0.0] + [c for c in CH if 0.5 < c < DUR - 0.5] + [DUR - 0.05]
# One mood per section: cold open, then one per chapter card. Moods: tense, curious, dark, thoughtful, warm (warm resolves at the end).
# None = automatic (tense open, curious/dark/thoughtful in the middle, warm ending).
MOODS = ['tense', 'curious', 'thoughtful', 'rise', 'warm']
print('sections', [round(b, 2) for b in BOUNDS])

_pl, _gl, _pd = {}, {}, {}
def pl(mid, dur=0.6, bright=0.5):
    k = (mid, dur, bright)
    if k not in _pl: _pl[k] = I.pluck(m2f(mid), 1.0, rng(mid), dur=dur, bright=bright)
    return _pl[k]
def gl(mid, dur=1.4):
    k = (mid, dur)
    if k not in _gl: _gl[k] = I.glock(m2f(mid), 1.0, rng(mid), dur=dur)
    return _gl[k]
def pd(mids, dur, warm=900):
    k = (tuple(mids), round(dur, 2), warm)
    if k not in _pd: _pd[k] = I.pad([m2f(x) for x in mids], dur, 1.0, rng(7), att=min(0.8, dur / 3), rel=0.9, warm=warm)
    return _pd[k]

mus = np.zeros((2, N))
def section(t0, t1, fn, fade_in=1.5, fade_out=1.5):
    buf = np.zeros((2, ns(t1 - t0) + ns(3))); fn(buf, t1 - t0)
    n = buf.shape[1]; e = np.ones(n); a, b = ns(fade_in), ns(fade_out); end = ns(t1 - t0)
    e[:a] = np.linspace(0, 1, a); e[max(0, end - b):end] *= np.linspace(1, 0, min(b, end)); e[end:] = 0
    place(mus, buf * e, t0)

def arp(buf, dur, chords, bpm, vel=0.35, oct=12, pattern=(0, 2, 1, 3, 2, 1, 3, 2), bass=True, padv=0.10, glock_every=0, mel=None):
    B = 60 / bpm; bar = 4 * B; t = 0.0; i = 0
    while t < dur - 0.1:
        ch = chords[i % len(chords)]
        if padv: place(buf, pd(ch[:3], bar + 0.2) * padv, t)
        if bass: place(buf, pan(pl(ch[0] - 12, 1.4, 0.3) * vel * 1.4, 0), t)
        for k, idx in enumerate(pattern):
            tb = t + k * B / 2
            if tb >= dur: break
            place(buf, pan(pl(ch[idx % len(ch)] + oct, 0.5, 0.55) * vel, -0.3 if k % 2 else 0.3), tb)
        if glock_every and i % glock_every == glock_every - 1 and mel:
            for ob, mm in mel:
                if t + ob * B < dur: place(buf, pan(gl(mm) * vel * 0.6, 0.25), t + ob * B)
        t += bar; i += 1

def pulse(buf, dur, notes, bpm, vel=0.4, start=0.0, grow=0.0):
    B = 60 / bpm; t = start; k = 0
    while t < dur:
        place(buf, pan(pl(notes[(k // 8) % len(notes)], 0.28, 0.35) * vel * (1 + grow * t / dur), -0.1), t); t += B / 2; k += 1

def drone(buf, dur, mids, vel=0.3, warm=420): place(buf, pd(mids, dur, warm) * vel, 0)

Cc, G, Am, F = [48, 55, 60, 64], [43, 50, 55, 59], [45, 52, 57, 60], [41, 48, 53, 57]
Dm, Bb, Gm, Aa = [50, 57, 62, 65], [46, 53, 58, 62], [43, 50, 55, 58], [45, 52, 57, 61]
D, Bm, A = [50, 57, 62, 66], [47, 54, 59, 62], [45, 52, 57, 61]
MEL = [(0, 72), (0.5, 74), (1, 76), (2, 79), (3, 76)]

def warm(b, d):     # warm resolve: gentle arpeggio, then a held chord and a glock sparkle at the end
    tail = min(7.0, d * 0.5)
    arp(b, max(0.5, d - tail), [D, Bm, G, A], 88, 0.24, pattern=(0, 1, 2, 3, 2, 1, 2, 1), padv=0.13)
    place(b, pd([38, 50, 54, 57, 62], tail + 0.5, 1300) * 0.3, d - tail)
    for j, mm in enumerate([74, 78, 81, 86]): place(b, pan(gl(mm, 2.4) * 0.3, -0.3 + 0.2 * j), d - tail + j * 0.12)
MOOD_FN = {
    'tense': lambda b, d: (drone(b, d, [38, 45, 50], 0.28), pulse(b, d, [38, 38, 41, 36], 98, 0.30, start=0.4, grow=0.4)),
    'curious': lambda b, d: arp(b, d, [Am, F, Cc, G], 104, 0.30, glock_every=2, mel=MEL),
    'dark': lambda b, d: (drone(b, d, [33, 40, 45], 0.30), pulse(b, d, [33, 33, 36, 31], 92, 0.28, grow=0.5)),
    'thoughtful': lambda b, d: arp(b, d, [Dm, Bb, F, Cc], 98, 0.27, padv=0.11),
    'warm': warm,
    'rise': lambda b, d: (arp(b, d, [D, A, Bm, G], 112, 0.30, pattern=(0, 1, 2, 3, 2, 3, 1, 2), glock_every=2, mel=[(0, 74), (0.5, 76), (1, 78), (2, 81), (3, 78)]), pulse(b, d, [38, 45, 47, 43], 112, 0.22, grow=0.6)),
}
n = len(BOUNDS) - 1
moods = MOODS or (['curious'] if n == 1 else ['tense'] + [['curious', 'dark', 'thoughtful'][i % 3] for i in range(n - 2)] + ['warm'])
moods = (list(moods) + [moods[-1]] * n)[:n]
for i, (a, b) in enumerate(zip(BOUNDS, BOUNDS[1:])):
    last = i == n - 1
    section(a, b if last else b + 1, MOOD_FN[moods[i]], fade_in=0.3 if i == 0 else 1.5, fade_out=2.0 if last else 1.5)
print('moods', moods)

ir = make_ir(1.3, 3)
mus = mus * 0.85 + np.stack([signal.oaconvolve(mus[c], ir[c])[:N] for c in range(2)]) * 0.28

# ---------------- SFX ----------------
sfx = np.zeros((2, N))
def env_exp(n, k): return np.exp(-np.arange(n) / SR * k)
def noise(d): return R.standard_normal(ns(d))
def whoosh(d=0.45, lo=300, hi=2500, amp=0.5):
    x = noise(d); n = len(x); out = np.zeros(n); seg = 256
    for i in range(0, n, seg):
        p = i / n; fc = lo + (hi - lo) * np.sin(np.pi * p)
        out[i:i + seg] = bp(x[max(0, i - 512):i + seg], max(60, fc * 0.6), fc * 1.4)[-len(out[i:i + seg]):]
    return amp * out * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
def pop(f0=700, f1=180, d=0.12, amp=0.45):
    t = tt(d); f = f1 + (f0 - f1) * np.exp(-t * 40); return amp * np.sin(TAU * np.cumsum(f) / SR) * env_exp(len(t), 30)
def thud(amp=0.6, f=80):
    t = tt(0.35); return amp * (np.sin(TAU * f * t) * env_exp(len(t), 14) + 0.6 * lp(noise(0.35), 400) * env_exp(len(t), 25))
def click(amp=0.3, f=None):
    t = tt(0.03); f = f or R.uniform(2500, 4500); return amp * np.sin(TAU * f * t) * env_exp(len(t), 160)
def key(amp=0.22):
    x = bp(noise(0.04), 1500, 6000) * env_exp(ns(0.04), 120); return amp * x
def paper(d=0.4, amp=0.35):
    x = bp(noise(d), 500, 5000) * (0.4 + 0.6 * smooth_noise(ns(d), R, 25)); return amp * x * np.sin(np.pi * np.linspace(0, 1, len(x))) ** 0.8
def ding(amp=0.3): return amp * gl(88, 1.2)
def step(amp=0.18): return amp * lp(noise(0.06), 900) * env_exp(ns(0.06), 60)
P = lambda x, t, p=0.0: place(sfx, pan(x, p), max(0.0, t))

for i, s in enumerate(shots):
    t0, t1 = s['t0'], s['t1']
    if s['type'] == 'card':
        if s.get('chapter'):
            P(whoosh(0.7, 200, 1800, 0.55), t0 - 0.1); P(thud(0.8, 55), t0 + 0.05)
        else:   # word-pop line: a soft pop per word (same timing as the card), brighter on *highlighted* words
            words = s.get('text', '').split(' ')
            a = s.get('a', t0 + 0.1); b = max(a + 0.3, s.get('b', a + len(words) * 0.3) - 0.15)
            for k, w in enumerate(words):
                hot = '*' in w
                P(pop(1100 if hot else 760, 300, 0.09, 0.32 if hot else 0.2), a + (b - a) * k / max(1, len(words)), R.uniform(-0.2, 0.2))
        continue
    if i and shots[i - 1]['type'] != 'card': P(whoosh(0.35, 400, 2600, 0.22), t0 - 0.12, R.uniform(-0.4, 0.4))
    cam = s.get('cam') or {}
    if isinstance(cam.get('shake'), (int, float)): P(thud(0.7, 60), cam['shake'])
    allp = (s.get('props') or []) + (s.get('fg') or []) + (s.get('screen') or [])
    for pnl in s.get('panels') or []: allp += pnl.get('props') or []
    for p in allp:
        k, at = p['kind'], p.get('at')
        if k == 'stamp': P(thud(0.75, 70), p.get('a', t0 + 1))
        elif k == 'calendar' and p.get('from') is not None:
            a, b = p.get('a', t0), p.get('b', t0 + 1)
            for j in range(10): P(paper(0.1, 0.22), a + (b - a) * j / 10)
        elif k == 'chart': P(whoosh(1.4, 300, 2200, 0.3), p.get('a', t0))
        elif k == 'phone':
            for j, _ in enumerate(p.get('posts', [])): P(pop(900, 400, 0.08, 0.3), p.get('a', t0) + 0.6 + j * 0.45)
        elif k == 'label' and at is not None: P(pop(650, 220, 0.12, 0.35), at)
        elif k in ('q', 'tag', 'note', 'box', 'chip', 'brain', 'lock', 'shield', 'crt', 'truck', 'thought', 'crowd') and at is not None: P(pop(), at)
        elif k == 'magnifier': P(whoosh(1.0, 300, 1200, 0.18), (p.get('move') or {}).get('a', t0))
        elif k == 'subscribe': P(click(0.5, 2200), p.get('a', t0) + 0.55); P(ding(0.35), p.get('a', t0) + 0.7)
        elif k == 'hub':
            for nd in p.get('nodes', []):
                if nd.get('at') is not None: P(pop(800, 250), nd['at'])
        elif k == 'scale':
            for ta in p.get('tAt', []): P(thud(0.35, 120), ta + 0.2)
        elif k == 'book': P(paper(0.6, 0.4), p.get('a', t0))
        elif k == 'building': P(whoosh(2.0, 150, 900, 0.3), p.get('a', t0))
        elif k == 'audience':   # camera flash clicks
            tt_ = t0 + 0.3
            while tt_ < t1: P(click(0.25, 5000), tt_, R.uniform(-0.6, 0.6)); tt_ += 0.4 + R.random() * 0.6
        elif k == 'clock':
            if p.get('a') is not None:
                a, b = p['a'], p.get('b', p['a'] + 2); tt_ = a
                while tt_ < min(b, t1): P(click(0.28, 3200), tt_, 0.1); tt_ += 0.12
            if p.get('ring'): P(ding(0.25), t0 + 0.1); P(ding(0.2), t0 + 0.35)
        elif k == 'notif':
            for j, _ in enumerate(p.get('items', [])): P(pop(1000, 500, 0.08, 0.3), p.get('a', t0) + j * p.get('gap', 0.3), 0.3)
        elif k == 'meter': P(whoosh(1.0, 400, 2400, 0.22), p.get('a', t0))
        elif k == 'road': P(whoosh(1.5, 200, 1500, 0.3), p.get('a', t0))
        elif k == 'iceberg' and p.get('reveal') is not None: P(whoosh(1.4, 120, 700, 0.35), p['reveal'])
        elif k == 'gem': P(ding(0.3), at if at is not None else t0 + 0.1)
        elif k == 'mobile' and p.get('move'): P(whoosh(0.5, 500, 2000, 0.25), p['move']['a']); P(thud(0.35, 140), p['move']['b'])
        elif k == 'puppet': P(whoosh(0.8, 150, 900, 0.25), at if at is not None else t0)
        elif k in ('bubble', 'mountain', 'money', 'laptop') and at is not None: P(pop(), at)
        elif k == 'speed': P(whoosh(0.6, 600, 3500, 0.35), t0)
    for c in (s.get('chars') or []):
        w = c.get('walk')
        if w and w['x0'] != w['x1']:
            tt_ = w['a']
            while tt_ < min(w['b'], t1): P(step(), tt_, 0.0); tt_ += 0.29

write_wav('music.wav', mus)
write_wav('sfx.wav', sfx)
print('stems written', round(DUR, 1))
