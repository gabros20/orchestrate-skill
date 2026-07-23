import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { MONO, SANS, Theme, ThemeName, themes } from "./theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const io = (
  frame: number,
  range: number[],
  out: number[],
): number =>
  interpolate(frame, range, out, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

// ---------- shared primitives ----------

const ContextBar: React.FC<{ t: Theme; fill: number; w?: number }> = ({
  t,
  fill,
  w = 150,
}) => {
  const color =
    fill < 0.6 ? t.good : fill < 0.85 ? t.amber : t.bad;
  return (
    <div
      style={{
        width: w,
        height: 9,
        borderRadius: 5,
        background: t.codeBg,
        border: `1px solid ${t.line}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min(fill, 1) * 100}%`,
          height: "100%",
          background: color,
        }}
      />
    </div>
  );
};

const Box: React.FC<{
  t: Theme;
  title: string;
  sub?: string;
  color?: string;
  dashed?: boolean;
  opacity?: number;
  scale?: number;
  bar?: number;
  x: number;
  y: number;
  w: number;
}> = ({ t, title, sub, color, dashed, opacity = 1, scale = 1, bar, x, y, w }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      opacity,
      scale: String(scale),
      background: t.panel,
      border: `2px ${dashed ? "dashed" : "solid"} ${color ?? t.line}`,
      borderRadius: 12,
      padding: "12px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}
  >
    <div
      style={{
        fontFamily: MONO,
        fontSize: 21,
        fontWeight: 600,
        color: color ?? t.ink,
        whiteSpace: "nowrap",
      }}
    >
      {title}
    </div>
    {sub ? (
      <div style={{ fontFamily: SANS, fontSize: 15, color: t.muted, whiteSpace: "nowrap" }}>
        {sub}
      </div>
    ) : null}
    {bar !== undefined ? <ContextBar t={t} fill={bar} /> : null}
  </div>
);

const FileChip: React.FC<{
  t: Theme;
  label: string;
  x: number;
  y: number;
  opacity?: number;
  stamp?: React.ReactNode;
}> = ({ t, label, x, y, opacity = 1, stamp }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity,
      background: t.codeBg,
      border: `1.5px solid ${t.line}`,
      borderRadius: 9,
      padding: "9px 14px",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    <span style={{ color: t.file, fontSize: 16 }}>▤</span>
    <span style={{ fontFamily: MONO, fontSize: 18, color: t.ink, whiteSpace: "nowrap" }}>
      {label}
    </span>
    {stamp}
  </div>
);

const Caption: React.FC<{ t: Theme; frame: number; from: number; to: number; children: React.ReactNode }> = ({
  t,
  frame,
  from,
  to,
  children,
}) => {
  const opacity =
    io(frame, [from, from + 12], [0, 1]) * io(frame, [to - 10, to], [1, 0]);
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 18,
        textAlign: "center",
        fontFamily: SANS,
        fontSize: 21,
        color: t.muted,
        opacity,
      }}
    >
      {children}
    </div>
  );
};

// ---------- beat 1: the problem ----------

const Problem: React.FC<{ t: Theme; frame: number }> = ({ t, frame }) => {
  const opacity = io(frame, [0, 12], [0, 1]) * io(frame, [95, 113], [1, 0]);
  if (opacity <= 0.01) return null;
  const fill = io(frame, [15, 88], [0.35, 0.97]);
  const shake = fill > 0.9 ? Math.sin(frame * 1.7) * 1.6 : 0;
  return (
    <AbsoluteFill style={{ opacity }}>
      {["refactor auth", "migrate the DB", "fix the tests", "ship the docs"].map(
        (task, i) => {
          const from = 12 + i * 14;
          const o = io(frame, [from, from + 10], [0, 1]);
          return (
            <div
              key={task}
              style={{
                position: "absolute",
                left: 318 + i * 152,
                top: io(frame, [from, from + 14], [52, 92]),
                opacity: o,
                rotate: `${(i % 2 ? 1 : -1) * 2.5}deg`,
                background: t.panel,
                border: `1.5px solid ${t.line}`,
                borderRadius: 8,
                padding: "7px 11px",
                fontFamily: MONO,
                fontSize: 14.5,
                color: t.muted,
                whiteSpace: "nowrap",
              }}
            >
              {task}
            </div>
          );
        },
      )}
      <div
        style={{
          position: "absolute",
          left: 440,
          top: 205,
          width: 320,
          translate: `${shake}px 0px`,
          background: t.panel,
          border: `2px solid ${interpolateColors(
            fill,
            [0.6, 0.97],
            [t.line, t.bad],
          )}`,
          borderRadius: 12,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 9,
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, color: t.ink }}>
          one agent
        </div>
        <div style={{ fontFamily: SANS, fontSize: 15, color: t.muted }}>
          the whole plan, one context window
        </div>
        <ContextBar t={t} fill={fill} w={276} />
        <div
          style={{
            fontFamily: MONO,
            fontSize: 14,
            color: fill > 0.85 ? t.bad : t.muted,
          }}
        >
          context {Math.round(fill * 100)}%
        </div>
      </div>
      <Caption t={t} frame={frame} from={8} to={100}>
        You hand one agent a big plan — the context fills up, quality drops.
      </Caption>
    </AbsoluteFill>
  );
};

