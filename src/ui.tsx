// Small shared pieces of the replica: tokens measured from the live pages, and plain line icons.
import React from "react";
import { staticFile } from "remotion";

export const C = {
  page: "#fcfcfc",
  ink: "#0d0d0d",
  soft: "#5d5d5d",
  faint: "#8f8f8f",
  rule: "#ececec",
  border: "#e3e3e3",
  sidebar: "#f9f9f9",
  bubble: "#e6f0fd",
  bubbleInk: "#0b2a55",
  link: "#2b6cb0",
  blue: "#2f80ed",
  pillBg: "#d6f2df",
  pillInk: "#12733f",
  redBg: "#fde0e0",
  redInk: "#c22f2f",
  plum: "#8052ff",
  paper: "#f7f4ee",
  grid: "#e7e1d6",
  brandInk: "#17151f",
};
export const SANS = '"Segoe UI", system-ui, sans-serif';
export const MONO = '"Cascadia Mono", Consolas, monospace';
export const BRAND = '"Archivo", "Segoe UI", sans-serif';
export const BRAND_MONO = '"IBM Plex Mono", Consolas, monospace';

const I: React.FC<{ d: string; s?: number; c?: string; w?: number }> = ({ d, s = 18, c = "currentColor", w = 1.7 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
export const Icons = {
  pencil: "M4 20h4L20 8l-4-4L4 16v4zM14 6l4 4",
  images: "M4 6h12v12H4zM8 14l3-3 5 5M20 8v12H8",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  library: "M5 4h4v16H5zM11 4h3v16h-3zM16 5l3-1 3 15-3 1z",
  at: "M12 21a9 9 0 1 1 9-9v1.5a2.5 2.5 0 0 1-5 0V12a4 4 0 1 1-1.2-2.8",
  term: "M4 5h16v14H4zM8 10l2 2-2 2M13 15h3",
  dots: "M5 12h.01M12 12h.01M19 12h.01",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4-4",
  panel: "M4 5h16v14H4zM9 5v14",
  plus: "M12 5v14M5 12h14",
  mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3",
  arrowUp: "M12 19V5M6 11l6-6 6 6",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-2-4-2 1-2-2V4h-4l-1 2-2 1-2-1-2 4 2 1v2l-2 1 2 4 2-1 2 1 1 2h4l1-2 2-1 2 1 2-4-2-1z",
  link: "M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1",
  share: "M12 15V4M8 8l4-4 4 4M5 13v7h14v-7",
  chevron: "M9 6l6 6-6 6",
  down: "M12 4v12M7 11l5 5 5-5M5 20h14",
  back: "M15 6l-6 6 6 6",
  forward: "M9 6l6 6-6 6",
  reload: "M20 11a8 8 0 1 0-2 6M20 5v6h-6",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  star: "M12 4l2.5 5 5.5.8-4 3.9.9 5.5L12 16.6 7.1 19.2l.9-5.5-4-3.9 5.5-.8z",
  x: "M6 6l12 12M18 6L6 18",
  file: "M6 3h8l4 4v14H6zM14 3v4h4",
};
export const Icon: React.FC<{ n: keyof typeof Icons; s?: number; c?: string; w?: number }> = ({ n, ...p }) => (
  <I d={Icons[n]} {...p} />
);

export const Logo: React.FC<{ s?: number }> = ({ s = 14 }) => (
  <img src={staticFile("brand/archlang-icon-plum.svg")} width={s} height={s} style={{ display: "inline-block", verticalAlign: "-2px" }} />
);

export const Pill: React.FC<{ children: React.ReactNode; red?: boolean; style?: React.CSSProperties }> = ({ children, red, style }) => (
  <span
    style={{
      display: "inline-block",
      background: red ? C.redBg : C.pillBg,
      color: red ? C.redInk : C.pillInk,
      fontSize: 13,
      lineHeight: "20px",
      padding: "0 7px",
      borderRadius: 8,
      fontWeight: 500,
      ...style,
    }}
  >
    {children}
  </span>
);

export const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code style={{ fontFamily: MONO, fontSize: 13.5, background: "#f0f0f0", padding: "2px 5px", borderRadius: 5 }}>{children}</code>
);

/** Words appear as they stream. */
export const stream = (text: string, k: number): string => {
  const n = Math.floor(Math.min(1, Math.max(0, k)) * text.length);
  if (n >= text.length) return text;
  const cut = text.lastIndexOf(" ", n);
  return text.slice(0, cut < 0 ? 0 : cut);
};
