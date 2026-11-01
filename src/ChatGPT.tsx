// A replica of the ChatGPT pages at the 1280 px width they were measured at. State comes in as `t`.
import React from "react";
import { FILM, REAL } from "./copy";
import facts from "./facts.json";
import { LAYERS, mixView, Plan, sheetView, type View } from "./Plan";
import { bar, BEAT, fadeIn, lerp, outCubic, prog, smooth, within } from "./time";
import { T, typedAt } from "./timeline";
import { C, Code, Icon, Icons, Logo, MONO, Pill, SANS, stream } from "./ui";

export const PAGE_W = 1280;
export const PAGE_H = 640;

const Rise: React.FC<{ t: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, at, children, style }) => {
  if (t < at) return null;
  const k = outCubic(prog(t, at, at + 0.3));
  return <div style={{ opacity: k, transform: `translateY(${(1 - k) * 8}px)`, ...style }}>{children}</div>;
};

const NAV: Array<[keyof typeof Icons, string]> = [
  ["pencil", "New chat"],
  ["images", "Images"],
  ["clock", "Scheduled"],
  ["library", "Library"],
  ["at", "Plugins"],
  ["term", "Codex"],
  ["dots", "Explore"],
];

export const Sidebar: React.FC<{ active?: string; recent?: string }> = ({ active, recent }) => (
  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 240, background: C.sidebar, borderRight: `1px solid ${C.rule}`, fontSize: 14 }}>
    <div style={{ position: "absolute", left: 16, top: 12, fontSize: 19, fontWeight: 600, letterSpacing: -0.3 }}>ChatGPT</div>
    <div style={{ position: "absolute", left: 160, top: 16, color: C.soft }}>
      <Icon n="search" s={18} />
    </div>
    <div style={{ position: "absolute", left: 204, top: 16, color: C.soft }}>
      <Icon n="panel" s={18} />
    </div>
    <div style={{ position: "absolute", top: 58, left: 6, right: 6 }}>
      {NAV.map(([n, l]) => (
        <div key={l} style={{ height: 36, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", borderRadius: 10, background: active === l ? "#ececec" : "transparent", fontWeight: active === l ? 500 : 400 }}>
          <Icon n={n} s={18} />
          {l}
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", top: 342, left: 16, color: C.faint }}>Projects</div>
    <div style={{ position: "absolute", top: 382, left: 16, color: "#aaa" }}>No projects</div>
    <div style={{ position: "absolute", top: 438, left: 16, color: C.faint }}>Recents</div>
    <div style={{ position: "absolute", top: 468, left: 6, right: 14, height: 36, display: "flex", alignItems: "center", padding: "0 10px", borderRadius: 10, background: recent ? "#ececec" : "transparent" }}>
      {recent ?? "Registry Check Results"}
    </div>
    <div style={{ position: "absolute", left: 14, bottom: 22, display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ width: 24, height: 24, borderRadius: 12, background: "#f5c518", color: "#7a5c00", fontSize: 10, display: "grid", placeItems: "center" }}>CH</div>
      <div style={{ lineHeight: "17px" }}>
        Chan
        <div style={{ fontSize: 12.5, color: C.soft }}>Free</div>
      </div>
    </div>
  </div>
);

export const Listing: React.FC<{ t: number }> = ({ t }) => {
  const hot = within(t, T.clickStarter - 0.9, T.toHome, 0.12);
  return (
    <>
      <Sidebar active="Plugins" />
      <div style={{ position: "absolute", left: 240, right: 0, top: 0, bottom: 0, background: C.page }}>
        <div style={{ position: "absolute", left: 28, top: 15, fontSize: 14, color: C.soft }}>
          Plugins <span style={{ margin: "0 8px" }}>›</span> <span style={{ color: C.ink }}>ArchLang</span>
        </div>
        <div style={{ position: "absolute", left: 155, top: 70, width: 720 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 60, height: 60, borderRadius: 14, border: `1px solid ${C.rule}`, display: "grid", placeItems: "center", background: "#fff" }}>
              <Logo s={42} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, lineHeight: "28px" }}>ArchLang</div>
              <div style={{ fontSize: 14, color: C.soft }}>
                {REAL.byline} • {REAL.shortDescription}
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
              <Icon n="dots" s={20} w={2.6} />
              <div style={{ background: "#f0f0f0", borderRadius: 18, height: 36, padding: "0 14px", display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                <Icon n="gear" s={16} /> Manage
              </div>
              <div style={{ background: C.ink, color: "#fff", borderRadius: 18, height: 36, padding: "0 14px", display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                <Icon n="link" s={16} /> Try in chat
              </div>
            </div>
          </div>
          <div style={{ marginTop: 22, height: 288, borderRadius: 18, background: "radial-gradient(90% 120% at 12% 10%, #bcd3fb 0%, transparent 60%), radial-gradient(90% 120% at 88% 90%, #e2d2fb 0%, transparent 60%), radial-gradient(60% 80% at 60% 40%, #f4eefe 0%, #d9e3fb 100%)", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            {REAL.starters.map((s, i) => (
              <div key={s} style={{ width: 490, borderRadius: 16, background: `rgba(255,255,255,${i === 0 ? 0.62 + 0.3 * hot : 0.62})`, boxShadow: i === 0 && hot > 0 ? `0 4px ${18 * hot}px rgba(70,60,160,${0.28 * hot})` : "none", padding: "8px 44px 8px 14px", fontSize: 15, lineHeight: "23px", position: "relative", transform: `scale(${i === 0 ? 1 + 0.012 * hot : 1})` }}>
                <Logo s={13} /> <span style={{ color: "#3a4a9c", fontWeight: 500 }}>ArchLang</span> {s}
                <div style={{ position: "absolute", right: 10, top: "50%", marginTop: -13, width: 26, height: 26, borderRadius: 13, background: "#eeeef3", display: "grid", placeItems: "center" }}>
                  <Icon n="arrowRight" s={14} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, fontSize: 15, lineHeight: "24px", color: C.ink }}>{REAL.about}</div>
        </div>
      </div>
    </>
  );
};

const Composer: React.FC<{ value?: string; chip?: boolean; style?: React.CSSProperties; tall?: boolean; ready?: boolean }> = ({ value, chip, style, tall, ready }) => (
  <div style={{ position: "absolute", width: 768, background: "#fff", borderRadius: 28, boxShadow: "0 2px 12px rgba(0,0,0,.07), 0 0 0 1px rgba(0,0,0,.03)", ...style }}>
    <div style={{ position: "relative", minHeight: tall ? 125 : 52 }}>
      {tall ? (
        <div style={{ position: "absolute", left: 20, top: 14, right: 20, fontSize: 16, lineHeight: "25px" }}>
          {chip ? (
            <>
              <Logo s={13} /> <span style={{ color: C.link }}>ArchLang</span>{" "}
            </>
          ) : null}
          {value}
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", left: 16, top: 14, color: C.ink }}>
            <Icon n="plus" s={22} w={1.6} />
          </div>
          <div style={{ position: "absolute", left: 52, top: 14, right: 180, fontSize: 16, lineHeight: "24px", whiteSpace: "nowrap", overflow: "hidden", color: value ? C.ink : C.faint }}>{value || "Ask ChatGPT"}</div>
        </>
      )}
      {tall ? (
        <div style={{ position: "absolute", left: 16, bottom: 14 }}>
          <Icon n="plus" s={22} w={1.6} />
        </div>
      ) : null}
      <div style={{ position: "absolute", right: 88, bottom: 9, height: 34, borderRadius: 17, background: "#e7eef8", color: "#2b5b9e", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16 }}>Think</div>
      <div style={{ position: "absolute", right: 56, bottom: 16 }}>
        <Icon n="mic" s={20} />
      </div>
      <div style={{ position: "absolute", right: 8, bottom: 8, width: 36, height: 36, borderRadius: 18, background: C.blue, display: "grid", placeItems: "center", opacity: ready === false ? 0.9 : 1 }}>
        <Icon n="arrowUp" s={18} c="#fff" w={2.2} />
      </div>
    </div>
  </div>
);

export const Home: React.FC = () => (
  <>
    <Sidebar active="New chat" />
    <div style={{ position: "absolute", left: 240, right: 0, top: 0, bottom: 0, background: C.page }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 186, textAlign: "center", fontSize: 26, fontWeight: 500 }}>{REAL.home}</div>
      <Composer tall chip value={REAL.starters[0]} style={{ left: 136, top: 256 }} />
    </div>
  </>
);

const Bubble: React.FC<{ text: string; chip?: boolean }> = ({ text, chip }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 26 }}>
    <div style={{ maxWidth: 540, background: C.bubble, color: C.bubbleInk, borderRadius: 22, padding: "10px 16px", fontSize: 16, lineHeight: "26px" }}>
      {chip ? (
        <>
          <Logo s={13} /> <span style={{ color: C.link }}>ArchLang</span>{" "}
        </>
      ) : null}
      {text}
    </div>
  </div>
);

const Shimmer: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => {
  const x = ((t * 0.8) % 1) * 240 - 40;
  return (
    <span style={{ backgroundImage: `linear-gradient(100deg, ${C.faint} ${x - 30}%, #d8d8d8 ${x}%, ${C.faint} ${x + 30}%)`, WebkitBackgroundClip: "text", color: "transparent" }}>{children}</span>
  );
};

const Activity: React.FC<{ text: string; live?: boolean; t: number }> = ({ text, live, t }) => (
  <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 15, lineHeight: "30px", color: C.soft }}>
    <Icon n="at" s={15} />
    {live ? <Shimmer t={t}>{text}</Shimmer> : text}
  </div>
);

const P: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 16, lineHeight: "26px", marginBottom: 14, ...style }}>{children}</div>
);

const PLAN_VIEW: View = { x: -1900, y: -1500, w: 13300, h: 11100 };

/** The MCP App card, with its own +/−/Fit. */
const Card: React.FC<{ t: number }> = ({ t }) => {
  const reveal = Object.fromEntries(LAYERS.map((l) => [l, prog(t, T.layers[l], T.layers[l] + (l === "A-WALL" ? 1.2 : 0.8))]));
  const z1 = smooth(prog(t, T.zoomClick[0], T.zoomClick[0] + 0.35));
  const z2 = smooth(prog(t, T.zoomClick[1], T.zoomClick[1] + 0.35));
  const out = smooth(prog(t, T.fitClick, T.fitClick + 0.4));
  const fit: View = { ...sheetView("76") };
  const near = mixView(fit, PLAN_VIEW, 0.62 * z1 + 0.38 * z2);
  const view = mixView(near, fit, out);
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px 12px", background: "#fff", marginBottom: 16 }}>
      <div style={{ fontSize: 14, color: C.soft, marginBottom: 8 }}>{REAL.dragHint}</div>
      <div style={{ position: "relative", height: 410, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", background: "#fff" }}>
        <Plan id="76" view={view} width={742} height={408} reveal={reveal} scope="cardA" />
        <div style={{ position: "absolute", right: 8, top: 8, display: "flex", gap: 6 }}>
          {["+", "−", "Fit"].map((b) => (
            <div key={b} style={{ minWidth: 30, height: 30, padding: "0 7px", boxSizing: "border-box", border: `1px solid ${C.border}`, borderRadius: 6, background: "#fff", fontSize: 14, display: "grid", placeItems: "center" }}>
              {b}
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, margin: "10px 0 2px" }}>Lint findings</div>
      <div style={{ fontSize: 14 }}>• None.</div>
    </div>
  );
};

const Stat: React.FC<{ value: string; label: string; green?: boolean; big?: boolean }> = ({ value, label, green, big }) => (
  <div>
    <div style={{ fontSize: big ? 26 : 22, fontWeight: 700, color: green ? "#0d9e4f" : C.ink, lineHeight: "32px" }}>{value}</div>
    <div style={{ fontSize: 15, color: big ? C.ink : C.soft, fontWeight: big ? 600 : 400, lineHeight: "30px" }}>{label}</div>
  </div>
);

const count = (to: number, k: number, unit = " m²", dp = 2): string => `${(to * outCubic(k)).toFixed(dp)}${unit}`;

const Stats: React.FC<{ t: number }> = ({ t }) => {
  const f = facts["76"].totals;
  const k = prog(t, T.completed + 0.3, T.completed + 1.3);
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px", marginBottom: 18, background: "#fff" }}>
      <Stat big green value={count(f.gross_internal_area_m2, k)} label="Gross internal area" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginTop: 4 }}>
        <Stat value={count(f.net_floor_area_m2, k)} label="Net usable floor area" />
        <Stat value={count(f.floor_area_m2, k, " m²", 1)} label="Sum of room centreline areas" />
        <Stat value={String(Math.round(f.rooms * outCubic(k)))} label="Rooms" />
        <Stat value={String(Math.round(f.windows * outCubic(k)))} label="Windows" />
      </div>
    </div>
  );
};

