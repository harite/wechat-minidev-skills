---
name: nojs-wechat-minigame
description: No.js guidelines for building WeChat minigames with CodeBuddy or other AI agents. Use when asked to design, implement, or review WeChat minigames, especially lightweight casual games that should follow no.js architecture, performance, and platform constraints.
---

# No.js WeChat Minigame

## Overview

Apply the no.js standards to WeChat minigame projects. Use the bundled no.js docs as the source of truth for architecture, performance, and platform constraints, and produce code or guidance that stays within those rules.

## Quick Start

1. Open `references/nojs/docs/index.md` and follow the linked sections relevant to the request.
2. Read `references/nojs/docs/charter.md` to keep alignment with the no.js principles.
3. If a sample is needed, inspect `references/nojs/examples/` and adapt the closest example.
4. If a template is needed, use `references/nojs/templates/` as the base structure.
5. When answering, explicitly call out any constraints or tradeoffs required by WeChat minigame limits or no.js rules.

## Guidelines

- Prefer lightweight casual game mechanics and simple interaction loops.
- Keep performance tight: minimize draw calls, avoid heavy per-frame allocations, and reuse resources.
- Avoid self-hosted backends unless unavoidable; prefer WeChat minigame open capabilities.
- Keep the project structure clear and maintainable; explain how files map to responsibilities.
- When generating code, surface platform-specific constraints (rendering, storage, permissions, lifecycle).

## Deliverable Expectations

- Provide a short plan and the minimal file tree to implement the requested minigame.
- Include any configuration required for WeChat minigame runtime.
- If adding new assets or templates, indicate their location relative to the project root.

## References

Use the bundled no.js materials under `references/nojs/`:

- Entry point: `references/nojs/docs/index.md`
- Examples (including submodule demos): `references/nojs/examples/`
- Templates (including submodule adapter): `references/nojs/templates/`
