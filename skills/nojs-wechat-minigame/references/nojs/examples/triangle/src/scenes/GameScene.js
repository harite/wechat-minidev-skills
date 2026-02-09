import PixiScene from './PixiScene';
import EventBus from '../core/EventBus';
import Player from '../gameobjects/Player';
import Logger from '../utils/Logger';

/**
 * 游戏场景示例
 * 演示：GameObject 管理、模态对话框（事件穿透防护）
 */
class GameScene extends PixiScene {
  constructor() {
    super();
    this.isPaused = false;
    this.pauseModalId = null;
    this.score = 0;
  }

  onEnter(params) {
    super.onEnter(params);
    
    Logger.info('GameScene 接收参数:', params);
    
    const systemInfo = wx.getSystemInfoSync();
    
    // 背景
    const bg = this.createText('游戏场景 (点击屏幕加分)', {
      fontSize: 24,
      fill: 0x666666
    });
    bg.anchor.set(0.5);
    bg.x = systemInfo.screenWidth / 2;
    bg.y = 50;
    this.stage.addChild(bg);
    
    // 分数
    this.scoreText = this.createText('分数: 0', {
      fontSize: 32,
      fill: 0xffff00
    });
    this.scoreText.x = 20;
    this.scoreText.y = 100;
    this.stage.addChild(this.scoreText);
    
    // 暂停按钮
    const pauseBtn = this.createText('[暂停]', {
      fontSize: 24,
      fill: 0xff0000
    });
    pauseBtn.anchor.set(1, 0);
    pauseBtn.x = systemInfo.screenWidth - 20;
    pauseBtn.y = 20;
    pauseBtn.interactive = true;
    pauseBtn.buttonMode = true;
    pauseBtn.on('pointerup', () => {
      this.showPauseMenu();
    });
    this.stage.addChild(pauseBtn);
    
    // 创建玩家对象
    this.player = new Player();
    this.player.init();
    this.player.setPosition(systemInfo.screenWidth / 2, systemInfo.screenHeight / 2);
    this.addGameObject(this.player);
    
    // 监听分数更新事件
    EventBus.on('game:score', this.onScoreUpdate, this);
  }

  onTouchEnd(event) {
    if (this.isPaused) return;
    
    // 点击屏幕加分
    this.score += 10;
    EventBus.emit('game:score', this.score);
    
    Logger.info('点击位置:', event.changedTouches[0]);
  }

  onScoreUpdate(score) {
    this.scoreText.text = `分数: ${score}`;
  }

  /**
   * 显示暂停菜单（模态对话框）
   */
  showPauseMenu() {
    if (this.isPaused) return;
    
    this.isPaused = true;
    
    // 推入拦截层，阻止点击穿透到背景
    this.pauseModalId = this.openModal();
    
    const systemInfo = wx.getSystemInfoSync();
    
    // 半透明遮罩
    const mask = new PIXI.Graphics();
    mask.beginFill(0x000000, 0.7);
    mask.drawRect(0, 0, systemInfo.screenWidth, systemInfo.screenHeight);
    mask.endFill();
    this.stage.addChild(mask);
    this.pauseMask = mask;
    
    // 暂停文本
    const pauseText = this.createText('游戏暂停', {
      fontSize: 48,
      fill: 0xffffff
    });
    pauseText.anchor.set(0.5);
    pauseText.x = systemInfo.screenWidth / 2;
    pauseText.y = systemInfo.screenHeight / 2 - 100;
    this.stage.addChild(pauseText);
    this.pauseText = pauseText;
    
    // 继续按钮
    const resumeBtn = this.createText('点击继续', {
      fontSize: 32,
      fill: 0x00ff00
    });
    resumeBtn.anchor.set(0.5);
    resumeBtn.x = systemInfo.screenWidth / 2;
    resumeBtn.y = systemInfo.screenHeight / 2;
    resumeBtn.interactive = true;
    resumeBtn.buttonMode = true;
    resumeBtn.on('pointerup', () => {
      this.closePauseMenu();
    });
    this.stage.addChild(resumeBtn);
    this.resumeBtn = resumeBtn;
    
    Logger.info('暂停菜单打开 - 背景点击已被拦截');
  }

  /**
   * 关闭暂停菜单
   */
  closePauseMenu() {
    if (!this.isPaused) return;
    
    this.isPaused = false;
    
    // 移除拦截层，恢复输入
    this.closeModal(this.pauseModalId);
    this.pauseModalId = null;
    
    // 清理 UI
    if (this.pauseMask) {
      this.stage.removeChild(this.pauseMask);
      this.pauseMask.destroy();
      this.pauseMask = null;
    }
    if (this.pauseText) {
      this.stage.removeChild(this.pauseText);
      this.pauseText.destroy();
      this.pauseText = null;
    }
    if (this.resumeBtn) {
      this.stage.removeChild(this.resumeBtn);
      this.resumeBtn.destroy();
      this.resumeBtn = null;
    }
    
    Logger.info('暂停菜单关闭 - 背景点击已恢复');
  }

  cleanup() {
    // 取消事件监听
    EventBus.off('game:score', this.onScoreUpdate);
    
    // 清理 UI
    this.closePauseMenu();
  }
}

export default GameScene;
