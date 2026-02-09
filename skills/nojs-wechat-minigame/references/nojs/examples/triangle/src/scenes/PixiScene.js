import Scene from '../core/Scene';
// 微信小游戏环境需要先导入 @pixi/unsafe-eval
import '@pixi/unsafe-eval';
import * as PIXI from 'pixi.js';

/**
 * Pixi 场景基类 - 2D 游戏使用
 * 封装 Pixi.js 的初始化和渲染逻辑
 */
class PixiScene extends Scene {
  constructor() {
    super();
    
    // Pixi 应用实例（复用或创建）
    this.app = null;
  }

  onEnter(params = {}) {
    super.onEnter(params);
    
    // 初始化 Pixi 应用（全局单例）
    if (!window.__PIXI_APP__) {
      this.app = new PIXI.Application({
        view: GameGlobal.screencanvas,
        width: wx.getSystemInfoSync().screenWidth,
        height: wx.getSystemInfoSync().screenHeight,
        backgroundColor: 0x000000,
        resizeTo: GameGlobal.screencanvas
      });
      window.__PIXI_APP__ = this.app;
    } else {
      this.app = window.__PIXI_APP__;
    }

    // 设置场景容器
    this.stage = new PIXI.Container();
    this.app.stage.addChild(this.stage);

    this.renderer = this.app.renderer;
  }

  onExit() {
    // 从主舞台移除场景容器
    if (this.app && this.stage) {
      this.app.stage.removeChild(this.stage);
    }

    super.onExit();
  }

  cleanup() {
    // 销毁场景容器
    if (this.stage) {
      this.stage.destroy({ children: true });
      this.stage = null;
    }
  }

  /**
   * 创建文本
   * @param {string} text - 文本内容
   * @param {Object} style - 文本样式
   * @returns {PIXI.Text}
   */
  createText(text, style = {}) {
    const defaultStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center'
    });
    
    return new PIXI.Text(text, { ...defaultStyle, ...style });
  }

  /**
   * 创建精灵
   * @param {string} texturePath - 纹理路径
   * @returns {PIXI.Sprite}
   */
  createSprite(texturePath) {
    return PIXI.Sprite.from(texturePath);
  }
}

export default PixiScene;
