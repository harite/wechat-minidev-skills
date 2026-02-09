import Scene from '../core/Scene';
import * as THREE from 'three';

/**
 * Three.js 场景基类 - 3D 游戏使用
 * 封装 Three.js 的初始化和渲染逻辑
 */
class ThreeScene extends Scene {
  constructor() {
    super();
    
    // Three.js 渲染器（全局单例）
    this.renderer = null;
    
    // 场景和相机
    this.stage = null;  // THREE.Scene
    this.camera = null;
    
    // HUD 相机和场景（用于 2D UI）
    this.hudScene = null;
    this.hudCamera = null;
  }

  onEnter(params = {}) {
    super.onEnter(params);
    
    const systemInfo = wx.getSystemInfoSync();
    
    // 初始化渲染器（全局单例）
    if (!window.__THREE_RENDERER__) {
      this.renderer = new THREE.WebGLRenderer({
        canvas: GameGlobal.screencanvas,
        antialias: true
      });
      this.renderer.setSize(systemInfo.screenWidth, systemInfo.screenHeight);
      this.renderer.autoClear = false; // 手动控制清屏，以便渲染 HUD
      window.__THREE_RENDERER__ = this.renderer;
    } else {
      this.renderer = window.__THREE_RENDERER__;
    }

    // 创建 3D 场景
    this.stage = new THREE.Scene();
    
    // 创建相机（默认透视相机）
    this.camera = new THREE.PerspectiveCamera(
      75,
      systemInfo.screenWidth / systemInfo.screenHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // 创建 HUD 场景和正交相机（用于 2D UI）
    this.hudScene = new THREE.Scene();
    this.hudCamera = new THREE.OrthographicCamera(
      -systemInfo.screenWidth / 2,
      systemInfo.screenWidth / 2,
      systemInfo.screenHeight / 2,
      -systemInfo.screenHeight / 2,
      1,
      10
    );
    this.hudCamera.position.z = 10;
  }

  update(dt) {
    super.update(dt);
    
    // 渲染 3D 场景
    this.renderer.clear();
    this.renderer.render(this.stage, this.camera);
    
    // 渲染 HUD（2D UI）
    this.renderer.clearDepth();
    this.renderer.render(this.hudScene, this.hudCamera);
  }

  cleanup() {
    // 清理场景
    if (this.stage) {
      this.stage.clear();
      this.stage = null;
    }
    
    if (this.hudScene) {
      this.hudScene.clear();
      this.hudScene = null;
    }
    
    this.camera = null;
    this.hudCamera = null;
  }

  /**
   * 创建 HUD 文本（使用离屏 Canvas）
   * @param {string} text - 文本内容
   * @param {Object} options - 选项 { fontSize, color, x, y }
   * @returns {THREE.Sprite}
   */
  createHUDText(text, options = {}) {
    const {
      fontSize = 24,
      color = '#ffffff',
      x = 0,
      y = 0
    } = options;

    // 创建离屏 Canvas
    const canvas = wx.createCanvas();
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // 绘制文本
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // 创建纹理和精灵
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    
    sprite.position.set(x, y, 0);
    sprite.scale.set(canvas.width, canvas.height, 1);

    return sprite;
  }

  /**
   * 添加 HUD 元素
   * @param {THREE.Object3D} object
   */
  addToHUD(object) {
    if (this.hudScene) {
      this.hudScene.add(object);
    }
  }

  /**
   * 从 HUD 移除元素
   * @param {THREE.Object3D} object
   */
  removeFromHUD(object) {
    if (this.hudScene) {
      this.hudScene.remove(object);
    }
  }
}

export default ThreeScene;
