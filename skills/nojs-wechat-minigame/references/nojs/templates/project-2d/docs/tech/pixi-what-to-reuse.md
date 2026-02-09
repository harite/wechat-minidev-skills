# Pixi.js 复用边界技术文档（避免造轮子）

## 背景与目标

本项目是微信小游戏环境下的 2D 游戏，渲染引擎使用 `pixi.js@5`（配合 `@pixi/unsafe-eval` 以适配小游戏环境限制）。

**目标**：
- **尽量复用 Pixi 已提供的渲染、场景图、事件系统与资源体系**，避免直接基于 Canvas API 自己实现一套"渲染器/输入/组件库"，从而降低性能风险与维护成本。
- 在"复用引擎能力"的前提下，为游戏提供一套**引擎无关的核心框架**（`src/core/`），便于场景驱动、领域逻辑收敛、资源释放与测试。

> 约束：微信小游戏只有一个主画布 `GameGlobal.screencanvas`；禁止 `eval/new Function`（Pixi 需要引入 `@pixi/unsafe-eval` 规避动态执行限制）。

---

## 总体架构与模块边界（建议落地形态）

按 no.js 宪章：**Scene → Domain → ECS/GameObject → Rendering**。

- **`src/core/`（引擎无关）**
  - `Game`：主循环与生命周期管理
  - `Scene` / `SceneManager`：多场景切换与场景生命周期
  - `EventBus`：跨模块/跨场景事件（业务事件，不承载渲染/输入细节）
  - `TimeManager`：暂停/时间缩放
  - `ScreenAdapter`：设计分辨率与安全区适配
  - `InputManager`：输入路由/拦截（注意：不要替代 Pixi 的 UI 事件系统）

- **`src/scenes/`（引擎适配层 + 场景实现）**
  - `PixiScene`：Pixi 初始化与场景容器管理（每个场景一个 `PIXI.Container`）

- **`src/gameobjects/`（渲染对象/交互对象）**
  - `GameObject`：承载 `displayObject`（Pixi DisplayObject）与 update/destroy

核心原则：
- **渲染与 UI 交互尽量交给 Pixi**（场景图 + 事件系统）。
- core 层只做"业务生命周期/组织结构/资源释放"的薄封装，不重复实现渲染管线。

---

## 哪些模块必须直接用 Pixi（不应该自己造轮子）

下面这些能力，Pixi 已经做到了"正确、足够快、生态成熟"，重复实现只会带来维护成本和性能坑。

### 1) 核心渲染与场景图（Scene Graph）

- **直接用 Pixi 的**：
  - `PIXI.Application` / `PIXI.Renderer`
  - `PIXI.Container`、`PIXI.Sprite`、`PIXI.Graphics`、`PIXI.Text` / `PIXI.BitmapText`
  - Transform（position/scale/rotation/skew/pivot）、alpha、visible、zIndex/sortableChildren
- **不要自己做**：
  - 自己维护一套显示列表 / 变换矩阵 / 层级排序
  - 自己拼接 WebGL draw call、做 batch、纹理状态切换

原因：这属于"渲染器内核"，不只是画出来，还涉及 WebGL 状态、合批策略、缓存与平台兼容。

### 2) 纹理、图集与资源生命周期

- **直接用 Pixi 的**：
  - `PIXI.Loader`（v5）或 `Assets`（v7+）的资源加载体系，或 `Texture.from(...)`
  - Spritesheet/Atlas（合批的基础）
  - `BaseTexture`/`Texture` 复用
- **不要自己做**：
  - 自己写图片解码、纹理缓存、图集切图、引用计数

落地建议：资源组织以"场景包/玩法包"为单位；场景 `onExit/cleanup` 必须释放独占资源（或交由统一资源管理器做引用计数）。

### 3) 输入事件系统（指 UI/显示对象交互）

Pixi v5+ 支持**事件冒泡/捕获/命中检测**。

- **直接用 Pixi 的**：
  - DisplayObject 的 pointer/touch 事件（例如 `pointerdown`/`pointerup`/`pointermove`）
  - `event.stopPropagation()` 进行冒泡屏蔽
  - `hitArea`、`interactiveChildren`/`interactive`
- **不要自己做**：
  - 自己实现命中检测（hitTest）、事件派发树、手势识别基础设施

说明：`src/core/InputManager` 适合做"游戏层输入路由/屏蔽"（例如点击背景加分、拖拽落点判定的兜底），但 **UI 组件（按钮/对话框）应该直接用 Pixi 事件**，否则会出现两套事件体系并存，后期难维护。

### 4) 遮罩、裁剪、滤镜与合成

- **直接用 Pixi 的**：
  - `mask`（图形遮罩/精灵遮罩）
  - `filters`（注意性能与兼容）
  - `RenderTexture`（用于缓存、截图、局部静态内容合成）
- **不要自己做**：
  - 自己实现裁剪矩形/圆角裁剪/离屏合成管线

### 5) 文本渲染与字体

- **直接用 Pixi 的**：`Text` 或 `BitmapText`。
- **不要自己做**：把文字逐字 `fillText` 到 canvas 再当纹理用（除非你非常确定需要并且统一封装）。

原因：文本的缓存、测量、换行、清晰度与性能优化都很容易踩坑。

---

## 哪些模块需要我们封装（但必须基于 Pixi，而不是替代 Pixi）

### 1) 多场景管理（core 层负责"组织"，Pixi 负责"显示"）

