# 核心框架

## 核心思想

no.js 提供了一套**引擎无关**的基础框架，核心解决：

1. **场景驱动架构** - 统一生命周期管理
2. **事件穿透问题** - 场景切换和模态对话框的输入隔离
3. **引擎适配** - 2D (Pixi.js) / 3D (Three.js)，创建项目时二选一

## 框架结构

### 引擎无关的核心类（templates/project/src/core/）

- **Game** - 游戏主循环，驱动场景更新
- **Scene** - 场景基类，生命周期：`onEnter(params)` → `update(dt)` → `cleanup()`
- **SceneManager** - 场景切换管理，延迟切换机制
- **GameObject** - 游戏对象基类，适用于数量少、行为复杂的对象
- **EventBus** - 全局事件总线，跨场景通信
- **InputManager** - 输入管理，拦截层栈解决事件穿透
- **TimeManager** - 时间管理（暂停、时间缩放）
- **ScreenAdapter** - 屏幕适配（设计分辨率 750x1334）
- **ObjectPool** - 对象池（复用频繁创建/销毁的对象）

### 引擎适配类（根据项目类型自动生成）

- **PixiScene** (2D) - Pixi.js 场景基类，封装渲染逻辑
- **ThreeScene** (3D) - Three.js 场景基类，包含 HUD 系统

## 核心用法

### 场景生命周期

```javascript
class GameScene extends PixiScene { // 或 ThreeScene
  onEnter(params) {
    super.onEnter(params);
    // 初始化场景
  }
  
  update(dt) {
    super.update(dt); // dt 已处理暂停和时间缩放
    // 每帧更新
  }
  
  cleanup() {
    // 清理纹理、事件监听、定时器
  }
}
```

### 场景切换

```javascript
// 切换场景并传参
this.switchTo(NextScene, { level: 2 });
```

### 输入事件

```javascript
class GameScene extends Scene {
  onTouchStart(event) { /* 处理触摸 */ }
  onTouchMove(event) { /* 处理拖动 */ }
  onTouchEnd(event) { /* 处理抬起 */ }
}
```

### 模态对话框（防事件穿透）

```javascript
// 打开模态层（阻止背景场景输入）
const modalId = this.openModal();

// 关闭时必须移除
this.closeModal(modalId);
```

### GameObject 管理

```javascript
class Player extends GameObject {
  init() {
    this.displayObject = new PIXI.Container();
    // 初始化状态
  }
  update(dt) { /* 更新逻辑 */ }
  cleanup() { /* 清理资源 */ }
}

// 在场景中使用
const player = new Player();
player.init();
this.addGameObject(player);  // 自动加入渲染树和更新循环
```

### 对象池

```javascript
// 创建对象池
const bulletPool = new ObjectPool(() => new Bullet(), 20);

// 获取和归还
const bullet = bulletPool.acquire();
scene.addGameObject(bullet);
// ... 使用完毕后
bulletPool.release(bullet);
```

## 最佳实践

1. **场景大小** - 场景 ≤ 2000 行，GameObject ≤ 500 行
2. **资源清理** - 必须在 `cleanup()` 中清理纹理、事件监听、定时器
3. **性能优化** - 使用对象池，避免在 `update()` 中创建对象
4. **模态对话框** - 打开 `openModal()`，关闭必须 `closeModal(modalId)`
5. **引擎选择** - 2D 继承 `PixiScene`，3D 继承 `ThreeScene`（3D UI 使用 HUD 系统）

## 详细实现

核心框架作为脚手架工程的一部分，支持项目按需修改：
- `templates/project/src/core/` - 引擎无关的核心框架类
- `templates/project-2d/src/scenes/` - 2D 引擎适配基类和示例场景
- `templates/project-3d/src/scenes/` - 3D 引擎适配基类和示例场景

CLI 创建项目时会根据选择的类型（2D/3D）自动复制对应的引擎基类和示例代码。
