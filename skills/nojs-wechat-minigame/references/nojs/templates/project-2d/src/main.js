// 第一步：加载 core-js polyfill（必须在 weapp-adapter 之前）
import 'core-js/modules/es.symbol.js';
import 'core-js/modules/es.symbol.iterator.js';
import 'core-js/modules/es.array.iterator.js';
import 'core-js/modules/es.string.iterator.js';
import 'core-js/modules/es.object.to-string.js';

// 第二步：引入微信小游戏适配器
import '../libs/weapp-adapter/index.js';

// 第三步：开启 Pixi 的 unsafe-eval 兼容（必须在创建任何 Pixi renderer/app 之前）
import * as PIXI from 'pixi.js';
import { install as installUnsafeEval } from '@pixi/unsafe-eval';
installUnsafeEval(PIXI);

// 导入场景
import { LoadingScene } from './scenes';

// 注意：使用 GameGlobal.screencanvas (weapp-adapter 创建的) 获取主画布
// 后续 wx.createCanvas 创建的都是离屏 Canvas

// 打印构建信息（由 webpack 构建时注入）
console.log('='.repeat(50));
console.log('游戏:', __GAME_NAME__);
console.log('版本:', __GAME_VERSION__);
console.log('构建时间:', __BUILD_TIME__);
console.log('='.repeat(50));

// 版本强制更新
const updateManager = wx.getUpdateManager();
updateManager.onUpdateReady(() => {
  updateManager.applyUpdate();
});

// 开启分享
wx.showShareMenu({
  menus: ['shareAppMessage', 'shareTimeline']
});

wx.onShareAppMessage(() => ({
  title: __GAME_NAME__
}));

wx.onShareTimeline(() => ({
  title: __GAME_NAME__
}));

// 启动游戏
// TODO: 需要实现 Game 类或直接初始化 LoadingScene
// const game = new Game();
// game.start(LoadingScene);

// 临时示例：直接初始化场景
const loadingScene = new LoadingScene();
loadingScene.onEnter();
