# wechat-minidev-skills

## 1. 项目来源、致谢与引用

本项目将 no.js 的微信小游戏开发规范整理为可安装的 skills 结构，便于在 Codex 与 Claude Code 中直接使用。

移植来源：
- `https://gitee.com/nofree5th/no.js`

致谢与引用：
- 原始项目：`nofree5th/no.js`
- 本仓库中的 `nojs-wechat-minigame` skill 基于其文档、示例与模板进行适配整理。
- 相关三方来源见 `THIRD_PARTY_NOTICES.md`
- 本仓库许可证见 `LICENSE`

## 2. Codex 用户安装方式（Codex 命令行 + Codex App）

Codex 命令行（CLI）安装：

```bash
git clone https://github.com/harite/wechat-minidev-skills.git
cd wechat-minidev-skills
./scripts/install-codex.sh
```

Codex 命令行（CLI）也可直接通过 GitHub 路径安装：

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --url https://github.com/harite/wechat-minidev-skills/tree/main/skills/nojs-wechat-minigame
```

Codex App 安装：
1. 在 Codex App 打开内置终端。
2. 执行与 CLI 相同命令：

```bash
git clone https://github.com/harite/wechat-minidev-skills.git
cd wechat-minidev-skills
./scripts/install-codex.sh
```

默认安装路径：`~/.codex/skills/nojs-wechat-minigame`

安装后重启 Codex（CLI 会话或 App）以加载技能。

## 3. Claude Code 用户安装方式

方式 A：使用 `plugin` 命令（推荐）

在 Claude Code 会话中执行：

```bash
/plugin marketplace add harite/wechat-minidev-skills
/plugin install wechat-minidev-skills@wechat-minidev-skills
```

或在终端执行：

```bash
claude plugin marketplace add harite/wechat-minidev-skills
claude plugin install wechat-minidev-skills@wechat-minidev-skills
```

方式 B：脚本安装（备用）

```bash
git clone https://github.com/harite/wechat-minidev-skills.git
cd wechat-minidev-skills
./scripts/install-claude-code.sh
```

默认安装路径：`~/.claude/skills/nojs-wechat-minigame`

安装后重启 Claude Code 以加载技能。
