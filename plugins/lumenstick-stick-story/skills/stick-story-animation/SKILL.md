---
name: stick-story-animation
description: Use when the user wants a "stick story animation", a "stick figure business story", a "stick figure documentary", a "what if" or "how X became Y" story, or a long-form 16:9 stick figure video about a company, a founder, money, tech or history, from a voiceover, a script or an idea. Builds a 16:9 Remotion video of bean-shaped stick figures (big round heads, dot eyes, clothes drawn on) in detailed flat sets, with a new shot about every 3 seconds, a slow push-in on every shot, props and labels that tell the story, word-pop title cards, generated music and SFX, two thumbnails and post text. No burned-in captions.
---

# Stick Story Animation (16:9 long-form)

The look: bean stick figures (big round head, dot eyes under lids, tiny mouth, tapered bean body with the outfit drawn on, thin stick arms and legs, one dark outline, flat colour plus one shade) in detailed flat sets (garage, office, boardroom, keynote stage, data centre, trading floor, skyline, HQ, capitol, TV wall), soft lights, a vignette and light grain. The story is told by **props with labels** (price tags, desk plates, countdown calendars, stamps, charts that draw themselves, scales, hub diagrams) and by **data as objects** (stairs, money stacks, growing buildings). Fonts: Fredoka for labels, Lilita One for titles.

The pace: **a new shot about every 3 seconds** (one per sentence), every shot slowly pushes in about 10 %, and a title card comes every 20-30 s: chapter cards ("CHAPTER 1" + title + yellow underline) and word-pop lines (the key sentence pops in word by word, key words in yellow).

The plugin root is two folders up from this skill's base directory. Call it `<plugin>`. The kit is `<plugin>/skills/stick-story-animation/kit` (read-only). The finishing rules are in `<plugin>/tools/STANDARDS.md`: **read it before step 2**.

Keep the user informed with a task list and work straight through.

## 0. Intake
- **Voiceover attached** → step 1. **Script only** → step 1 (the plugin makes the voice). **Idea only** → offer 10 story ideas (a company, an invention, a money mystery: "How a $2 idea...", "Why X failed...", "What if...?"), then write a 3-12 minute script:
  - a cold open on the most dramatic moment and the big question
  - a chapter card, then the story from the beginning in 3-6 chapters, each ending on a turn
  - short sentences with concrete numbers and plain analogies
  - a loop back to the opening question
- Format: 16:9 1920x1080. No burned captions (an .srt for YouTube CC instead).

## 1. Project
1. `python <plugin>/tools/new_project.py story <project>` (folder named after the title).
2. Inside it: `npm install` (Remotion downloads its own headless Chrome on the first render). If Node, Python or ffmpeg are missing, run `animation-setup` first.
3. Put the voice at `<project>/voice.mp3`, the script (if any) at `<project>/script.txt`.

## 2. Voice + word timings
Follow STANDARDS "Voice and timing" → `voice.mp3` + `work/words.json`. Note the voice length in seconds: `ffprobe -v error -show_entries format=duration -of csv=p=0 voice.mp3`.

## 3. Study the kit (it renders a finished 30 s demo out of the box)
- `work/shots_spec.py`: **the whole video is this file.** The header documents every field. Each `S("phrase", type, ...)` is one shot that starts on that phrase of the voice. It holds stage shots with a set, characters (`C`) and props (`P`), cards, and splits. Any string `"@phrase"` becomes the time that phrase starts, `"@>phrase"` the time it ends, and `"+1.2"` means 1.2 s after the shot starts.
- `work/build_shots.py words.json src/bean/shots.json <seconds>`: finds every phrase in the words (fuzzy, prints each match) and writes `src/bean/shots.json`.
- `src/bean/Bean.tsx`: the character rig and `CAST` presets (`exec` / `execMid` / `execYoung` are one founder at three ages). `sets.tsx`: the sets. `props.tsx`: the props. `BeanVideo.tsx`: the player (camera push, cards, splits, vignette, grain). `thumbs.json`: the two thumbnails.
- Render `npx remotion still CastSheet work/cast.png` once to see every preset and expression.

