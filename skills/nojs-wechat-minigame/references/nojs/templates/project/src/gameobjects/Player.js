import { GameObject } from '../core';
import * as PIXI from 'pixi.js';

/**
 * 玩家对象示例
 */
class Player extends GameObject {
  init() {
    // 创建显示对象
    this.displayObject = new PIXI.Container();
    
    // 绘制一个圆形代表玩家
    const circle = new PIXI.Graphics();
    circle.beginFill(0x00ffff);
    circle.drawCircle(0, 0, 30);
    circle.endFill();
    this.displayObject.addChild(circle);
    
    // 添加文字
    const text = new PIXI.Text('玩家', {
      fontSize: 16,
      fill: 0xffffff
    });
    text.anchor.set(0.5);
    text.y = 50;
    this.displayObject.addChild(text);
    
    // 状态
    this.rotation = 0;
  }

  update(dt) {
    // 旋转动画
    this.rotation += dt * 0.001;
    this.displayObject.rotation = this.rotation;
  }

  cleanup() {
    // 清理资源
  }
}

export default Player;
