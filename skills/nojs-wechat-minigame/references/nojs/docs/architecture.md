# 架构设计

## 一、领域建模

### 识别游戏对象
1. **实体** - 游戏中的"东西"（玩家、敌人、子弹）
2. **行为** - 能做什么（移动、攻击、死亡）
3. **交互** - 对象间如何影响（碰撞、伤害）

### 分离数据与逻辑
- **数据层**：状态（hp, position）、配置（攻击力）、关系（阵营）
- **逻辑层**：行为（移动、攻击）、规则（死亡判定）、状态机

## 二、架构选型

**决策**：数量 > 20 且行为简单 → ECS，否则 → GameObject

**示例**：敌人群/子弹/粒子 → ECS，玩家/Boss/管理器 → GameObject

## 三、实现原则

### ECS
- Component = 纯数据（无方法）
- System = 纯逻辑（无状态）

### GameObject
- 职责单一
- 管理生命周期（init/update/destroy）

### 混合使用
- ❌ Component 持有 GameObject
- ❌ GameObject 直接改 Component
- ✅ Scene 同时管理 ECS World 和 GameObject