Pixi 本身不提供"场景切换"概念；这里建议沿用现有实现：
- `SceneManager` 负责切换时机（例如下一帧切换，避免 update 中途切换）。
- `Scene` 定义生命周期：`onEnter(params)` / `update(dt)` / `onExit()` / `cleanup()`。
- `PixiScene` 在 `onEnter` 创建场景自己的 `stage`（`PIXI.Container`），并挂到全局 `app.stage` 下；`onExit` 移除并销毁。

**关键边界**：
- **全局只保留一个 `PIXI.Application`**（当前代码已这么做），避免频繁创建 renderer 导致卡顿与内存抖动。
- 场景切换时只替换"场景容器"，不要替换"渲染器内核"。

### 2) 跨场景/模态对话框的事件屏蔽（推荐的"引擎内方案"）

我们需要解决的问题是：
- 模态弹窗打开时，背景 UI/背景玩法不应响应；
- 弹窗内部按钮仍然可点击；
- 允许多层弹窗栈（确认框叠在设置框上）。

**推荐做法：用 Pixi 的事件系统实现遮罩吞事件**，而不是靠全局 Canvas 事件直接截断。

落地建议：在 `PIXI.Application` 的根舞台下固定三层：
- `sceneLayer`：当前场景根容器（由 `PixiScene` 管）
- `overlayLayer`：全局弹窗/遮罩层（跨场景也能存在，或切场景时统一清空）
- `debugLayer`：调试面板/HUD（可选）

模态弹窗打开：
- 往 `overlayLayer` 加一个全屏遮罩（`Graphics` 或 `Sprite`），其本身可交互（`interactive = true`），并在事件回调里 `stopPropagation()`。
- 遮罩之上再放弹窗容器。

这样做的好处：
- "屏蔽"与"可交互"都在 Pixi 的一套事件树里完成，**不会出现两套输入系统互相打架**。

> 当前项目 `InputManager.pushBlockLayer()` 的策略是"阻止触摸事件分发到 Scene 的 `onTouchXxx`"，它适合屏蔽玩法层输入（例如背景点击加分），但它**不应该取代** Pixi UI 的冒泡控制。

### 3) 核心渲染流程（只选一种主循环）

当前项目：
- `core/Game` 自己 `requestAnimationFrame` 驱动 `Scene.update(dt)`；
- `PIXI.Application` 默认也会启动自己的 ticker（内部也会 render）。

为了避免"两个时钟源"造成抖动/难以定位问题，建议长期只保留一种：
- **方案 A（推荐）**：以 Pixi `app.ticker` 为唯一主循环，在 ticker 回调里驱动 `SceneManager.update(dt)`。
- **方案 B**：以 `core/Game` 为唯一主循环，并显式控制渲染（例如调用 `app.renderer.render(app.stage)`）。

选择标准：
- 想把"逻辑更新 + 渲染"统一节奏：选 A。
- 想让 core 完全掌控节奏（暂停/慢放/录制回放等）：选 B。

无论选哪种，都不要在 UI/玩法里再引入第三套定时更新机制。

### 4) 基本 UI 组件（基于 Pixi DisplayObject 的"轻组件"）

目标不是做一个重量级 UI 框架，而是提供少量高复用组件，满足小游戏常见需求：

- **`Button`**：
  - 组合 `Container + Sprite/Text`，使用 Pixi pointer 事件
  - 统一状态：normal/pressed/disabled（只做视觉切换 + 事件开关）
- **`Modal`/`Dialog`**：
  - 统一"遮罩吞事件 + 弹窗容器"结构
  - 与 `overlayLayer` 配套，支持弹窗栈
- **`Panel`/`Card` 容器**：
  - 用 `NineSlicePlane`（若引入）或图片边框，避免大量 `Graphics` 反复重绘
- **`ScrollView`（谨慎）**：
  - 优先使用 mask + 仅渲染可见内容（否则很容易卡）

**避免的方向**：
- 不要基于原生 Canvas API 自绘按钮/文本/布局，然后贴图到 Pixi；这样会绕开 Pixi 的批处理与缓存策略，且交互命中也会变得复杂。

---

## "不要造轮子"的清单（强约束）

- **不要**：自己写渲染循环里逐层 `drawImage`/`fillText` 的 UI 系统
- **不要**：自己写 hitTest/事件冒泡/手势分发树
- **不要**：自己写纹理缓存/图集切分/资源引用计数（除非封装的是 Pixi 之上的"资源分组与释放策略"）
- **不要**：自己写遮罩裁剪与离屏合成管线

对应地：
- **要**：把"业务组织/生命周期/资源释放时机/层级结构"做好，把渲染与交互交给 Pixi。

---

## 与现有代码的对齐点（当前仓库已具备的基础）

- `src/core/SceneManager`：延迟到下一帧切场景，避免 update 中途切换引发的问题。
- `src/core/Scene`：统一生命周期，并在 `onEnter` 时注册输入、在 `onExit` 做销毁。
- `src/scenes/PixiScene`：全局复用 `PIXI.Application`，每个场景创建自己的 `stage` 容器并挂到 `app.stage`。
- `src/core/InputManager`：提供"模态拦截层"栈（更适合屏蔽场景级 `onTouchXxx` 玩法输入）。

下一步（等我们确定方案后再改代码）：
- 固化 `app.stage` 的层级结构（`sceneLayer/overlayLayer/debugLayer`），并把模态弹窗切到 Pixi 事件体系里处理冒泡吞噬。
- 统一主循环来源（只保留一种 tick/RAF）。