// ---------- beats 2–5: the stage ----------

const CTL = { x: 64, y: 208, w: 250 };
const LANE = { x: 430, briefY: 118, reportY: 196, brief2Y: 296, report2Y: 374 };
const WRK = { x: 852, y1: 128, y2: 306, w: 280 };

const Stamp: React.FC<{ t: Theme; frame: number; at: number; label: string }> = ({
  t,
  frame,
  at,
  label,
}) => {
  const o = io(frame, [at, at + 8], [0, 1]);
  if (o <= 0.01) return null;
  return (
    <span
      style={{
        opacity: o,
        scale: String(io(frame, [at, at + 12], [1.5, 1])),
        fontFamily: MONO,
        fontSize: 15,
        fontWeight: 600,
        color: t.good,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};

const Stage: React.FC<{ t: Theme; frame: number }> = ({ t, frame }) => {
  const opacity = io(frame, [98, 122], [0, 1]) * io(frame, [452, 470], [1, 0]);
  if (opacity <= 0.01) return null;

  // traveling chips: brief 1 (controller → lane), report 1 (worker → lane),
  // brief 2 (controller → lane)
  const b1x = io(frame, [128, 162], [CTL.x + 40, LANE.x]);
  const b1y = io(frame, [128, 162], [CTL.y + 10, LANE.briefY]);
  const b1o = io(frame, [128, 140], [0, 1]);

  const r1x = io(frame, [202, 236], [WRK.x - 30, LANE.x]);
  const r1y = io(frame, [202, 236], [WRK.y1 + 14, LANE.reportY]);
  const r1o = io(frame, [202, 214], [0, 1]);

  const b2x = io(frame, [354, 386], [CTL.x + 40, LANE.x]);
  const b2y = io(frame, [354, 386], [CTL.y + 24, LANE.brief2Y]);
  const b2o = io(frame, [354, 366], [0, 1]);

  const w1bar = io(frame, [176, 216], [0.06, 0.52]);
  const w1ghost = io(frame, [238, 266], [1, 0.34]);

  // ledger typing
  const line1 = "✓ task 1 — spec ✓ quality ✓";
  const line2 = "· task 2 in flight";
  const l1chars = Math.round(io(frame, [326, 352], [0, line1.length]));
  const l2chars = Math.round(io(frame, [396, 416], [0, line2.length]));

  return (
    <AbsoluteFill style={{ opacity }}>
      <Box
        t={t}
        title="controller"
        sub="coordinates, never implements"
        color={t.accent}
        x={CTL.x}
        y={CTL.y}
        w={CTL.w}
        scale={io(frame, [102, 124], [0.85, 1])}
        opacity={io(frame, [102, 118], [0, 1])}
      />

      {/* worker 1 — spawns fresh, works, is discarded */}
      <Box
        t={t}
        title="worker 1"
        sub={frame < 250 ? "fresh — empty context" : "context discarded"}
        dashed={frame >= 250}
        x={WRK.x}
        y={WRK.y1}
        w={WRK.w}
        bar={w1bar}
        scale={io(frame, [150, 172], [0.85, 1])}
        opacity={io(frame, [150, 166], [0, 1]) * w1ghost}
      />

      {/* worker 2 — the second fresh mind */}
      <Box
        t={t}
        title="worker 2"
        sub="fresh — empty context"
        x={WRK.x}
        y={WRK.y2}
        w={WRK.w}
        bar={0.06}
        scale={io(frame, [372, 394], [0.85, 1])}
        opacity={io(frame, [372, 390], [0, 1])}
      />

      <FileChip t={t} label="task-1-brief.md" x={b1x} y={b1y} opacity={b1o} />
      <FileChip
        t={t}
        label="task-1-report.md"
        x={r1x}
        y={r1y}
        opacity={r1o}
        stamp={
          <>
            <Stamp t={t} frame={frame} at={272} label="spec ✓" />
            <Stamp t={t} frame={frame} at={302} label="quality ✓" />
          </>
        }
      />
      <FileChip t={t} label="task-2-brief.md" x={b2x} y={b2y} opacity={b2o} />

      {/* ledger strip */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 430,
          borderTop: `2px dashed ${t.line}`,
          paddingTop: 10,
          fontFamily: MONO,
          fontSize: 17,
          color: t.muted,
          display: "flex",
          gap: 26,
          opacity: io(frame, [112, 130], [0, 1]),
        }}
      >
        <span style={{ color: t.accent, fontWeight: 600 }}>progress.md</span>
        <span style={{ color: t.good }}>{line1.slice(0, l1chars)}</span>
        <span>{line2.slice(0, l2chars)}</span>
      </div>

      <Caption t={t} frame={frame} from={118} to={190}>
        A <b style={{ color: t.ink }}>controller</b> coordinates. It writes a brief file; a fresh worker takes the task.
      </Caption>
      <Caption t={t} frame={frame} from={196} to={264}>
        The worker reports — then it is <b style={{ color: t.ink }}>thrown away</b>. The files stay.
      </Caption>
      <Caption t={t} frame={frame} from={270} to={348}>
        Two gates in fixed order — spec, then quality — then one ledger line.
      </Caption>
      <Caption t={t} frame={frame} from={356} to={442}>
        Every task gets a <b style={{ color: t.ink }}>fresh mind</b>. The run lives on disk.
      </Caption>
    </AbsoluteFill>
  );
};

// ---------- shared header for the added beats ----------

const BeatHead: React.FC<{ t: Theme; frame: number; from: number; kicker: string; title: string }> = ({
  t,
  frame,
  from,
  kicker,
  title,
}) => (
  <div style={{ position: "absolute", top: 26, left: 0, right: 0, textAlign: "center", opacity: io(frame, [from, from + 16], [0, 1]) }}>
    <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 600, fontSize: 15, color: t.accent }}>
      {kicker}
    </div>
    <div style={{ fontFamily: MONO, fontSize: 26, color: t.ink, marginTop: 6, letterSpacing: "-0.01em" }}>{title}</div>
  </div>
);

