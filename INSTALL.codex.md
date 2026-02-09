# wechat-minidev-skills for Codex

用于 Codex CLI 和 Codex App 的自动安装说明。

## Quick Install

让 Codex 执行以下指令：

```
Fetch and follow instructions from https://raw.githubusercontent.com/harite/wechat-minidev-skills/refs/heads/main/INSTALL.codex.md
```

## Instructions for Codex

按顺序执行以下步骤，不要跳步。

1. 克隆仓库到临时目录（浅克隆）

```bash
set -euo pipefail
WORKDIR="$(mktemp -d /tmp/wechat-minidev-skills.XXXXXX)"
git clone --depth=1 https://github.com/harite/wechat-minidev-skills.git "$WORKDIR/repo"
```

2. 安装 skill 到 Codex 目录（兼容 Codex CLI 与 Codex App）

```bash
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
SKILL_NAME="nojs-wechat-minigame"
SKILL_SRC="$WORKDIR/repo/skills/$SKILL_NAME"
SKILL_DEST="$CODEX_HOME/skills/$SKILL_NAME"

if [ ! -d "$SKILL_SRC" ]; then
  echo "Skill source not found: $SKILL_SRC" >&2
  exit 1
fi

mkdir -p "$CODEX_HOME/skills"

if [ -d "$SKILL_DEST" ]; then
  BACKUP_PATH="${SKILL_DEST}.bak-$(date +%Y%m%d%H%M%S)"
  mv "$SKILL_DEST" "$BACKUP_PATH"
  echo "Backed up existing skill to: $BACKUP_PATH"
fi

cp -R "$SKILL_SRC" "$SKILL_DEST"
```

3. 验证安装结果

```bash
test -f "$SKILL_DEST/SKILL.md"
ls -la "$SKILL_DEST"
```

4. 清理临时目录

```bash
rm -rf "$WORKDIR"
```

5. 向用户回报
- 输出最终安装路径：`$SKILL_DEST`
- 提示重启 Codex（CLI 会话或 Codex App）以加载新 skill

## Manual Verify

安装后可让 Codex 执行：

```bash
ls -la ~/.codex/skills/nojs-wechat-minigame
```
