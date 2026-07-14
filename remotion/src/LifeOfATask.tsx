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
  const opacity = io(frame, [98, 122], [0, 1]);
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

// ---------- composition ----------

export const LifeOfATask: React.FC<{ theme: ThemeName }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const t = themes[theme];
  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <Problem t={t} frame={frame} />
      <Stage t={t} frame={frame} />
    </AbsoluteFill>
  );
};
