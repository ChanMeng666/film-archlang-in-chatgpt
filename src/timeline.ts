// The film's script: when everything happens, in bars. Pure data; no React.
import { REAL } from "./copy";
import { bar, DURATION, lerp, smooth, prog } from "./time";

export const SECTIONS = {
  hook: [bar(1), bar(4)],
  listing: [bar(4), bar(7)],
  work: [bar(7), bar(11)],
  drawn: [bar(11), bar(15)],
  checks: [bar(15), bar(18)],
  edit: [bar(18), bar(23)],
  sheet: [bar(23), bar(27)],
  playground: [bar(27), bar(31)],
  end: [bar(31), DURATION],
} as const;

export type Page = "listing" | "home" | "chatA" | "chatB" | "chatC" | "playground";
export const pageAt = (t: number): Page => {
  if (t < T.toHome) return "listing";
  if (t < T.sendA) return "home";
  if (t < T.sendB) return "chatA";
  if (t < T.sendC) return "chatB";
  if (t < T.openPlayground) return "chatC";
  return "playground";
};

/** Every moment the picture and the score must agree on. */
export const T = {
  browserIn: bar(4),
  clickStarter: bar(6, 2),
  toHome: bar(6, 2.5),
  sendA: bar(7, 2),
  planLine: bar(7, 3),
  activity: [bar(8, 2), bar(8, 3.5), bar(9, 1)],
  firstDraft: bar(9, 2),
  accessGraph: bar(9, 3.5),
  strictFlag: bar(10, 1),
  activityB: [bar(10, 2.5), bar(10, 3.25)],
  drop: bar(11),
  layers: {
    "A-FLOR": bar(11),
    "A-WALL": bar(11, 1),
    "A-GLAZ": bar(11, 3),
    "A-DOOR": bar(12),
    "A-FURN": bar(12, 2),
    "A-ANNO-TEXT": bar(13),
    "A-ANNO-DIMS": bar(13, 2),
    "A-ANNO": bar(13, 3),
  },
  zoomClick: [bar(12, 3), bar(13, 1)],
  fitClick: bar(14, 2),
  completed: bar(15),
  checksScroll: bar(16),
  checkHits: Array.from({ length: 8 }, (_, i) => bar(16, 0.5 + i * 0.5)),
  finalCheck: bar(17, 1),
  promptB: bar(18),
  sendB: bar(19),
  modified: bar(19, 3),
  diff: bar(20),
  morph: bar(20, 2),
  table: bar(21, 2),
  promptC: bar(23),
  sendC: bar(24),
  tight: bar(24, 2),
  next: bar(25),
  verified: bar(25, 2),
  card: bar(26),
  clickPdf: bar(26, 3),
  openPlayground: bar(27),
  openFormat: bar(27, 3),
  pickPdf: bar(28, 1),
  clickDownload: bar(28, 2),
  downloaded: bar(28, 3),
  click3d: bar(29, 2),
  plate3d: bar(29, 2.5),
  plate3dEnd: bar(31),
  end: bar(31),
};

export const TYPED = [
  { text: REAL.starters[1], from: T.promptB + 0.1, to: T.sendB - 0.45 },
  { text: REAL.starters[2], from: T.promptC + 0.1, to: T.sendC - 0.45 },
];

export const typedAt = (t: number, i: number): string => {
  const { text, from, to } = TYPED[i];
  return text.slice(0, Math.floor(prog(t, from, to) * text.length));
};

export type Caption = { from: number; to: number; text: string; note?: string };
const REAL_RUN = (s: string) => `Real run: ${s}. Sped up here.`;
export const CAPTIONS: Caption[] = [
  { from: bar(4, 1), to: bar(5, 3), text: "listed" },
  { from: bar(7, 3), to: bar(11), text: "works", note: REAL_RUN("4 min 39 s") },
  { from: bar(11, 1), to: bar(12, 3), text: "drawn" },
  { from: bar(12, 3), to: bar(15), text: "zoom" },
  { from: bar(15), to: bar(18), text: "measured" },
  { from: bar(19), to: bar(23), text: "edit", note: REAL_RUN("54 s") },
  { from: bar(24), to: bar(27), text: "sheet", note: REAL_RUN("1 min 5 s") },
  { from: bar(27), to: bar(29, 2), text: "playground" },
  { from: bar(29, 2), to: bar(31), text: "threeD" },
];

