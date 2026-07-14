// Palettes mirror site/index.html :root tokens exactly — the video must sit on the page
// as if drawn by the page's own CSS.
export const themes = {
  light: {
    bg: "#f6f7fa",
    panel: "#ffffff",
    ink: "#1c2333",
    muted: "#5a6478",
    line: "#d8dde8",
    accent: "#3b63d8",
    amber: "#a97a10",
    amberBg: "#fdf6e3",
    good: "#1e7f4f",
    bad: "#b3403a",
    codeBg: "#eef1f7",
    glyph: "#8391ad",
    file: "#a97a10",
  },
  dark: {
    bg: "#12151d",
    panel: "#1a1f2b",
    ink: "#e6eaf3",
    muted: "#93a0b8",
    line: "#2b3245",
    accent: "#6f93ff",
    amber: "#d9a72e",
    amberBg: "#26200f",
    good: "#4cc38a",
    bad: "#e5726c",
    codeBg: "#141824",
    glyph: "#5d6a85",
    file: "#d9a72e",
  },
} as const;

export type ThemeName = keyof typeof themes;
export type Theme = (typeof themes)[ThemeName];

export const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
export const SANS = 'system-ui, -apple-system, "Segoe UI", sans-serif';
