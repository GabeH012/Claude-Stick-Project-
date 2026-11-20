# 9:16 version: python -I work/vertical.py src/bean/shots.json src/bean/vshots.json
# The vertical player shows a 607-unit-wide window of each 1920x1080 stage (centred on cx, default 960).
# Side-by-side layouts are restacked into a column here; V[i] patches shot i: "chars"/"props" lists are
# patched by position (None = keep, {"drop": True} = remove), nested dicts (walk, move) are merged.
import json, sys, copy
S = json.load(open(sys.argv[1], encoding="utf-8"))
CU = lambda **k: dict(x=960, **k)                       # close-up character recentred
STK = lambda s=0.95: dict(x=960, s=s)                   # standing character recentred
PH = dict(x=960, y=300, s=0.58)                         # big phone above the character
D = {"drop": True}
V = {
    0: dict(props=[dict(y=290), dict(y=150)]),
    1: dict(chars=[dict(x=960, s=0.9)], props=[dict(x=960, y=250, size=120), dict(x=960, y=400, size=50)]),
    2: dict(chars=[CU()], props=[dict(x=1110, y=130, s=0.6)]),
    5: dict(props=[None, dict(size=95)]),
    6: dict(chars=[dict(x=880, s=0.9)], props=[D, dict(x=790, y=190, s=0.38), dict(x=1090, y=330, s=0.52)]),
    7: dict(chars=[CU()], props=[dict(x=960, y=130)]),
    8: dict(chars=[STK()], props=[PH]),
    9: dict(chars=[STK()], props=[dict(x=960, y=110, s=0.85)]),
    10: dict(chars=[STK()], props=[PH]),
    11: dict(chars=[STK()], props=[dict(x=960, y=260, s=0.7), dict(x=960, y=260, size=70)]),
    15: dict(props=[dict(size=70)]),
    16: dict(chars=[STK()], props=[PH]),
    17: dict(chars=[CU(y=1237)], props=[dict(x=960, y=150, size=75), dict(x=960, y=270, size=46)]),
    20: dict(chars=[dict(x=790, s=0.8), dict(x=1130, s=0.8)], props=[dict(y=300, s=0.75)]),
    21: dict(chars=[dict(x=790, s=0.7), dict(x=1130, s=0.7)], props=[dict(s=0.5), dict(y=300)]),
    23: dict(chars=[dict(x=1100)], props=[dict(x=760)]),
    24: dict(chars=[STK()], props=[PH]),
    25: dict(props=[dict(x=830, s=0.5), dict(x=1090, s=0.5)]),
    26: dict(props=[dict(x=760, s=0.45), dict(x=960, s=0.48), dict(x=1160, s=0.45), None]),
    27: dict(chars=[CU()], props=[dict(x=960, y=120)]),
    30: dict(chars=[STK()], props=[dict(x=960, y=250, w=520), dict(x=960, y=420, size=54)]),
    31: dict(chars=[dict(walk=dict(x0=860, x1=1060))], props=[D, dict(x=960, y=420)]),
    33: dict(props=[dict(w=500)]),
    34: dict(chars=[dict(x=800, s=0.9)], props=[dict(x=1120, s=0.8), dict(x=960, y=200, w=500)]),
    36: dict(chars=[dict(x=890, s=0.35, y=920), dict(x=1030, s=0.35, y=920)], props=[dict(s=0.4, y=940)]),
    37: dict(chars=[CU()], props=[dict(x=960, y=120)]),
    39: dict(chars=[dict(x=830, s=0.9)], props=[dict(x=1100, s=0.7, move=dict(x=1300, y=100)), dict(x=960, y=300, size=80)]),
    43: dict(chars=[STK()], props=[dict(x=960, y=270, s=0.75)]),
    44: dict(chars=[STK()], props=[PH]),
    45: dict(chars=[STK()], props=[PH]),
    46: dict(chars=[CU()], props=[dict(x=960, y=120)]),
    48: dict(chars=[dict(walk=dict(x0=1250, x1=960))]),
    49: dict(chars=[dict(x=960)], props=[dict(x=960, y=330, size=70)]),
    50: dict(chars=[STK()], props=[dict(x=960, y=270, s=0.5)]),
    51: dict(chars=[CU()], props=[dict(x=1150, y=110, s=0.3)]),
    52: dict(chars=[dict(x=820, s=0.9)], props=[dict(x=1120, s=0.8)]),
    53: dict(chars=[dict(s=0.5, walk=dict(x0=1240, x1=910))], props=[dict(x=700, w=140), dict(x=960, y=250, size=80)]),
    57: dict(props=[dict(s=0.65, y=420), dict(size=85)]),
    61: dict(chars=[dict(walk=dict(x0=780))], props=[dict(x=840, w=240), dict(size=75, y=320)]),
    62: dict(chars=[dict(x=820, s=0.9)], props=[dict(x=1110, s=0.7), dict(x=1110, y=380, s=1.8, move=dict(x=1110, y=830))]),
    64: dict(chars=[dict(x=790, s=0.9)], props=[dict(x=1080, y=160, s=0.75), dict(x=1080, y=330, s=0.75), dict(x=1080, y=500, s=0.75)]),
    65: dict(chars=[STK()], props=[dict(x=960, y=260, s=0.6)]),
    67: dict(chars=[dict(x=800, s=0.9)], props=[dict(x=1110, s=0.8)]),
    68: dict(chars=[CU(y=1237)], props=[dict(x=960, y=150, size=60), dict(x=960, y=260, size=60)]),
    70: dict(chars=[dict(x=800, s=0.9)], props=[dict(x=1110, s=0.8), dict(x=960, y=250)]),
    71: dict(chars=[STK()], props=[dict(x=960, y=270, s=0.75)]),
    72: dict(chars=[dict(walk=dict(x0=1100, x1=860))], props=[dict(w=440)]),
    73: dict(props=[dict(s=0.85)]),
    74: dict(props=[None, dict(size=70)]),
    75: dict(chars=[dict(x=800, s=0.9)], props=[dict(x=1040, s=0.7), dict(x=1140, s=0.7)]),
    76: dict(chars=[dict(x=1100)]),
    77: dict(props=[dict(s=0.65, x=1010)]),
    79: dict(props=[None, dict(size=56)]),
    80: dict(props=[None, dict(size=56)]),
    81: dict(chars=[STK()], props=[dict(x=960, y=280, s=0.8)]),
    82: dict(props=[dict(y=290), dict(y=150)]),
    84: dict(chars=[STK()], props=[dict(x=960, y=260, s=0.6)]),
    86: dict(chars=[CU(y=1237)], props=[dict(x=960, y=250, size=110)]),
    87: dict(props=[dict(s=0.85)]),
    89: dict(chars=[CU()]),
    90: dict(chars=[CU()], props=[dict(x=1130, y=150, s=0.6)]),
    92: dict(chars=[dict(x=780, s=0.7)], props=[dict(s=0.5), dict(y=300)]),
    93: dict(chars=[STK()], props=[PH]),
    94: dict(chars=[dict(x=900, s=1.0)], props=[dict(x=1090, y=320, s=1.6, move=dict(x=1090, y=860)), dict(x=960, y=140)]),
    96: dict(props=[dict(x=960, y=150), dict(x=960, y=330), dict(x=960, y=510), dict(size=70)]),
    95: dict(props=[None, dict(size=60)]),
    97: dict(chars=[dict(x=820)], props=[dict(x=820, s=0.7), dict(x=1120, s=0.7)]),
    100: dict(props=[dict(x=960, y=120)]),
}
def merge(o, p):
    for k, v in p.items():
        if isinstance(v, dict) and isinstance(o.get(k), dict): o[k] = {**o[k], **v}
        else: o[k] = copy.deepcopy(v)
out = []
for i, s in enumerate(S):
    s = copy.deepcopy(s)
    for f, patch in V.get(i, {}).items():
        if f in ("chars", "props"):
            lst = s.get(f, [])
            for j, p in enumerate(patch):
                if p is None: continue
                if p.get("drop"): lst[j] = None
                else: merge(lst[j], p)
            s[f] = [x for x in lst if x is not None]
        else: s[f] = patch
    out.append(s)
json.dump(out, open(sys.argv[2], "w", encoding="utf-8"), indent=0, ensure_ascii=False)
print(len(out), "vertical shots ->", sys.argv[2])
