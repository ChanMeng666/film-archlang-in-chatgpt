// The one plate in the film: the Playground's real 3D preview of the A3 plan, seeked frame by frame.
// It is too expensive to replicate and it is the product's own pixels. Provenance goes in
// public/plate/provenance.json.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FRAMES = 72;
const cli = join(ROOT, "node_modules/@chanmeng666/archlang/dist/cli.js");
const link = JSON.parse(
  execFileSync(process.execPath, [cli, "link", join(ROOT, "data/plan-a3.arch"), "--json"], { encoding: "utf8" }),
).playground;

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 2 });
await page.goto(link);
await page.waitForSelector("#tab-preview3d");
await page.click("#tab-preview3d");
await page.waitForFunction(() => window.__preview3d !== undefined, undefined, { timeout: 90_000 });
await page.evaluate(() => window.__preview3d.ready);
const canvas = page.locator("#preview3d canvas").first();
const box = await canvas.boundingBox();
mkdirSync(join(ROOT, "public/plate"), { recursive: true });
await page.evaluate(() => document.querySelector("#preview3d button")?.click());
for (let i = 0; i < FRAMES; i++) {
  const t = i / (FRAMES - 1);
  await page.evaluate((x) => {
    const pause = [...document.querySelectorAll("#preview3d button")].find((b) => /Pause|❚/.test(b.textContent ?? ""));
    pause?.click();
    window.__preview3d.seek(x);
  }, t);
  await canvas.screenshot({ path: join(ROOT, `public/plate/f${String(i).padStart(3, "0")}.jpg`), type: "jpeg", quality: 92 });
}
const text = await page.locator("#preview3d").innerText();
writeFileSync(
  join(ROOT, "public/plate/provenance.json"),
  `${JSON.stringify({ source: "https://playground.archlang.uk (3D preview tab)", plan: "data/plan-a3.arch", captured: new Date().toISOString().slice(0, 10), frames: FRAMES, box, strip: text }, null, 2)}\n`,
);
await browser.close();
console.log("capture-3d:", FRAMES, "frames", JSON.stringify(box), text.replace(/\s+/g, " ").slice(0, 160));
