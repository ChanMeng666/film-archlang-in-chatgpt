// node scripts/stills.mjs out/s 8.0 12.5 ...  (seconds). One bundle, many stills.
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";

const [dir, ...times] = process.argv.slice(2);
mkdirSync(dir, { recursive: true });
const serveUrl = await bundle({ entryPoint: resolve("src/index.ts") });
const puppeteerInstance = await openBrowser("chrome");
const composition = await selectComposition({ serveUrl, id: "film", puppeteerInstance });
for (const s of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * 30));
  await renderStill({ serveUrl, composition, frame, output: join(dir, `t${String(Number(s).toFixed(2)).padStart(6, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 85, puppeteerInstance, overwrite: true });
}
await puppeteerInstance.close({ silent: true });
console.log("stills:", times.length);
