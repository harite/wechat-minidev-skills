// 引入微信小游戏适配器
import '../libs/weapp-adapter/index.js';
import Logger from './utils/Logger';
import { Game } from './core';
import { CubeScene } from './scenes';

// 注意：使用GameGlobal.screencanvas(weapp-adapter创建的)获取主画布，后续wx.createCanvas创建的都是离屏Canvas

// 打印构建信息（由 webpack 构建时注入）
Logger.info('='.repeat(50));
Logger.info('游戏:', __GAME_NAME__);
Logger.info('版本:', __GAME_VERSION__);
Logger.info('构建时间:', __BUILD_TIME__);
Logger.info('='.repeat(50));

// 版本强制更新
const updateManager = wx.getUpdateManager();
updateManager.onUpdateReady(() => {
  updateManager.applyUpdate();
});

// 开启分享
wx.showShareMenu({
  withShareTicket: true,
  menus: ['shareAppMessage', 'shareTimeline']
});

wx.onShareAppMessage(() => ({
  title: __GAME_NAME__
}));

wx.onShareTimeline(() => ({
  title: __GAME_NAME__
}));

// 启动游戏
const game = new Game();
game.start(CubeScene);
