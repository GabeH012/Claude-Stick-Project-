# python -I lips.py voice.mp3 out.json  -> per-frame (30 fps) mouth level 0/1/2 from voice loudness
import sys, json, subprocess, numpy as np
sr = 16000
x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32)
hop = sr // 30
rms = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2) + 1e-12) for i in range(0, len(x), hop)])
db = 20 * np.log10(rms)
ref = np.percentile(db[db > -50], 70)
lv = np.where(db > ref - 2, 2, np.where(db > ref - 14, 1, 0))
lv[1::4] = np.minimum(lv[1::4], 1)      # flap: never hold the widest mouth
json.dump(lv.astype(int).tolist(), open(sys.argv[2], "w"))
print(len(lv), "frames", np.bincount(lv))
