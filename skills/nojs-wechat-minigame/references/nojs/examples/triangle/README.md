# 旋转三角形示例

基于 no.js 框架的微信小游戏示例项目 (2D)

## 功能特性

- ✨ **梦幻星空背景**：渐变背景 + 闪烁星星 + 彩色星云
- 🔺 **旋转三角形**：带荧光效果的等边三角形
- 🚀 **长按加速**：按住屏幕加速旋转，松开恢复正常速度
- 🎨 **荧光特效**：模糊滤镜 + 亮度增强 + 青色光晕

## 开发

```bash
# 安装依赖
npm install

# 开发模式（自动监听文件变化）
npm run dev

# 构建
npm run build
```

## 微信开发者工具

1. 打开微信开发者工具
2. 导入项目，选择 `dist` 目录
3. AppID 使用测试号或填写你的小游戏 AppID

## 项目结构

```
src/
├── core/           # 核心框架（引擎无关，可按需修改）
├── scenes/         # 场景（引擎适配基类和示例由 CLI 自动生成）
├── gameobjects/    # 游戏对象示例
├── utils/          # 工具类（Logger/WechatShare）
└── main.js         # 入口文件
```

## 开发指南

本项目遵守 no.js 规范，CodeBuddy 规则已配置在 `.codebuddy/rules/` 目录下。

### 核心框架（src/core/）

引擎无关的场景驱动架构，支持按需修改：

- `Game` - 游戏主循环
- `Scene` - 场景基类（生命周期：onEnter/update/cleanup）
- `GameObject` - 游戏对象基类
- `EventBus` - 全局事件总线
- `InputManager` - 输入管理（自动解决事件穿透）
- `TimeManager` - 时间管理（暂停、时间缩放）
- `ScreenAdapter` - 屏幕适配工具
- `ObjectPool` - 对象池（性能优化）

### 核心场景

- **TriangleScene** - 旋转三角形主场景 ⭐
  - 梦幻星空背景（150颗闪烁星星 + 5个彩色星云）
  - 等边三角形带青色荧光边框
  - 基础旋转速度 0.02，长按加速至 0.08
  - 平滑速度过渡效果
  
### 其他示例场景

- `LoadingScene` - 加载场景（游戏忠告、资源预加载）
- `MenuScene` - 菜单场景（按钮、模态对话框示例）
- `GameScene` - 游戏场景（GameObject 管理、输入处理）

### 快速开始

1. 本项目为 2D 游戏
2. 场景继承 `PixiScene`（2D）或 `ThreeScene`（3D）
3. 查看 `src/scenes/` 下的示例代码
4. 用自然语言描述游戏功能，让 CodeBuddy 帮你实现！
