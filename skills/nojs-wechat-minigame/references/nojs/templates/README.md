# 模板结构说明

## 目录组织

```
templates/
├── project/          # 通用模板（引擎无关）
│   ├── src/
│   │   ├── core/    # 核心框架（Game、Scene、GameObject 等）
│   │   ├── scenes/  # 占位目录（只有 index.js）
│   │   ├── gameobjects/
│   │   ├── utils/
│   │   └── main.js
│   ├── build/       # 构建工具（logger-transform-loader.js）
│   ├── .gitignore
│   ├── game.json
│   ├── project.config.json
│   └── README.md
│
├── project-2d/       # 2D 特定文件（Pixi.js 5.3.12）
│   ├── package.json  # 包含 pixi.js@5.3.12 依赖
│   ├── .babelrc      # 支持 core-js polyfill（2D 特定）
│   ├── webpack.config.js  # 支持 pixi.js 转译（2D 特定）
│   ├── README.md     # 2D 项目说明
│   ├── docs/
│   │   └── tech/     # Pixi.js 技术最佳实践文档
│   │       ├── README.md                          # 技术指南索引
│   │       ├── pixi-what-to-reuse.md             # 复用边界指南
│   │       ├── pixi-ui-layout.md                  # UI 布局最佳实践
│   │       ├── pixi-input-in-wechat-minigame.md  # 微信小游戏交互
│   │       └── responsive-layout.md               # 自适应布局
│   └── src/
│       ├── main.js          # 2D 入口文件
│       └── scenes/
│           ├── PixiScene.js      # Pixi.js 基类
│           ├── LoadingScene.js   # 2D 示例
│           ├── MenuScene.js
│           ├── GameScene.js
│           └── index.js
│
├── project-3d/       # 3D 特定文件
│   ├── package.json  # 包含 three 依赖
│   ├── .babelrc      # 3D 特定配置
│   ├── webpack.config.js  # 3D 特定配置
│   └── src/scenes/
│       ├── ThreeScene.js     # Three.js 基类
│       ├── LoadingScene.js   # 3D 示例
│       ├── MenuScene.js
│       ├── GameScene.js
│       └── index.js
│
└── weapp-adapter/    # 微信小游戏适配器
```

## CLI 创建流程

当执行 `nojs create game my-game` 时：

1. **选择项目类型**：2D 或 3D
2. **复制通用模板**：`project/*` → `my-game/`
3. **合并类型特定模板**：`project-2d/*` 或 `project-3d/*` → `my-game/`
4. **复制适配器**：`weapp-adapter/src/*` → `my-game/libs/weapp-adapter/`
5. **变量替换**：`{{PROJECT_NAME}}`、`{{PROJECT_TYPE}}` 等

## 最终项目结构（以 2D 为例）

```
my-game/
├── src/
│   ├── core/              # 从 project/src/core/ 复制
│   ├── scenes/
│   │   ├── PixiScene.js   # 从 project-2d/src/scenes/ 复制
│   │   ├── LoadingScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   └── index.js
│   ├── gameobjects/       # 从 project/src/gameobjects/ 复制
│   ├── utils/             # 从 project/src/utils/ 复制
│   └── main.js            # 从 project/src/main.js 复制
├── libs/weapp-adapter/    # 从 weapp-adapter/src/ 复制
├── dist/                  # 构建输出目录
├── package.json           # 从 project-2d/package.json 复制（变量替换）
├── .babelrc               # 从 project/.babelrc 复制
├── .gitignore             # 从 project/.gitignore 复制
├── game.json              # 从 project/game.json 复制
├── project.config.json    # 从 project/project.config.json 复制
├── webpack.config.js      # 从 project/webpack.config.js 复制
└── README.md              # 从 project/README.md 复制（变量替换）
```

**注意：** `assets/` 目录需要时由开发者自行创建，用于存放图片、音频等静态资源。

## 设计原则

1. **引擎无关** - `project/` 中的所有代码不依赖任何渲染引擎
2. **按需生成** - 项目只包含需要的引擎适配代码
3. **易于扩展** - 新增引擎只需添加 `project-xxx/` 目录
4. **清晰分离** - 通用代码和引擎特定代码完全独立
5. **文档驱动** - 提供技术最佳实践文档，指导 AI 生成符合规范的代码

## 2D 项目特色（基于 richflower 项目优化）

`project-2d/` 模板基于生产项目 richflower 的成功经验优化：

1. **生产验证的版本**：Pixi.js 5.3.12 + @pixi/unsafe-eval 5.3.12
2. **完整技术文档**：`docs/tech/` 包含架构、UI 布局、交互等最佳实践
3. **避免重复造轮子**：明确 Pixi.js 的复用边界，避免自己实现渲染/事件系统
4. **微信小游戏优化**：针对微信小游戏环境的特殊适配和避坑指南

详见：`project-2d/docs/OPTIMIZATION.md` 和 `project-2d/docs/tech/README.md`

## 添加新引擎示例

如果要支持新引擎（如 Cocos）：

1. 创建 `templates/project-cocos/`
2. 添加 `package.json`（包含 Cocos 依赖）
3. 添加 `src/scenes/CocosScene.js` 和示例场景
4. 在 CLI 中添加选项：`3: Cocos游戏`
