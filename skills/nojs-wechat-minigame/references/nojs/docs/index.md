# No.js AI 工作流

## 一、需求评审（需用户参与）

**澄清需求**，消除模棱两可：
- Feature: 功能描述、交互细节、边界条件、验收标准
- Bug: 复现步骤、预期行为、实际行为、影响范围

**关键决策：类型判断**
- 工具开发（如关卡编辑器）→ 明确工具与运行时的交互方式（数据格式、接口）
- 运行时功能（游戏逻辑）→ 继续后续流程
- Bug 修复 → 跳到步骤三直接修复

## 二、架构设计（无需用户参与）

→ 阅读 [`architecture.md`](./architecture.md) + [`charter.md`](./charter.md)

**目标**：解决可维护性、性能、安全性等技术约束

**步骤**：
1. **领域建模** - 识别游戏对象（实体、行为、交互），分离数据与逻辑
2. **架构选型** - ECS or GameObject？
3. **场景规划** - 单/多场景？场景职责、切换流程
4. **任务拆解** - 列出实现任务清单，标注依赖关系

## 三、代码实现

**遵守宪章** → [`charter.md`](./charter.md)

### 项目未初始化？
→ 阅读 [`scaffold.md`](./scaffold.md) 初始化小游戏基本结构

### 核心框架使用
→ 阅读 [`core-framework.md`](./core-framework.md) 使用 Scene、GameObject 等基础类

**关键特性：**
- 引擎无关的场景驱动架构
- 自动解决事件穿透问题（场景切换、模态对话框）
- 支持 2D (Pixi.js) 或 3D (Three.js)，创建项目时选择

### 已有项目？
实现顺序：
1. 数据层（Component/数据结构）
2. 逻辑层（System/GameObject）
3. 渲染层（视觉）

### 场景化建议

**识别场景并主动询问用户**（仅在首次创建该场景时）

**主界面/主菜单场景**
- 询问用户：是否需要接入排行榜和游戏圈功能？
- 如需接入 → [`open-abilities/save-and-rank.md`](./open-abilities/save-and-rank.md) + [`open-abilities/game-club.md`](./open-abilities/game-club.md)

**设置/关于页面**
- 询问用户：是否需要接入投诉反馈功能？
- 如需接入 → [`open-abilities/feedback.md`](./open-abilities/feedback.md)

### 涉及微信能力接入？
→ 阅读 [`wx-api.md`](./wx-api.md) 对应章节

### 游戏存档？
→ 阅读 [`open-abilities/save-and-rank.md`](./open-abilities/save-and-rank.md) 存档与排行榜

### 实时对战？
→ 阅读 [`open-abilities/realtime-battle.md`](./open-abilities/realtime-battle.md) 实时对战指南

### Bug 修复？
→ 定位问题，直接修复