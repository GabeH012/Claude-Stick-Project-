# Resolve shot phrases to Whisper times -> shots.json for the Bean player.
# python -I build_shots.py words.json out.json total_seconds
# "@phrase" -> start of phrase, "@>phrase" -> end of phrase, "+1.2" -> shot start + 1.2 s. Chapter cards hold >= 2.4 s.
import json, re, sys, difflib, importlib.util, os

words = json.load(open(sys.argv[1], encoding="utf-8"))
out_p, TOTAL = sys.argv[2], float(sys.argv[3])
spec = importlib.util.spec_from_file_location("spec", os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots_spec.py"))
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
tok = [norm(w["w"]) for w in words]

def find(phrase, start, window=400, strict=0.86):
    pt = [x for x in (norm(x) for x in phrase.split()) if x]
    pj = "".join(pt); k = len(pt); best = (0, None, None)
    for i in range(max(0, start), min(len(tok), start + window)):
        if not tok[i] or (pj[:1] and pj[:1] not in tok[i][:2]):
            continue
        for m in range(max(1, k - 2), k + 3):
            r = difflib.SequenceMatcher(None, pj, "".join(tok[i:i + m])).ratio()
            if r > best[0]: best = (r, i, i + m - 1)
        if best[0] >= strict and best[1] == i:
            cand = []   # a match can begin a word or two early ("them. The company's ..."): take the best start nearby
            for j in range(i, min(len(tok), i + 4)):
                for m in range(max(1, k - 2), k + 3):
                    cand.append((round(difflib.SequenceMatcher(None, pj, "".join(tok[j:j + m])).ratio(), 3), j, j + m - 1))
            r, j, e = max(cand, key=lambda c: (c[0], -c[1]))
            return j, e, r
    if best[0] >= 0.66: return best[1], best[2], best[0]
    raise SystemExit(f"NOT FOUND: {phrase!r} after word {start} ({words[min(start, len(words)-1)]['s']} s), best {best}")

def resolve(obj, i0, t0):
    if isinstance(obj, str):
        if obj.startswith("@>"):
            a, b, _ = find(obj[2:], max(0, i0 - 8), window=200, strict=0.84); return round(words[b]["e"], 3)
        if obj.startswith("@"):
            a, b, _ = find(obj[1:], max(0, i0 - 8), window=200, strict=0.84); return round(words[a]["s"], 3)
        if re.fullmatch(r"\+\d+(\.\d+)?", obj): return round(t0 + float(obj[1:]), 3)
        return obj
    if isinstance(obj, dict): return {k: resolve(v, i0, t0) for k, v in obj.items()}
    if isinstance(obj, list): return [resolve(v, i0, t0) for v in obj]
    return obj

cursor, shots = 0, []
for sh in mod.SHOTS:
    at = sh["at"]
    if at.startswith("end:"):
        a, b, r = find(at[4:], max(0, cursor - 4)); t0 = words[b]["e"] + 0.15; idx = b + 1
    else:
        a, b, r = find(at, max(0, cursor - 4)); t0 = words[a]["s"] - 0.05; idx = a
    t0 = max(0.0, t0 + sh.get("off", 0))
    props = resolve({k: v for k, v in sh.items() if k not in ("at", "off")}, idx, t0)
    props["t0"] = round(t0, 3)
    props["_match"] = " ".join(w["w"] for w in words[a:b + 1]) + f"  ({r:.2f})"
    shots.append(props); cursor = idx
shots[0]["t0"] = 0.0
for i, s in enumerate(shots):
    if s.get("chapter") and i + 1 < len(shots):
        shots[i + 1]["t0"] = round(max(shots[i + 1]["t0"], s["t0"] + 2.4), 3)
for i, s in enumerate(shots):
    s["t1"] = shots[i + 1]["t0"] if i + 1 < len(shots) else TOTAL
for i, s in enumerate(shots):
    print(f"{i:3d} {s['t0']:7.2f} {s['t1'] - s['t0']:5.1f}s {s['type']:6s} {s.get('set', s.get('text', ''))[:14]:14s} {s['_match'][:50]}")
bad = [(i, s["t0"], round(s["t1"] - s["t0"], 2)) for i, s in enumerate(shots) if s["t1"] - s["t0"] < 1.0]
print("TOO SHORT:", bad)
json.dump(shots, open(out_p, "w", encoding="utf-8"), indent=0, ensure_ascii=False)
print(len(shots), "shots ->", out_p)
