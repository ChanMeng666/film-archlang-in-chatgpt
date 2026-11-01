// The one file allowed to know about frames. Everything else speaks seconds, or bars and beats.
export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const BPM = 100;
export const BEAT = 60 / BPM;
export const BAR = 4 * BEAT;
export const LAST_BAR = 35;

/** The start of bar `n` (1-based), plus `beat` beats. */
export const bar = (n: number, beat = 0): number => (n - 1) * BAR + beat * BEAT;
export const DURATION = bar(LAST_BAR);
export const DURATION_FRAMES = Math.round(DURATION * FPS);
export const seconds = (frame: number): number => frame / FPS;
export const frameOf = (t: number): number => Math.round(t * FPS);

export const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));
export const smooth = (x: number): number => {
  const k = clamp01(x);
  return k * k * (3 - 2 * k);
};
export const outCubic = (x: number): number => 1 - (1 - clamp01(x)) ** 3;
/** 0 before `a`, 1 after `b`, linear between. */
export const prog = (t: number, a: number, b: number): number => clamp01((t - a) / Math.max(b - a, 1e-6));
export const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;
/** Rises over `d` seconds from `a`. */
export const fadeIn = (t: number, a: number, d = 0.25): number => smooth(prog(t, a, a + d));
/** A window: in at `a`, out at `b`. */
export const within = (t: number, a: number, b: number, d = 0.25): number =>
  Math.min(fadeIn(t, a, d), 1 - fadeIn(t, b - d, d));
