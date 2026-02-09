# Pixi.js 2D 游戏技术指南

本目录包含基于 richflower 项目成功经验总结的 Pixi.js 技术最佳实践。

## 技术文档索引

### 核心架构
- [**pixi-what-to-reuse.md**](./pixi-what-to-reuse.md) - Pixi.js 复用边界指南（避免重复造轮子）
  - 哪些模块必须直接用 Pixi
  - 哪些模块需要封装但基于 Pixi
  - 核心架构设计原则

### UI 开发
- [**pixi-ui-layout.md**](./pixi-ui-layout.md) - Pixi UI 布局经验
  - 内容自适应布局方案
  - 弹窗/按钮等组件的布局实现
  - Graphics 绘制与清理注意事项

- [**pixi-input-in-wechat-minigame.md**](./pixi-input-in-wechat-minigame.md) - 微信小游戏中的交互实现
  - 为什么不用 Pixi 的 pointer 事件
  - 场景 onTouchStart + 命中检测的标准实现
  - 弹窗/暂停的交互控制

### 屏幕适配
- [**responsive-layout.md**](./responsive-layout.md) - 自适应布局方案
  - 画布尺寸计算
  - 高分辨率适配
  - 响应式更新策略

## 技术栈

### Pixi.js 版本
- **pixi.js**: 5.3.12
- **@pixi/unsafe-eval**: 5.3.12

选择 5.x 版本的原因：
- 已在生产环境验证稳定
- 与微信小游戏环境兼容性好
- 配合 @pixi/unsafe-eval 可规避小游戏禁止 eval 的限制

### 构建配置
- Webpack 5 + Babel
- 目标平台：Chrome 53+, iOS 8+
- core-js 3 按需引入 polyfill

## 快速参考

### 设计分辨率
统一使用 **750 × 1334** 作为设计分辨率。

### 性能优化关键点
1. **复用 Pixi 能力**：不要重复实现渲染/事件/资源系统
2. **资源生命周期**：场景切换时及时释放资源
3. **减少 Graphics 重绘**：使用纹理或缓存静态内容
4. **避免两套事件系统**：统一使用场景 onTouchXxx + 命中检测

### 常见坑点
- ❌ 不要依赖 Pixi 的 `pointerdown` 事件（微信小游戏不稳定）
- ❌ 不要使用 `InputManager.openModal()`（会阻止所有输入）
- ❌ Graphics.clear() 不会清理子节点（需手动移除）
- ❌ 避免固定高度的弹窗（应该内容自适应）

## 更多资源

参考 richflower 项目的完整实现：
- `/Users/nofree/src/richflower/docs/tech/`
- `/Users/nofree/src/richflower/src/`

---

**注意**：这些最佳实践基于真实项目的经验总结，建议在开发时优先参考这些文档。
