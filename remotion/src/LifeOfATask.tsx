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

// ---------- beat 2: the flight plan (no silent launch) ----------

// Every line here is the shape shared-flight-plan.md specifies: a header with the triage why, one
// node per agent carrying `model @ effort` and isolation, gates as children, the final gate last,
// then the gates / rails / budget / tweak footer strips.
const PLAN_TREE: [string, string, string][] = [
  ["staged  ×2 tasks", "plan.md · independent, suite verifies", ""],
  ["├─ implementer", "task N · shared tree", "sonnet @ high"],
  ["    ├─ spec gate", "did it build what was asked", "sonnet @ medium"],
  ["    └─ quality gate", "runs only after spec ✓", "opus @ high"],
  ["└─ final gate", "whole branch vs the stated goal", "opus @ high"],
];

const PLAN_STRIPS: [string, string][] = [
  ["gates", "spec → quality per task · final-deliverable gate at finish"],
  ["rails", "branch first · PR cap 1 · never a duplicate agent on overload"],
  ["budget", "7 agents · token range from the 15× multi-agent multiplier"],
  ["tweak", "[1] strategy  [2] models  [3] effort  [4] engine  [5] review  [6] isolation"],
];

const FlightPlan: React.FC<{ t: Theme; frame: number }> = ({ t, frame }) => {
  const S = 108;
  const opacity = io(frame, [S, S + 18], [0, 1]) * io(frame, [S + 242, S + 260], [1, 0]);
  if (opacity <= 0.01) return null;

  const panelOp = io(frame, [S + 10, S + 26], [0, 1]);
  const tickO = io(frame, [S + 168, S + 178], [0, 1]);
  const tickScale = io(frame, [S + 168, S + 184], [1.6, 1]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <BeatHead t={t} frame={frame} from={S} kicker="no silent launch" title="the flight plan" />
      <div
        style={{
          position: "absolute",
          top: 96,
          left: 80,
          right: 80,
          background: t.codeBg,
          border: `1.5px solid ${t.line}`,
          borderRadius: 12,
          padding: "14px 22px 16px",
          opacity: panelOp,
        }}
      >
        {PLAN_TREE.map(([node, note, pin], i) => {
          const from = S + 24 + i * 11;
          const o = io(frame, [from, from + 13], [0, 1]);
          const head = i === 0;
          return (
            <div
              key={node}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                height: 27,
                opacity: o,
                translate: `${io(frame, [from, from + 13], [-10, 0])}px 0`,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 17,
                  fontWeight: head ? 600 : 400,
                  color: head ? t.accent : t.ink,
                  width: 230,
                  whiteSpace: "pre",
                }}
              >
                {node}
              </span>
              <span style={{ fontFamily: SANS, fontSize: 15, color: t.muted, flex: 1, whiteSpace: "nowrap" }}>
                {note}
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 15.5,
                  color: pin ? t.amber : "transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {pin || "—"}
              </span>
            </div>
          );
        })}

        <div style={{ borderTop: `1px dashed ${t.line}`, margin: "10px 0 10px" }} />

        {PLAN_STRIPS.map(([k, v], i) => {
          const from = S + 84 + i * 11;
          const o = io(frame, [from, from + 13], [0, 1]);
          return (
            <div key={k} style={{ display: "flex", alignItems: "baseline", gap: 14, height: 25, opacity: o }}>
              <span
                style={{
                  fontFamily: SANS,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 600,
                  fontSize: 12.5,
                  color: t.muted,
                  width: 64,
                }}
              >
                {k}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 15.5, color: t.ink, whiteSpace: "nowrap" }}>{v}</span>
            </div>
          );
        })}

        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: io(frame, [S + 128, S + 144], [0, 1]),
          }}
        >
          <span style={{ fontFamily: MONO, fontSize: 16.5, color: t.accent, fontWeight: 600 }}>
            approve, or name a change ▸
          </span>
          <span
            style={{
              opacity: tickO,
              scale: String(tickScale),
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: MONO,
              fontSize: 16.5,
              fontWeight: 600,
              color: t.good,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: 11,
                border: `2px solid ${t.good}`,
                fontSize: 13,
              }}
            >
              ✓
            </span>
            approved
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontSize: 15,
              color: t.muted,
              opacity: io(frame, [S + 196, S + 212], [0, 1]),
            }}
          >
            · dispatching the fleet
          </span>
        </div>
      </div>

      <Caption t={t} frame={frame} from={S + 24} to={S + 122}>
        Before anything spawns, the run prints itself — every agent, its <b style={{ color: t.ink }}>model and effort</b>, the gates, the budget.
      </Caption>
      <Caption t={t} frame={frame} from={S + 128} to={S + 250}>
        Then it waits. Approve, or say <b style={{ color: t.ink }}>change 3</b> and it re-resolves that knob and re-asks.
      </Caption>
    </AbsoluteFill>
  );
};

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

