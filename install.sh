#!/usr/bin/env bash
# Install one runtime skill without exposing repository-only docs, evals, or release files.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
target="${1:-claude}"
skill_name="orchestrate"
source_dir="$here/skills/$skill_name"

[ -f "$source_dir/SKILL.md" ] || { echo "install: missing $source_dir/SKILL.md" >&2; exit 1; }

install_to() {
  parent="$1"
  dest="$parent/$skill_name"
  staging="$parent/.${skill_name}.install.$$"
  backup="$parent/.${skill_name}.backup.$$"

  mkdir -p "$parent"
  trap 'rm -rf "$staging" "$backup"' RETURN
  cp -R "$source_dir" "$staging"

  if [ -e "$dest" ]; then
    mv "$dest" "$backup"
  fi
  if mv "$staging" "$dest"; then
    rm -rf "$backup"
  else
    [ ! -e "$backup" ] || mv "$backup" "$dest"
    echo "install: failed; previous installation restored" >&2
    return 1
  fi
  echo "installed → $dest"
}

case "$target" in
  claude)      install_to "$HOME/.claude/skills" ;;
  codex)       install_to "${CODEX_HOME:-$HOME/.codex}/skills" ;;
  agents)      install_to "$HOME/.agents/skills" ;;
  cursor)      install_to "$HOME/.cursor/skills" ;;
  antigravity) install_to "$HOME/.gemini/config/skills"
               install_to "$HOME/.gemini/antigravity-cli/skills" ;;
  opencode)    install_to "$HOME/.config/opencode/skills" ;;
  grok)        install_to "$HOME/.grok/skills" ;;
  hermes)      install_to "$HOME/.hermes/skills" ;;
  kimi)        install_to "$HOME/.kimi-code/skills"
               install_to "$HOME/.agents/skills" ;;
  pi)          install_to "$HOME/.pi/agent/skills"
               install_to "$HOME/.agents/skills" ;;
  jcode)       install_to "$HOME/.jcode/skills" ;;
  all)         # claude, codex and the shared ~/.agents always; every other CLI home only if it already exists —
               # never create a home for a CLI the user does not have.
               install_to "$HOME/.claude/skills"
               install_to "${CODEX_HOME:-$HOME/.codex}/skills"
               install_to "$HOME/.agents/skills"
               for parent in "$HOME/.cursor" "$HOME/.gemini/config" "$HOME/.gemini/antigravity-cli" "$HOME/.config/opencode" \
                             "$HOME/.grok" "$HOME/.hermes" "$HOME/.kimi-code" "$HOME/.pi/agent" "$HOME/.jcode"; do
                 if [ -d "$parent" ]; then install_to "$parent/skills"; fi
               done ;;
  *) echo "usage: ./install.sh [claude|codex|agents|cursor|antigravity|opencode|grok|hermes|kimi|pi|jcode|all]" >&2; exit 1 ;;
esac

# `board` — the live kanban the user runs in a pane of their own. Installed on PATH when
# ~/.local/bin is there; otherwise every run also carries a copy at .orchestrate/board.
bin_dir="$HOME/.local/bin"
existing="$(command -v board 2>/dev/null || true)"
if [ -n "$existing" ] && [ "$existing" != "$bin_dir/board" ]; then
  echo "board: a different 'board' is already on PATH ($existing) — skipped; use .orchestrate/board"
else
  mkdir -p "$bin_dir" && cp "$source_dir/scripts/board" "$bin_dir/board" && chmod +x "$bin_dir/board"
  case ":$PATH:" in
    *":$bin_dir:"*) echo "installed → $bin_dir/board (run  board  in any pane inside a repo)" ;;
    *) echo "installed → $bin_dir/board — add $bin_dir to PATH, or run .orchestrate/board" ;;
  esac
fi

echo "Codex explicit invocation: \$$skill_name. Other clients may use slash commands, @mentions, a skill tool, or natural language."
