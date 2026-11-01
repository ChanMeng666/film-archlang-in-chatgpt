// Every drawing and number in the film comes from here: the real compiler over the real plans.
// plan-76 is ChatGPT's plan, decoded from its Playground link. plan-80 applies its one-line edit.
// plan-a3 is its A3 sheet, every changed line read back from its Playground link. plan-80-a3-1to50 is the failed fit.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compile, describe, lint } from "@chanmeng666/archlang";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(join(ROOT, f), "utf8").replace(/\r\n/g, "\n");
const base = read("data/plan-76.arch");

const swap = (s, pairs) =>
  pairs.reduce((out, [a, b]) => {
    if (!out.includes(a)) throw new Error(`bake: "${a}" is not in the plan`);
    return out.replaceAll(a, b);
  }, s);

const p80 = swap(base, [
  ["room id=bed1 at (6500,0) size 3000x4000", "room id=bed1 at (6500,0) size 4000x4000"],
  ["76 m²", "80 m²"],
]);
const a3Tight = swap(p80, [["paper A2 landscape", "paper A3 landscape"]]);
const a3 = swap(a3Tight, [
  ["scale 1:50", "scale 1:100"],
  ["approximately 76 square metres", "approximately 80 square metres"],
  ['label "Laundry" uses utility', 'label "Laundry" at (1250,6600) uses utility'],
  ['label "Bathroom" at (3750,6650) uses bath', 'label "Bath" at (4550,6750) uses bath'],
  ["door between kitchen and laundry at center width 800 swing into laundry", "door sliding between kitchen and laundry at center width 800"],
  ["furniture washer in laundry anchor left flush size 600x650", "furniture washer in laundry anchor bottom-left flush size 600x650 rotate 180"],
  ["furniture dryer in laundry anchor right flush size 600x650", "furniture dryer in laundry anchor bottom-right flush size 600x650 rotate 180"],
  [
    "a living and dining room, separate kitchen, bathroom and laundry.",
    "living and dining, kitchen, bathroom and laundry. Bedroom 1 is widened to 4 metres.",
  ],
]);

const plans = { 76: base, 80: p80, a3, "a3-tight": a3Tight };
const facts = {};
for (const [id, src] of Object.entries(plans)) {
  writeFileSync(join(ROOT, `data/plan-${id}.arch`), src);
  const c = compile(src);
  const errors = c.diagnostics.filter((d) => d.severity === "error" || String(d.code).startsWith("E_"));
  if (errors.length) throw new Error(`bake: plan ${id}: ${errors[0].code}`);
  writeFileSync(join(ROOT, `public/plans/plan-${id}.svg`), c.svg);
  const d = describe(src);
  const l = lint(src);
  const list = Array.isArray(l) ? l : (l.diagnostics ?? []);
  facts[id] = {
    totals: d.totals,
    sheet: d.sheet,
    bbox: d.bbox,
    bbox_outer: d.bbox_outer,
    rooms: d.rooms.map((r) => ({ id: r.id, label: r.label, area_m2: r.area_m2, net_area_m2: r.net_area_m2, bbox: r.bbox })),
    compileCodes: c.diagnostics.map((x) => x.code),
    lintCodes: list.map((x) => x.code),
  };
}
const parts = Object.fromEntries(
  Object.keys(plans).map((id) => {
    const svg = readFileSync(join(ROOT, `public/plans/plan-${id}.svg`), "utf8");
    const m = svg.match(/^<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>\s*$/);
    return [id, { viewBox: m[1].split(" ").map(Number), inner: m[2] }];
  }),
);
writeFileSync(join(ROOT, "src/plans.generated.ts"), `// Written by scripts/bake.mjs from the real compiler's output.
export const PLANS = ${JSON.stringify(parts)} as const;
`);
writeFileSync(join(ROOT, "src/facts.json"), `${JSON.stringify(facts, null, 2)}\n`);
const v = execFileSync(process.execPath, [join(ROOT, "node_modules/@chanmeng666/archlang/dist/cli.js"), "--version"], { encoding: "utf8" }).trim();
console.log(`bake: compiler ${v}`);
for (const [id, f] of Object.entries(facts))
  console.log(id, JSON.stringify(f.totals), "compile", f.compileCodes.join(",") || "-", "lint", f.lintCodes.join(",") || "-");
