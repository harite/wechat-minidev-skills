#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
SKILL_SRC="${REPO_ROOT}/skills/nojs-wechat-minigame"
CLAUDE_HOME="${CLAUDE_HOME:-${HOME}/.claude}"
SKILL_DEST="${CLAUDE_HOME}/skills/nojs-wechat-minigame"

if [[ ! -d "${SKILL_SRC}" ]]; then
  echo "Skill source not found: ${SKILL_SRC}" >&2
  exit 1
fi

mkdir -p "${CLAUDE_HOME}/skills"
rm -rf "${SKILL_DEST}"
cp -R "${SKILL_SRC}" "${SKILL_DEST}"

echo "Installed skill to ${SKILL_DEST}"
echo "Restart Claude Code to load the new skill."
