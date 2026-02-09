import ThreeScene from './ThreeScene';
import GameScene from './GameScene';
import Logger from '../utils/Logger';

/**
 * 主菜单场景示例 (3D)
 */
class MenuScene extends ThreeScene {
  onEnter(params) {
    super.onEnter(params);
    
    Logger.info('MenuScene 接收参数:', params);
    
    // 标题
    const title = this.createHUDText('主菜单', {
      fontSize: 48,
      color: '#ffffff',
      x: 0,
      y: 150
    });
    this.addToHUD(title);
    
    // 提示文本
    const hint = this.createHUDText('点击屏幕开始游戏', {
      fontSize: 24,
      color: '#00ff00',
      x: 0,
      y: 0
    });
    this.addToHUD(hint);
  }
  
  onTouchStart(event) {
    Logger.info('点击开始游戏');
    this.switchTo(GameScene, { fromMenu: true });
  }
}

export default MenuScene;
