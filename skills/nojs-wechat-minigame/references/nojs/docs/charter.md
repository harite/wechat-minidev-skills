# 宪章

## 可维护性优先

### 设计原则
- **高内聚低耦合**：按职责拆分对象/模块，减少相互依赖
- **组合优于继承**：通过组合实现逻辑复用（Component 组合）
- **继承例外**：UI 相关可考虑继承（Scene、GameObject 基类）
- **单一职责**：每个类/模块只负责一件事
- **依赖倒置**：依赖抽象而非具体实现

### 架构一致性
- 场景驱动：所有逻辑围绕场景组织，每个场景按独立目录组织
- 分层清晰：Scene → Domain → ECS/GameObject → Rendering
- 场景 ≤ 2000 行 / GameObject ≤ 500 行
- Component 纯数据 / 领域不依赖 UI / 无循环依赖

### 命名一致性
- 场景：`XxxScene`
- 组件：`XxxComponent`
- 系统：`XxxSystem`
- 领域模型：业务名词
- 事件：`domain:action` 格式

## 微信小游戏特别规范

### 屏幕适配规范
- **设计分辨率**：建议使用 750x1334（iPhone 6/7/8 标准）
- **提醒用户**：当用户使用绝对值定位或设置物体宽高时，需提醒当前设计分辨率
- **自动适配**：实现设计分辨率到物理分辨率的自动缩放适配
- **刘海屏适配**：
  - 使用 `wx.getSystemInfoSync()` 获取安全区域信息
  - 关键属性：`safeArea`（安全区域）、`screenWidth`、`screenHeight`
  - 确保重要 UI 元素（按钮、文字）不被刘海遮挡
- **多端适配**：游戏需同时适配移动端和 PC 端

### Canvas 使用规范
- **画布结构**：小游戏环境只有一个主画布，其他都是离屏 Canvas
- **主画布访问**：
  - weapp-adapter 已创建主 Canvas（on-screen canvas）
  - 直接使用 `GameGlobal.screencanvas` 获取主画布
  - 后续创建的 Canvas（`wx.createCanvas`）都是离屏 Canvas（off-screen canvas）
- **渲染引擎选择**：
  - **2D 游戏**：使用 pixi.js
  - **3D 游戏**：使用 three.js
- **3D 游戏 UI 规范**：
  - UI 必须基于离屏 Canvas 绘制
  - 最终通过 HUD 方式合并到主画布

### 小游戏环境禁止动态执行代码
- **禁止使用 `eval`、`new Function`**：避免动态执行代码。对于pixi.js需要同时引入unsafe-eval扩展以避免eval

### 平台 API 规范
- **禁止使用 DOM API**：微信小游戏不支持 DOM
- **优先使用 wx API**：直接调用微信提供的原生接口
- **适配层例外**：以下 API 已在 weapp-adapter 中适配，可直接使用：
  - Canvas API（与浏览器对齐）
  - WebAudio API（与浏览器对齐）
  - WebGL 1.0 API（与浏览器对齐）

## 性能原则

### 渲染优化
- 减少 DrawCall：合批渲染、纹理图集
- 动态合批：复用材质、合并 Mesh

### 内存优化
- 及时释放：场景切换清理纹理/事件/定时器
- 按需加载：分包、懒加载、对象池
- 优化数据结构：避免冗余数据

### 流畅度优化
- 减少卡顿：分帧加载、异步处理
- 空间换时间：缓存计算结果（内存占用可控前提下）