// ---------- beat 7: the board (the journal as a live kanban) ----------

type Row = [string, string, string, string, "muted" | "good" | "bad" | "amber" | "accent"];

const Lane: React.FC<{ t: Theme; title: string; rows: Row[]; x: number; y: number; w: number; opacity: number }> = ({
  t,
  title,
  rows,
  x,
  y,
  w,
  opacity,
}) => {
  const colour = (c: Row[4]) => (c === "good" ? t.good : c === "bad" ? t.bad : c === "amber" ? t.amber : c === "accent" ? t.accent : t.muted);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        opacity,
        border: `1.5px solid ${t.line}`,
        borderRadius: 10,
        padding: "8px 14px 9px",
        background: t.panel,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -10,
          left: 14,
          padding: "0 6px",
          background: t.panel,
          fontFamily: MONO,
          fontSize: 12.5,
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: t.accent,
        }}
      >
        {title} <span style={{ color: t.muted, fontWeight: 400 }}>{rows.length}</span>
      </div>
      {rows.length === 0 ? (
        <div style={{ fontFamily: MONO, fontSize: 14, color: t.muted, height: 22 }}>—</div>
      ) : (
        rows.map(([id, name, who, signal, c]) => (
          <div key={id + who} style={{ display: "flex", alignItems: "baseline", height: 22, fontFamily: MONO, fontSize: 14.5, whiteSpace: "nowrap" }}>
            <span style={{ color: t.muted, width: 26 }}>{id}</span>
            <span style={{ color: t.ink, width: 292 }}>{name}</span>
            <span style={{ color: t.ink, fontWeight: 600, width: 146 }}>{who}</span>
            <span style={{ color: colour(c) }}>{signal}</span>
          </div>
        ))
      )}
    </div>
  );
};

