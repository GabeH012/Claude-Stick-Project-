# python -I sheet.py sample_dir out_prefix [shots.json] -> contact sheets: one row per shot (3 samples), 8 shots per sheet
import sys, os, json, cv2, numpy as np
d, out = sys.argv[1], sys.argv[2]
fs = sorted(os.listdir(d))
shots = json.load(open(sys.argv[3], encoding="utf-8")) if len(sys.argv) > 3 else None
rows = []
for i in range(0, len(fs), 3):
    ims = [cv2.resize(cv2.imread(os.path.join(d, f)), (512, 288)) for f in fs[i:i + 3]]
    row = np.hstack(ims)
    k = i // 3
    lab = f"{k}" + (f"  {shots[k]['t0']:.1f}s" if shots else "")
    cv2.rectangle(row, (0, 0), (150, 26), (0, 0, 0), -1)
    cv2.putText(row, lab, (5, 19), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
    rows.append(row)
for s in range(0, len(rows), 8):
    cv2.imwrite(f"{out}_{s // 8:02d}.jpg", np.vstack(rows[s:s + 8]), [cv2.IMWRITE_JPEG_QUALITY, 82])
print((len(rows) + 7) // 8, "sheets")