const H: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ fontSize: 18, fontWeight: 650, lineHeight: "28px", margin: "6px 0 10px" }}>{children}</div>;

const Checks: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ marginBottom: 12 }}>
    <H>{REAL.checksTitle}</H>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, padding: "6px 0", borderBottom: `1px solid ${C.rule}` }}>
      <span>Check</span>
      <span style={{ width: 166 }}>Result</span>
    </div>
    {REAL.checks.map((c, i) => {
      const on = t >= T.checkHits[i];
      const k = outCubic(prog(t, T.checkHits[i], T.checkHits[i] + 0.2));
      return (
        <div key={c} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, height: 38, borderBottom: `1px solid ${C.rule}` }}>
          <span>{c}</span>
          <span style={{ width: 166 }}>{on ? <Pill style={{ transform: `scale(${0.7 + 0.3 * k})`, opacity: k }}>Passed</Pill> : null}</span>
        </div>
      );
    })}
  </div>
);

const Scroll: React.FC<{ y: number; children: React.ReactNode }> = ({ y, children }) => (
  <div style={{ position: "absolute", left: 376 - 240, top: 62, width: 768, transform: `translateY(${-y}px)` }}>{children}</div>
);

const ChatFrame: React.FC<{ t: number; title?: string; composer?: string; children: React.ReactNode }> = ({ title, composer, children }) => (
  <>
    <Sidebar recent={title} />
    <div style={{ position: "absolute", left: 240, right: 0, top: 0, bottom: 0, background: C.page, overflow: "hidden" }}>
      {children}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 52, background: "linear-gradient(#fcfcfc 75%, rgba(252,252,252,0))" }}>
        <div style={{ position: "absolute", right: 22, top: 15, display: "flex", gap: 6, alignItems: "center", fontSize: 15 }}>
          <Icon n="share" s={17} /> Share
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 92, background: "linear-gradient(rgba(252,252,252,0), #fcfcfc 30%)" }} />
      <Composer value={composer} style={{ left: 136, bottom: 24 }} />
    </div>
  </>
);

