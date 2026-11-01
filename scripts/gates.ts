// Gates that execute the film's own modules and say what they looked at. `npx tsx scripts/gates.ts`.
// Pass --master to also measure the rendered file.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { FILM, REAL } from "../src/copy";
import facts from "../src/facts.json";
import { BEAT, DURATION, DURATION_FRAMES, frameOf } from "../src/time";
import { CAPTIONS, CLICKS, CURSOR, SECTIONS, T, pageAt } from "../src/timeline";

let failed = 0;
const gate = (name: string, ok: boolean, saw: string) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}: ${saw}`);
  if (!ok) failed++;
};
const flat = (x: unknown): string[] => (typeof x === "string" ? [x] : Array.isArray(x) ? x.flatMap(flat) : Object.values(x as object).flatMap(flat));

// Copy: every REAL string occurs in the saved transcripts of the live pages.
const sources = readdirSync("data/sources").map((f) => readFileSync(`data/sources/${f}`, "utf8")).join("\n");
const reals = flat(REAL);
const missing = reals.filter((s) => !sources.includes(s.trim()));
gate("real strings", reals.length > 30 && missing.length === 0, `${reals.length} strings, missing: ${JSON.stringify(missing.slice(0, 3))}`);

// Copy: every FILM string has a row in the clearance table.
const clearance = readFileSync("data/copy-clearance.md", "utf8");
const films = flat(FILM);
const uncleared = films.filter((s) => !clearance.includes(s));
gate("film strings cleared", films.length > 10 && uncleared.length === 0, `${films.length} strings, uncleared: ${JSON.stringify(uncleared.slice(0, 3))}`);

// Numbers: the figures the transcript gives equal what the compiler says.
const a = facts["76"].totals;
const b = facts["80"].totals;
const want: Array<[string, number, string]> = [
  ["72.54", a.gross_internal_area_m2, "76 gross"],
  ["69.54", a.net_floor_area_m2, "76 net"],
  ["76.34", b.gross_internal_area_m2, "80 gross"],
  ["73.34", b.net_floor_area_m2, "80 net"],
];
gate("numbers", want.every(([s, n]) => sources.includes(s) && Number(s) === n), want.map(([s, n, l]) => `${l} ${s}=${n}`).join(", "));
gate("A3 fit", facts["a3-tight"].compileCodes.includes("W_SCALE_OVERFLOW") && facts.a3.compileCodes.length === 0 && facts.a3.lintCodes.length === 0, `tight ${facts["a3-tight"].compileCodes}, a3 clean`);

// Frame arithmetic lives in one file.
const literals = readdirSync("src")
  .filter((f) => /\.tsx?$/.test(f) && f !== "time.ts" && f !== "Root.tsx" && !f.includes("generated"))
  .filter((f) => /\bFPS\b|\* 30\b|\/ 30\b/.test(readFileSync(`src/${f}`, "utf8").replace(/import[^;]*;/g, "")));
gate("frame maths in one file", literals.length === 0, `offenders: ${literals}`);

// Time purity: no clocks, randomness or CSS motion in the picture.
const impure = readdirSync("src")
  .filter((f) => /\.tsx?$/.test(f) && !f.includes("generated"))
  .filter((f) => /Date\.now|Math\.random|performance\.now|transition:|@keyframes|requestAnimationFrame/.test(readFileSync(`src/${f}`, "utf8")));
gate("time purity", impure.length === 0, `offenders: ${impure}`);

// Grid: boundaries sit on whole frames at 100 BPM (a beat is 18 frames).
const onBeat = Object.values(SECTIONS).flat().filter((t) => t !== DURATION);
const off = onBeat.filter((t) => Math.abs(t / BEAT - Math.round(t / BEAT)) > 1e-6);
gate("sections on the beat", onBeat.length > 8 && off.length === 0, `${onBeat.length} boundaries; ${DURATION_FRAMES} frames`);
gate("beat is whole frames", Math.abs(frameOf(BEAT) - BEAT * 30) < 1e-9, `${BEAT * 30} frames`);

// Honesty: each compressed run says so for at least 3 s.
const notes = CAPTIONS.filter((c) => c.note);
gate("real-run notes", notes.length === 3 && notes.every((c) => c.to - c.from >= 3 && /Sped up here/.test(c.note!)), notes.map((c) => `${c.note} ${(c.to - c.from).toFixed(1)}s`).join("; "));
gate("worked time matches", sources.includes("Worked for 4m 39s") && sources.includes("Worked for 54s") && sources.includes("Worked for 1m 5s"), "4m39 54s 1m5");

// Cursor: keys ascend and stay on the page; every click lands while a page is up.
const asc = CURSOR.every((k, i) => i === 0 || k.t >= CURSOR[i - 1].t);
gate("cursor path", asc && CURSOR.every((k) => k.x >= 0 && k.x <= 1280 && k.y >= 0 && k.y <= 640), `${CURSOR.length} keys, ${CLICKS.length} clicks`);
const pages = [...new Set(Object.values(T).flat().filter((x): x is number => typeof x === "number").map(pageAt))];
gate("every page is reached", pages.length === 6, pages.join(" "));

if (process.argv.includes("--master")) {
  const f = "out/archlang-in-chatgpt.mp4";
  gate("master exists", existsSync(f), f);
  const probe = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", f], { encoding: "utf8" }));
  const v = probe.streams.find((s: { codec_type: string }) => s.codec_type === "video");
  const au = probe.streams.find((s: { codec_type: string }) => s.codec_type === "audio");
  gate("format", v.width === 1920 && v.height === 1080 && v.nb_frames === String(DURATION_FRAMES) && !!au, `${v.width}x${v.height} ${v.nb_frames} frames ${au?.codec_name}`);
  const e = spawnSync("ffmpeg", ["-hide_banner", "-i", f, "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 28 }).stderr;
  const lufs = Number([...e.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop()?.[1]);
  const peak = Number([...e.matchAll(/Peak:\s+(-?[\d.]+) dBFS/g)].pop()?.[1]);
  gate("loudness", Math.abs(lufs + 16) <= 0.5 && peak <= -1.5, `${lufs} LUFS, true peak ${peak} dBTP`);
  const home = `${process.env.USERPROFILE ?? ""}/.claude/skills/chanmeng-product-film/scripts/flash-check.mjs`;
  const r = spawnSync(process.execPath, [home, f], { encoding: "utf8", maxBuffer: 1 << 28 });
  gate("flash", r.status === 0, (r.stdout + r.stderr).trim().split("\n").slice(-1)[0] ?? "");
}
console.log(failed ? `\n${failed} gate(s) failed` : "\nall gates passed");
process.exit(failed ? 1 : 0);
