// A replica of playground.archlang.uk at the 1422 px it was measured at, scaled onto the page.
import React from "react";
import { Img, staticFile } from "remotion";
import { REAL } from "./copy";
import facts from "./facts.json";
import { Plan, sheetView } from "./Plan";
import { fadeIn, prog, smooth, within } from "./time";
import { T } from "./timeline";
import { BRAND, BRAND_MONO, Logo } from "./ui";

const P = { bg: "#eef0f5", bar: "#eceef3", rule: "#d8dbe3", ink: "#171a24", code: "#fbfbfd", pane: "#f7f5f0", red: "#b3261e", blue: "#2a5db0", green: "#1f6f43", brown: "#8a4b12", plum: "#6d3fe0" };
const SCALE = 1280 / 1422;
export const PG = { w: 1422, h: 640 / SCALE };

const group: React.CSSProperties = { display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 12px", borderRight: `1px solid ${P.rule}`, height: 70 };
const label: React.CSSProperties = { fontFamily: BRAND_MONO, fontSize: 10.5, letterSpacing: 1, color: "#5f6470", marginBottom: 4 };
const btn: React.CSSProperties = { height: 28, padding: "0 10px", border: "1px solid #b9bdc8", borderRadius: 4, background: "#fff", fontSize: 13.5, display: "inline-flex", alignItems: "center", fontFamily: BRAND };

const SOURCE = (): string[] => {
  // The plan's own lines, shown as the editor shows them.
  const raw = LINES;
  return raw.split("\n");
};
const LINES = `plan "Two-bedroom flat — 80 m²" {
  units mm
  grid 100
  north up
  paper A3 landscape
  scale 1:100
  dims auto all
  schedule rooms
  legend
  accTitle "Two-bedroom apartment — approximately 80 square metres"
  accDescr "A two-bedroom apartment with a central hallway, living and dining, kitchen,
  room id=living at (0,0) size 5000x4000 label "Living / Dining" uses living
  room id=hall at (5000,0) size 1500x8000 label "Hall" uses hall
  room id=bed1 at (6500,0) size 4000x4000 label "Bedroom 1" uses bedroom
  room id=bed2 at (6500,4000) size 3000x4000 label "Bedroom 2" uses bedroom
  room id=kitchen at (0,4000) size 5000x2000 label "Kitchen" uses kitchen
  room id=laundry at (0,6000) size 2500x2000 label "Laundry" at (1250,6600) uses utilit
  room id=bath at (2500,6000) size 2500x2000 label "Bath" at (4550,6750) uses bath
  walls from rooms exterior 200 partition 100 { open between living and kitchen width
  door on hall.bottom at center width 900 swing into hall
  door between hall and living at center width 900 swing into living`;

const Token: React.FC<{ line: string }> = ({ line }) => {
  const parts = line.split(/("[^"]*"?|\b\d[\dx,:]*\b|\b(?:plan|room|walls|door|paper|scale|legend|schedule)\b)/g);
  return (
    <>
      {parts.map((p, i) => {
        const color = /^"/.test(p) ? P.green : /^\d/.test(p) ? P.blue : /^(plan|room|walls|door|paper|scale|legend|schedule)$/.test(p) ? P.brown : P.ink;
        return (
          <span key={i} style={{ color, fontWeight: color === P.brown ? 600 : 400 }}>
            {p}
          </span>
        );
      })}
    </>
  );
};

const Tab: React.FC<{ text: string; on: boolean }> = ({ text, on }) => (
  <div style={{ fontFamily: BRAND_MONO, fontSize: 12, letterSpacing: 0.8, padding: "6px 10px", borderBottom: on ? `2px solid ${P.red}` : "2px solid transparent", fontWeight: on ? 600 : 400 }}>{text}</div>
);

export const Playground: React.FC<{ t: number }> = ({ t }) => {
  const three = t >= T.click3d;
  const menu = within(t, T.openFormat, T.pickPdf + 0.15, 0.06);
  const fmt = t >= T.pickPdf ? "PDF" : "SVG";
  const f = facts.a3.totals;
  const frame = Math.min(71, Math.floor(prog(t, T.plate3d, T.plate3dEnd - 0.25) * 72));
  const dl = t >= T.downloaded ? within(t, T.downloaded, T.click3d + 0.1, 0.18) : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: PG.w, height: PG.h, transform: `scale(${SCALE})`, transformOrigin: "0 0", background: P.bg, color: P.ink, fontFamily: BRAND }}>
      <div style={{ height: 70, display: "flex", alignItems: "center", background: P.bar, borderBottom: `1px solid ${P.rule}` }}>
        <div style={{ width: 126, flexShrink: 0, paddingLeft: 10, boxSizing: "border-box", fontWeight: 800, fontSize: 20, display: "flex", alignItems: "center", gap: 4 }}>
          <Logo s={19} /> <span style={{ color: P.plum }}>Arch</span>Lang
        </div>
        <div style={group}>
          <div style={label}>DRAWING</div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ ...btn, width: 172 }}>Laneway House</span>
            <span style={btn}>Format</span>
            <span style={btn}>Finish</span>
            <span style={btn}>Saved ▾</span>
          </div>
        </div>
        <div style={group}>
          <div style={label}>VIEW</div>
          <span style={{ ...btn, width: 100 }}>Default</span>
        </div>
        <div style={group}>
          <div style={label}>ISSUE</div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ ...btn, width: 64, justifyContent: "space-between", outline: menu > 0 ? `2px solid ${P.blue}` : "none" }}>
              {fmt} <span style={{ fontSize: 9 }}>▾</span>
            </span>
            <span style={btn}>☐ a11y</span>
            <span style={{ ...btn, background: P.red, color: "#fff", border: "none", fontWeight: 600 }}>Download</span>
          </div>
        </div>
        <div style={{ ...group, borderRight: "none" }}>
          <div style={label}>SHARE</div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={btn}>Copy link</span>
            <span style={btn}>Copy for LLM</span>
            <span style={btn}>Embed</span>
          </div>
        </div>
      </div>
      <div style={{ padding: "12px 14px 12px", background: P.bg }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>ArchLang Playground — write floor plans, compile them in your browser</div>
        <div style={{ fontSize: 13.5, color: "#555a66", marginTop: 6, width: 790, lineHeight: "20px" }}>
          ArchLang is an open-source (MIT) DSL for floor plans. Write .arch source in the editor below and it compiles in your browser to a dimensioned SVG plan — no install, no account.
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 168, bottom: 0, display: "flex", borderTop: `1px solid ${P.rule}` }}>
        <div style={{ width: 740, background: P.code, borderRight: `2px solid ${P.plum}`, overflow: "hidden" }}>
          <div style={{ fontFamily: BRAND_MONO, fontSize: 12, letterSpacing: 0.8, padding: "8px 14px", color: "#555a66", borderBottom: `1px solid ${P.rule}` }}>SOURCE.ARCH</div>
          <div style={{ padding: "8px 0", fontFamily: BRAND_MONO, fontSize: 13.5, lineHeight: "20px" }}>
            {LINES.split(String.fromCharCode(10)).map((l, i) => (
              <div key={i} style={{ display: "flex", whiteSpace: "pre" }}>
                <span style={{ width: 40, textAlign: "right", color: "#a0a4ae", marginRight: 8 }}>{i + 1}</span>
                <Token line={l} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, background: P.pane, position: "relative" }}>
          <div style={{ height: 36, display: "flex", alignItems: "center", padding: "0 12px", borderBottom: `1px solid ${P.rule}` }}>
            <span style={{ width: 9, height: 9, borderRadius: 5, background: "#1f8a4c", marginRight: 8 }} />
            <span style={{ fontFamily: BRAND_MONO, fontSize: 12, letterSpacing: 1 }}>READY</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
              <Tab text="PREVIEW" on={!three} />
              <Tab text="DESCRIBE" on={false} />
              <Tab text="LINT" on={false} />
              <Tab text="INTENT" on={false} />
              <Tab text="3D PREVIEW" on={three} />
            </div>
          </div>
          {three ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 36, bottom: 0, background: "#f7f5f0" }}>
              <div style={{ fontSize: 13, color: "#555a66", padding: "8px 14px" }}>{REAL.preview3d}</div>
              <Img src={staticFile(`plate/f${String(frame).padStart(3, "0")}.jpg`)} style={{ width: 682, display: "block" }} />
            </div>
          ) : (
            <>
              <div style={{ position: "absolute", left: 0, right: 0, top: 36, bottom: 40, backgroundImage: `linear-gradient(#e7e2d8 1px, transparent 1px), linear-gradient(90deg, #e7e2d8 1px, transparent 1px)`, backgroundSize: "14px 14px" }}>
                <div style={{ position: "absolute", left: 54, top: 12, width: 572, height: 404 * 0.98, background: "#fff" }}>
                  <Plan id="a3" view={sheetView("a3")} width={572} height={396} scope="pg" />
                </div>
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 40, display: "flex", alignItems: "center", gap: 22, padding: "0 14px", borderTop: `1px solid ${P.rule}`, fontFamily: BRAND_MONO, fontSize: 12, background: P.pane }}>
                <span>ROOMS {f.rooms}</span>
                <span>DOORS {f.doors}</span>
                <span>WINDOWS {f.windows}</span>
                <span>FLOOR AREA {f.floor_area_m2} m²</span>
                <span>
                  ENTRANCE <b style={{ color: P.green }}>yes</b>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      {menu > 0 ? (
        <div style={{ position: "absolute", left: 646, top: 58, width: 90, background: "#fff", border: "1px solid #b9bdc8", boxShadow: "0 6px 18px rgba(0,0,0,.16)", opacity: menu, fontSize: 14 }}>
          {["SVG", "PNG", "DXF", "TXT", "PDF"].map((o) => (
            <div key={o} style={{ padding: "4px 10px", background: o === "PDF" && t >= T.pickPdf - 0.25 ? P.blue : "transparent", color: o === "PDF" && t >= T.pickPdf - 0.25 ? "#fff" : P.ink }}>
              {o}
            </div>
          ))}
        </div>
      ) : null}
      {dl > 0 ? (
        <div style={{ position: "absolute", right: 16, top: 10, width: 300, background: "#fff", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,.22)", padding: "12px 14px", opacity: dl, transform: `translateY(${(1 - smooth(fadeIn(t, T.downloaded, 0.25))) * -12}px)`, fontFamily: '"Segoe UI", sans-serif' }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Recent downloads</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 32, borderRadius: 4, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 700, display: "grid", placeItems: "center" }}>PDF</div>
            <div>
              <div style={{ fontSize: 14 }}>floorplan.pdf</div>
              <div style={{ fontSize: 12.5, color: "#666" }}>A3 · 420 × 297 mm</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
