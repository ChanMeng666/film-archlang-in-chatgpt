import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { ChatA, ChatB, ChatC, Home, Listing, PAGE_H, PAGE_W } from "./ChatGPT";
import { FILM } from "./copy";
import { LAYERS, Plan, type View } from "./Plan";
import { Playground } from "./Playground";
import { bar, BEAT, DURATION, fadeIn, H, lerp, outCubic, prog, seconds, smooth, W, within } from "./time";
import { camAt, CAPTIONS, cursorAt, pageAt, SECTIONS, T } from "./timeline";
import { BRAND, BRAND_MONO, C, Icon, Logo, SANS } from "./ui";

const FONT_CSS = `
@font-face{font-family:Archivo;font-weight:400;src:url(${staticFile("fonts/archivo-latin-400-normal.woff2")})}
@font-face{font-family:Archivo;font-weight:600;src:url(${staticFile("fonts/archivo-latin-600-normal.woff2")})}
@font-face{font-family:Archivo;font-weight:800;src:url(${staticFile("fonts/archivo-latin-800-normal.woff2")})}
@font-face{font-family:"IBM Plex Mono";font-weight:400;src:url(${staticFile("fonts/ibm-plex-mono-latin-400-normal.woff2")})}
@font-face{font-family:"IBM Plex Mono";font-weight:500;src:url(${staticFile("fonts/ibm-plex-mono-latin-500-normal.woff2")})}
`;

// The browser window on the stage.
const WIN = { x: 140, y: 34, w: 1640, chrome: 84 };
const ZOOM = WIN.w / PAGE_W;
const WIN_H = WIN.chrome + PAGE_H * ZOOM;

const Grid: React.FC<{ shift?: number }> = ({ shift = 0 }) => (
  <AbsoluteFill
    style={{
      background: C.paper,
      backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
      backgroundSize: "60px 60px",
      backgroundPosition: `${shift}px ${shift * 0.5}px`,
    }}
  />
);

const tabOf = (t: number): { title: string; url: string } => {
  if (t >= T.openPlayground) return { title: "ArchLang Playground", url: "playground.archlang.uk" };
  if (t >= T.sendA) return { title: "Design ArchLang Flat", url: "chatgpt.com/c/…" };
  if (t >= T.toHome) return { title: "ChatGPT", url: "chatgpt.com" };
  return { title: "ArchLang | ChatGPT Plugins", url: "chatgpt.com/plugins/archlang" };
};

const Chrome: React.FC<{ t: number }> = ({ t }) => {
  const { title, url } = tabOf(t);
  return (
    <div style={{ height: WIN.chrome, background: "#dfe3e9", fontFamily: SANS, color: "#1f2328", position: "relative" }}>
      <div style={{ position: "absolute", left: 14, top: 8, height: 36, width: 290, background: "#fff", borderRadius: "10px 10px 0 0", display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: 14 }}>
        <Logo s={15} />
        <span style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{title}</span>
        <span style={{ marginLeft: "auto", color: "#777" }}>
          <Icon n="x" s={13} />
        </span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 44, height: 40, background: "#fff", display: "flex", alignItems: "center", gap: 14, padding: "0 14px", borderBottom: "1px solid #e4e4e4" }}>
        <Icon n="back" s={18} c="#555" />
        <Icon n="forward" s={18} c="#bbb" />
        <Icon n="reload" s={17} c="#555" />
        <div style={{ flex: 1, height: 30, borderRadius: 15, background: "#eff1f4", display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontSize: 15 }}>
          <Icon n="lock" s={14} c="#555" /> {url}
        </div>
      </div>
    </div>
  );
};