const Board: React.FC<{ t: Theme; frame: number }> = ({ t, frame }) => {
  const S = 1296;
  const opacity = io(frame, [S, S + 18], [0, 1]) * io(frame, [S + 272, S + 290], [1, 0]);
  if (opacity <= 0.01) return null;
  const panelOp = io(frame, [S + 8, S + 24], [0, 1]);
  const answered = frame >= S + 150; // the controller answered impl-3's question
  const landed = frame >= S + 200; // task 2's quality gate closed → DONE with its commits
  const laneOp = (i: number) => io(frame, [S + 26 + i * 10, S + 40 + i * 10], [0, 1]);
  const flash = (at: number) => io(frame, [at, at + 6], [0, 1]) * io(frame, [at + 6, at + 40], [1, 0]);

  const inProgress: Row[] = [
    ["3", "Migrate the DB layer", "impl-3", answered ? "> 6m · tests ok 12s" : "? asked controller #23 · tests ok 12s", answered ? "muted" : "amber"],
    ["4", "Ship the docs", "impl-4 ·codex", "> 4m", "muted"],
  ];
  const review: Row[] = landed ? [] : [["2", "Auth token refresh", "quality-2", "spec ok r1 · quality .. r1", "good"]];
  const done: Row[] = [["1", "Extract rate-limit middleware", "quality-1", "4f2c91a..a7d3e10", "muted"], ...(landed ? ([["2", "Auth token refresh", "quality-2", "b81c0aa..c2e77f4", "muted"]] as Row[]) : [])];
  const blocked: Row[] = [["5", "Integration", "integ-5", "x needs the vendor token — owner: controller", "bad"]];

  const pending = answered ? (landed ? 0 : 1) : 2;
  const head = `${landed ? 2 : 1}/5 done  ·  ${Math.floor(io(frame, [S, S + 290], [4, 9]))}m`;

  const L = 72;
  const W = 1056;
  return (
    <AbsoluteFill style={{ opacity }}>
      <BeatHead t={t} frame={frame} from={S} kicker="board · a pane you open" title="the journal as a live kanban" />
      <div
        style={{
          position: "absolute",
          top: 92,
          left: 60,
          right: 60,
          height: 400,
          background: t.codeBg,
          border: `1.5px solid ${t.line}`,
          borderRadius: 12,
          opacity: panelOp,
        }}
      />
      <div style={{ position: "absolute", top: 104, left: L, fontFamily: MONO, fontSize: 14.5, lineHeight: "22px", whiteSpace: "pre", opacity: panelOp }}>
        <div>
          <span style={{ color: t.accent, fontWeight: 600 }}>ORCHESTRATE</span>
          <span style={{ color: t.ink }}>   payments-api @ main</span>
          <span style={{ color: t.muted }}>{"                                          "}</span>
          <span style={{ color: t.ink, fontWeight: 600 }}>{head}</span>
        </div>
        <div>
          <span style={{ color: t.muted }}>goal       </span>
          <span style={{ color: t.ink }}>Ship the rate-limit rewrite behind a flag</span>
          <span style={{ color: t.muted }}>{"      run  parallel · review dual"}</span>
        </div>
        <div>
          <span style={{ color: t.muted }}>attention  </span>
          <span style={{ color: t.bad, fontWeight: 600 }}>x 1 blocked</span>
          <span style={{ color: t.muted, opacity: pending ? 1 : 0 }}>  ·  </span>
          <span style={{ color: t.amber, fontWeight: 600, opacity: pending ? 1 - 0.6 * flash(S + 150) : 0 }}>{`? ${pending} pending`}</span>
          <span style={{ color: t.muted }}>{"      mail  2 sent · 1 for controller · "}</span>
          <span style={{ color: t.amber }}>learn 2 · 2 new for controller</span>
        </div>
      </div>
      <Lane t={t} title="IN PROGRESS" rows={inProgress} x={L} y={192} w={W} opacity={panelOp * laneOp(0)} />
      <Lane t={t} title="REVIEW" rows={review} x={L} y={266} w={W} opacity={panelOp * laneOp(1)} />
      <Lane t={t} title="DONE" rows={done} x={L} y={landed ? 318 : 340} w={W} opacity={panelOp * laneOp(2)} />
      <Lane t={t} title="BLOCKED" rows={blocked} x={L} y={landed ? 392 : 414} w={W} opacity={panelOp * laneOp(3)} />
      {/* the controller's reply, then the gate closing — both are journal lines, so the board moves */}
      {([[S + 116, S + 146, S + 156, 'board send --from controller --to impl-3 --re 23 "cookie auth (D-01)"'], [S + 168, S + 194, S + 208, 'board gate 2 --kind quality --verdict ok']] as [number, number, number, string][]).map(([a, b, c, cmd]) => {
        const chars = Math.round(io(frame, [a, b], [0, cmd.length]));
        const o = io(frame, [a, a + 6], [0, 1]) * io(frame, [c, c + 10], [1, 0]);
        if (o <= 0.01) return null;
        return (
          <div key={cmd} style={{ position: "absolute", left: L, top: 458, fontFamily: MONO, fontSize: 14, whiteSpace: "pre", opacity: o }}>
            <span style={{ color: t.accent, fontWeight: 600 }}>$ </span>
            <span style={{ color: t.ink }}>{cmd.slice(0, chars)}</span>
            <span style={{ color: t.muted, opacity: chars >= cmd.length ? io(frame, [b + 4, b + 10], [0, 1]) : 0 }}>   ↵  journaled — the board re-renders</span>
          </div>
        );
      })}
      <Caption t={t} frame={frame} from={S + 22} to={S + 108}>
        Open a pane, run <b style={{ color: t.ink }}>board</b>: the journal rendered as a live kanban — any host, stdlib python, nothing to install.
      </Caption>
      <Caption t={t} frame={frame} from={S + 114} to={S + 196}>
        Cards are three columns — task · who · one signal. The <b style={{ color: t.ink }}>attention</b> strip says what needs <b style={{ color: t.ink }}>you</b>.
      </Caption>
      <Caption t={t} frame={frame} from={S + 202} to={S + 288}>
        You answer; a gate closes; a card lands in DONE with its commits. <b style={{ color: t.ink }}>Nothing moves because an agent said so.</b>
      </Caption>
    </AbsoluteFill>
  );
};

