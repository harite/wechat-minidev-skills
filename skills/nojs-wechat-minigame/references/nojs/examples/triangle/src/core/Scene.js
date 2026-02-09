import EventBus from './EventBus';
import InputManager from './InputManager';

/**
 * 场景基类 - 引擎无关
 * 
 * 生命周期：
 * 1. constructor() - 创建场景
 * 2. onEnter(params) - 进入场景（资源加载、初始化）
 * 3. update(dt) - 每帧更新
 * 4. onExit() - 离开场景（清理资源）
 */
class Scene {
  constructor() {
    this.sceneId = `scene_${Date.now()}_${Math.random()}`;
    this.isActive = false;
    
    // 渲染引擎相关（由子类初始化）
    this.renderer = null;  // Pixi.Application 或 Three.WebGLRenderer
    this.stage = null;     // Pixi.Container 或 Three.Scene
    
    // GameObject 列表
    this.gameObjects = [];
    
    // 输入事件处理器
    this.inputHandlers = {
      onTouchStart: this.onTouchStart.bind(this),
      onTouchMove: this.onTouchMove.bind(this),
      onTouchEnd: this.onTouchEnd.bind(this),
      onTouchCancel: this.onTouchCancel.bind(this)
    };
  }

  /**
   * 进入场景
   * @param {Object} params - 场景参数（由上个场景传递）
   */
  onEnter(params = {}) {
    this.isActive = true;
    
    // 注册输入处理
    InputManager.registerScene(this.sceneId, this.inputHandlers);
    
    // 清理上一个场景的拦截层
    InputManager.clearBlockLayers();
  }

  /**
   * 每帧更新
   * @param {number} dt - 距离上一帧的时间（毫秒）
   */
  update(dt) {
    // 更新所有 GameObject
    for (const obj of this.gameObjects) {
      if (obj.update) {
        obj.update(dt);
      }
    }
  }

  /**
   * 离开场景
   */
  onExit() {
    this.isActive = false;
    
    // 注销输入处理
    InputManager.unregisterScene(this.sceneId);
    
    // 清理所有 GameObject
    for (const obj of this.gameObjects) {
      if (obj.destroy) {
        obj.destroy();
      }
    }
    this.gameObjects = [];
    
    // 清理事件监听（子类实现）
    this.cleanup();
  }

  /**
   * 清理资源（子类重写）
   */
  cleanup() {
    // 子类实现：清理纹理、事件监听、定时器等
  }

  /**
   * 添加 GameObject
   * @param {GameObject} gameObject
   */
  addGameObject(gameObject) {
    this.gameObjects.push(gameObject);
    
    // 如果场景有 stage，将 gameObject 添加到渲染树
    if (this.stage && gameObject.displayObject) {
      this.stage.add(gameObject.displayObject);
    }
  }

  /**
   * 移除 GameObject
   * @param {GameObject} gameObject
   */
  removeGameObject(gameObject) {
    const index = this.gameObjects.indexOf(gameObject);
    if (index !== -1) {
      this.gameObjects.splice(index, 1);
      
      // 从渲染树移除
      if (this.stage && gameObject.displayObject) {
        this.stage.remove(gameObject.displayObject);
      }
      
      // 销毁对象
      if (gameObject.destroy) {
        gameObject.destroy();
      }
    }
  }

  /**
   * 切换到其他场景
   * @param {Class} SceneClass - 目标场景类
   * @param {Object} params - 传递给目标场景的参数
   */
  switchTo(SceneClass, params = {}) {
    EventBus.emit('scene:switch', SceneClass, params);
  }

  // ========== 输入事件处理（子类可重写）==========

  onTouchStart(event) {
    // 子类实现
  }

  onTouchMove(event) {
    // 子类实现
  }

  onTouchEnd(event) {
    // 子类实现
  }

  onTouchCancel(event) {
    // 子类实现
  }

  // ========== 模态对话框支持 ==========

  /**
   * 打开模态层（阻止事件穿透到背景）
   * @returns {string} 拦截层ID，用于关闭时传入
   */
  openModal() {
    const layerId = `modal_${this.sceneId}_${Date.now()}`;
    return InputManager.pushBlockLayer(layerId);
  }

  /**
   * 关闭模态层
   * @param {string} layerId - 打开时返回的拦截层ID
   */
  closeModal(layerId) {
    InputManager.popBlockLayer(layerId);
  }
}

export default Scene;