export const ChatA: React.FC<{ t: number }> = ({ t }) => {
  const done = t >= T.drop;
  const beforeScroll = smooth(prog(t, bar(9, 2), bar(10, 3)));
  const y = done
    ? lerp(lerp(lerp(70, 780, smooth(prog(t, T.completed - 0.2, T.completed + 0.5))), 1040, smooth(prog(t, T.checksScroll - 0.3, T.checksScroll + 0.3))), 1040, 0)
    : 150 * beforeScroll;
  return (
    <ChatFrame t={t} title="Design ArchLang Flat" composer={typedAt(t, 0)}>
      <Scroll y={y}>
        <Bubble chip text={REAL.starters[0]} />
        {!done ? (
          <>
            {t < T.planLine ? (
              <div style={{ fontSize: 16 }}>
                <Shimmer t={t}>Thinking</Shimmer>
              </div>
            ) : null}
            {t >= T.planLine ? <P>{stream(REAL.plan, prog(t, T.planLine, T.planLine + 1.1))}</P> : null}
            {REAL.activityA.map((a, i) => (
              <Rise key={a} t={t} at={T.activity[i]}>
                <Activity t={t} text={a} live={t < (T.activity[i + 1] ?? T.firstDraft)} />
              </Rise>
            ))}
            {t >= T.firstDraft ? <P style={{ marginTop: 12 }}>{stream(REAL.firstDraft, prog(t, T.firstDraft, T.firstDraft + 0.5))}</P> : null}
            {t >= T.accessGraph ? <P>{stream(REAL.accessGraph, prog(t, T.accessGraph, T.accessGraph + 0.9))}</P> : null}
            {t >= T.strictFlag ? <P>{stream(REAL.strictFlag, prog(t, T.strictFlag, T.strictFlag + 0.8))}</P> : null}
            {REAL.activityB.map((a, i) => (
              <Rise key={a} t={t} at={T.activityB[i]}>
                <Activity t={t} text={a} live={t < (T.activityB[i + 1] ?? T.drop)} />
              </Rise>
            ))}
          </>
        ) : (
          <>
            <div style={{ fontSize: 16, color: C.soft, borderBottom: `1px solid ${C.rule}`, paddingBottom: 6, marginBottom: 12 }}>{REAL.worked} ›</div>
            <div style={{ fontSize: 16, color: C.faint, marginBottom: 8 }}>
              <Logo s={13} /> {REAL.opened}
            </div>
            <Card t={t} />
            <H>{REAL.completed}</H>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              <Pill>{REAL.strictPassed}</Pill>
              <Pill>{REAL.zeroLint}</Pill>
            </div>
            <Stats t={t} />
            <Checks t={t} />
            <Rise t={t} at={T.finalCheck}>
              <P>
                {REAL.finalCheckA} <Code>validate --strict</Code> {REAL.finalCheckB} <Code>ok: true</Code>
                {REAL.finalCheckC}
              </P>
            </Rise>
          </>
        )}
      </Scroll>
    </ChatFrame>
  );
};

