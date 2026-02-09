import PixiScene from './PixiScene';
import * as PIXI from 'pixi.js';

/**
 * 三角形主场景
 * 特性：
 * - 梦幻星空背景
 * - 旋转三角形带荧光效果
 * - 长按加速旋转
 */
class TriangleScene extends PixiScene {
  constructor() {
    super();
    
    // 旋转参数
    this.baseRotationSpeed = 0.02; // 基础旋转速度
    this.currentRotationSpeed = this.baseRotationSpeed;
    this.acceleratedSpeed = 0.08; // 加速后的旋转速度
    this.isPressing = false; // 是否正在按压
    
    // 三角形
    this.triangle = null;
    this.glowFilter = null;
    
    // 星空
    this.stars = [];
  }

  onEnter(params = {}) {
    super.onEnter(params);
    
    const { screenWidth, screenHeight } = wx.getSystemInfoSync();
    
    // 创建梦幻星空背景
    this.createStarField(screenWidth, screenHeight);
    
    // 创建三角形
    this.createTriangle(screenWidth, screenHeight);
    
    // 设置输入事件
    this.setupInput();
  }

  /**
   * 创建星空背景
   */
  createStarField(width, height) {
    // 渐变背景
    const gradient = new PIXI.Graphics();
    gradient.beginFill(0x0a0a2e);
    gradient.drawRect(0, 0, width, height);
    gradient.endFill();
    this.stage.addChild(gradient);
    
    // 创建星星
    const starCount = 150;
    for (let i = 0; i < starCount; i++) {
      const star = {
        graphics: new PIXI.Graphics(),
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2
      };
      
      // 绘制星星
      star.graphics.beginFill(0xffffff);
      star.graphics.drawCircle(star.x, star.y, star.radius);
      star.graphics.endFill();
      star.graphics.alpha = star.alpha;
      
      this.stage.addChild(star.graphics);
      this.stars.push(star);
    }
    
    // 添加一些彩色星云效果
    for (let i = 0; i < 5; i++) {
      const nebula = new PIXI.Graphics();
      const colors = [0x4a148c, 0x1a237e, 0x0d47a1, 0x4a148c];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      nebula.beginFill(color, 0.1);
      nebula.drawCircle(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 100 + 50
      );
      nebula.endFill();
      nebula.filters = [new PIXI.BlurFilter(15)];
      
      this.stage.addChildAt(nebula, 1);
    }
  }

  /**
   * 创建三角形
   */
  createTriangle(width, height) {
    // 创建容器
    this.triangle = new PIXI.Container();
    this.triangle.x = width / 2;
    this.triangle.y = height / 2;
    
    // 绘制三角形
    const size = 150;
    const graphics = new PIXI.Graphics();
    
    // 三角形路径（等边三角形）
    const height_triangle = size * Math.sqrt(3) / 2;
    graphics.lineStyle(4, 0x00ffff, 1); // 青色边框
    graphics.beginFill(0x1a237e, 0.6); // 半透明填充
    graphics.moveTo(0, -height_triangle * 2/3);
    graphics.lineTo(-size / 2, height_triangle / 3);
    graphics.lineTo(size / 2, height_triangle / 3);
    graphics.closePath();
    graphics.endFill();
    
    this.triangle.addChild(graphics);
    
    // 添加荧光效果
    const glowGraphics = new PIXI.Graphics();
    glowGraphics.lineStyle(2, 0x00ffff, 0.8);
    glowGraphics.beginFill(0x00ffff, 0.1);
    glowGraphics.moveTo(0, -height_triangle * 2/3);
    glowGraphics.lineTo(-size / 2, height_triangle / 3);
    glowGraphics.lineTo(size / 2, height_triangle / 3);
    glowGraphics.closePath();
    glowGraphics.endFill();
    
    this.triangle.addChild(glowGraphics);
    
    // 添加发光滤镜
    const glowFilter = new PIXI.BlurFilter();
    glowFilter.blur = 8;
    
    const colorMatrix = new PIXI.ColorMatrixFilter();
    colorMatrix.brightness(1.3, false);
    
    this.triangle.filters = [glowFilter, colorMatrix];
    
    this.stage.addChild(this.triangle);
    
    // 添加中心光点
    const centerDot = new PIXI.Graphics();
    centerDot.beginFill(0x00ffff);
    centerDot.drawCircle(0, 0, 5);
    centerDot.endFill();
    centerDot.alpha = 0.8;
    this.triangle.addChild(centerDot);
  }

  /**
   * 设置输入事件
   */
  setupInput() {
    // 触摸开始 - 加速旋转
    wx.onTouchStart(() => {
      this.isPressing = true;
    });
    
    // 触摸结束 - 恢复正常速度
    wx.onTouchEnd(() => {
      this.isPressing = false;
    });
  }

  update(dt) {
    super.update(dt);
    
    // 更新旋转速度（平滑过渡）
    const targetSpeed = this.isPressing ? this.acceleratedSpeed : this.baseRotationSpeed;
    this.currentRotationSpeed += (targetSpeed - this.currentRotationSpeed) * 0.1;
    
    // 旋转三角形
    if (this.triangle) {
      this.triangle.rotation += this.currentRotationSpeed;
    }
    
    // 星星闪烁效果
    this.stars.forEach(star => {
      star.twinklePhase += star.twinkleSpeed;
      star.graphics.alpha = star.alpha + Math.sin(star.twinklePhase) * 0.3;
    });
  }

  cleanup() {
    // 清理输入事件
    wx.offTouchStart();
    wx.offTouchEnd();
    
    // 清理星星
    this.stars.forEach(star => {
      if (star.graphics) {
        star.graphics.destroy();
      }
    });
    this.stars = [];
    
    super.cleanup();
  }
}

export default TriangleScene;
