import EventBus from './EventBus';

/**
 * 场景管理器
 * 职责：管理场景切换、场景生命周期
 */
class SceneManager {
  constructor() {
    this.currentScene = null;
    this.nextScene = null;
    
    // 监听场景切换事件
    EventBus.on('scene:switch', this.switchTo.bind(this));
  }

  /**
   * 启动场景
   * @param {Class} SceneClass - 场景类
   * @param {Object} params - 场景参数
   */
  start(SceneClass, params = {}) {
    if (this.currentScene) {
      throw new Error('Scene already started. Use switchTo() instead.');
    }
    
    this.currentScene = new SceneClass();
    this.currentScene.onEnter(params);
  }

  /**
   * 切换场景
   * @param {Class} SceneClass - 目标场景类
   * @param {Object} params - 传递给目标场景的参数
   */
  switchTo(SceneClass, params = {}) {
    // 延迟到下一帧切换，避免在 update 中切换导致的问题
    this.nextScene = { SceneClass, params };
  }

  /**
   * 执行场景切换（在 Game 主循环中调用）
   */
  performSwitch() {
    if (!this.nextScene) return;

    const { SceneClass, params } = this.nextScene;
    this.nextScene = null;

    // 退出当前场景
    if (this.currentScene) {
      this.currentScene.onExit();
      this.currentScene = null;
    }

    // 进入新场景
    this.currentScene = new SceneClass();
    this.currentScene.onEnter(params);
  }

  /**
   * 更新当前场景
   * @param {number} dt - 距离上一帧的时间（毫秒）
   */
  update(dt) {
    if (this.currentScene) {
      this.currentScene.update(dt);
    }
  }

  /**
   * 获取当前场景
   * @returns {Scene|null}
   */
  getCurrentScene() {
    return this.currentScene;
  }
}

export default SceneManager;