const Compare: React.FC<{ t: number }> = ({ t }) => {
  const b = facts["76"];
  const a = facts["80"];
  const room = (f: typeof a) => f.rooms.find((r) => r.id === "bed1")!;
  const n = (x: number) => x.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
  const rows: Array<[string, string, string]> = [
    ["Bedroom 1 area", `${n(room(b).area_m2)} m²`, `${n(room(a).area_m2)} m²`],
    ["Bedroom 1 net area", `${n(room(b).net_area_m2)} m²`, `${n(room(a).net_area_m2)} m²`],
    ["Total room area", `${n(b.totals.floor_area_m2)} m²`, `${n(a.totals.floor_area_m2)} m²`],
    ["Gross internal area", `${n(b.totals.gross_internal_area_m2)} m²`, `${n(a.totals.gross_internal_area_m2)} m²`],
    ["Net floor area", `${n(b.totals.net_floor_area_m2)} m²`, `${n(a.totals.net_floor_area_m2)} m²`],
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px", fontSize: 14, fontWeight: 600, padding: "6px 0", borderBottom: `1px solid ${C.rule}`, textAlign: "right" }}>
        <span style={{ textAlign: "left" }}>Measurement</span>
        <span>Before</span>
        <span>After</span>
      </div>
      {rows.map(([l, x, y], i) => {
        const on = T.table + i * BEAT * 0.5;
        const k = fadeIn(t, on, 0.2);
        return (
          <div key={l} style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px", alignItems: "center", fontSize: 14, height: 34, borderBottom: `1px solid ${C.rule}`, textAlign: "right", opacity: 0.25 + 0.75 * k }}>
            <span style={{ textAlign: "left" }}>{l}</span>
            <span style={{ color: C.soft }}>{x}</span>
            <span style={{ fontWeight: 600, color: i < 2 ? C.pillInk : C.ink }}>{k > 0 ? y : ""}</span>
          </div>
        );
      })}
    </div>
  );
};

