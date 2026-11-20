import React from "react";
import { BeanSampler, BeanVideo, Shot } from "./BeanVideo";
import shots from "./shots.json";
import lips from "./lips.json";

/* The video. shots.json comes from work/build_shots.py (phrase-timed shot list), lips.json from work/lips.py.
   The total length is the last shot's end time (= the voice length you passed to build_shots.py). */
const SH = shots as unknown as Shot[];
export const STORY_TOTAL = SH[SH.length - 1].t1;
export const STORY_SHOTS = SH.length;
export const Story: React.FC = () => <BeanVideo shots={SH} lips={lips as number[]} total={STORY_TOTAL} />;
export const StorySampler: React.FC = () => <BeanSampler shots={SH} lips={lips as number[]} />;
