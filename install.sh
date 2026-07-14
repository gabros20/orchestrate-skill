#!/usr/bin/env bash
# Install the orchestrate skill into your agent's user-level skills directory.
# Usage: ./install.sh [claude|codex|cursor|antigravity|opencode|grok|hermes|agents|all]
# (default: claude)
#
# `agents` = the cross-agent standard path ~/.agents/skills — Codex reads it natively,
# and Cursor, opencode, Copilot, Amp (and others) read it too. `all` = claude + agents,
# which covers most hosts without littering every vendor dir. Prefer
# `npx skills add gabros20/orchestrate` when you have Node — it maps 70+ agents itself.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
target="${1:-claude}"
install_to() {
  dest="$1/orchestrate"
  mkdir -p "$(dirname "$dest")"
  rm -rf "$dest"
  cp -R "$here/skills/orchestrate" "$dest"
  echo "installed → $dest"
}
case "$target" in
  claude)       install_to "$HOME/.claude/skills" ;;
  codex|agents) install_to "$HOME/.agents/skills" ;;
  cursor)       install_to "$HOME/.cursor/skills" ;;
  antigravity)  install_to "$HOME/.gemini/config/skills"            # Antigravity IDE
                install_to "$HOME/.gemini/antigravity-cli/skills" ;; # Antigravity CLI (agy)
  opencode)     install_to "$HOME/.config/opencode/skills" ;;
  grok)         install_to "$HOME/.grok/skills" ;;
  hermes)       install_to "$HOME/.hermes/skills" ;;
  all)          install_to "$HOME/.claude/skills"; install_to "$HOME/.agents/skills" ;;
  *) echo "usage: ./install.sh [claude|codex|cursor|antigravity|opencode|grok|hermes|agents|all]" >&2; exit 1 ;;
esac
echo "Invoke with /orchestrate (or your host's skill invocation) — see README for the control surface."