const Cursor: React.FC<{ t: number }> = ({ t }) => {
  const c = cursorAt(t);
  if (c.show <= 0) return null;
  const ripple = c.press;
  return (
    <div style={{ position: "absolute", left: c.x, top: c.y, opacity: c.show, zIndex: 50 }}>
      {ripple > 0 ? <div style={{ position: "absolute", left: -18, top: -18, width: 36, height: 36, borderRadius: 18, background: `rgba(128,82,255,${0.28 * ripple})`, transform: `scale(${1.5 - 0.6 * ripple})` }} /> : null}
      <svg width={24} height={30} viewBox="0 0 24 30" style={{ position: "absolute", left: -3, top: -2, transform: `scale(${1 - 0.14 * c.press})`, transformOrigin: "3px 2px", filter: "drop-shadow(0 2px 3px rgba(0,0,0,.3))" }}>
        <path d="M3 2 L3 23 L8.4 18.2 L12 26.6 L15.6 25 L12 16.8 L19.4 16.8 Z" fill="#111" stroke="#fff" strokeWidth={1.7} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const PageContent: React.FC<{ t: number }> = ({ t }) => {
  const p = pageAt(t);
  if (p === "listing") return <Listing t={t} />;
  if (p === "home") return <Home />;
  if (p === "chatA") return <ChatA t={t} />;
  if (p === "chatB") return <ChatB t={t} />;
  if (p === "chatC") return <ChatC t={t} />;
  return <Playground t={t} />;
};

const Browser: React.FC<{ t: number }> = ({ t }) => {
  const a = SECTIONS.listing[0];
  const enter = outCubic(prog(t, a, a + 0.9));
  const leave = smooth(prog(t, T.end - 0.1, T.end + 0.8));
  const cam = camAt(t);
  // Page point (cam.x, cam.y) sits at the frame point it holds at zoom 1, pulled to centre as z grows.
  const px = WIN.x + cam.x * ZOOM;
  const py = WIN.y + WIN.chrome + cam.y * ZOOM;
  const tx = (W / 2 - 40 * 0 - px) * (cam.z - 1) / cam.z;
  const ty = ((H - 100) / 2 - py) * (cam.z - 1) / cam.z;
  const scale = cam.z * lerp(0.92, 1, enter) * (1 - 0.06 * leave);
  return (
    <div
      style={{
        position: "absolute",
        left: WIN.x,
        top: WIN.y,
        width: WIN.w,
        height: WIN_H,
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: SANS,
        color: C.ink,
        boxShadow: "0 30px 80px rgba(40,30,70,.22), 0 2px 6px rgba(40,30,70,.12)",
        transformOrigin: `${px - WIN.x}px ${py - WIN.y}px`,
        transform: `translate(${tx * cam.z}px, ${ty * cam.z + (1 - enter) * 700 - leave * 60}px) scale(${scale})`,
        opacity: 1 - leave,
      }}
    >
      <Chrome t={t} />
      <div style={{ position: "absolute", left: 0, top: WIN.chrome, width: PAGE_W, height: PAGE_H, transform: `scale(${ZOOM})`, transformOrigin: "0 0", overflow: "hidden", background: C.page }}>
        <PageContent t={t} />
        <Cursor t={t} />
      </div>
    </div>
  );
};

const CaptionBar: React.FC<{ t: number }> = ({ t }) => {
  const c = CAPTIONS.find((x) => t >= x.from && t < x.to);
  if (!c) return null;
  const k = within(t, c.from, c.to, 0.22);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, opacity: k, transform: `translateY(${(1 - k) * 10}px)` }}>
      <div style={{ fontFamily: BRAND, fontWeight: 600, fontSize: 32, color: C.brandInk, background: "rgba(247,244,238,.94)", padding: "8px 22px", borderRadius: 12 }}>{FILM[c.text as keyof typeof FILM]}</div>
      {c.note ? <div style={{ fontFamily: BRAND_MONO, fontSize: 20, color: "#4b4560", background: "rgba(247,244,238,.94)", padding: "6px 14px", borderRadius: 10 }}>{c.note}</div> : null}
    </div>
  );
};