// ---------- beat 3: nine strategies (the option space) ----------

const STRATS: [string, string][] = [
  ["staged", "sequential tasks · dual review"],
  ["parallel", "concurrent · isolated worktrees"],
  ["hierarchical", "domain sub-orchestrators"],
  ["team", "workers message & debate"],
  ["workflow", "deterministic script fan-out"],
  ["loop", "repeat until goal / schedule"],
  ["advisor", "costly reasoning ↔ cheap exec"],
  ["adversarial", "challenge the plan first"],
  ["xcli", "external coding CLIs as workers"],
];

const Strategies: React.FC<{ t: Theme; frame: number }> = ({ t, frame }) => {
  const S = 470;
  const opacity = io(frame, [S, S + 18], [0, 1]) * io(frame, [720, 740], [1, 0]);
  if (opacity <= 0.01) return null;
  return (
    <AbsoluteFill style={{ opacity }}>
      <BeatHead t={t} frame={frame} from={S} kicker="one mechanic · nine strategies" title="pick the shape the work needs" />
      {STRATS.map(([name, desc], i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const from = S + 20 + i * 8;
        const o = io(frame, [from, from + 12], [0, 1]);
        const seen = name === "staged";
        const isXcli = name === "xcli";
        const edge = seen || isXcli ? t.accent : t.line;
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: 80 + col * 356,
              top: 122 + row * 118,
              width: 332,
              height: 96,
              opacity: o,
              scale: String(io(frame, [from, from + 12], [0.92, 1])),
              background: t.panel,
              border: `1.5px solid ${edge}`,
              borderRadius: 12,
              padding: "14px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: seen || isXcli ? t.accent : t.ink }}>{name}</span>
              {seen ? (
                <span style={{ fontFamily: SANS, fontSize: 12, color: t.muted, border: `1px solid ${t.line}`, borderRadius: 20, padding: "1px 9px" }}>just saw</span>
              ) : null}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 15, color: t.muted, whiteSpace: "nowrap" }}>{desc}</div>
          </div>
        );
      })}
      <Caption t={t} frame={frame} from={S + 34} to={738}>
        <b style={{ color: t.ink }}>staged</b> is one of nine — same controller, different topology.
      </Caption>
    </AbsoluteFill>
  );
};