/** Page-space cursor path. `click` marks a press at that key. */
export type Key = { t: number; x: number; y: number; click?: boolean };
export const CURSOR: Key[] = [
  { t: bar(4, 2), x: 1180, y: 600 },
  { t: bar(5), x: 760, y: 118 },
  { t: bar(5, 1.5), x: 760, y: 118 },
  { t: bar(5, 3.5), x: 985, y: 218 },
  { t: T.clickStarter, x: 985, y: 218, click: true },
  { t: T.sendA - 0.5, x: 1118, y: 356 },
  { t: T.sendA, x: 1118, y: 356, click: true },
  { t: T.planLine, x: 1190, y: 480 },
  { t: bar(12, 2), x: 1035, y: 160 },
  { t: T.zoomClick[0], x: 1035, y: 160, click: true },
  { t: T.zoomClick[1], x: 1035, y: 160, click: true },
  { t: bar(14), x: 1107, y: 160 },
  { t: T.fitClick, x: 1107, y: 160, click: true },
  { t: bar(15), x: 1200, y: 420 },
  { t: T.promptB - 0.4, x: 700, y: 590 },
  { t: T.promptB, x: 700, y: 590, click: true },
  { t: T.sendB - 0.3, x: 1118, y: 590 },
  { t: T.sendB, x: 1118, y: 590, click: true },
  { t: bar(20), x: 1200, y: 300 },
  { t: T.promptC - 0.4, x: 700, y: 590 },
  { t: T.promptC, x: 700, y: 590, click: true },
  { t: T.sendC - 0.3, x: 1118, y: 590 },
  { t: T.sendC, x: 1118, y: 590, click: true },
  { t: T.card, x: 1200, y: 300 },
  { t: T.clickPdf - 0.5, x: 760, y: 400 },
  { t: T.clickPdf, x: 760, y: 400, click: true },
  { t: T.openFormat - 0.5, x: 634, y: 38 },
  { t: T.openFormat, x: 634, y: 38, click: true },
  { t: T.pickPdf - 0.2, x: 612, y: 150 },
  { t: T.pickPdf, x: 612, y: 150, click: true },
  { t: T.clickDownload - 0.3, x: 772, y: 38 },
  { t: T.clickDownload, x: 772, y: 38, click: true },
  { t: T.click3d - 0.5, x: 1222, y: 167 },
  { t: T.click3d, x: 1222, y: 167, click: true },
  { t: bar(30), x: 1240, y: 610 },
];

export const cursorAt = (t: number): { x: number; y: number; press: number; show: number } => {
  const k = CURSOR;
  let i = 0;
  while (i < k.length - 2 && t >= k[i + 1].t) i++;
  const a = k[i];
  const b = k[i + 1];
  const e = smooth(prog(t, a.t, b.t));
  const arc = Math.sin(e * Math.PI) * Math.min(26, Math.hypot(b.x - a.x, b.y - a.y) * 0.05);
  const press = k.reduce((m, c) => (c.click ? Math.max(m, 1 - Math.abs(t - c.t) / 0.12) : m), 0);
  const show = Math.min(prog(t, k[0].t - 0.3, k[0].t), 1 - prog(t, T.end - 0.3, T.end));
  return { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e) - arc, press: Math.max(0, press), show };
};
export const CLICKS = CURSOR.filter((c) => c.click).map((c) => c.t);

/** Camera over the page: `z` is the zoom on top of the fitted browser, aimed at page point (x, y). */
type Cam = { t: number; x: number; y: number; z: number };
const CAM: Cam[] = [
  { t: bar(4), x: 640, y: 320, z: 1 },
  { t: bar(5, 3), x: 640, y: 320, z: 1 },
  { t: bar(6, 2), x: 790, y: 240, z: 1.34 },
  { t: bar(6, 3), x: 790, y: 240, z: 1.34 },
  { t: bar(7, 1), x: 760, y: 320, z: 1.2 },
  { t: bar(7, 3), x: 760, y: 200, z: 1.2 },
  { t: bar(10, 3), x: 760, y: 220, z: 1.26 },
  { t: bar(11), x: 640, y: 320, z: 1 },
  { t: bar(12), x: 760, y: 330, z: 1.32 },
  { t: bar(14, 2), x: 760, y: 330, z: 1.32 },
  { t: bar(15), x: 640, y: 320, z: 1 },
  { t: bar(20, 1), x: 640, y: 320, z: 1 },
  { t: bar(20, 2), x: 760, y: 300, z: 1.2 },
  { t: bar(21, 2), x: 760, y: 300, z: 1.2 },
  { t: bar(22), x: 640, y: 320, z: 1 },
  { t: bar(26, 1), x: 640, y: 320, z: 1 },
  { t: T.clickPdf, x: 760, y: 360, z: 1.3 },
  { t: T.openPlayground, x: 640, y: 320, z: 1 },
  { t: bar(29, 3), x: 640, y: 320, z: 1 },
  { t: bar(30), x: 960, y: 370, z: 1.5 },
  { t: bar(31), x: 960, y: 370, z: 1.56 },
];
export const camAt = (t: number): { x: number; y: number; z: number } => {
  let i = 0;
  while (i < CAM.length - 2 && t >= CAM[i + 1].t) i++;
  const a = CAM[i];
  const b = CAM[i + 1];
  const e = smooth(prog(t, a.t, b.t));
  return { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), z: lerp(a.z, b.z, e) };
};