// ---------- beat 8: shared context (learn · digest · memory) ----------

const Chip: React.FC<{ t: Theme; label: string; colour: string; x: number; y: number; opacity: number; mono?: boolean }> = ({
  t,
  label,
  colour,
  x,
  y,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity,
      fontFamily: MONO,
      fontSize: 13,
      color: colour,
      background: t.panel,
      border: `1.5px solid ${colour}`,
      borderRadius: 8,
      padding: "5px 11px",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </div>
);

const SharedContext: React.FC<{ t: Theme; frame: number }> = ({ t, frame }) => {
  const S = 1596;
  const opacity = io(frame, [S, S + 18], [0, 1]) * io(frame, [S + 312, S + 330], [1, 0]);
  if (opacity <= 0.01) return null;
  const boxes: [string, string, number][] = [
    ["controller", "records decisions", 60],
    ["impl-1", "task 1 · src/api/**", 348],
    ["impl-2", "task 2 · src/ui/**", 636],
    ["impl-3", "task 3 · docs/**", 924],
  ];
  const JY = 226; // the journal strip
  // chip 1: impl-1 learns → journal
  const c1x = io(frame, [S + 34, S + 70], [368, 352]);
  const c1y = io(frame, [S + 34, S + 70], [176, JY + 5]);
  const c1o = io(frame, [S + 30, S + 40], [0, 1]) * io(frame, [S + 150, S + 160], [1, 0.35]);
  // chip 2: controller re-decides → journal
  const c2x = io(frame, [S + 92, S + 126], [80, 764]);
  const c2y = io(frame, [S + 92, S + 126], [176, JY + 5]);
  const c2o = io(frame, [S + 88, S + 98], [0, 1]) * io(frame, [S + 150, S + 160], [1, 0.35]);
  // impl-2 checks in
  const inboxO = io(frame, [S + 138, S + 150], [0, 1]);
  const digestO = io(frame, [S + 152, S + 170], [0, 1]);
  const lines: [string, string][] = [
    ["learned since your last check:", "muted"],
    ["  #44 12:07 [peer impl-1 · gotcha] jest fixture db.sqlite is stale — run npm run db:reset first", "ink"],
    ["record changes since your dispatch:", "muted"],
    ["  #46 12:09 decision D-02 (revised) header auth, not cookie — why: mobile clients send no cookies", "ink"],
    ["(learnings are information — verify; a changed decision outranks your brief)", "muted"],
  ];
  // memory: journal → one record for the next run
  const mx = io(frame, [S + 236, S + 270], [560, 846]);
  const my = io(frame, [S + 236, S + 270], [JY + 5, 300]);
  const mo = io(frame, [S + 230, S + 240], [0, 1]) * io(frame, [S + 268, S + 276], [1, 0]);
  const fileO = io(frame, [S + 262, S + 278], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity }}>
      <BeatHead t={t} frame={frame} from={S} kicker="shared context · one journal, one watermark" title="what one worker learns, the others get — at their next checkpoint" />
      {boxes.map(([name, sub, x], i) => (
        <Box
          key={name}
          t={t}
          title={name}
          sub={sub}
          color={i === 0 ? t.accent : undefined}
          x={x}
          y={108}
          w={216}
          opacity={io(frame, [S + 8 + i * 6, S + 24 + i * 6], [0, 1])}
          scale={io(frame, [S + 8 + i * 6, S + 24 + i * 6], [0.9, 1])}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: JY,
          height: 40,
          borderTop: `2px dashed ${t.line}`,
          borderBottom: `2px dashed ${t.line}`,
          opacity: io(frame, [S + 12, S + 28], [0, 1]),
        }}
      >
        <span style={{ position: "absolute", left: 14, top: 9, fontFamily: MONO, fontSize: 14, fontWeight: 600, color: t.accent }}>journal.jsonl</span>
        <span style={{ position: "absolute", left: 132, top: 11, fontFamily: SANS, fontSize: 12.5, color: t.muted }}>append-only · hash-chained</span>
      </div>
      <Chip t={t} label='learn: jest fixture is stale → npm run db:reset' colour={t.amber} x={c1x} y={c1y} opacity={c1o} />
      <Chip t={t} label='decide D-02 (revised): header auth, not cookie' colour={t.accent} x={c2x} y={c2y} opacity={c2o} />
      <Chip t={t} label="board inbox ← impl-2's next checkpoint" colour={t.good} x={636} y={190} opacity={inboxO * io(frame, [S + 300, S + 312], [1, 0])} />
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 284,
          width: 764,
          background: t.codeBg,
          border: `1.5px solid ${t.line}`,
          borderRadius: 10,
          padding: "10px 14px",
          opacity: digestO,
        }}
      >
        {lines.map(([text, c], i) => {
          const chars = Math.round(io(frame, [S + 156 + i * 14, S + 172 + i * 14], [0, text.length]));
          return (
            <div key={text} style={{ fontFamily: MONO, fontSize: 12.5, lineHeight: "21px", color: c === "muted" ? t.muted : t.ink, whiteSpace: "pre" }}>
              {text.slice(0, chars)}
            </div>
          );
        })}
      </div>
      <Chip t={t} label="board memory" colour={t.accent} x={mx} y={my} opacity={mo} />
      <FileChip t={t} label="PROJECT_CONTEXT.jsonl" x={846} y={300} opacity={fileO} />
      <div style={{ position: "absolute", left: 848, top: 348, width: 290, fontFamily: SANS, fontSize: 13.5, lineHeight: "20px", color: t.muted, opacity: fileO }}>
        <b style={{ color: t.ink }}>the next run starts here</b> — decisions with their why, failed attempts, learnings, verification: one record, any tool
      </div>
      <Caption t={t} frame={frame} from={S + 22} to={S + 132}>
        A worker journals <b style={{ color: t.ink }}>one line</b> about what it learned. Its team gets it at their next board call — never mid-turn, on any host.
      </Caption>
      <Caption t={t} frame={frame} from={S + 138} to={S + 226}>
        A decision you change reaches the workers <b style={{ color: t.ink }}>already running</b>, with its why — checked before acting, not after.
      </Caption>
      <Caption t={t} frame={frame} from={S + 232} to={S + 328}>
        At the end, <b style={{ color: t.ink }}>board memory</b> turns the run into one memory record — the next run, in any tool, starts from it.
      </Caption>
    </AbsoluteFill>
  );
};