// ---------- beat 4: compose the run (the dimensions) ----------

const KNOBS: [string, string][] = [
  ["review", "off · spec · quality · dual · panel:N · consensus:N"],
  ["models", "pin a tier per role — never inherit a default"],
  ["isolation", "worktree · branch — parallel writers never collide"],
  ["trigger", "once · goal · interval · schedule"],
  ["budget", "cap cycles · agents · tokens · open PRs"],
];

const Dimensions: React.FC<{ t: Theme; frame: number }> = ({ t, frame }) => {
  const S = 744;
  const opacity = io(frame, [S, S + 18], [0, 1]) * io(frame, [980, 1000], [1, 0]);
  if (opacity <= 0.01) return null;
  const cmdOp = io(frame, [S + 14, S + 34], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity }}>
      <BeatHead t={t} frame={frame} from={S} kicker="one invocation · every knob" title="compose the run" />
      <div
        style={{
          position: "absolute",
          top: 104,
          left: 80,
          right: 80,
          background: t.codeBg,
          border: `1px solid ${t.line}`,
          borderRadius: 10,
          padding: "13px 18px",
          fontFamily: MONO,
          fontSize: 18,
          opacity: cmdOp,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <span style={{ color: t.accent, fontWeight: 600 }}>/orchestrate</span>
        <span style={{ color: t.ink }}> plan.md </span>
        <span style={{ color: t.muted }}>strategy=</span>
        <span style={{ color: t.ink }}>parallel </span>
        <span style={{ color: t.muted }}>review=</span>
        <span style={{ color: t.ink }}>panel:3 </span>
        <span style={{ color: t.muted }}>isolation=</span>
        <span style={{ color: t.ink }}>worktree</span>
      </div>
      {KNOBS.map(([k, v], i) => {
        const from = S + 40 + i * 8;
        const o = io(frame, [from, from + 12], [0, 1]);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              top: 182 + i * 54,
              opacity: o,
              translate: `${io(frame, [from, from + 12], [-14, 0])}px 0`,
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600, color: t.accent, width: 120 }}>{k}</div>
            <div style={{ fontFamily: SANS, fontSize: 17, color: t.muted }}>{v}</div>
          </div>
        );
      })}
      <Caption t={t} frame={frame} from={S + 40} to={998}>
        Typed gates in fixed order · a model pinned per dispatch · caps on every loop.
      </Caption>
    </AbsoluteFill>
  );
};

// ---------- beat 5: external CLIs (xcli) ----------

const ENGINES = ["codex", "grok", "cursor", "agy", "opencode", "hermes", "kimi"];

