// The picture's timeline, as data for the score. The sound follows the film, never the reverse.
import { writeFileSync } from "node:fs";
import { BAR, BEAT, BPM, DURATION } from "../src/time";
import { CLICKS, T, TYPED } from "../src/timeline";

const typing = TYPED.flatMap(({ text, from, to }) => {
  const n = Math.floor(text.length / 2);
  return Array.from({ length: n }, (_, i) => from + ((to - from) * i) / n);
});
writeFileSync(
  "data/cues.json",
  `${JSON.stringify({ bpm: BPM, beat: BEAT, bar: BAR, duration: DURATION, clicks: CLICKS, typing, checks: T.checkHits, layers: T.layers, sends: [T.sendA, T.sendB, T.sendC], morph: T.morph, tight: T.tight, verified: T.verified, table: T.table, plate3d: T.plate3d, downloaded: T.downloaded, openPlayground: T.openPlayground, drop: T.drop, end: T.end }, null, 2)}\n`,
);
console.log("cues:", CLICKS.length, "clicks,", typing.length, "keys");
