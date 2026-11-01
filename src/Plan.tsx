// The compiler's real drawing. A "view" is a world rectangle, so a zoom stays crisp and two plans
// line up in the same coordinates. Layers are the SVG's own; the film only reveals them.
import React from "react";
import { PLANS } from "./plans.generated";
import { clamp01, smooth } from "./time";

export type PlanId = keyof typeof PLANS;
export type View = { x: number; y: number; w: number; h: number };
export const LAYERS = ["A-FLOR", "A-WALL", "A-GLAZ", "A-DOOR", "A-FURN", "A-ANNO-TEXT", "A-ANNO-DIMS", "A-ANNO"] as const;

export const sheetView = (id: PlanId): View => {
  const [x, y, w, h] = PLANS[id].viewBox;
  return { x, y, w, h };
};
export const mixView = (a: View, b: View, k: number): View => ({
  x: a.x + (b.x - a.x) * k,
  y: a.y + (b.y - a.y) * k,
  w: a.w + (b.w - a.w) * k,
  h: a.h + (b.h - a.h) * k,
});

export const Plan: React.FC<{
  id: PlanId;
  view: View;
  width: number;
  height: number;
  /** 0–1 per layer; missing means fully shown. */
  reveal?: Partial<Record<(typeof LAYERS)[number], number>>;
  scope: string;
  opacity?: number;
  clipRight?: number;
}> = ({ id, view, width, height, reveal, scope, opacity = 1 }) => {
  const rules = reveal
    ? LAYERS.map((l) => {
        const k = clamp01(reveal[l] ?? 1);
        return `.${scope} #${l}{opacity:${smooth(Math.min(1, k * 3))};clip-path:inset(0 ${(1 - smooth(k)) * 100}% 0 0)}`;
      }).join("")
    : "";
  const a = view.w / view.h;
  const b = width / height;
  const vw = a > b ? view.w : view.h * b;
  const vh = a > b ? view.w / b : view.h;
  const vb = `${view.x - (vw - view.w) / 2} ${view.y - (vh - view.h) / 2} ${vw} ${vh}`;
  return (
    <div className={scope} style={{ position: "absolute", inset: 0, opacity }}>
      {rules ? <style>{rules}</style> : null}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={vb}
        width={width}
        height={height}
        fontFamily="Helvetica, Arial, sans-serif"
        dangerouslySetInnerHTML={{ __html: PLANS[id].inner }}
      />
    </div>
  );
};
