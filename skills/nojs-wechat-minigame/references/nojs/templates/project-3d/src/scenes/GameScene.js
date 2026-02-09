import ThreeScene from './ThreeScene';
import * as THREE from 'three';
import Logger from '../utils/Logger';

/**
 * 游戏场景示例 (3D)
 */
class GameScene extends ThreeScene {
  constructor() {
    super();
    this.cube = null;
    this.scoreText = null;
    this.score = 0;
  }

  onEnter(params) {
    super.onEnter(params);
    
    Logger.info('GameScene 接收参数:', params);
    
    // 创建一个旋转的立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.stage.add(this.cube);
    
    // 添加分数 HUD
    this.scoreText = this.createHUDText(`分数: ${this.score}`, {
      fontSize: 32,
      color: '#ffffff',
      x: 0,
      y: 250
    });
    this.addToHUD(this.scoreText);
    
    // 添加提示
    const hint = this.createHUDText('点击屏幕增加分数', {
      fontSize: 20,
      color: '#999999',
      x: 0,
      y: -250
    });
    this.addToHUD(hint);
  }
  
  update(dt) {
    super.update(dt);
    
    // 旋转立方体
    if (this.cube) {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
    }
  }
  
  onTouchStart(event) {
    this.score++;
    Logger.info('当前分数:', this.score);
    
    // 更新分数显示（简化版本，实际应该更新 HUD 文本）
    if (this.scoreText) {
      this.removeFromHUD(this.scoreText);
    }
    this.scoreText = this.createHUDText(`分数: ${this.score}`, {
      fontSize: 32,
      color: '#ffffff',
      x: 0,
      y: 250
    });
    this.addToHUD(this.scoreText);
  }
  
  cleanup() {
    if (this.cube) {
      this.stage.remove(this.cube);
      this.cube.geometry.dispose();
      this.cube.material.dispose();
      this.cube = null;
    }
  }
}

export default GameScene;