export const ChatB: React.FC<{ t: number }> = ({ t }) => {
  const morph = smooth(prog(t, T.morph, T.morph + 0.6));
  const view: View = { x: -1700, y: -1450, w: 14600, h: 11000 };
  const y = 8 + 118 * smooth(prog(t, T.diff - 0.5, T.diff)) + 430 * smooth(prog(t, T.table - 0.7, T.table - 0.1));
  return (
    <ChatFrame t={t} title="Design ArchLang Flat" composer={t >= T.sendC ? "" : typedAt(t, 1)}>
      <Scroll y={y}>
        <Bubble text={REAL.starters[1]} />
        {t < T.modified ? (
          <div style={{ fontSize: 16 }}>
            <Shimmer t={t}>Thinking</Shimmer>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 16, color: C.soft, borderBottom: `1px solid ${C.rule}`, paddingBottom: 6, marginBottom: 12 }}>Worked for 54s ›</div>
            <Rise t={t} at={T.modified}>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, position: "relative", height: 300, overflow: "hidden", background: "#fff", marginBottom: 10 }}>
                <Plan id="76" view={view} width={766} height={298} scope="b76" opacity={1 - morph} />
                <Plan id="80" view={view} width={766} height={298} scope="b80" opacity={morph} />
                {t >= T.morph ? (
                  <div style={{ position: "absolute", right: 66, top: 18, opacity: within(t, T.morph + 0.2, T.table, 0.25) }}>
                    <Pill style={{ background: C.plum, color: "#fff", fontSize: 14 }}>+1,000 mm</Pill>
                  </div>
                ) : null}
              </div>
            </Rise>
            <Rise t={t} at={T.modified + 0.25}>
              <Pill>{REAL.modified}</Pill>
            </Rise>
            <Rise t={t} at={T.diff}>
              <div style={{ background: "#e6e6e6", borderRadius: 22, padding: "12px 20px", margin: "12px 0", fontFamily: MONO, fontSize: 12.5, lineHeight: "20px" }}>
                <div style={{ fontFamily: SANS, fontSize: 15, marginBottom: 6 }}>Diff</div>
                <div style={{ color: "#b3261e" }}>- {REAL.diffMinus}</div>
                <div style={{ color: "#1a7f37", background: `rgba(26,127,55,${0.14 * fadeIn(t, T.diff + 0.5)})` }}>+ {REAL.diffPlus}</div>
              </div>
            </Rise>
            <Rise t={t} at={T.diff + 0.4}>
              <P>
                I widened <b>Bedroom 1</b> {REAL.widened}
              </P>
            </Rise>
            <div style={{ height: 8 }} />
            <Compare t={t} />
            <Rise t={t} at={T.table + 1.8}>
              <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
                <Pill>ArchLang strict validation: PASSED</Pill>
                <Pill>Residential lint: 0 warnings</Pill>
              </div>
            </Rise>
          </>
        )}
      </Scroll>
    </ChatFrame>
  );
};