const HOOK_VIEW: View = { x: -2600, y: -1600, w: 14800, h: 11400 };

const Hook: React.FC<{ t: number }> = ({ t }) => {
  const reveal = Object.fromEntries(LAYERS.map((l, i) => [l, l === "A-ANNO" || l === "A-ANNO-DIMS" || l === "A-ANNO-TEXT" ? 0 : prog(t, bar(1, 2) + i * 0.9, bar(1, 2) + i * 0.9 + 2.4)]));
  const out = 1 - smooth(prog(t, bar(3, 3), bar(4, 1)));
  const l1 = fadeIn(t, bar(1, 1), 0.4);
  const l2 = fadeIn(t, bar(2, 1), 0.4);
  const l3 = fadeIn(t, bar(3), 0.35);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <style>{`.hook svg>rect{fill:transparent}.hook svg>g:not([id]){display:none}`}</style>
      <div style={{ position: "absolute", right: 70, top: 130, width: 800, height: 820 }}>
        <Plan id="76" view={HOOK_VIEW} width={800} height={820} reveal={reveal} scope="hook" />
      </div>
      <div style={{ position: "absolute", left: 120, top: 380, width: 1000, fontFamily: BRAND, color: C.brandInk }}>
        <div style={{ fontWeight: 800, fontSize: 60, lineHeight: "72px", letterSpacing: -1.2, opacity: l1, transform: `translateY(${(1 - l1) * 16}px)` }}>{FILM.hook1}</div>
        <div style={{ fontWeight: 800, fontSize: 60, lineHeight: "72px", letterSpacing: -1.2, marginTop: 10, opacity: l2, transform: `translateY(${(1 - l2) * 16}px)` }}>{FILM.hook2}</div>
        <div style={{ fontWeight: 600, fontSize: 38, marginTop: 34, color: "#5a3fd0", opacity: l3 }}>{FILM.hook3}</div>
      </div>
    </AbsoluteFill>
  );
};

const End: React.FC<{ t: number }> = ({ t }) => {
  const s = T.end;
  const a = outCubic(prog(t, s + 0.3, s + 1.1));
  const b = fadeIn(t, s + BEAT * 4, 0.5);
  const c = fadeIn(t, s + BEAT * 8, 0.5);
  return (
    <AbsoluteFill style={{ opacity: fadeIn(t, s, 0.5) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: BRAND, color: C.brandInk }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: a, transform: `scale(${0.96 + 0.04 * a})` }}>
          <Logo s={108} />
          <span style={{ fontSize: 112, fontWeight: 800, letterSpacing: -2.5 }}>ArchLang</span>
        </div>
        <div style={{ fontSize: 44, fontWeight: 600, marginTop: 16, opacity: a }}>Floor plans as checked code</div>
        <div style={{ fontSize: 34, fontWeight: 600, marginTop: 62, color: "#5a3fd0", opacity: b }}>{FILM.end1}</div>
        <div style={{ fontFamily: BRAND_MONO, fontSize: 26, marginTop: 16, opacity: b }}>{FILM.end2}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, textAlign: "center", fontFamily: BRAND, fontSize: 21, lineHeight: "31px", color: "#5a5566", opacity: c }}>
        {FILM.fine1}
        <br />
        {FILM.fine2}
      </div>
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const t = seconds(useCurrentFrame());
  return (
    <AbsoluteFill>
      <style>{FONT_CSS}</style>
      <Grid shift={-t * 3} />
      {t < SECTIONS.listing[0] + 1 ? <Hook t={t} /> : null}
      {t >= SECTIONS.listing[0] && t < T.end + 0.95 ? <Browser t={t} /> : null}
      <CaptionBar t={t} />
      {t >= T.end ? <End t={t} /> : null}
      {t > DURATION ? null : <Audio src={staticFile("soundtrack.wav")} />}
    </AbsoluteFill>
  );
};