const Xcli: React.FC<{ t: Theme; frame: number }> = ({ t, frame }) => {
  const S = 1004;
  const opacity = io(frame, [S, S + 18], [0, 1]) * io(frame, [1270, 1292], [1, 0]);
  if (opacity <= 0.01) return null;
  const panelOp = io(frame, [S + 20, S + 40], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity }}>
      <BeatHead t={t} frame={frame} from={S} kicker="workers · not just claude" title="external CLIs, first-class" />
      <Box
        t={t}
        title="controller"
        sub="pins an engine per dispatch"
        color={t.accent}
        x={72}
        y={214}
        w={244}
        opacity={io(frame, [S + 12, S + 30], [0, 1])}
        scale={io(frame, [S + 12, S + 30], [0.9, 1])}
      />
      <div style={{ position: "absolute", left: 330, top: 246, fontFamily: MONO, fontSize: 34, color: t.accent, opacity: io(frame, [S + 26, S + 46], [0, 1]) }}>→</div>
      <div
        style={{
          position: "absolute",
          left: 400,
          top: 112,
          right: 72,
          height: 300,
          background: t.panel,
          border: `1.5px solid ${t.line}`,
          borderRadius: 14,
          padding: "18px 22px",
          opacity: panelOp,
        }}
      >
        <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontSize: 13, color: t.muted, marginBottom: 16 }}>
          external coding CLIs · each in its own worktree
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {ENGINES.map((e, i) => {
            const from = S + 26 + i * 9;
            const o = io(frame, [from, from + 12], [0, 1]);
            return (
              <div
                key={e}
                style={{
                  opacity: o,
                  scale: String(io(frame, [from, from + 12], [0.85, 1])),
                  fontFamily: MONO,
                  fontSize: 19,
                  color: t.ink,
                  background: t.codeBg,
                  border: `1.5px dashed ${t.accent}`,
                  borderRadius: 9,
                  padding: "9px 15px",
                }}
              >
                {e}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 14, opacity: io(frame, [S + 120, S + 140], [0, 1]) }}>
          <span style={{ fontFamily: MONO, fontSize: 17, color: t.good, fontWeight: 600 }}>→ results captured</span>
          <span style={{ fontFamily: MONO, fontSize: 16, color: t.ink, background: t.codeBg, border: `1px solid ${t.line}`, borderRadius: 8, padding: "6px 12px" }}>
            <span style={{ color: t.file }}>▤</span> run/ on disk
          </span>
          <span style={{ fontFamily: SANS, fontSize: 15, color: t.muted }}>· as workers, peers, or a second opinion</span>
        </div>
      </div>
      <Caption t={t} frame={frame} from={S + 40} to={1290}>
        Workers don&rsquo;t have to be Claude — dispatch <b style={{ color: t.ink }}>any coding CLI</b>, each sandboxed, results captured.
      </Caption>
    </AbsoluteFill>
  );
};

// ---------- beat 6: close ----------

const Close: React.FC<{ t: Theme; frame: number }> = ({ t, frame }) => {
  const S = 1296;
  const opacity = io(frame, [S, S + 20], [0, 1]) * io(frame, [1420, 1440], [1, 0]);
  if (opacity <= 0.01) return null;
  return (
    <AbsoluteFill style={{ opacity, alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 36, color: t.ink, letterSpacing: "-0.01em" }}>coordinate — don&rsquo;t implement</div>
        <div style={{ fontFamily: SANS, fontSize: 20, color: t.muted, marginTop: 16, maxWidth: 860 }}>
          the controller dispatches; fresh agents work; every run is a folder you can read.
        </div>
        <div style={{ fontFamily: MONO, fontSize: 16, color: t.accent, marginTop: 24, opacity: io(frame, [S + 30, S + 52], [0, 1]) }}>
          $orchestrate&nbsp;&nbsp;·&nbsp;&nbsp;/orchestrate&nbsp;&nbsp;·&nbsp;&nbsp;@orchestrate
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- composition ----------

// Reader-first pacing: each beat animates in, HOLDS long enough to read, then fades out before the
// next begins. Beats 1–2 (Problem, Stage) are the original life-of-a-task; 3–6 enrich it with the
// strategy space, the dimension knobs, external-CLI workers, and a close. 48s, loops.
//   B1 problem      0–113
//   B2 stage        98–470     (the staged strategy — the poster beat)
//   B3 strategies   470–740    nine strategies
//   B4 dimensions   744–1000   compose the run
//   B5 xcli         1004–1292  external CLIs, first-class
//   B6 close        1296–1440
export const LifeOfATask: React.FC<{ theme: ThemeName }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const t = themes[theme];
  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <Problem t={t} frame={frame} />
      <Stage t={t} frame={frame} />
      <Strategies t={t} frame={frame} />
      <Dimensions t={t} frame={frame} />
      <Xcli t={t} frame={frame} />
      <Close t={t} frame={frame} />
    </AbsoluteFill>
  );
};
