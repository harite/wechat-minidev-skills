# 项目初始化

## 技术选型

- 平台：微信小游戏
- 语言：JavaScript
- 引擎：Pixi.js (2D) 或 Three.js (3D)，创建项目时二选一
- 架构：GameObject + Component（主） + ECS（辅）
- 构建：Webpack + Babel（目标：chrome 53 + iOS 8）

## 项目搭建

### 0. 收集项目信息

**开始创建前必须询问用户：**
1. **小游戏名称**（必填）
   - 用途：设置 `project.config.json` 的 `projectname` 字段
   - 默认值：当前项目目录名

2. **小游戏 AppID**（选填）
   - 格式：wx 开头的字符串
   - 用途：设置 `project.config.json` 的 `appid` 字段
   - 若未提供：使用测试号（`appid` 字段留空或使用 `"touristappid"`）

### 1. 初始化 npm 项目

**创建项目时，根据游戏类型选择对应的 package.json：**

```bash
# 2D 游戏
cp package.2d.json package.json
npm install

# 或 3D 游戏
cp package.3d.json package.json
npm install
```

**package.2d.json 依赖**：pixi.js  
**package.3d.json 依赖**：three

**Babel 配置原则：**
- 目标环境：`{ chrome: 53, ios: 8 }`（适配微信小游戏平台）
- 按需转换语法和引入 Polyfill
- 避免体积膨胀

### 2. 复制 weapp-adapter
```bash
cp -r <no.js>/templates/weapp-adapter/src/* libs/weapp-adapter/
```

### 3. 配置 webpack 和构建脚本

**关键配置项：**
- 入口：`src/main.js`
- 输出：`dist/miniprogram/game.js`
- 模块解析：`.js` 扩展名
- Loader：使用 `babel-loader` 转换代码
- Babel preset：`@babel/preset-env` 目标 `{ chrome: 53, ios: 8 }`
- 启用树摇优化（tree shaking）
- 屏蔽 weapp-adapter 目录的所有警告
- **不自动清理输出目录**（`clean: false`）

**构建时需要复制的文件：**
1. `assets/` → `dist/miniprogram/assets/` （游戏资源）
2. `game.json` → `dist/miniprogram/game.json` （微信游戏配置）
3. `project.config.json` → `dist/project.config.json` （微信开发者工具配置）

**构建脚本原则：**
- ❌ 不要删除顶层目录（如 `rm -rf dist/`）
- ✅ 只删除子目录内容（如 `rm -rf dist/*`）
- 原因：删除顶层目录会导致微信开发者工具无法感知变化，需要重新打开项目

**推荐的 npm scripts：**
- `clean`：清理构建产物（`dist/*`）
- `build`：完整构建流程（清理 → webpack 打包 → 复制资源文件）
- `dev`：开发模式（webpack --watch）

### 4. 配置 project.config.json

**在项目根目录创建 `project.config.json`（构建时会复制到 `dist/` 目录）：**
```json
{
  "miniprogramRoot": "miniprogram/",
  "appid": "用户提供的appid或touristappid",
  "projectname": "用户提供的游戏名称或当前目录名",
  "setting": {
    "es6": false,
    "enhance": false,
    "minified": false
  }
}
```

**配置说明：**
- `es6: false` - 禁用微信开发者工具的 ES6 转 ES5（已由 Babel 处理）
- `enhance: false` - 禁用增强编译（避免二次处理）
- `minified: false` - 禁用代码压缩（已由 Webpack 处理）

**注意事项：**
- 若用户提供了 appid（wx开头），使用用户的 appid
- 若未提供，使用 `"touristappid"` 以测试号模式运行
- `projectname` 优先使用用户提供的名称，否则使用当前项目目录名
- **目录路径说明**：配置中的路径（miniprogramRoot）相对于 `dist/` 目录
- **文件位置**：此配置文件在项目根目录创建，构建时复制到 `dist/` 目录

## 目录结构

### 源码目录（开发）
```
project/
├── src/                 # 源码（JavaScript）
│   ├── main.js          # 入口
│   ├── core/            # Game, Scene, SceneManager
│   ├── scenes/          # 场景类
│   ├── components/      # Component 定义
│   ├── gameobjects/     # GameObject 类
│   ├── systems/         # ECS Systems（可选）
│   └── utils/
├── libs/
│   └── weapp-adapter/   # 微信适配层（复制自 no.js）
├── assets/              # 资源文件
├── game.json            # 微信游戏配置
├── project.config.json  # 微信开发者工具配置
├── package.json         # npm 依赖
├── .babelrc             # Babel 配置
└── webpack.config.js    # 构建配置
```

### 构建目录（发布）
```
dist/
├── miniprogram/         # 小游戏前端
│   ├── game.js          # webpack 打包输出
│   ├── game.json        # 微信配置
│   └── assets/          # 资源（复制）
├── cloudfunctions/      # 云函数（可选）
│   └── xxx/
└── project.config.json  # 微信开发者工具配置
```

## 核心框架

no.js 提供了一套引擎无关的基础框架，包含：

**基础类：**
- `Game` - 游戏主循环，管理场景
- `Scene` - 场景基类，生命周期管理
- `SceneManager` - 场景切换管理
- `GameObject` - 游戏对象基类
- `EventBus` - 全局事件总线
- `InputManager` - 输入管理（解决事件穿透问题）

**引擎适配类（创建项目时二选一）：**
- `PixiScene` - 2D 场景基类（Pixi.js）- 使用 package.2d.json
- `ThreeScene` - 3D 场景基类（Three.js，包含 HUD 系统）- 使用 package.3d.json

**详细使用文档** → [`core-framework.md`](./core-framework.md)

## 必须的初始化配置

初始化即游戏启动时（main.js开始执行）

### 1. 版本强制更新（setupForceUpdate）

```javascript
function setupForceUpdate() {
  const updateManager = wx.getUpdateManager();
  updateManager.onUpdateReady(function() {
    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    updateManager.applyUpdate();
  }); 
}

// main 函数最开头调用
setupForceUpdate();
```

### 2. 开启分享能力（setupShare）

```javascript
// 分享到聊天
wx.showShareMenu({
  withShareTicket: true,
  menus: ['shareAppMessage', 'shareTimeline']
});

// 自定义分享内容
wx.onShareAppMessage(() => ({
  title: '游戏名称',
  // imageUrl: 'assets/share.png' // 分享图片没有的话得把字段注释掉
}));

// 分享到朋友圈
wx.onShareTimeline(() => ({
  title: '游戏名称',
  // imageUrl: 'assets/share.png' // 分享图片没有的话得把字段注释掉
}));
```

### 3. 默认加载场景（LoadingScene）

**必须实现加载场景作为首个场景**，用于：
- 快速渲染，提升启动体验
- 展示游戏标题（屏幕中间）
- 展示健康游戏忠告（屏幕底部）
- 加载必要资源后切换到主场景

**健康游戏忠告文案**：
```
抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。
适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。
```

**启动流程**：
```javascript
// main.js
setupForceUpdate();
setupShare();

const game = new Game();
game.start(LoadingScene); // 首个场景必须是 LoadingScene
```

## 场景通信

- 参数传递：`switchTo(SceneClass, params)`
- 事件总线：`EventBus.emit/on`
- 持久化：`wx.setStorageSync/getStorageSync`