export const ChatC: React.FC<{ t: number }> = ({ t }) => {
  const y = 8 + 220 * smooth(prog(t, T.card - 0.5, T.card));
  const press = within(t, T.clickPdf - 0.1, T.clickPdf + 0.12, 0.05);
  return (
    <ChatFrame t={t} title="Download A3 PDF">
      <Scroll y={y}>
        <Bubble text={REAL.starters[2]} />
        {t < T.tight ? (
          <div style={{ fontSize: 16 }}>
            <Shimmer t={t}>Thinking</Shimmer>
          </div>
        ) : (
          <>
            <P>
              {REAL.a3Tight} <Pill red>W_SCALE_OVERFLOW</Pill> warning.
            </P>
            <Rise t={t} at={T.next}>
              <P>{REAL.a3Next}</P>
            </Rise>
            <Rise t={t} at={T.verified}>
              <div style={{ marginBottom: 12 }}>
                <Pill>{REAL.a3Verified}</Pill>
              </div>
              <P>{REAL.a3Ready}</P>
              <div style={{ fontSize: 16, lineHeight: "26px", marginBottom: 12, paddingLeft: 16 }}>
                • {REAL.a3Checks}
                <br />• {REAL.a3Fit}
              </div>
            </Rise>
            <Rise t={t} at={T.card}>
              <H>{REAL.downloadTitle}</H>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 20, height: 22, borderRadius: 4, background: "#ef4444", color: "#fff", fontSize: 7, fontWeight: 700, display: "grid", placeItems: "center" }}>PDF</div>
                  <div style={{ fontSize: 17, fontWeight: 650 }}>{REAL.pdfCard}</div>
                  <Pill style={{ marginLeft: "auto" }}>Ready</Pill>
                </div>
                <div style={{ height: 36, borderRadius: 18, background: C.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 16, transform: `scale(${1 - 0.015 * press})` }}>
                  <Icon n="down" s={17} c="#fff" /> {REAL.pdfButton}
                </div>
                <div style={{ fontSize: 13, color: C.soft, lineHeight: "17px", marginTop: 8 }}>{REAL.pdfHint}</div>
              </div>
            </Rise>
          </>
        )}
      </Scroll>
    </ChatFrame>
  );
};

export { FILM };
