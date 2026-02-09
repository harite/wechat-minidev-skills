import PixiScene from './PixiScene';
import GameScene from './GameScene';
import Logger from '../utils/Logger';

/**
 * 主菜单场景示例
 */
class MenuScene extends PixiScene {
  onEnter(params) {
    super.onEnter(params);
    
    Logger.info('MenuScene 接收参数:', params);
    
    const systemInfo = wx.getSystemInfoSync();
    
    // 标题
    const title = this.createText('主菜单', {
      fontSize: 48,
      fill: 0xffffff
    });
    title.anchor.set(0.5);
    title.x = systemInfo.screenWidth / 2;
    title.y = 150;
    this.stage.addChild(title);
    
    // 开始按钮
    const startBtn = this.createText('点击开始游戏', {
      fontSize: 32,
      fill: 0x00ff00
    });
    startBtn.anchor.set(0.5);
    startBtn.x = systemInfo.screenWidth / 2;
    startBtn.y = systemInfo.screenHeight / 2;
    startBtn.interactive = true;
    startBtn.buttonMode = true;
    
    // 添加点击效果
    startBtn.on('pointerdown', () => {
      startBtn.style.fill = 0x00aa00;
    });
    
    startBtn.on('pointerup', () => {
      startBtn.style.fill = 0x00ff00;
      this.switchTo(GameScene, { level: 1 });
    });
    
    this.stage.addChild(startBtn);
  }

  onTouchEnd(event) {
    Logger.info('MenuScene 点击位置:', event.changedTouches[0]);
  }
}

export default MenuScene;
