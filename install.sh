#!/usr/bin/env bash
# Install the orchestrate skill into your agent's user-level skills directory.
# Usage: ./install.sh [claude|codex|all]   (default: claude)
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
  claude) install_to "$HOME/.claude/skills" ;;
  codex)  install_to "$HOME/.agents/skills" ;;
  all)    install_to "$HOME/.claude/skills"; install_to "$HOME/.agents/skills" ;;
  *) echo "usage: ./install.sh [claude|codex|all]" >&2; exit 1 ;;
esac
echo "Invoke with /orchestrate — see README for the full control surface."