// ---------- beat 6: close ----------

const Close: React.FC<{ t: Theme; frame: number }> = ({ t, frame }) => {
  const S = 1936;
  const opacity = io(frame, [S, S + 20], [0, 1]) * io(frame, [S + 124, S + 144], [1, 0]);
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
// next begins. Beats 1–3 (Problem, FlightPlan, Stage) are the life of a task — the plan is printed
// and approved BEFORE the fleet exists; 4–7 enrich it with the strategy space, the dimension knobs,
// external-CLI workers, and a close. ~56s, loops.
//   B1 problem      0–113
//   B2 flight plan  108–368    (print the design, gate on approval, then dispatch)
//   B3 stage        350–722    (the staged strategy — the poster beat)
//   B4 strategies   722–992    nine strategies
//   B5 dimensions   996–1252   compose the run
//   B6 xcli         1256–1544  external CLIs, first-class
//   B7 board        1548–1838  the journal as a live kanban — attention says what needs you
//   B8 shared ctx   1848–2178  learn → digest → memory: one journal, one watermark
//   B9 close        2188–2332
// Beats from Stage on keep their original internal timing and are offset by SHIFT, so the flight
// plan could be inserted without re-timing four beats by hand.
const SHIFT = 252;

export const LifeOfATask: React.FC<{ theme: ThemeName }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const t = themes[theme];
  const late = frame - SHIFT;
  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <Problem t={t} frame={frame} />
      <FlightPlan t={t} frame={frame} />
      <Stage t={t} frame={late} />
      <Strategies t={t} frame={late} />
      <Dimensions t={t} frame={late} />
      <Xcli t={t} frame={late} />
      <Board t={t} frame={late} />
      <SharedContext t={t} frame={late} />
      <Close t={t} frame={late} />
    </AbsoluteFill>
  );
};