## 4. Build the video
1. Write a new `work/shots_spec.py` (replace the demo SHOTS list):
   - One shot per sentence (2-4 s, never under 1 s). Hold a shot longer only while something moves: a walk, a chart drawing, a sign writing itself.
   - A word-pop `card(...)` every 20-30 s on the twist lines, and a `chapter(...)` card at each chapter start (they hold at least 2.4 s).
   - Give every sentence a visual idea, not just a character standing: a prop that acts (a calendar flips, a stamp slams, a chart crashes, a scale tips, a door says EXIT), a labelled object, a split before/after, a crowd reacting, a close-up face (`s=2.3, y=470+290*s`) for big emotions.
   - On-screen words: 2-3 per label, never full sentences. Keep labels inside x 120-1800 and above y 950.
   - Characters stand or walk; don't seat them.
   - **Real companies and people:** names may appear as text on signs, tags and the HQ `label`. Draw people as original bean characters (a role and outfit), never as likenesses, and use no brand logos (STANDARDS "Content rules"). If the story presents things as true, check the key facts and tell the user about anything off. Mark rumors as unverified on screen (stamps such as "UNPROVEN", "NOT VERIFIED").
2. `python -I -X utf8 work/build_shots.py work/words.json src/bean/shots.json <seconds>`. Fix any NOT FOUND phrase (use the words as Whisper wrote them) and any shot it lists as TOO SHORT.
3. `python -I work/lips.py voice.mp3 src/bean/lips.json` (mouth flaps for characters with `talk=True`).
4. QA before the long render:
   - `npx remotion render StorySampler work/sample --sequence --image-format=jpeg --scale=0.4`, then `python -I work/sheet.py work/sample work/qa src/bean/shots.json` (one row per shot, 3 moments each).
   - Look at every sheet. Fix text cut off at the edges, labels overlapping a set's own sign, faces framed too low, props covering faces, and empty first frames (a prop that pops in late).
   - Send the sheets to the user.
5. For new sets, props or cast, add them to `sets.tsx` / `props.tsx` (register in `SETS` / `KINDS`) / `CAST`, and keep the same outline colour `OL`, stroke widths and flat-plus-one-shade look.

## 5. Sound
Follow STANDARDS "Sound". `audio/audio.py` makes music with one mood per section: the cold open, then one per chapter card. Set `MOODS` to suit the story (tense, curious, dark, thoughtful, warm). The SFX come from the shot list on their own: whooshes on cuts, pops when props appear, word pops on cards, thuds on stamps and shakes, ticks on calendars, footsteps on walks. Then `mix.py`.

## 6. Render + finish
1. `npx remotion render Story work/video_silent.mp4 --muted --crf=18 --concurrency=8` (foreground; keep the PC awake; about 10 min per 5 min of video on a mid-range PC).
2. Mux (no captions): `ffmpeg -y -i work/video_silent.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest out/<Title>.mp4`
3. `python -I tools/srt.py work/words.json out/subtitles_en.srt` for YouTube's CC.
4. Thumbnails: edit `src/bean/thumbs.json` (a stage plus a white line and a big yellow line, 2-4 words that open a question), then `npx remotion still ThumbA out/thumbnail_A.jpg --image-format=jpeg` and `ThumbB`. Recommend one.
5. QA contact sheet of the final video (`ffmpeg -ss 3 -i out/<Title>.mp4 -vf "fps=1/11,scale=480:-1,tile=4x6" -frames:v 1 work/final_sheet.jpg`).
6. Post text with chapters (STANDARDS). Send the MP4, both thumbnails and the sheet.

## Notes
- `BeanVideo` also has a 9:16 mode (`vertical` prop; the 1920x1080 stage seen through a 607-unit window aimed with each shot's `cx`) for Shorts cut from a long video. Shorts get burned captions (STANDARDS).
- The look is original: own fonts, own card design, own characters. If the user brings a reference video, take its pacing and techniques, never its fonts, characters, gags or branding.
