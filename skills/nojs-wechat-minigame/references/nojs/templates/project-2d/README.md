# 微信小游戏 2D 项目模板（Pixi.js）

基于 `pixi.js@5.3.12` 的微信小游戏 2D 项目模板，提供完整的场景管理、资源加载和 UI 开发支持。

## 特性

- ✅ **Pixi.js 5.x**：生产验证的稳定版本
- ✅ **场景驱动**：完整的场景生命周期管理
- ✅ **微信小游戏优化**：针对微信小游戏环境的特殊适配
- ✅ **最佳实践**：基于真实项目经验的技术指南

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发

```bash
npm run dev
```

### 3. 构建

```bash
npm run build
```

### 4. 测试

```bash
npm test
```

## 项目结构

```
.
├── src/
│   ├── scenes/           # 场景目录
│   │   ├── PixiScene.js  # Pixi 场景基类
│   │   ├── LoadingScene.js
│   │   ├── MenuScene.js
│   │   └── GameScene.js
│   └── main.js           # 入口文件
├── docs/
│   └── tech/             # 技术文档
│       ├── README.md     # 技术指南索引
│       ├── pixi-what-to-reuse.md
│       ├── pixi-ui-layout.md
│       ├── pixi-input-in-wechat-minigame.md
│       └── responsive-layout.md
├── package.json          # 2D 特定依赖（pixi.js 5.3.12）
├── .babelrc              # 支持 core-js polyfill
└── webpack.config.js     # 支持 pixi.js 转译

# 注：以下配置文件使用 project/ 中的公共版本
# - game.json
# - project.config.json
# - .gitignore
```

## 技术栈

- **渲染引擎**: pixi.js@5.3.12
- **构建工具**: Webpack 5 + Babel
- **测试框架**: Jest
- **目标平台**: 微信小游戏（Chrome 53+, iOS 8+）

## 核心概念

### 设计分辨率
统一使用 **750 × 1334** 作为设计分辨率。

### 场景系统
所有游戏逻辑围绕场景组织：
- `LoadingScene`: 资源加载
- `MenuScene`: 主菜单
- `GameScene`: 游戏主场景

每个场景继承自 `PixiScene`，拥有完整的生命周期：
- `onEnter()`: 场景进入
- `update(dt)`: 每帧更新
- `onExit()`: 场景退出
- `cleanup()`: 资源清理

### 交互实现
**重要**：不使用 Pixi 的 pointer 事件（微信小游戏不稳定），统一使用：
- 场景的 `onTouchStart/Move/End` 方法
- 手动命中检测（基于设计分辨率坐标）

详见：[pixi-input-in-wechat-minigame.md](./docs/tech/pixi-input-in-wechat-minigame.md)

## 技术文档

**必读**：[技术指南索引](./docs/tech/README.md)

核心文档：
1. [Pixi.js 复用边界指南](./docs/tech/pixi-what-to-reuse.md) - 避免重复造轮子
2. [UI 布局最佳实践](./docs/tech/pixi-ui-layout.md) - 自适应布局方案
3. [微信小游戏交互实现](./docs/tech/pixi-input-in-wechat-minigame.md) - 正确的交互方式

## 常见问题

### 为什么使用 Pixi.js 5.x 而不是 7.x？
- 5.3.12 已在生产环境充分验证
- 与微信小游戏环境兼容性更好
- 配合 `@pixi/unsafe-eval` 可规避小游戏的 eval 限制

### 为什么不用 Pixi 的 pointer 事件？
在微信小游戏环境中，Pixi 的 pointer 事件不稳定。推荐使用场景的 `onTouchStart` + 手动命中检测。

### 如何做屏幕适配？
参考 [responsive-layout.md](./docs/tech/responsive-layout.md)

## 性能优化建议

1. **复用 Pixi 能力**：不要重复实现渲染/事件/资源系统
2. **资源管理**：场景切换时及时释放资源
3. **减少重绘**：使用纹理或 RenderTexture 缓存静态内容
4. **合理使用 Graphics**：避免每帧重绘，注意清理子节点

详见：[pixi-what-to-reuse.md](./docs/tech/pixi-what-to-reuse.md)

## 开发规范

遵循 no.js 开发规范：
- 场景驱动：所有逻辑围绕场景组织
- 分层清晰：Scene → Domain → GameObject → Rendering
- 可维护性优先：DRY、KISS、高内聚低耦合

## License

MIT
